import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpenseService } from '../../core/services/expense.service';
import {ActivatedRoute, Router } from '@angular/router';
import { __param } from 'tslib';
import { IExpense } from '../../core/models/common.model';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './expense-form.component.html',
  styleUrl: './expense-form.component.scss'
})
export class ExpenseFormComponent implements OnInit{
  expenseForm!: FormGroup;

  expenseId = '';
  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private router: Router,
    private activedRoute: ActivatedRoute
  ){
    this.expenseForm = this.fb.group({
      title: new FormControl("", [Validators.required]),
      price: new FormControl("", [Validators.required]),
      description: new FormControl("")
    })
  }

  ngOnInit():void{
    this.activedRoute.params.subscribe({
      next:(params)=>{
        this.expenseId = params['id'] || '';
        this.getExpense(this.expenseId);
      }
    })
  }

  onsubmit(){
    if(this.expenseForm.valid){
      console.log(this.expenseId);
      debugger;
      if(this.expenseId !== ''){
        this.expenseService.updateExpanses(this.expenseId, this.expenseForm.value)
      }else{
        this.expenseService.addExpanses(this.expenseForm.value)
      }
      this.router.navigate(['/'])
    }else{
      this.expenseForm.markAllAsTouched()
    }
  }

  getExpense(key: string) {
    this.expenseService.getExpense(key).snapshotChanges().subscribe({
      next: (data) => {
        const expense = data.payload.toJSON() as IExpense;
        if (expense) {
          this.expenseForm.patchValue(expense);
        }
      },
      error: (error) => console.error('Error fetching expense:', error)
    });
  }

  




}
