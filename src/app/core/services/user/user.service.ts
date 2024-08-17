import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable, from, map, firstValueFrom, throwError, of   } from 'rxjs';
import { IUser } from '../../models/user.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { switchMap, catchError  } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private dbPath = '/users';
  usersRef: AngularFireList<IUser>;

  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth,

  ) {
    this.usersRef = db.list(this.dbPath);
  }

  getAllUsers(): Observable<IUser[]> {
    return this.usersRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key || undefined, ...c.payload.val() } as IUser))
      )
    );
  }

  getUser(key: string): Observable<IUser | null> {
    return this.db.object<IUser>(`${this.dbPath}/${key}`).valueChanges();
  }


  createUser(user: IUser, imageFile?: File): Observable<string> {
    if (!user.email || !user.password) {
      return throwError(() => new Error('Email và mật khẩu không được để trống'));
    }

    return from(this.isEmailUnique(user.email)).pipe(
      switchMap(isUnique => {
        if (!isUnique) {
          return throwError(() => new Error('Email đã tồn tại'));
        }

        return from(this.afAuth.createUserWithEmailAndPassword(user.email, user.password!));
      }),
      switchMap(result => {
        const firebaseUser = result.user;
        if (!firebaseUser) {
          return throwError(() => new Error('Đăng ký thất bại: Người dùng không tồn tại.'));
        }

        return from(firebaseUser.getIdToken()).pipe(
          switchMap(async token => {
            const now = new Date().toISOString();
            const newUser: IUser = {
              ...user,
              key: firebaseUser.uid,
              rememberToken: token,
              created_at: now,
              updated_at: now
            };

            if (imageFile) {
              try {
                const processedImage = await this.processImageFile(imageFile);
                if (processedImage) {
                  newUser.image = processedImage;
                }
              } catch (error) {
                console.error('Không xử lý được hình ảnh:', error);
              }
            }

            delete newUser.password;
            await this.db.object(`${this.dbPath}/${firebaseUser.uid}`).set(newUser);
            return firebaseUser.uid;
          })
        );
      }),
      catchError(error => {
        console.error('Lỗi trong quá trình tạo người dùng:', error);
        return throwError(() => error);
      })
    );
  }


  private async processImageFile(imageFile: File): Promise<string | null> {
    const maxSize = 20 * 1024 * 1024; // 20MB
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
      'image/bmp', 'image/webp', 'image/tiff', 'image/svg+xml'
    ];

    try {
      if (imageFile.size > maxSize) {
        throw new Error('Image file is too large. Maximum size is 20MB.');
      }

      if (!allowedTypes.includes(imageFile.type)) {
        throw new Error('Invalid file type. Allowed types are: JPEG, JPG, PNG, GIF, BMP, WebP, TIFF, and SVG.');
      }

      const base64Image = await this.encodeImageToBase64(imageFile);
      const maxBase64Size = Math.ceil(maxSize * 1.4);

      if (base64Image.length > maxBase64Size) {
        throw new Error('Encoded image is too large to store in the database.');
      }

      return base64Image;
    } catch (error) {
      console.error('Error processing image:', error);
      if (error instanceof Error) {
        if (error.message.includes('too large') || error.message.includes('Invalid file type')) {
          throw error; // Re-throw these specific errors
        }
      }
      return null; // Return null for other errors
    }
  }

  private async encodeImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  updateUser(key: string, value: Partial<IUser>, imageFile?: File): Observable<void> {
    return from(this.afAuth.currentUser).pipe(
      switchMap(user => {
        if (!user) {
          return throwError(() => new Error('No authenticated user found'));
        }

        let updateData: Partial<IUser> = {
          ...value,
          updated_at: new Date().toISOString()
        };

        // Loại bỏ email và password khỏi dữ liệu cập nhật
        delete updateData.email;
        delete updateData.password;

        // Lọc bỏ các giá trị undefined
          updateData = Object.entries(updateData).reduce((acc, [key, value]) => {
            if (value !== undefined) {
              return { ...acc, [key]: value };
            }
            return acc;
          }, {} as Partial<IUser>);

        let updateChain = Promise.resolve();

        if (imageFile) {
          updateChain = updateChain
            .then(() => this.processImageFile(imageFile))
            .then(processedImage => {
              if (processedImage) {
                updateData.image = processedImage;
              }
            });
        }

        return from(updateChain.then(() => this.db.object(`${this.dbPath}/${key}`).update(updateData)));
      }),
      catchError(error => {
        console.error('Error in updateUser:', error);
        return throwError(() => new Error(`Failed to update user: ${error.message}`));
      })
    );
  }

  // Phương thức để kiểm tra email đã tồn tại chưa
  async isEmailUnique(email: string): Promise<boolean> {
    try {
      const users = await firstValueFrom(
        this.db.list('/users', ref => ref.orderByChild('email').equalTo(email)).valueChanges()
      );
      return !users || users.length === 0;
    } catch (error) {
      console.error('Error checking email uniqueness:', error);
      throw error;
    }
  }

}
