import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-resource-allocate',
  templateUrl: './resource-allocate.component.html',
  styleUrls: ['./resource-allocate.component.scss']
})
export class ResourceAllocateComponent {
  itemForm: FormGroup;
  formModel: any = { status: null };
  showError: boolean = false;
  errorMessage: string = '';
  assignModel: any = {};

  showMessage: boolean = false;
  responseMessage: string = '';
  eventList$: Observable<any> = of([]);
  resourceList$: Observable<any> = of([]);
  filteredResourceList$: Observable<any> = of([]);



  constructor(public router: Router, private formBuilder: FormBuilder, private httpService: HttpService, private authService: AuthService) {
    if (authService.getRole != 'PLANNER') {
      router.navigateByUrl('dashboard')
    }
    this.itemForm = this.formBuilder.group({
      resource: ['', [Validators.required]],
      quantity: ['', [Validators.required, this.notNegitive]],
      event: ['', [Validators.required]]

    })

  }
  ngOnInit(): void {
    this.getEvent();
    this.getResources();
    this.filteredResourceList$ = this.resourceList$.pipe(
      map((arr: any) => {
        return arr.filter(r => r.availability)
      })
    );
  }
//custom validator for non negative quantity
  notNegitive(control: AbstractControl): ValidationErrors | null {
    if (control.value < 0) {
      return { nNegitive: true };
    } else {
      return null;
    }
  }
//this function get invoked when user clicks on submit button
  onSubmit() {
    if (this.itemForm.valid) {
      this.httpService.allocateResources(this.itemForm.value.event.eventID, this.itemForm.value.resource.resourceID, this.itemForm.value).subscribe(
        (data: any) => {
          this.showMessage = true;
          this.responseMessage = 'Allocation successfully done';
          setTimeout(this.refresh, 1000);
        },
        (error: any) => {
          this.showError = true;
          this.errorMessage = 'Unable to allocate resource.';
          setTimeout(this.refresh, 1000)
        }
      );
    }
  }

  getEvent() {
    this.eventList$ = this.httpService.GetAllevents();
  }

  getResources() {
    this.resourceList$ = this.httpService.GetAllResources();
    this.filteredResourceList$ = this.resourceList$;
  }
  refresh() {
    window.location.reload();
  }


}
