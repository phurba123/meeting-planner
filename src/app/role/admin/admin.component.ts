import { Component, OnInit,ViewChild,ElementRef, OnDestroy } from '@angular/core';
//import { CookieService } from 'ngx-cookie-service'
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { Subject } from 'rxjs'
import { UserService } from 'src/app/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {CookieService} from 'ngx-cookie-service'

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit ,OnDestroy{

  ngOnDestroy(): void {
    console.log('inside on Destroy');
  }

  public authToken;
  public receiverUserId;
  public receiverUserName;
  public allUsers:any

  public activeDayIsOpen: boolean = true;

  view: string = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private cookie:CookieService
  ) { }

  ngOnInit(): void {
    console.log('inside on init')
    let cookieObj= this.userService.getCookieData();

    this.receiverUserId=cookieObj.receiverUserId;
    this.receiverUserName=cookieObj.receiverUserName;
    this.authToken=cookieObj.authToken

    this.getAllUsers()
    


  }

  //getting all the users
  public getAllUsers(){
    this.userService.getAllUsers(this.authToken).subscribe(
      (apiResponse)=>
      {
        console.log(apiResponse)
        this.allUsers = apiResponse.data;
        console.log('all users',this.allUsers)
      },
      (error)=>
      {
        console.log('error while getting all users')
      });
  }//end of getting all the users

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  //logout function
  public logOut() {
    this.userService.logOut(this.receiverUserId).subscribe(
      (apiResponse) => {
        if (apiResponse['status'] === 200) {
          this.toastr.success('You are logged out', 'LogOut successfull');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1000);

          this.deleteCookiesAndLocalStorage();
        }
        else{
          this.toastr.error(apiResponse['message'],'LogOut failed')
          console.log(apiResponse)
        }
      },
      (error) => {
        console.log('error is : ',error)
      }
    );
  }

  private deleteCookiesAndLocalStorage()
  {
    //deleting local storage and cookies upon logout
    this.userService.removeUserInfoFromLocalStorage();
    this.cookie.delete('authToken')
    this.cookie.delete('receiverUserId');
    this.cookie.delete('receiverUserName');
  }

  

}
