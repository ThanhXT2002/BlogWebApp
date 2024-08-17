import { Routes } from '@angular/router';
import { UploadFileComponent } from './pages/upload-file/upload-file.component';
import { ExpenseFormComponent } from './pages/expense-form/expense-form.component';
import { ExpenseComponent } from './pages/expense/expense.component';
import { FileManagerComponent } from './pages/file-manager/file-manager.component';
import { ReadFileComponent } from './pages/read-file/read-file.component';

import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { UserComponent } from './pages/admin/user/user.component';
import { ProductCategoryComponent } from './pages/admin/product-category/product-category.component';
import { ProductComponent } from './pages/admin/product/product.component';
import { LayoutComponent } from './pages/admin/layout/layout.component';
import { AuthComponent } from './pages/admin/auth/auth.component';
import { RegisterComponent } from './pages/website/auth/register/register.component';
import { HomeComponent } from './pages/website/home/home.component';
import { adminGuard } from './pages/admin/guard/admin.guard';
import { PostComponent } from './pages/admin/post/post.component';
import { PostCategoryComponent } from './pages/admin/post-category/post-category.component';
import { RichEditorComponent } from './pages/rich-editor/rich-editor.component';
import { FormPostCategoryComponent } from './pages/admin/post-category/form-post-category/form-post-category.component';
import { FormPostComponent } from './pages/admin/post/form-post/form-post.component';
import { LayoutWebsiteComponent } from './pages/website/layout-website/layout-website.component';
import { LoginComponent } from './pages/website/auth/login/login.component';


export const routes: Routes = [

  {
    path:'',
    redirectTo:'home',
    pathMatch:'full'
  },
  {path: '', component:LayoutWebsiteComponent,
    children:[
      {path: 'home', component:HomeComponent},
      {
        path:'register', component:RegisterComponent
       },
      {
        path:'login', component:LoginComponent
       },
    ]
  },
  {path: 'expense', component:ExpenseComponent},
  {path: 'expense-form', component:ExpenseFormComponent},
  {path: 'expense-form/:id', component:ExpenseFormComponent},
  {path: 'file-upload', component:UploadFileComponent},

  {path: 'read-file', component:ReadFileComponent},


  {
    path:'admin/login', component:AuthComponent
   },
  {
    path:'rich-editor', component:RichEditorComponent
   },
  {
    path: 'admin', component:LayoutComponent,
    canActivate: [adminGuard],
    children:[

     {
      path:'dashboard', component:DashboardComponent
     },
     {
      path:'product', component: ProductComponent
    },
    {
      path:'product_category', component: ProductCategoryComponent
    },
    {
      path:'user', component: UserComponent
    },
    {
      path:'post', component: PostComponent
    },
    {
      path:'form-post', component: FormPostComponent
    },
    {
      path:'form-post/:id', component: FormPostComponent
    },
    {
      path:'post-category', component: PostCategoryComponent
    },
    {
      path:'form-post-category', component: FormPostCategoryComponent
    },
    {
      path:'form-post-category/:id', component: FormPostCategoryComponent
    },
    {path: 'file-manager', component:FileManagerComponent},
    ]

  }

];
