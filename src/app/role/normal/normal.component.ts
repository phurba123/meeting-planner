import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CookieService } from 'ngx-cookie-service'
import { CalendarEvent,CalendarView } from 'angular-calendar';
import { Subject } from 'rxjs'
import { UserService } from 'src/app/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
  ) { }

  ngOnInit(): void {


    this.authToken = this.cookie.get('authToken');
    this.receiverUserId = this.cookie.get('receiverUserId');
    this.receiverUserName = this.cookie.get('receiverUserName');
    this.remindMe = true

    this.userInfo = this.userService.getUserInfoFromLocalStorage()

    if (this.userInfo.isAdmin == 'false') {

      // this.verifyUserConfirmation()
      // this.authErrorFunction();
      // this.getUserAllMeetingFunction();
      // this.getUpdatesFromAdmin();
    }
    else {
      //this.router.navigate(['/user/normal/meeting/dashboard']);

    }

    setInterval(() => {
      //this.meetingReminder();// function to send the reminder to the user
    }, 5000);//will check for every two minutes
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

}
