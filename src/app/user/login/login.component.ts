import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../user.service';
import { Router } from '@angular/router'
import {CookieService} from 'ngx-cookie-service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email: any;
  public password: any;

  constructor(
    private toast: ToastrService,
    private userService: UserService,
    private router: Router,
    private cookie:CookieService
  ) { }

  ngOnInit() {
  }

  public logIn(): void {
    if (!this.email) {
      this.toast.warning('email cannot be empty', 'enter email');
    }
    else if (!this.password) {
      this.toast.warning('password cannot be empty', 'enter password')
    }
    else {
      let user =
      {
        email: this.email,
        password: this.password
      }

      this.userService.logIn(user).subscribe(
        (data) => {
          if (data.status === 200) {
            //console.log(data)
            this.toast.success('You Are Logged In', 'Login Successfull');

            //getting userName of user out of data
            let userName = data.data.userDetails.userName;
            //console.log(userName);

            //setting cookie
            this.cookie.set('authToken',data.data.authToken);
            this.cookie.set('receiverUserName',userName)
            this.cookie.set('receiverUserId',data.data.userDetails.userId);
            //end of setting cookie

            //setting userInfo on local storage
            this.userService.setUserInfoOnLocalStorage(data.data.userDetails);

            //to check if userName ends with admin or not
            let indexToSlice = (userName.length - 5);//for getting substring with last 5 character
            let slicedUserName = userName.slice(indexToSlice);
            //console.log(slicedUserName)

            this.routingWithRole(slicedUserName);

          }
          else {
            this.toast.error(data.message, 'Login Error');
          }
        }
        , (err) => {
          //console.log(err)
          this.toast.error(err.error.message, 'Login Failed')
        })
    }
  }//end of login function

  //routes to admin/normalUser dashboard by checking condition
  private routingWithRole(slicedUserName) {
    if (slicedUserName === 'admin' || slicedUserName === 'Admin') {
      this.router.navigate(['role/admin'])
    }
    else {
      this.router.navigate(['role/user'])
    }
  }//end

  //login using enterkey event
  public loginUsingKeyPress(event: any) {
    if (event.keyCode == 13) {
      this.logIn();
    }
  }

}
