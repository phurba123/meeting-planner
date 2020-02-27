import { Injectable } from '@angular/core';
import * as io from 'socket.io-client'
import {Observable, observable} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private baseUrl = "http://localhost:3000";
  private socket;

  constructor() {
    //connection to base url
    this.socket = io(this.baseUrl)
  }

  //events that has to be listened

  //verify user
  public verifyUser = () => {
    return Observable.create((observer) => {
      this.socket.on('verifyUser', (data) => {
        observer.next(data);
      });//On method
    });//end observable
  }//end verifyUser

  //end of events to be listened

  //events to be emitted

  //set user
  public setUser =(token)=>
  {
    this.socket.emit('set-user',token)
  }//end of set user
}
