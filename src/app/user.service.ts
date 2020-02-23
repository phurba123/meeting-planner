import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private backendUrl = 'http://localHost:3000/api/v1/user';

  private authToken;

  constructor(private http: HttpClient) { }
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
  public logIn(data):Observable<any>
  {
    const params = new HttpParams()
    .set('email',data.email)
    .set('password',data.password)

    return this.http.post(`${this.backendUrl}/login`,params);
  }//end of login

  //for logout
  public logOut(authToken)
  {
    let params = new HttpParams()
    .set('authToken',authToken)
    return this.http.post(`${this.backendUrl}/logout`,params);
  }

  //setting userInfo on local storage
  public setUserInfoOnLocalStorage(data)
  {
    localStorage.setItem('userInfo',JSON.stringify(data))
  }

  //removing UserInfo From LocalStorage
  public removeUserInfoFromLocalStorage()
  {
    localStorage.removeItem('userInfo');
  }

  //getting userInfo from local storage
  public getUserInfoFromLocalStorage()
  {
    return localStorage.getItem('userInfo')
  }
  
}
