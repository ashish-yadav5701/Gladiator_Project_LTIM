import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
roleName: string | null;
constructor(private router:Router){

}
onExplore(){
    this.router.navigateByUrl('/login');
}
}