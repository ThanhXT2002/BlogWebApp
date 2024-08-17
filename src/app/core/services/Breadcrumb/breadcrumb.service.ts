import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {

  private titleSource = new BehaviorSubject<string>('');
  currentTitle = this.titleSource.asObservable();

  updateTitle(title: string) {
    this.titleSource.next(title);
  }
}
