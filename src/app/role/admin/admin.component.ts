import { Component, OnInit, ViewChild, OnDestroy, TemplateRef } from '@angular/core';
//import { CookieService } from 'ngx-cookie-service'
import { CalendarEvent, CalendarView, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { UserService } from 'src/app/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service'
import { MeetingService } from 'src/app/meeting.service';
import { Subject } from 'rxjs'
import { isSameMonth, isSameDay, addHours } from 'date-fns'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'

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
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit, OnDestroy {

  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  ngOnDestroy(): void {
    console.log('inside on Destroy');
  }

  public authToken;
  public receiverUserId;
  public receiverUserName;
  public allUsers: any
  public userInfo;

  public activeDayIsOpen: boolean = true;

  refresh: Subject<any> = new Subject();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  view: string = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();

  public meetings: any = [];
  public events: CalendarEvent[] = [];

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private cookie: CookieService,
    private meetingService: MeetingService,
    private modal: NgbModal
  ) { }

  ngOnInit(): void {
    //console.log('inside on init')
    this.userInfo = this.userService.getUserInfoFromLocalStorage()
    this.receiverUserId = this.userInfo.userId
    this.receiverUserName = this.userInfo.userName;
    this.authToken = this.cookie.get('authToken');

    this.getAllUsers()



  }

  //getting all the users
  public getAllUsers() {
    this.userService.getAllUsers(this.authToken).subscribe(
      (apiResponse) => {
        //console.log(apiResponse)
        this.allUsers = apiResponse.data;
        //console.log('all users', this.allUsers)
      },
      (error) => {
        this.toastr.error(error.error.message)
      });
  }//end of getting all the users

  //getting selected user meetings
  public getSelectedUserMeeting(userId) {
    this.receiverUserId = userId;
    //console.log('getting selected user meeting')
    this.getUserAllMeetingFunction()

  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  getUserAllMeetingFunction() {
    this.events = [];
    this.meetingService.getUserAllMeeting(this.receiverUserId, this.authToken).subscribe(
      (apiResponse) => {
        if (apiResponse.status === 200) {
          // console.log(apiResponse.data);
          this.toastr.info('Meeting Found')

          let allMeetings = apiResponse.data;
          //console.log('allMeetings before', allMeetings)

          //assigning all meetings of user to calendar events
          for (let meetingEvent of allMeetings) {
            meetingEvent.title = meetingEvent.topic;
            meetingEvent.start = new Date(meetingEvent.meetingStartDate);
            meetingEvent.end = new Date(meetingEvent.meetingEndDate);
            meetingEvent.color = colors.red;
            meetingEvent.remindMe = true

          }
          //console.log('allMeetings after', allMeetings)
          this.events = allMeetings;
          this.refresh.next()
        }
        else {
          this.toastr.error(apiResponse.message);
          this.events = [];
        }
      }), (err) => {
        this.toastr.error('Error On Getting Your Events');
        this.events = [];
      };
  }

  //logout function
  public logOut() {
    console.log(this.receiverUserId)
    this.userService.logOut(this.userInfo.userId).subscribe(
      (apiResponse) => {
        if (apiResponse['status'] === 200) {
          this.toastr.success('You are logged out', 'LogOut successfull');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1000);

          this.deleteCookiesAndLocalStorage();
        }
        else {
          this.toastr.error(apiResponse['message'], 'LogOut failed')
          console.log(apiResponse)
        }
      },
      (error) => {
        console.log('error is : ', error)
      }
    );
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
    event.start = new Date(newStart);
    event.end = new Date(newEnd);
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    console.log('handle event', event)
    this.modal.open(this.modalContent, { size: 'lg', scrollable: true });
  }

  //updating meeting
  public updateMeeting(meetingId) {
    console.log(meetingId);
    this.router.navigate([`meeting/${meetingId}/update`]);
    this.modal.dismissAll()
  }//end of updating meeting

  //deleting meeting
  public deleteMeeting(meetingId,eventToDelete) {
    this.meetingService.deleteMeeting(meetingId).subscribe((apiResponse) => {
      if (apiResponse['status'] === 200) {
        this.toastr.success(apiResponse['message']);
        setTimeout(() => {
          this.dismissModal()
        },1000);
        this.events = this.events.filter(event => event !== eventToDelete);
        this.refresh.next()
      }
      else {
        this.toastr.info(apiResponse['message']);
        this.dismissModal()
      }
    },
      (err) => {
        this.toastr.error(err.error.message);
        this.dismissModal()
      })
  }

  private deleteCookiesAndLocalStorage() {
    //deleting local storage and cookies upon logout
    this.userService.removeUserInfoFromLocalStorage();
    this.cookie.delete('authToken')
  }

  //close modal
  public dismissModal() {
    this.modal.dismissAll()
  }//end of close modal

}
