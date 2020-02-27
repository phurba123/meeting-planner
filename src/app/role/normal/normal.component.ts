import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CookieService } from 'ngx-cookie-service'
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { Subject } from 'rxjs'
import { UserService } from 'src/app/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from 'src/app/socket.service';
//import { ThrowStmt } from '@angular/compiler';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  },

  green: {
    primary: '#008000',
    secondary: '#FDF1BA'
  }

};

@Component({
  selector: 'app-normal',
  templateUrl: './normal.component.html',
  styleUrls: ['./normal.component.css']
})


export class NormalComponent implements OnInit {

  // @ViewChild('modalContent') modalContent: TemplateRef<any>;
  // @ViewChild('modalAlert') modalAlert: TemplateRef<any>;

  view: string = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  //refresh: Subject<any> = new Subject();

  activeDayIsOpen: boolean = true;

  public userInfo: any;
  public authToken: any;
  public receiverUserId: any;
  public receiverUserName: any;
  public meetings: any = [];
  public events: CalendarEvent[] = [];
  public remindMe: boolean;


  constructor(
    //private modal: NgbModal,
    public userService: UserService,
    //public socketService: SocketService,
    private cookie: CookieService,
    public _route: ActivatedRoute,
    public router: Router,
    private toastr: ToastrService,
    private socketService: SocketService
  ) { }

  ngOnInit(): void {


    this.authToken = this.cookie.get('authToken');
    this.receiverUserId = this.cookie.get('receiverUserId');
    this.receiverUserName = this.cookie.get('receiverUserName');
    this.remindMe = true

    this.userInfo = this.userService.getUserInfoFromLocalStorage()

    this.checkStatus();
    if (!this.userService.isAdmin(this.receiverUserName)) {
      this.verifyUserConfirmation()
    }
    else {
      // this.verifyUserConfirmation()
      // this.authErrorFunction();
      // this.getUserAllMeetingFunction();
      // this.getUpdatesFromAdmin();
    }

    setInterval(() => {
      //this.meetingReminder();// function to send the reminder to the user
    }, 5000);//will check for every two minutes
  }

  //function to check whether user is authorized to be on this component
  public checkStatus = (): any =>
  {
    //using if condition to check if authToken is valid or not
    if (this.authToken === null || this.authToken === '' || this.authToken === undefined || this.authToken !== this.cookie.get('authToken')) {
      this.router.navigate(['/']);
      return false;
    }
    else {
      return true;
    }
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  //logout function
  public logOut() {
    console.log('inside logout')
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
        else {
          this.toastr.error(apiResponse['message'], 'LogOut fail');
          //this.router.navigate(['/login']);
        }
      },
      (error) => {
        console.log(error)
      }
    );
  }

  verifyUserConfirmation() {
    this.socketService.verifyUser().subscribe(()=>
    {
      this.socketService.setUser(this.authToken);
    })
  }

}
