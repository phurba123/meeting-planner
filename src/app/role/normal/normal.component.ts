import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CookieService } from 'ngx-cookie-service'
import { CalendarEvent, CalendarView, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { isSameMonth, isSameDay } from 'date-fns'
import { Subject } from 'rxjs'
import { UserService } from 'src/app/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from 'src/app/socket.service';
import { MeetingService } from 'src/app/meeting.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

const colors: any = {

  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  }
  ,

  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  }
  ,

  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }


};

@Component({
  selector: 'app-normal',
  templateUrl: './normal.component.html',
  styleUrls: ['./normal.component.css']
})


export class NormalComponent implements OnInit {

  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  view: string = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  refresh: Subject<any> = new Subject();

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
    public _route: ActivatedRoute,
    public cookie: CookieService,
    public router: Router,
    private toastr: ToastrService,
    private socketService: SocketService,
    private meetingService: MeetingService,
    private modal: NgbModal
  ) { }

  ngOnInit(): void {


    this.authToken = this.cookie.get('authToken');
    this.remindMe = true

    this.userInfo = this.userService.getUserInfoFromLocalStorage()
    this.receiverUserId = this.userInfo.userId
    this.receiverUserName = this.userInfo.userName;

    this.checkStatus();

    if (!this.userService.isAdmin(this.receiverUserName)) {
      this.verifyUserConfirmation();
      this.getUserAllMeetingFunction();
    }
    else {
      // for admin
    }

  }

  //function to check whether user is authorized to be on this component
  public checkStatus = (): any => {
    //using if condition to check if authToken is valid or not
    if (this.authToken === null || this.authToken === '' || this.authToken === undefined || this.authToken !== this.cookie.get('authToken')) {
      this.router.navigate(['/']);
      return false;
    }
    else {
      return true;
    }
  }

  //setting view of calendar
  setView(view: CalendarView) {
    this.view = view;
  }

  //to check the status of whether current day is open or not
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

          //deleting local storage and cookies upon logout
          this.userService.removeUserInfoFromLocalStorage();
          this.cookie.delete('authToken');
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

  //verifying user upon login and setting self online
  verifyUserConfirmation() {
    this.socketService.verifyUser().subscribe(() => {
      this.socketService.setUser(this.authToken);
    })
  }
  getUserAllMeetingFunction() {
    this.meetingService.getUserAllMeeting(this.receiverUserId, this.authToken).subscribe(
      (apiResponse) => {
        if (apiResponse.status === 200) {
          // console.log(apiResponse.data);

          let allMeetings = apiResponse.data;
          console.log('allMeetings before',allMeetings)

          //assigning all meetings of user to calendar events
          for (let meetingEvent of allMeetings) {
            meetingEvent.title = meetingEvent.topic;
            meetingEvent.start = new Date(meetingEvent.meetingStartDate);
            meetingEvent.end = new Date(meetingEvent.meetingEndDate);
            meetingEvent.color = colors.red;
            meetingEvent.remindMe = true

          }
          console.log('allMeetings after',allMeetings)
          this.events = allMeetings;
          this.refresh.next()
        }
        else{
          this.toastr.error(apiResponse.message);
          this.events=[];
        }
      }), (err) => {
        this.toastr.error('Error On Getting Your Events');
      };
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg'});
  }

}
