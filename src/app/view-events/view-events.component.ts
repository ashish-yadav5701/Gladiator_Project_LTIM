import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { FormsModule } from '@angular/forms';
import { map, Observable, of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-view-events',
  templateUrl: './view-events.component.html',
  styleUrls: ['./view-events.component.scss']
})
export class ViewEventsComponent implements OnInit {

  itemForm: FormGroup;
  isUpdateVisible: boolean = false;
  formModel: any = { status: null };
  showError: boolean = false;
  errorMessage: any;
  eventObj$: Observable<any> = of([]);
  assignModel: any = {};

  showMessage: any;
  responseMessage: any;
  isUpdate: any = true;

  inputMessage: string = '';
  userList$: Observable<any> = of([]);
  errorMsg$: Observable<String> = of('');
  responseMsg$: Observable<String> = of('');
  notClicked: boolean = true;
  event: any;
  isCompleted: boolean;
  constructor(public router: Router, private formBuilder: FormBuilder, private httpService: HttpService, private authService: AuthService) {
    if (authService.getRole != 'STAFF') {
      router.navigateByUrl('dashboard')
    }
    this.itemForm = formBuilder.group({
      eventID: [''],
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      dateTime: ['', [Validators.required, this.dateValidations]],
      location: ['', [Validators.required]],
      status: ['', [Validators.required]],
      user: ['', [Validators.required]]
    });
  }
  ngOnInit(): void {


  }
  toggleUpdatePageVisibility() {
    this.isUpdateVisible = !this.isUpdateVisible;
  }

  searchEvent() {
    this.eventObj$ = this.httpService.GetEventdetails(this.inputMessage).pipe(
      map((data: any) => {
        if (Array.isArray(data)) {
          return data;
        } else {
          return [data];
        }
      })
    );
    this.notClicked = false;
  }

    // Convert Date object to string in the format accepted by datetime-local input (YYYY-MM-DDTHH:mm)
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = this.padZero(date.getMonth() + 1);
    const day = this.padZero(date.getDate());
    const hours = this.padZero(date.getHours());
    const minutes = this.padZero(date.getMinutes());

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

    // Pad single digits with zero
  padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  onSubmit() {
    if (this.itemForm.valid) {
      this.httpService.updateEvent({
        eventID: this.itemForm.value.eventID,
        title: this.itemForm.value.title,
        description: this.itemForm.value.description,
        dateTime: new Date(this.itemForm.value.dateTime),
        location: this.itemForm.value.location,
        status: this.itemForm.value.status,
        user: this.itemForm.value.user
      }, this.inputMessage).subscribe(
        (res: any) => {
          this.responseMsg$ = of('Event updated successfully');
          this.searchEvent();
        },
        (error: any) => {
          this.errorMsg$ = of('Unable to update event');
        }
      )
      this.isUpdate = true;
      if (this.itemForm.value.status === 'Complete') {
        this.isCompleted = true;
      }
    } else {
      this.itemForm.markAllAsTouched();
    }
  }
  edit(val: any) {
    this.isUpdate = false;
    let dateTime = new Date(val.dateTime);
    this.eventObj$.subscribe((data: any) => {
      this.event = data[0];
      this.itemForm.patchValue({
        eventID: data[0].eventID,
        title: data[0].title,
        description: data[0].description,
        dateTime: this.formatDate(new Date(data[0].dateTime)),
        location: data[0].location,
        status: data[0].status,
        user: data[0].user
      });

    });
  }

  dateValidations(control: AbstractControl): ValidationErrors | null {

    const today=new Date();
    const input=new Date(control.value);
    

    if ( input<today) {
      return { invalidDate: true };
    } else {
      return null;
    }
  }

}