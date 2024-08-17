import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { from, Observable, of  } from 'rxjs';
import { catchError, last, tap } from 'rxjs/operators';
import { switchMap, map  } from 'rxjs/operators';
import { HttpEvent, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EditorboxService {

  constructor(private storage: AngularFireStorage) {}

  uploadImage(file: File, directory: string = 'editor_images'): Observable<HttpEvent<{ imageUrl: string }>> {
    const filePath = `${directory}/${new Date().getTime()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    return task.snapshotChanges().pipe(
      last(),
      switchMap(() => fileRef.getDownloadURL()),
      map(downloadURL => {
        console.log('Download URL:', downloadURL);
        return new HttpResponse<{ imageUrl: string }>({
          body: { imageUrl: downloadURL }
        });
      }),
      catchError(error => {
        console.error('Upload error:', error);
        return of(new HttpResponse<{ imageUrl: string }>({
          body: { imageUrl: '' },
          status: 400
        }));
      })
    );
  }
}
