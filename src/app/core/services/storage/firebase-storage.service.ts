import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, forkJoin, from } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

interface StorageItem {
  name: string;
  fullPath: string;
  type: 'file' | 'folder';
  downloadURL?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseStorageService {
constructor(private storage: AngularFireStorage) { }

// Upload multiple files
uploadMultiCategory(files: File[]): Observable<any> {
  const uploadTasks = files.map(file =>
    this.storage.upload(`multipleCateGory/${file.name}`, file)
  );
  return forkJoin(uploadTasks);
}

getAllMultiCategoryItems(): Observable<StorageItem[]> {
  return this.storage.ref('multipleCateGory').listAll().pipe(
    mergeMap(result => {
      const folderItems: StorageItem[] = result.prefixes.map(prefix => ({
        name: prefix.name,
        fullPath: prefix.fullPath,
        type: 'folder'
      }));

      const fileObservables = result.items.map(item =>
        from(item.getDownloadURL()).pipe(
          map(url => ({
            name: item.name,
            fullPath: item.fullPath,
            type: 'file',
            downloadURL: url
          } as StorageItem))
        )
      );

      return forkJoin([...fileObservables]).pipe(
        map(fileItems => [...folderItems, ...fileItems])
      );
    })
  );
}

// Xóa file
deleteFile(fileUrl: string): Promise<void> {
  return this.storage.refFromURL(fileUrl).delete().toPromise();
}


}





// constructor(private storage: AngularFireStorage) { }

// listFiles(path: string): Observable<any[]> {
//   return from(this.storage.ref(path).listAll()).pipe(
//     map(result => {
//       return [...result.items, ...result.prefixes];
//     })
//   );
// }

// uploadFile(path: string, file: File): Observable<string> {
//   const ref = this.storage.ref(path);
//   return from(ref.put(file)).pipe(
//     map(() => `File ${file.name} uploaded successfully`)
//   );
// }

// deleteFile(path: string): Observable<string> {
//   return from(this.storage.ref(path).delete()).pipe(
//     map(() => `File at ${path} deleted successfully`)
//   );
// }

// downloadFile(path: string): Observable<string> {
//   return this.storage.ref(path).getDownloadURL();
// }
