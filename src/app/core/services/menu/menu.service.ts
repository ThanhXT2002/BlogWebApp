import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IMenu, IMenuItem } from '../../models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  constructor(private db: AngularFireDatabase) {}

  getMenus(): Observable<IMenu[]> {
    return this.db.list<IMenu>('menus').snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({
          ...(c.payload.val() as IMenu),
          key: c.payload.key as string
        }))
      ),
      catchError(error => {
        console.error('Error fetching menus', error);
        return [];
      })
    );
  }

  getMenuById(key: string): Observable<IMenu | null> {
    return this.db.object<IMenu>(`menus/${key}`).valueChanges();
  }

  createMenu(menu: Omit<IMenu, 'key'>): Observable<string> {
    return from(this.db.list('menus').push(menu)).pipe(
      map(ref => ref.key!),
      catchError(error => {
        console.error('Error creating menu', error);
        throw error;
      })
    );
  }

  updateMenu(key: string, menu: Partial<IMenu>): Observable<void> {
    return from(this.db.object(`menus/${key}`).update(menu)).pipe(
      catchError(error => {
        console.error('Error updating menu', error);
        throw error;
      })
    );
  }

  deleteMenu(key: string): Observable<void> {
    return from(this.db.object(`menus/${key}`).remove()).pipe(
      catchError(error => {
        console.error('Error deleting menu', error);
        throw error;
      })
    );
  }

  getMenuItems(menuKey: string): Observable<IMenuItem[]> {
    return this.db.list<IMenuItem>(`menus/${menuKey}/items`).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({
          ...(c.payload.val() as IMenuItem),
          key: c.payload.key as string
        }))
      ),
      catchError(error => {
        console.error('Error fetching menu items', error);
        return [];
      })
    );
  }

  updateMenuItems(menuKey: string, items: IMenuItem[]): Observable<void> {
    return from(this.db.object(`menus/${menuKey}/items`).set(items)).pipe(
      catchError(error => {
        console.error('Error updating menu items', error);
        throw error;
      })
    );
  }
}
