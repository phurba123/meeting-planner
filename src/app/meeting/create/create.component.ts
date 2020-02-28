import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user.service'
import { CookieService } from 'ngx-cookie-service';
import { Location } from '@angular/common'
import { MeetingService } from 'src/app/meeting.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router'

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  providers: [Location]
})
export class CreateComponent implements OnInit {

  private authToken;
  private receiverUserName;
  private receiverUserId;

  public selectedUserName;//userName should be unique
  public selectedUserDetail;
  public startDate: Date;
  public endDate: Date;
  public topic;
  public meetingPlace;
  public description;
  public allUsers: any;

  constructor(
    private userService: UserService,
    private cookie: CookieService,
    public location: Location,
    private meetingService: MeetingService,
    private toastr: ToastrService,
    private router: Router
  ) { }


  ngOnInit(): void {

    // let cookieObj= this.userService.getCookieData();

    // this.receiverUserId=cookieObj.receiverUserId;
    // this.receiverUserName=cookieObj.receiverUserName;
    // this.authToken=cookieObj.authToken

    this.getAllUsers();
  }

  //getting all the users
  public getAllUsers() {
    this.userService.getAllUsers(this.userService.getCookieData().authToken).subscribe(
      (apiResponse) => {
        if (apiResponse.status === 200) {
          console.log(apiResponse)
          this.allUsers = apiResponse.data;
          console.log('all users', this.allUsers)
        }
        else {
          this.toastr.error(apiResponse.message)
          console.log(apiResponse)
        }

      },
      (error) => {
        //this.toastr.error(error.message)
      });
  }

  //create meeting
  public createMeeting() {
    // console.log(this.topic);
    //console.log(this.selectedUserDetail)
    if (!this.topic) {
      this.toastr.warning('Enter Meeting Topic')
    }
    else if (!this.selectedUserDetail) {
      this.toastr.warning('Enter Participant')
    }
    else if (!this.description) {
      this.toastr.warning('Enter Meeting Description')
    }
    else if (!this.meetingPlace) {
      this.toastr.warning('Enter Place of Meeting')
    }
    else {
      let meetingObj =
      {
        topic: this.topic,
        hostId: this.receiverUserId,
        hostName: this.receiverUserName,
        participantId: this.selectedUserDetail.userId,
        participantName: this.selectedUserDetail.userName,
        participantEmail: this.selectedUserDetail.email,
        meetingStartDate: this.startDate,
        meetingEndDate: this.endDate,
        meetingDescription: this.description,
        meetingPlace: this.meetingPlace

      }

      this.meetingService.addNewMeeting(meetingObj).subscribe(
        (apiResponse) => {
          if (apiResponse['status'] === 200) {
            this.toastr.success('Meeting Created', 'Success');

            setTimeout(() => {
              this.router.navigate(['role/admin'])
            }, 1000)
          }
        },
        (err) => {
          this.toastr.error(err, 'Creation failed');
        }
      )
      //console.log(meetingObj)
    }
  }//end of create meeting

  //go back
  public goBack() {
    console.log('inside go back')
    // not workiing as of now
    this.location.back()
  }

}
