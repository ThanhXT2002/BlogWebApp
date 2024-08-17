import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { mergeMap, toArray } from 'rxjs/operators';
import slugify from 'slugify';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  constructor() { }

  // Phương thức để chuyển một ảnh thành base64
  convertToBase64(file: File): Observable<string> {
    return new Observable((observer) => {
      const reader = new FileReader();

      reader.onload = () => {
        observer.next(reader.result as string);
        observer.complete();
      };

      reader.onerror = (error) => {
        observer.error('Error converting file to base64: ' + error);
        reader.abort();
      };

      reader.readAsDataURL(file);

      return () => {
        reader.abort();
      };
    });
  }

  // Phương thức để upload một ảnh
  uploadImage(file: File): Observable<string> {
    return this.convertToBase64(file);
  }

  // Phương thức để upload nhiều ảnh
  uploadAlbum(files: File[]): Observable<string[]> {
    return from(files).pipe(
      mergeMap(file => this.convertToBase64(file)),
      toArray()
    );
  }

  // Phương thức tạo slug cơ bản
  createSlug(title: string): string {
    return slugify(title, {
      lower: true,
      strict: true,
      locale: 'vi'
    });
  }
}
