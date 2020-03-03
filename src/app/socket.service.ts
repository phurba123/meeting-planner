import { Injectable } from '@angular/core';
import * as io from 'socket.io-client'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private baseUrl = "http://localhost:3000";
  public socket;

  constructor() {
    //connection to base url
    this.socket = io(this.baseUrl)
  }

  /**
   * events to be listened
   */

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

   /**
   * end of events to be listened
   */



  /** 
   * events to be emitted
   */

  //set user
  public setUser = (token) => {
    this.socket.emit('set-user', token)
  }//end of set user

  //disconnecting socket
  public disconnectSocket = () => {
    return Observable.create((observer) => {
      this.socket.emit('disconnect', () => {
        observer.next();
      });
    });//end observable

  }//end socket disconnect



  public exitSocket = () =>{
    this.socket.disconnect();
  }// end exit socket
}
