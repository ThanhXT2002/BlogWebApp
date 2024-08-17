import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable, from, forkJoin, of } from 'rxjs';
import { map, switchMap, mergeMap, toArray, take } from 'rxjs/operators';
import { IPost } from '../../models/post.model';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class PostService extends BaseService{

  private dbPath = '/posts';
  postRef: AngularFireList<IPost>;

  constructor(private db: AngularFireDatabase) {
    super();
    this.postRef = db.list(this.dbPath);
  }

    // Lấy tất cả danh mục bài viết
    getAllPosts(): Observable<IPost[]> {
      return this.postRef.snapshotChanges().pipe(
        map(changes =>
          changes.map(c => ({
            ...(c.payload.val() as IPost),
            key: c.payload.key as string
          }))
        )
      );
    }

      // Lấy một danh mục bài viết cụ thể dựa trên key
  getPost(key: string): Observable<IPost | null> {
    return this.db.object(`${this.dbPath}/${key}`).valueChanges().pipe(
      map(data => {
        if (data) {
          return { ...(data as IPost), key };
        }
        return null;
      })
    );
  }

  // Hàm tạo slug duy nhất
  generateUniqueSlug(title: string, postKey?: string): Observable<string> {
    const baseSlug = this.createSlug(title);
    return this.getAllPosts().pipe(
      take(1), // Chỉ lấy giá trị đầu tiên và kết thúc Observable
      map(posts => {
        const slugs = posts
          .filter(cat => cat.key !== postKey)
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

  create(post: Omit<IPost, 'key' | 'slug' | 'created_at' | 'updated_at'> & { imageFile?: File, albumFiles?: File[] }): Observable<IPost> {
    return this.generateUniqueSlug(post.title).pipe(
      switchMap(slug => {
        const now = new Date();
        const newpost: Omit<IPost, 'key'> = {
          ...post,
          slug,
          created_at: now,
          updated_at: now,
          image: null,
          album: null
        };

        const imageUpload = post.imageFile
          ? this.uploadImage(post.imageFile)
          : of(null);
        const albumUpload = post.albumFiles && post.albumFiles.length > 0
          ? this.uploadAlbum(post.albumFiles)
          : of(null);

        return forkJoin({
          image: imageUpload,
          album: albumUpload
        }).pipe(
          switchMap(({ image, album }) => {
            const finalpost: IPost = {
              ...newpost,
              image,
              album
            };

            return from(this.postRef.push(finalpost)).pipe(
              map(ref => ({
                ...finalpost,
                key: ref.key as string
              }))
            );
          })
        );
      })
    );
  }




  update(key: string, post: Partial<IPost> & { imageFile?: File, albumFiles?: File[] }): Observable<IPost> {
    return this.generateUniqueSlug(post.title || '', key).pipe(
      switchMap(slug => {
        const now = new Date();
        const { imageFile, albumFiles, ...updateData } = post;
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
            const finalUpdateData: Partial<IPost> = {
              ...updateData,
              image,
              album
            };

            return from(this.postRef.update(key, finalUpdateData)).pipe(
              switchMap(() => this.getPost(key)),
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
   // Xóa một expense dựa trên key
   delete(key: string): Observable<void> {
    return from(this.db.object(`${this.dbPath}/${key}`).remove());
  }
}
