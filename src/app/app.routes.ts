import { Routes } from '@angular/router';
import { FileManagerComponent } from './pages/file-manager/file-manager.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { UserComponent } from './pages/admin/user/user.component';
import { ProductCategoryComponent } from './pages/admin/product-category/product-category.component';
import { LayoutComponent } from './pages/admin/layout/layout.component';
import { AuthComponent } from './pages/admin/auth/auth.component';
import { RegisterComponent } from './pages/website/auth/register/register.component';
import { HomeComponent } from './pages/website/home/home.component';
import { adminGuard } from './pages/admin/guard/admin.guard';
import { PostComponent } from './pages/admin/post/post.component';
import { PostCategoryComponent } from './pages/admin/post-category/post-category.component';
import { FormPostCategoryComponent } from './pages/admin/post-category/form-post-category/form-post-category.component';
import { FormPostComponent } from './pages/admin/post/form-post/form-post.component';
import { LayoutWebsiteComponent } from './pages/website/layout-website/layout-website.component';
import { LoginComponent } from './pages/website/auth/login/login.component';
import { PostDetailComponent } from './pages/website/post-detail/post-detail.component';
import { BlogComponent } from './pages/website/blog/blog.component';
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
       { path: 'post/:slug', component: PostDetailComponent },
       { path: 'blog', component: BlogComponent },
       { path: 'post', component: BlogComponent },
    ]
  },
  {
    path:'admin/login', component:AuthComponent
   },
  {
    path: 'admin', component:LayoutComponent,
    canActivate: [adminGuard],
    children:[

     {
      path:'dashboard', component:DashboardComponent
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
