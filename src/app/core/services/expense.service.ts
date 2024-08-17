import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { IExpense } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private dbPath = "/expenses"; // Đường dẫn đến node 'expenses' trong Realtime Database
  expensesRef: AngularFireList<any>; // Reference đến danh sách expenses

  constructor(private db: AngularFireDatabase) {
    this.expensesRef = db.list(this.dbPath); // Khởi tạo reference đến danh sách expenses
   }

   // Lấy tất cả expenses
   getAllExpense(){
    return this.expensesRef;
   }

   // Lấy một expense cụ thể dựa trên key
   getExpense(key:string){
    return this.db.object(`${this.dbPath}/${key}`);
   }

   // Thêm một expense mới
   addExpanses(expenses:IExpense){
    this.expensesRef.push(expenses);
   }

   // Cập nhật một expense dựa trên key
   updateExpanses(key: string, expenses:IExpense){
    this.expensesRef.update(key, expenses);
   }

   // Xóa một expense dựa trên key
   deleteExpanses(key:string){
    this.expensesRef.remove(key);
   }

}
