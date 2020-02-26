import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../user.service';
import { Router } from '@angular/router'
import { CookieService } from 'ngx-cookie-service'

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
    private cookie: CookieService
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
          console.log(data.message)
          if (data.status === 200) {
            //console.log(data)
            this.toast.success('You Are Logged In', 'Login Successfull');

            //getting userName of user out of data
            let userName = data.data.userDetails.userName;
            //console.log(userName);

            //setting cookie
            this.cookie.set('authToken', data.data.authToken);
            this.cookie.set('receiverUserName', userName)
            this.cookie.set('receiverUserId', data.data.userDetails.userId);
            //end of setting cookie

            //setting userInfo on local storage
            this.userService.setUserInfoOnLocalStorage(data.data.userDetails);

            //console.log(this.userService.isAdmin(userName))

            if (this.userService.isAdmin(userName)) {
              this.router.navigate(['/role/admin']);
            }
            else {
              this.router.navigate(['role/user'])
            }

          }
        }
        , (err) => {
          //console.log(err)
          this.toast.error(err.error.message, 'Login Failed')
        })
    }
  }//end of login function

  //login using enterkey event
  public loginUsingKeyPress(event: any) {
    if (event.keyCode == 13) {
      this.logIn();
    }
  }

}
