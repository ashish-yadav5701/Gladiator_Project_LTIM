import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  showUserTable: boolean = true;
  userList$: Observable<any>;
  eventList$: Observable<any>;
  eventList2$: Observable<any>;
  roleName: string = '';
  username: string = '';
  email: string = '';
  constructor(private httpService: HttpService, private authService: AuthService) {
    this.roleName = authService.getRole;
    this.username = authService.getUsername;
    this.email = authService.getEmail;

  }
  // load all lists
  ngOnInit(): void {
    this.getUsers();
    this.getEvents();
    this.getAllEvents()
  }
  // method to get all events for a particular user
  getEvents() {
    this.eventList$ = this.httpService.GetAllevents();
  }
  // method to get all events
  getUsers() {
    this.userList$ = this.httpService.getAllUser();
  }
  // method to get all for staff
  getAllEvents() {
    this.eventList2$ = this.httpService.getAllEventsStaff();
  }
}
