import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { IUser } from '../../models/user.model';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { passwordMatchValidator } from '../../validators/password-match.validator';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Đường dẫn tới nơi lưu trữ dữ liệu người dùng trong Firebase Realtime Database
  private dbPath = '/users';

  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase) {
    this.usersRef = db.list(this.dbPath);
  }
  usersRef: AngularFireList<IUser>;
  /**
   * Đăng ký người dùng mới
   * @param user Thông tin người dùng cần đăng ký
   * @returns Observable<void> dùng để theo dõi quá trình đăng ký
   */
  // Đăng ký người dùng mới
  register(user: IUser): Observable<void> {
    // Kiểm tra xem email và mật khẩu có được cung cấp không
    if (!user.email || !user.password) {
      // Nếu thiếu, trả về một Observable báo lỗi
      return from(Promise.reject('Email và mật khẩu không được để trống'));
    }

    // Gọi Firebase Authentication để tạo người dùng mới với email và mật khẩu
    return from(
      this.afAuth.createUserWithEmailAndPassword(user.email, user.password)
    ).pipe(
      switchMap(result => {
        const firebaseUser = result.user; // Lấy thông tin người dùng từ kết quả trả về của Firebase
        if (firebaseUser) {
          // Nếu người dùng tồn tại, lấy token xác thực và tiếp tục xử lý
          return from(firebaseUser.getIdToken()).pipe(
            switchMap(token => {
              // Tạo đối tượng người dùng mới để lưu vào cơ sở dữ liệu
              const newUser: IUser = {
                ...user, // Sao chép các thuộc tính từ đối tượng người dùng đã cung cấp
                key: firebaseUser.uid, // Gán UID của Firebase làm khóa người dùng
                rememberToken: token, // Lưu token xác thực của người dùng
                publish: true,
                role: false,
                created_at: new Date().toISOString(), // Lưu ngày giờ tạo tài khoản
                updated_at: new Date().toISOString(), // Lưu ngày giờ cập nhật tài khoản
              };
              delete newUser.password; // Xóa trường mật khẩu khỏi đối tượng người dùng

              // Lưu thông tin người dùng vào Firebase Realtime Database
              return from(this.db.object(`${this.dbPath}/${firebaseUser.uid}`).set(newUser));
            })
          );
        }
        // Nếu không lấy được thông tin người dùng, trả về một Observable báo lỗi
        return from(Promise.reject('Đăng ký thất bại: Người dùng không tồn tại.'));
      })
    );
  }

// Đăng nhập người dùng
/**
   * Đăng nhập người dùng
   * @param email Email của người dùng
   * @param password Mật khẩu của người dùng
   * @returns Observable<IUser | null> trả về thông tin người dùng nếu đăng nhập thành công, hoặc null nếu thất bại
   */
login(email: string, password: string): Observable<IUser | null> {
  // Gọi Firebase Authentication để đăng nhập với email và mật khẩu
  return from(this.afAuth.signInWithEmailAndPassword(email, password)).pipe(
    switchMap(result => {
      const firebaseUser = result.user; // Lấy thông tin người dùng từ kết quả trả về của Firebase
      if (firebaseUser) {
        // Nếu người dùng tồn tại, lấy token xác thực và tiếp tục xử lý
        return from(firebaseUser.getIdToken()).pipe(
          switchMap(token => {
            // Truy vấn thông tin người dùng từ Firebase Realtime Database dựa trên UID
            return this.db.object<IUser>(`${this.dbPath}/${firebaseUser.uid}`).valueChanges().pipe(
              map(user => {
                if (user) {
                  if (user.publish) {  // Kiểm tra nếu trường 'publish' là true
                    user.rememberToken = token;  // Lưu token xác thực vào đối tượng người dùng
                    this.saveUserData(user);  // Lưu thông tin người dùng vào LocalStorage
                    return user;  // Trả về thông tin người dùng
                  } else {
                    // Nếu publish không phải là true, trả về null hoặc xử lý lỗi tùy ý
                    return null;  // Người dùng không được phép đăng nhập
                  }  // Trả về thông tin người dùng
                }
                return null;  // Trả về null nếu không tìm thấy thông tin người dùng
              })
            );
          })
        );
      }
      // Nếu không có thông tin người dùng (firebaseUser là null), trả về Observable với giá trị null
      return from(Promise.resolve(null));
    })
  );
}

  /**
   * Đăng xuất người dùng
   * @returns Promise<void> hứa hẹn hoàn tất quá trình đăng xuất
   */
  logout(): Promise<void> {
    this.clearUserData();  // Xóa thông tin người dùng khỏi LocalStorage
    return this.afAuth.signOut();  // Đăng xuất người dùng khỏi Firebase Authentication
  }

   /**
   * Lấy thông tin người dùng hiện tại từ LocalStorage
   * @returns IUser | null trả về đối tượng người dùng nếu tồn tại, nếu không trả về null
   */
   getCurrentUser(): IUser | null {
    if (typeof localStorage !== 'undefined') {
      const userJson = localStorage.getItem('currentUser');
      return userJson ? JSON.parse(userJson) : null;
    }
    return null;
  }

  /**
   * Lưu thông tin người dùng và token vào LocalStorage
   * @param user Đối tượng người dùng cần lưu
   */
  private saveUserData(user: IUser): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  }

  /**
   * Xóa thông tin người dùng khỏi LocalStorage
   */
  private clearUserData(): void {
    localStorage.removeItem('currentUser');  // Xóa dữ liệu người dùng từ LocalStorage
  }

  /**
   * Kiểm tra người dùng đã đăng nhập hay chưa
   * @returns boolean trả về true nếu người dùng đã đăng nhập, nếu không trả về false
   */
  isLoggedIn(): boolean {
    return !!this.getCurrentUser();  // Kiểm tra xem có thông tin người dùng trong LocalStorage hay không
  }
}
