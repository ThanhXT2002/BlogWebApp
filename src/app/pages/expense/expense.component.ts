import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IExpense } from '../../core/models/common.model';
import { ExpenseService } from '../../core/services/expense.service';

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.scss'
})
export class ExpenseComponent implements OnInit {

  expenses:IExpense[] = [];
  totalExpenses = 0;

  constructor(
    private expenseService: ExpenseService,
    private router: Router){

  }

  ngOnInit(): void {
    this.getAllExpenses()
  }

  getAllExpenses(){
    this.expenseService.getAllExpense().snapshotChanges().subscribe({
      next:(data)=>{
        this.expenses = []
        data.forEach((item) => {
          let expenese = item.payload.toJSON() as IExpense;
          this.totalExpenses += parseInt(expenese.price);
          this.expenses.push({
            key: item.key || '',
            title: expenese.title,
            price:expenese.price,
            description: expenese.description,
          })
        })
      }
    })
  }

  editExpense(key: string){
    this.router.navigate(['/expense-form/' + key])
  }

  removeExpense(key:string){
    if(window.confirm("Bạn có thực sự muốn xóa bản ghi này không?")){
        this.expenseService.deleteExpanses(key)
    }
  }

  preventDefault(event: Event) {
    event.preventDefault();
  }




}
