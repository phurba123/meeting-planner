import { Injectable } from '@angular/core';
import * as io from 'socket.io-client'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private baseUrl = "http://plannerapi.phursang.xyz";
  public socket;

  constructor() {
    //connection to base url
    this.socket = io(this.baseUrl)
  }

  /**
   * events to be listened
   */

  //  public currentEventReminder()
  //  {
  //    return Observable.create((observer)=>
  //    {
  //      this.socket.on('current-event',(data)=>
  //      {
  //        observer.next(data)
  //      })
  //    })
  //  }

  //verify user
  public verifyUser = () => {
    return Observable.create((observer) => {
      this.socket.on('verifyUser', (data) => {
        observer.next(data);
      });//On method
    });//end observable
  }//end verifyUser

  //getting online user list
  public getOnlineUserList = () => {
    return Observable.create((observer) => {
      this.socket.on('online-user-list', (userList) => {
        observer.next(userList);
      });//end On method
    });//end observable

  }//end onlineUserList

  public getNotifiedOfMeeting(userId)
  {
    return Observable.create((observer)=>
    {
      this.socket.on(userId,(data)=>
      {
        observer.next(data)
      })
    })
  }

   /**
   * end of events to be listened
   */



  /** 
   * events to be emitted
   */

  //set user
  public setUser = (token) => {
  this.socket.emit('set-user', (token))
}//end of set user

  //disconnecting socket
  public disconnectSocket = () => {
  return Observable.create((observer) => {
    this.socket.emit('disconnect', () => {
      observer.next();
    });
  });//end observable

}//end socket disconnect

  //notifying users abouot meeeting creation
  public notifyUserOfNewMeeting(participantId)
{
  this.socket.emit('new-meeting', (participantId));
}

  //notify users about update
  public notifyUsersAboutUpdate(data)
{
  this.socket.emit('update-info', data)
}



  public exitSocket = () => {
  this.socket.disconnect();
}// end exit socket
}
