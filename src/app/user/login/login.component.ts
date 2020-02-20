import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../user.service';
import {Router} from '@angular/router'

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
    private router:Router
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
          if(data.status === 200)
          {
            this.toast.success('You Are Logged In','Login Successfull');

            //getting userName of user out of data
            let userName = data.data.userDetails.userName;
            console.log(userName);

            let indexToSlice = (userName.length - 5);//for getting substring with last 5 character
            let slicedUserName = userName.slice(indexToSlice);
            console.log(slicedUserName)

            this.routingWithRole(slicedUserName);
            // setTimeout(()=>
            // {
            //   this.router.navigate(['role/normal']);
            // })
          }
          else{
            this.toast.error('Some Error Occured','Login Error');
          }
        }
        , (err) => {

        })
    }
  }

  //routes to admin/normalUser dashboard by checking condition
  private routingWithRole(slicedUserName){
    if(slicedUserName === 'admin' || slicedUserName === 'Admin')
    {
      this.router.navigate(['role/admin'])
    }
    else{
      this.router.navigate(['role/user'])
    }
  }

  //login using enterkey event
  public loginUsingKeyPress(event: any) {
    if (event.keyCode == 13) {
      this.logIn();
    }
  }

  // public goToSignup()
  // {
  //   //navigate to signup page
  // }

}
