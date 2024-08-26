import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ISystem } from '../../models/system.model';

@Injectable({
  providedIn: 'root'
})
export class SystemService {
  private dbPath = '/system';

  constructor(private db: AngularFireDatabase) {}

  getSystemInfo(): Observable<ISystem | null> {
    return this.db.object<ISystem>(this.dbPath).valueChanges().pipe(
      map(system => system ? system : null)
    );
  }

  updateSystemInfo(systemInfo: ISystem): Observable<void> {
    return from(this.db.object(this.dbPath).set(systemInfo));
  }

  deleteSystemInfo(): Observable<void> {
    return from(this.db.object(this.dbPath).remove());
  }

   // Phương thức này sẽ thay thế thông tin hệ thống cũ bằng thông tin mới
  saveSystemInfo(newSystemInfo: ISystem): Observable<void> {
    return this.deleteSystemInfo().pipe(
      switchMap(() => this.updateSystemInfo(newSystemInfo))
    );
  }
}
