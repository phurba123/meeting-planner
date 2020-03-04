import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CalendarEvent, CalendarView, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { isSameMonth, isSameDay } from 'date-fns'
import { Subject } from 'rxjs'
import { UserService } from 'src/app/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from 'src/app/socket.service';
import { MeetingService } from 'src/app/meeting.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2'
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
  //public meetings: any = [];
  public events: CalendarEvent[] = [];
  public currentEvent;
  public reminder: boolean = true;


  constructor(
    //private modal: NgbModal,
    public userService: UserService,
    //public socketService: SocketService,
    public _route: ActivatedRoute,
    public router: Router,
    private toastr: ToastrService,
    private socketService: SocketService,
    private meetingService: MeetingService,
    private modal: NgbModal,
  ) { }

  ngOnInit(): void {
    let localStorage = this.userService.getUserInfoFromLocalStorage()
    this.receiverUserId = localStorage.userInfo.userId;
    this.receiverUserName = localStorage.userInfo.userName;
    this.authToken = localStorage.authToken

    this.checkStatus();

    if (!this.userService.isAdmin(this.receiverUserName)) {
      this.getUserAllMeetingFunction();
      this.verifyUserConfirmation();
      this.meetingReminder();

      //gets notification if your meeting just gets created
      this.socketService.getNotifiedOfMeeting(this.receiverUserId).subscribe((data)=>
      {
        this.toastr.info(data);
      })


      setInterval(() => {
        if (this.reminder) {
          this.meetingReminder()
        }
      }, 5000)// repeatedly calling after 5 seconds


    }
    else {
      this.router.navigate(['/'])
    }

  }


  //function to check whether user is authorized to be on this component
  public checkStatus = (): any => {
    //using if condition to check if authToken is valid or not
    if (this.authToken === null || this.authToken === '' || this.authToken === undefined || this.authToken !== this.authToken) {
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
    this.userService.logOut(this.authToken).subscribe(
      (apiResponse) => {
        if (apiResponse['status'] === 200) {
          this.toastr.success('You are logged out', 'LogOut successfull');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1000);

          //deleting local storage 
          this.userService.removeUserInfoFromLocalStorage();
          //disconnect socket to be emitted
          this.socketService.disconnectSocket()

          this.socketService.exitSocket()
        }
        else if (apiResponse['status'] === 500) {
          this.router.navigate(['/error/server'])
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
          console.log('allMeetings before', allMeetings)

          //assigning all meetings of user to calendar events
          for (let meetingEvent of allMeetings) {
            meetingEvent.title = meetingEvent.topic;
            meetingEvent.start = new Date(meetingEvent.meetingStartDate);
            meetingEvent.end = new Date(meetingEvent.meetingEndDate);
            meetingEvent.color = colors.red

          }
          console.log('allMeetings after', allMeetings)
          this.events = allMeetings;
          this.refresh.next()
        }
        else if (apiResponse.status === 500) {
          this.toastr.error(apiResponse.error)
          this.router.navigate(['/error/server'])
        }
        else {
          this.toastr.error(apiResponse.message);
          this.events = [];
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
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  public meetingReminder() {
    // this.socketService.currentEventReminder().subscribe((data) => {
    //   this.toastr.info(data)
    // })
    let eventStartTime;
    let currentTime;

    for (let i = 0; i < this.events.length; i++) {
      let event = this.events[i];
      // console.log(event)
      // console.log('next')
      eventStartTime = new Date(event.start).getTime() / 1000;//event start time in second
      currentTime = new Date().getTime() / 1000;//currnt time in second
      // console.log('eventstartTime', eventStartTime)
      // console.log('currentTime', currentTime);
      // console.log('event.hostName', event['hostName'])

      //start of time condition check
      if ((eventStartTime - currentTime) <= 60 && (eventStartTime - currentTime) >= 0) {
        Swal.fire({
          title: 'Meeting Reminder',
          text: `Your meeting with ${event['hostName']} is about to begin`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Snooze',
          cancelButtonText: 'Dismiss'
        }).then((result) => {
          if (result.value) {
            //for snooze
            if ((eventStartTime - currentTime) <= 60 && (eventStartTime - currentTime) >= 0) {
              setTimeout(() => {
                this.meetingReminder()
              }, 5000)//remind again after 5 seconds
            }
            this.reminder = false//setting reminder to false so that onInit setInterval wont lookout for meeting
          }
          else if (result.dismiss === Swal.DismissReason.cancel) {
            //dismiss
            this.reminder = false;//on dismiss setting reminder to false

          }
        })
        this.reminder = false;//once meeting under 1 min is found ,set reminder to false
        break;
      }//end of time condition check
    }

    //after finding meeting under 1 min,re set reminder to true after 1 min
    if (!this.reminder) {
      setTimeout(() => {
        this.reminder = true;
      }, 60000);
    }

  }//end of meeting reminder

}
