import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../../core/services/authentication/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const currentUser = authService.getCurrentUser();

  if (currentUser && currentUser.role) {
    // Người dùng đã đăng nhập và có role là true (admin)
    return true;
  }

  // Người dùng chưa đăng nhập hoặc không phải admin
  // Chuyển hướng về trang home
  return router.createUrlTree(['/home']);
};
