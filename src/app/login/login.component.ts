import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { Observable, of } from 'rxjs';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  itemForm: FormGroup;
  formModel: any = {};
  errorMessage: any;
  userSuccess$: Observable<String> = of('');
  userError$: Observable<String> = of('');
  constructor(public router: Router, public httpService: HttpService, private formBuilder: FormBuilder, private authService: AuthService) {
    if (authService.getLoginStatus) {
      router.navigateByUrl('dashboard');
    }
    this.itemForm = this.formBuilder.group({
      username: ["", [Validators.required, this.noSpaceValidations]],
      password: ["", [Validators.required, this.passwordIsNotValid]]
    });
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

  ngOnInit(): void {
  }
  onLogin() {
    if (this.itemForm.valid) {
      
      this.httpService.Login(this.itemForm.value).subscribe((data: any) => {
        if (data.userNo != 0) {

          this.authService.SetRole(data.role);
          this.authService.saveToken(data.token);
          this.authService.SetUsername(data.username);
          this.authService.SetEmail(data.email);
          this.userSuccess$ = of("User created successfully");
          this.router.navigateByUrl('/dashboard');
          setTimeout(() => {
            window.location.reload();
          }, 500);
        } else {
         
          this.errorMessage = "Wrong User or Password";
        }
      }, error => {
       
        this.errorMessage = "An error occurred while logging in. Please try again later.";
        this.userError$ = of("Unable to login user");
      });
    } else {
      this.itemForm.markAllAsTouched();
    }
  }

  registration() {
    this.router.navigateByUrl('/registration');
  }

  forgotPassword() {
    this.router.navigateByUrl('/forgot-password');
  }
}
