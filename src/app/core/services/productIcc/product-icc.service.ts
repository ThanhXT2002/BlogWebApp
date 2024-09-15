import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, from, of } from 'rxjs';
import { map, catchError, take, switchMap } from 'rxjs/operators';
import { IProductIcc } from '../../models/product-icc.models';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class ProductIccService extends BaseService {
  private dbPath = '/product-icc';

  constructor(private db: AngularFireDatabase) {
    super();
  }

  getAll(): Observable<IProductIcc[]> {
    return this.db.list<IProductIcc>(this.dbPath).snapshotChanges().pipe(
      map(changes => changes.map(c => ({ key: c.payload.key!, ...c.payload.val()! }))),
      catchError(this.handleError<IProductIcc[]>('getAll', []))
    );
  }

  getById(key: string): Observable<IProductIcc | null> {
    return this.db.object<IProductIcc>(`${this.dbPath}/${key}`).valueChanges().pipe(
      map(data => data ? { ...data, key } : null),
      catchError(this.handleError<IProductIcc | null>(`getById id=${key}`))
    );
  }

  create(product: Omit<IProductIcc, 'key' | 'slug' | 'created_at' | 'updated_at'>): Observable<string> {
    return this.generateUniqueSlug(product.title).pipe(
      switchMap(slug => {
        const now = new Date().toISOString();
        const newProduct = { ...product, slug, created_at: now, updated_at: now };
        return from(this.db.list(this.dbPath).push(newProduct));
      }),
      map(ref => ref.key!),
      catchError(this.handleError<string>('create'))
    );
  }

  update(key: string, product: Partial<IProductIcc>): Observable<void> {
    return this.generateUniqueSlug(product.title || '', key).pipe(
      switchMap(slug => {
        const updateData = {
          ...product,
          slug,
          updated_at: new Date().toISOString()
        };
        return from(this.db.object(`${this.dbPath}/${key}`).update(updateData));
      }),
      catchError(this.handleError<void>(`update id=${key}`))
    );
  }

  getProductBySlug(slug: string): Observable<IProductIcc | null> {
    return this.db.list<IProductIcc>(this.dbPath, ref => ref.orderByChild('slug').equalTo(slug))
      .snapshotChanges()
      .pipe(
        map(changes => {
          if (changes.length > 0) {
            const change = changes[0];
            return { key: change.payload.key!, ...change.payload.val()! };
          }
          return null;
        }),
        catchError(this.handleError<IProductIcc | null>(`getProductBySlug slug=${slug}`))
      );
  }

  generateUniqueSlug(title: string, productKey?: string): Observable<string> {
    const baseSlug = this.createSlug(title);
    return this.getAll().pipe(
      take(1),
      map(products => {
        const slugs = products
          .filter(product => product.key !== productKey)
          .map(product => product.slug);
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

  delete(key: string): Observable<void> {
    return from(this.db.object(`${this.dbPath}/${key}`).remove()).pipe(
      catchError(this.handleError<void>(`delete id=${key}`))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      //có thể thêm logic để gửi lỗi đến service log ở đây
      return of(result as T);
    };
  }
}
