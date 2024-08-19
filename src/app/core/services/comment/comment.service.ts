import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { IComment } from '../../models/comment.model';


@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private dbPath = '/comments';

  constructor(private db: AngularFireDatabase) {}

  getAllComments(): Observable<IComment[]> {
    return this.db.list<IComment>(this.dbPath)
      .snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c => ({
            key: c.payload.key,
            ...c.payload.val()
          } as IComment))
        )
      );
  }

  getCommentsByPostId(postId: string): Observable<IComment[]> {
    return this.db.list<IComment>(this.dbPath, ref => ref.orderByChild('post_id').equalTo(postId))
      .snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c => ({
            key: c.payload.key,
            ...c.payload.val() as Omit<IComment, 'key'>
          }))
        )
      );
  }

  createComment(comment: Omit<IComment, 'key'| 'status' | 'created_at' | 'updated_at'>): Observable<IComment> {
    const now = new Date().toISOString();
    const newComment: Omit<IComment, 'key'> = {
      ...comment,
      status:true,
      created_at: now,
      updated_at: now
    };
    return from(this.db.list(this.dbPath).push(newComment))
      .pipe(
        map(ref => ({ key: ref.key, ...newComment }))
      );
  }

  updateComment(key: string, value: Partial<IComment>): Observable<void> {
    return from(this.db.object(`${this.dbPath}/${key}`).update({
      ...value,
      updated_at: new Date().toISOString()
    }));
  }

  deleteComment(key: string): Observable<void> {
    return from(this.db.object(`${this.dbPath}/${key}`).remove());
  }
}
