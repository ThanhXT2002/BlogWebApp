import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { forkJoin, from, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { IBanner, IBannerImage } from '../../models/banner.model';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class BannerService extends BaseService {

  private dbPath = '/banners';
  bannersRef: AngularFireList<IBanner>;

  constructor(private db: AngularFireDatabase) {
    super();
    this.bannersRef = db.list(this.dbPath);
  }

  getAllBanners(limit: number = 10): Observable<IBanner[]> {
    return this.db.list<IBanner>(this.dbPath, ref => ref.limitToLast(limit)).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({
          ...(c.payload.val() as IBanner),
          key: c.payload.key as string
        }))
      )
    );
  }

  getBanner(key: string): Observable<IBanner | null> {
    return this.db.object(`${this.dbPath}/${key}`).valueChanges().pipe(
      map(data => {
        if (data) {
          return { ...(data as IBanner), key };
        }
        return null;
      })
    );
  }


  create(banner: Omit<IBanner, 'key' | 'created_at' | 'updated_at'>): Observable<IBanner> {
    const now = new Date().toISOString();
  const newBanner: Omit<IBanner, 'key'> = {
    ...banner,
    album: banner.album?.map(img => ({...img, uploadedAt: now})) || [],
    created_at: now,
    updated_at: now
  };

  return from(this.bannersRef.push(newBanner)).pipe(
    map(ref => ({
      ...newBanner,
      key: ref.key as string
    })),
    catchError(error => {
      console.error('Error creating banner:', error);
      return throwError(() => new Error('Failed to create banner'));
    })
  );
  }

  update(key: string, banner: Partial<IBanner>): Observable<IBanner> {
    const now = new Date().toISOString();
    const updateData: Partial<IBanner> = {
      ...banner,
      updated_at: now
    };

    return from(this.bannersRef.update(key, updateData)).pipe(
      switchMap(() => this.getBanner(key)),
      map(updatedBanner => {
        if (!updatedBanner) {
          throw new Error('Failed to retrieve updated banner');
        }
        return updatedBanner;
      })
    );
  }

  delete(key: string): Observable<void> {
    return from(this.bannersRef.remove(key));
  }

  generateShortCode(): string {
    // Implement your short code generation logic here
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}
