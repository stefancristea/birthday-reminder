import {ValidatorFn, AbstractControl} from "@angular/forms";

export class CustomValidators
{
  public static numbers(control: AbstractControl)
  {
    return /^\d+$/.test(control.value) ? null : {notNumber: true};
  }

  public static fixedSize(size: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value !== undefined && control.value.length == size)
            return null
        return {wrongSize: true};
    };
  }

  public static date(control: AbstractControl)
  {
    return typeof control.value === 'object' ? null : {notDate: true};
  }

  public static validPassword(control: AbstractControl)
  {
    const password = control.value;

    if (/[A-Z]/.test(password) == false)
      return { invalidPassword: true };

    if (/[a-z]/.test(password) == false)
      return { invalidPassword: true };

    if (/[0-9]/.test(password) == false)
      return { invalidPassword: true };

    if (/[\*\.\!\@\#\$\%\^\&\(\)\{\}\[\]\:\;\<\>\,\.\?\/\~\_\+\-\=\|]/.test(password) == false)
      return { invalidPassword: true };

    return null;
  }

}
