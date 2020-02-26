import { Injectable } from '@angular/core';
import {HttpParams,HttpClient} from '@angular/common/http'

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
}
