import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit {

  ngOnInit() {
    console.log('userservice oninit is called')
  }
  private backendUrl = 'http://localHost:3000/api/v1/user';

  private authToken;

  constructor(private http: HttpClient) {
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
  public logOut(authToken) {
    const params = new HttpParams()
      .set('authToken',authToken)
    return this.http.post(`${this.backendUrl}/logout`, params);
  }

  //setting userInfo on local storage
  public setUserInfoOnLocalStorage(data,authToken) {
    
    localStorage.setItem('userInfo', JSON.stringify(data))
    localStorage.setItem('authToken',authToken)
  }

  //removing UserInfo From LocalStorage
  public removeUserInfoFromLocalStorage() {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('authToken')
  }

  //getting userInfo from local storage
  public getUserInfoFromLocalStorage() {
    let data={
      'userInfo':JSON.parse(localStorage.getItem('userInfo')),
      'authToken':localStorage.getItem('authToken')
    }
    return data;
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

  //getting countries
  public getCountries()
  {
    return this.http.get('../assets/countryNames.json')
  }//end of getting countries

  //getting country codes
  public getCountryCodes()
  {
    return this.http.get('../assets/countryCodes.json');
  }

  //reset password
  public resetPassword(email)
  {
    return this.http.get(`${this.backendUrl}/${email}/recoverPassword`)
  }



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
