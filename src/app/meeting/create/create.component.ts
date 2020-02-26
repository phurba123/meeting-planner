import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user.service'
import { CookieService } from 'ngx-cookie-service';
import { Location } from '@angular/common'
import { MeetingService } from 'src/app/meeting.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router'

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
    private meetingService:MeetingService,
    private toastr:ToastrService,
    private router:Router
  ) { }


  ngOnInit(): void {
    this.authToken = this.cookie.get('authToken');
    this.receiverUserName = this.cookie.get('receiverUserName');
    this.receiverUserId=this.cookie.get('receiverUserId');
    console.log('receiverUserName', this.receiverUserName);

    setTimeout(() => {
      this.getAllUsers()
    }, 100)
  }

  //getting all the users
  public getAllUsers() {
    this.userService.getAllUsers(this.authToken).subscribe(
      (apiResponse) => {
        this.allUsers = apiResponse.data;
        console.log('all users', this.allUsers)
      },
      (error) => {
        console.log('error while getting all users')
      });
  }

  //create meeting
  public createMeeting() {
    // console.log(this.topic);
    //console.log(this.selectedUserDetail)

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
      (apiResponse)=>
      {
        if(apiResponse['status']===200)
        {
          this.toastr.success('Meeting Created','Success');

          setTimeout(()=>
          {
            this.router.navigate(['role/admin'])
          },1000)
        }
      },
      (err)=>
      {
        this.toastr.error(err,'Creation failed');
      }
    )
    //console.log(meetingObj)
  }


  //go back
  public goBack() {
    console.log('inside go back')
    // not workiing as of now
    this.location.back()
  }

}
