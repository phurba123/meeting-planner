import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user.service'
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

  public isUserSelected:boolean=false;

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
    public location: Location,
    private meetingService: MeetingService,
    private toastr: ToastrService,
    private router: Router
  ) { }


  ngOnInit(): void {
    console.log('onInit create')

    let localStorage = this.userService.getUserInfoFromLocalStorage();

    this.receiverUserId=localStorage.userInfo.userId
    this.receiverUserName=localStorage.userInfo.userName;
    this.authToken=localStorage.authToken
    console.log(this.authToken)
    if(this.userService.isAdmin(this.receiverUserName))
    {
      this.getAllUsers();
    }
    else{
      this.router.navigate(['/'])
    }

    
  }

  //getting all the users
  public getAllUsers() {
    this.userService.getAllUsers(this.authToken).subscribe(
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
        meetingStartDate: this.startDate.getTime(),
        meetingEndDate: this.endDate.getTime(),
        meetingDescription: this.description,
        meetingPlace: this.meetingPlace

      }
      console.log(meetingObj)

      this.meetingService.addNewMeeting(meetingObj,this.authToken).subscribe(
        (apiResponse) => {
          if (apiResponse['status'] === 200) {
            console.log('success creatinog')
            this.toastr.success('Meeting Created', 'Success');

            setTimeout(() => {
              this.router.navigate(['role/admin'])
            }, 1000)
          }
          else{
            this.toastr.warning(apiResponse['message'])
          }
        },
        (err) => {
          this.toastr.error(err, 'Creation failed');
        }
      )
      //console.log(meetingObj)
    }
  }//end of create meeting

  public selectFromDropdown(user)
  {
    this.selectedUserDetail = user
    this.selectedUserName = user.userName
    console.log(this.selectedUserName)
    this.isUserSelected = true;
  }

  //go back
  public goBack() {
    console.log('inside go back')
    // not workiing as of now
    this.location.back()
  }

}
