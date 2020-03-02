import { Injectable } from '@angular/core';
import {HttpParams,HttpClient} from '@angular/common/http'
import {Observable} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class MeetingService {

  private baseUrl = 'http://localhost:3000/api/v1/meeting';

  constructor(
    private http:HttpClient
  ) { }

  //adding new meeting
  public addNewMeeting(data)
  {
    console.log(data)

    const params = new HttpParams()
    .set('topic',data.topic)
    .set('hostId',data.hostId)
    .set('hostName',data.hostName)
    .set('participantId',data.participantId)
    .set('participantName',data.participantName)
    .set('participantEmail',data.participantEmail)
    .set('meetingStartDate',data.meetingStartDate)
    .set('meetingEndDate',data.meetingEndDate)
    .set('meetingDescription',data.meetingDescription)
    .set('meetingPlace',data.meetingPlace)

    return this.http.post(this.baseUrl+'/addMeeting',params);

  }

 // app.get(`${baseUrl}/:userId/view/all`,controller.getAllMeetingsOfUser)

  public getUserAllMeeting(userId,authToken): Observable<any> {
    
    return this.http.get(`${this.baseUrl}/${userId}/view/all?authToken=${authToken}`);
  }//end getUsers function

  //getting single meeting by meeting id
  public getSingleMeetingById(meetingId)
  {
    return this.http.get(`${this.baseUrl}/${meetingId}/view`);
  }
  //end of getting single meeting by meeting id

  // updating meeting
  public updateMeeting(meetingId,data){
    const params = new HttpParams()
    .set('topic',data.topic)
    .set('meetingDescription',data.meetingDescription)
    .set('meetingPlace',data.meetingPlace)
    .set('meetingStartDate',data.meetingStartDate)
    .set('meetingEndDate',data.meetingEndDate);

    return this.http.put(`${this.baseUrl}/${meetingId}/updateMeeting`,params);
  }//end of updating meeting

  public deleteMeeting(meetingId)
  {
    let data = {};
    return this.http.post(`${this.baseUrl}/${meetingId}/deleteMeeting`,data);
  }
}
