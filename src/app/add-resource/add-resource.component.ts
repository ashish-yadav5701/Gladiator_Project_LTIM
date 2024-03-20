import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-add-resource',
  templateUrl: './add-resource.component.html',
  styleUrls: ['./add-resource.component.scss']
})
export class AddResourceComponent implements OnInit {

  resourceList$: Observable<any[]> = of([]);
  itemForm: FormGroup;
  addResourceError$: Observable<String> = of('');
  addResourceSuccess$: Observable<String> = of('');



  constructor(public router: Router, private formBuilder: FormBuilder, private authService: AuthService, private httpService: HttpService) {
    if (authService.getRole != 'PLANNER') {
      router.navigateByUrl('dashboard')
    }
    this.itemForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      availability: ['', [Validators.required]]
    })


  }
  ngOnInit(): void {

    this.getResources();
  }


  onSubmit() {

    if (this.itemForm.valid) {
      this.httpService.addResource(this.itemForm.value).subscribe(
        (res) => {
          this.addResourceSuccess$ = of('Resource added successfully!');
          this.getResources();
        },
        (error) => {
          this.addResourceError$ = of('Unable to add resource');
        }
      );

    } else {
      this.markFormGroupTouched(this.itemForm);
    }

  }

  getResources() {

    this.resourceList$ = this.httpService.GetAllResources();

  }
  markFormGroupTouched(itemForm: FormGroup<any>) {
    throw new Error('Method not implemented.');
  }

}

