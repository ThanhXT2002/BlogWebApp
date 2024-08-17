import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const repeatPassword = control.get('repeat_password')?.value;
    if (password !== repeatPassword) {
      return { passwordsDoNotMatch: true };
    }
    return null;
  };
}
