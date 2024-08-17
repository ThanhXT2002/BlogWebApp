import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable, from, forkJoin, of } from 'rxjs';
import { map, switchMap, mergeMap, toArray, take } from 'rxjs/operators';
import { IPostCategory } from '../../models/post-category.model';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class PostCategoryService extends BaseService {
  private dbPath = '/categories';
  postCategoriesRef: AngularFireList<IPostCategory>;

  constructor(private db: AngularFireDatabase) {
    super();
    this.postCategoriesRef = db.list(this.dbPath);

  }

  // Lấy tất cả danh mục bài viết
  getAllPostCategories(): Observable<IPostCategory[]> {
    return this.postCategoriesRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({
          ...(c.payload.val() as IPostCategory),
          key: c.payload.key as string
        }))
      )
    );
  }

  // Lấy một danh mục bài viết cụ thể dựa trên key
  getPostCategory(key: string): Observable<IPostCategory | null> {
    return this.db.object(`${this.dbPath}/${key}`).valueChanges().pipe(
      map(data => {
        if (data) {
          return { ...(data as IPostCategory), key };
        }
        return null;
      })
    );
  }



  // Hàm tạo slug duy nhất
  generateUniqueSlug(title: string, existingKey?: string): Observable<string> {
    const baseSlug = this.createSlug(title);
    return this.getAllPostCategories().pipe(
      take(1), // Chỉ lấy giá trị đầu tiên và kết thúc Observable
      map(categories => {
        const slugs = categories
          .filter(cat => cat.key !== existingKey)
          .map(cat => cat.slug);
        let uniqueSlug = baseSlug;
        let counter = 1;
        while (slugs.includes(uniqueSlug)) {
          uniqueSlug = `${baseSlug}-${counter}`;
          counter++;
        }
        return uniqueSlug;
      })
    );
  }

  create(postCategory: Omit<IPostCategory, 'key' | 'slug' | 'created_at' | 'updated_at'> & { imageFile?: File, albumFiles?: File[] }): Observable<IPostCategory> {
    return this.generateUniqueSlug(postCategory.title).pipe(
      switchMap(slug => {
        const now = new Date();
        const { imageFile, albumFiles, ...newPostCategory } = postCategory;

        const category: Omit<IPostCategory, 'key'> = {
          ...newPostCategory,
          slug,
          created_at: now,
          updated_at: now,
          image: null,
          album: null
        };

        const imageUpload = imageFile
          ? this.uploadImage(imageFile)
          : of(null);
        const albumUpload = albumFiles && albumFiles.length > 0
          ? this.uploadAlbum(albumFiles)
          : of(null);

        return forkJoin({
          image: imageUpload,
          album: albumUpload
        }).pipe(
          switchMap(({ image, album }) => {
            category.image = image;
            category.album = album;

            return from(this.postCategoriesRef.push(category)).pipe(
              map(ref => ({
                ...category,
                key: ref.key as string
              }))
            );
          })
        );
      })
    );
  }




  update(key: string, postCategory: Partial<IPostCategory> & { imageFile?: File, albumFiles?: File[] }): Observable<IPostCategory> {
    return this.generateUniqueSlug(postCategory.title || '', key).pipe(
      switchMap(slug => {
        const now = new Date();
        const { imageFile, albumFiles, ...updateData } = postCategory;
        updateData.slug = slug;
        updateData.updated_at = now;

        const imageUpload = imageFile
          ? this.uploadImage(imageFile)
          : of(updateData.image);
        const albumUpload = albumFiles && albumFiles.length > 0
          ? this.uploadAlbum(albumFiles)
          : of(updateData.album);

        return forkJoin({
          image: imageUpload,
          album: albumUpload
        }).pipe(
          switchMap(({ image, album }) => {
            const finalUpdateData: Partial<IPostCategory> = {
              ...updateData,
              image,
              album
            };

            return from(this.postCategoriesRef.update(key, finalUpdateData)).pipe(
              switchMap(() => this.getPostCategory(key)),
              map(updatedCategory => {
                if (!updatedCategory) {
                  throw new Error('Failed to retrieve updated category');
                }
                return updatedCategory;
              })
            );
          })
        );
      })
    );
  }



  getHierarchicalCategories(): Observable<any[]> {
    return this.db.list<IPostCategory>(this.dbPath).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({
          key: c.payload.key || '',  // Sử dụng chuỗi rỗng nếu key là null hoặc undefined
          ...(c.payload.val() as Omit<IPostCategory, 'key'>)
        } as IPostCategory))
      ),
      map(categories => this.buildHierarchy(categories))
    );
  }

  private buildHierarchy(categories: IPostCategory[]): any[] {
    const hierarchy: any[] = [];
    const lookup: { [key: string]: any } = {};

    // Tạo lookup object và thêm các danh mục gốc vào hierarchy
    categories.forEach(category => {
      const { key, parent_id, title } = category;
      if (key) { // Kiểm tra key có tồn tại
        const item = { key, parent_id, title, children: [], level: 0 };
        lookup[key] = item;
        if (!parent_id) {
          hierarchy.push(item);
        }
      }
    });

    // Xây dựng cây phân cấp
    categories.forEach(category => {
      const { key, parent_id } = category;
      if (key && parent_id && lookup[parent_id]) {
        lookup[parent_id].children.push(lookup[key]);
        lookup[key].level = lookup[parent_id].level + 1;
      }
    });

    // Chuyển đổi cây phân cấp thành mảng phẳng với các dấu gạch ngang
    return this.flattenHierarchy(hierarchy);
  }
  private flattenHierarchy(items: any[], prefix = ''): any[] {
    let result: any[] = [];
    items.forEach(item => {
      const label = prefix + item.title;
      result.push({
        key: item.key,
        parent_id: item.parent_id,
        title: item.title,
        label: label,
        value: item.key
      });
      if (item.children.length > 0) {
        result = result.concat(this.flattenHierarchy(item.children, prefix + '----'));
      }
    });
    return result;
  }


   // Xóa một expense dựa trên key
   delete(key:string){
    this.postCategoriesRef.remove(key);
   }

   deleteCategory(key: string): Observable<boolean> {
    return this.canDeleteCategory(key).pipe(
      switchMap(canDelete => {
        if (canDelete) {
          return from(this.db.object(`${this.dbPath}/${key}`).remove()).pipe(
            map(() => true)
          );
        } else {
          return of(false);
        }
      })
    );
  }

  private canDeleteCategory(key: string): Observable<boolean> {
    return this.db.list<IPostCategory>(this.dbPath, ref =>
      ref.orderByChild('parent_id').equalTo(key)
    ).valueChanges().pipe(
      take(1),
      map(children => children.length === 0)
    );
  }

}
