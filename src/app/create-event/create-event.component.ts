import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { map, Observable, of } from 'rxjs';


@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent implements OnInit {

  itemForm: FormGroup;
  formModel: any = { status: null };
  showError: boolean = false;
  errorMessage: any;
  eventList: any = [];
  assignModel: any = {};

  showMessage: any;
  responseMessage: any;

  error$: Observable<String> = of('');
  success$: Observable<String> = of('');
  userList$: Observable<any>;
  constructor(public router: Router, private formBuilder: FormBuilder, private authService: AuthService, private httpService: HttpService) {

    if (authService.getRole != 'PLANNER') {
      router.navigateByUrl('dashboard')
    }
    this.itemForm = formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      dateTime: ['', [Validators.required, this.dateValidations]],
      location: ['', [Validators.required]],
      status: ['', [Validators.required]],
      user: ['', [Validators.required]]
    });
  }
  ngOnInit(): void {

    this.getUsers();
  }
  getUsers() {

    this.userList$ = this.httpService.getAllUser().pipe(
      map((data: any) => {
        return data.filter(r => r.role === 'CLIENT')
      })
    );
  }
  dateValidations(control: AbstractControl): ValidationErrors | null {

    const today = new Date();
    const input = new Date(control.value);


    if (input < today) {
      return { invalidDate: true };
    } else {
      return null;
    }
  }


  onSubmit() {

    if (this.itemForm.valid) {

      this.httpService.createEvent(this.itemForm.value).subscribe((data: any) => {
        this.success$ = of("Event created successfully.")
      }, (error) => {
        this.error$ = of('Unable to create Event.');
      });
    } else {
      alert("Form is not valid.");
      this.itemForm.markAllAsTouched();
    }
  }
}
