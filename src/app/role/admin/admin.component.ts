import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service'
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { Subject } from 'rxjs'
import { UserService } from 'src/app/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  private authToken;
  public receiverUserId;
  public receiverUserName;

  public activeDayIsOpen: boolean = true;

  view: string = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();

  constructor(
    private cookie: CookieService,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authToken = this.cookie.get('authToken');
    this.receiverUserId = this.cookie.get('receiverUserId');
    this.receiverUserName = this.cookie.get('receiverUserName');
    console.log(this.receiverUserName)
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  //logout function
  public logOut() {
    this.userService.logOut(this.authToken).subscribe(
      (apiResponse) => {
        if (apiResponse['status'] === 200) {
          this.toastr.success('You are logged out', 'LogOut successfull');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1000);

          //deleting local storage and cookies upon logout
          this.userService.removeUserInfoFromLocalStorage();
          this.cookie.delete('authToken');
          this.cookie.delete('receiverUserId');
          this.cookie.delete('receiverUserName');
        }
        else{
          this.toastr.error(apiResponse['message'],'LogOut failed')
        }
      },
      (error) => {
        console.log(error)
      }
    );
  }

}
