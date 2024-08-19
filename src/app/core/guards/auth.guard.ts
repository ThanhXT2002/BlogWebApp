import { AuthService } from '../services/authentication/auth.service';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';


export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const currentUser = authService.getCurrentUser();

  if (currentUser && currentUser.publish) {
    // Người dùng đã đăng nhập và có role là true (admin)
    return true;
  }

  // Người dùng chưa đăng nhập hoặc không phải admin
  // Chuyển hướng về trang home
  return router.createUrlTree(['/login']);
};
