import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service'
@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit {

  ngOnInit() {
    console.log('userservice oninit is called')
  }
  private backendUrl = 'http://localHost:3000/api/v1/user';

  private authToken;

  constructor(private http: HttpClient,
    private cookie: CookieService) {
    console.log('user service constructor called')
  }
  //end of constructor

  //for signup
  public signUp(data): Observable<any> {
    const params = new HttpParams()
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('userName', data.userName)
      .set('mobileNumber', data.mobileNumber)
      .set('email', data.email)
      .set('password', data.password);

    return this.http.post(`${this.backendUrl}/signup`, params);
  }
  //end of signup

  //for login
  public logIn(data): Observable<any> {
    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password)

    return this.http.post(`${this.backendUrl}/login`, params);
  }//end of login

  //for logout
  public logOut(userId) {
    const params = new HttpParams()
      .set('userId', userId)

    let data = {};
    console.log('inside logout')
    return this.http.post(`${this.backendUrl}/logout`, params);
  }

  //setting userInfo on local storage
  public setUserInfoOnLocalStorage(data) {
    localStorage.setItem('userInfo', JSON.stringify(data))
  }

  //removing UserInfo From LocalStorage
  public removeUserInfoFromLocalStorage() {
    localStorage.removeItem('userInfo');
  }

  //getting userInfo from local storage
  public getUserInfoFromLocalStorage() {
    return JSON.parse(localStorage.getItem('userInfo'));
  }

  //check if user is admin or not
  public isAdmin(userName): boolean {
    let name = userName;
    //to check if userName ends with admin or not
    let indexToSlice = (name.length - 5);//for getting substring with last 5 character
    let slicedUserName = name.slice(indexToSlice);
    //console.log(slicedUserName)

    if (slicedUserName === 'admin' || slicedUserName === 'Admin') {
      return true;
    }
    else {
      return false;
    }
  }

  //getting all the users
  public getAllUsers(authToken: string): Observable<any> {
    return this.http.get(`${this.backendUrl}/view/all?authToken=${authToken}`);
  }

  //getting cookies
  public getCookieData() {
    console.log('authToken', this.cookie.get('authToken'));
    let cookieObj = {
      'authToken': this.cookie.get('authToken'),
      'receiverUserId': this.cookie.get('receiverUserId'),
      'receiverUserName': this.cookie.get('receiverUserName')
    }
    console.log(cookieObj);
    return cookieObj;
  }//end of getting cookies



  private handleError(err: HttpErrorResponse) {

    let errorMessage = '';

    if (err.error instanceof Error) {

      errorMessage = `An error occurred: ${err.error.message}`;

    } else {

      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;

    } // end condition *if

    console.error(errorMessage);

    return Observable.throw(errorMessage);

  }  // END handleError

}
