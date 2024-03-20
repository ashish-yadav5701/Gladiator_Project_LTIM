import { Component, OnInit, Renderer2 } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  itemForm: FormGroup;
  success$: Observable<String> = of('');
  error$: Observable<String> = of('');

  showFlashMessage = false;
  success: boolean = false;
  constructor(private renderer: Renderer2, public router: Router, public httpService: HttpService, private formBuilder: FormBuilder, private authService: AuthService) {
    if (authService.getLoginStatus) {
      router.navigateByUrl('dashboard');
    }
    this.itemForm = this.formBuilder.group({
      username: ["", [Validators.required, this.noSpaceValidations]],
      password: ["", [Validators.required, this.passwordIsNotValid]],
      confirmPassword: ["", [Validators.required, this.passwordIsNotValid]]
    }, {
      validator: this.matchPassword
    });
  }


  ngOnInit(): void {
  }


  passwordIsNotValid(control: AbstractControl): { [key: string]: boolean } | null {
    let passwordVal = control.value as string;
    let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])([a-zA-Z\d!@#%$%^&*]){8,}$/;
    if (!passwordRegex.test(passwordVal)) {
      return { invalidPassword: true };
    }
    return null;
  }



  noSpaceValidations(control: AbstractControl): ValidationErrors | null {
    const controlValue = control.value as string;
    if (controlValue.indexOf(' ') >= 0) {
      return { NoSpaceValidator: true };
    } else {
      return null;
    }
  }

  matchPassword(f: FormGroup): ValidationErrors | null {
    return f.get('password').value == f.get('confirmPassword').value ? null : { notMatch: true };
  }

  onSubmit(): void {
    if (this.itemForm.valid) {
      this.httpService.getAllUser().subscribe((data: any) => {
        let found: boolean = false;
        for (let user of data) {
          if (user.username == this.itemForm.value.username) {
            found = true;
            this.httpService.updateUser(user.userID, {
              userID: user.userID,
              username: user.username,
              email: user.email,
              password: this.itemForm.value.password,
              role: user.role
            }).subscribe();

            this.success$ = of('Password updated successfully');
            this.flashMessage();
            setTimeout(() => { this.success$ = of('') }, 2000);
          }
        }
        if (!found) {
          this.error$ = of('Username not found');
          this.flashMessage();
          setTimeout(() => { this.error$ = of('') }, 2000);
        }

      })


    }
    else {

      this.error$ = of('Sorry! Passwords did not match');
      this.flashMessage();
      setTimeout(() => { this.error$ = of('') }, 2000);
    }

  }


  flashMessage() {
    this.showFlashMessage = true;
    setTimeout(() => {
      this.showFlashMessage = false;

    }, 2000); // Hide after 2 seconds
  }
}
