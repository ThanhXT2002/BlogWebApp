import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IMenu, IMenuItem } from '../../models/menu.model';


@Injectable({
  providedIn: 'root'
})
export class MenuService {
  constructor(private db: AngularFireDatabase) {}

  getMenus(): Observable<IMenu[]> {
    return this.db.list<IMenu>('menus').snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>  ({
          ...(c.payload.val() as IMenu),
          key: c.payload.key as string
        }))
      )
    );
  }

  getMenuById(id: string): Observable<IMenu | null> {
    return this.db.object<IMenu>(`menus/${id}`).valueChanges();
  }


  createMenu(menu: Omit<IMenu, 'id'>): Promise<string> {
    return this.db.list('menus').push(menu).then(ref => ref.key!);
  }

  updateMenu(id: string, menu: Partial<IMenu>): Promise<void> {
    return this.db.object(`menus/${id}`).update(menu);
  }

  deleteMenu(id: string): Promise<void> {
    return this.db.object(`menus/${id}`).remove();
  }

  addMenuItem(menuId: string, item: Omit<IMenuItem, 'id'>): Promise<string> {
    return this.db.list(`menus/${menuId}/items`).push(item).then(ref => ref.key!);
  }

  updateMenuItem(menuId: string, itemId: string, item: Partial<IMenuItem>): Promise<void> {
    return this.db.object(`menus/${menuId}/items/${itemId}`).update(item);
  }

  deleteMenuItem(menuId: string, itemId: string): Promise<void> {
    return this.db.object(`menus/${menuId}/items/${itemId}`).remove();
  }

  updateMenuItemsOrder(menuId: string, items: IMenuItem[]): Promise<void> {
    const updates = items.reduce((acc, item, index) => {
      acc[`menus/${menuId}/items/${item.id}/order`] = index;
      return acc;
    }, {} as Record<string, number>);
    return this.db.object('/').update(updates);
  }
}
