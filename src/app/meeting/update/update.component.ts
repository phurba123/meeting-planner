import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MeetingService } from 'src/app/meeting.service';
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {
  private authToken;
  public selectedUserName;
  public startDate: Date;
  public endDate: Date;
  public topic;
  public meetingPlace;
  public description;

  public meetingId;
  public meetingDetail;

  private notUpdatedMeetingDetail;
  constructor(
    private userService: UserService,
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private meetingService: MeetingService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    // this.authToken = this.cookie.get('authToken');
    // this.getAllUsers()
    this.meetingId = this.activatedRoute.snapshot.paramMap.get('meetingId');
    //console.log('meeting id is : ', this.meetingId);
    this.getSingleMeeting(this.meetingId)

  }

  private getSingleMeeting(meetingId) {
    this.meetingService.getSingleMeetingById(meetingId).subscribe((apiResponse) => {
      console.log('apiResponse : ', apiResponse);
      if (apiResponse['status'] === 200) {
        this.meetingDetail = apiResponse['data'];
        this.setDataOfMeeting(this.meetingDetail);
      }
    },
      (err) => {

      });
  }

  //setting data of meeting
  private setDataOfMeeting(meetingDetail) {
    this.topic = meetingDetail.topic;
    this.description = meetingDetail.meetingDescription;
    this.meetingPlace = meetingDetail.meetingPlace;
    this.startDate = new Date(meetingDetail.meetingStartDate);
    this.endDate = new Date(meetingDetail.meetingEndDate);
    //console.log('end date start',this.endDate)

    this.notUpdatedMeetingDetail =
      {
        'topic': this.topic,
        'meetingStartDate': this.startDate.getTime(),
        'meetingEndDate': this.endDate.getTime(),
        'meetingDescription': this.description,
        'meetingPlace': this.meetingPlace
      }
    // console.log('notUpdated',this.notUpdatedMeetingDetail)

  }//end of setting data

  public updateMeeting() {

    //console.log('end date ',this .endDate.getTime())
    let updatedMeetinObj =
    {
      'topic': this.topic,
      'meetingStartDate': this.startDate.getTime(),
      'meetingEndDate': this.endDate.getTime(),
      'meetingDescription': this.description,
      'meetingPlace': this.meetingPlace
    }

    //checking if value is changed to get updated or not
    if (JSON.stringify(this.notUpdatedMeetingDetail) === JSON.stringify(updatedMeetinObj)) {
      //if nothing is changed than just warn
      this.toastr.warning('Nothing to Update');
    }
    else {
      //if any one value is changed than just update it
      console.log(updatedMeetinObj)

      this.meetingService.updateMeeting(this.meetingId, updatedMeetinObj).subscribe((apiResponse) => {
        //console.log('api rsp ',apiResponse)
        this.toastr.success(apiResponse['message']);
        setTimeout(()=>
        {
          this.router.navigate(['/role/admin'])
        },1000)
      },
        (err) => {
          this.toastr.error(err.error.message)
        });
    }
  }//end of updating meeting

  //go back to previous location
  public goBack() {
    this.location.back();
  }

}
