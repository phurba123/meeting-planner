import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private backendUrl = 'http://localHost:3000/api/v1/user';

  constructor(private http: HttpClient) { }
    //end of constructor

    //for signup
    public signUp(data):Observable<any>
    {
      const params = new HttpParams()
      .set('firstName',data.firstName)
      .set('lastName',data.lastName)
      .set('userName',data.userName)
      .set('mobileNumber',data.mobileNumber)
      .set('email',data.email)
      .set('password',data.password);

      return this.http.post(`${this.backendUrl}/signup`,params);
    }
    //end of signup
}
