import { Component, OnInit } from '@angular/core';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email:any;
  public password:any;

  constructor(
    private toast:ToastrService
  ) 
  { }

  ngOnInit() {
  }

  public signIn():void{
    if(!this.email){
      this.toast.warning('email cannot be empty','enter email');
    }
    else if(!this.password)
    {
      this.toast.warning('password cannot be empty','enter password')
    }
    else{
      //code for sign in
      this.toast.success('lets go','logging in')
    }
  }

  //login using enterkey event
  public loginUsingKeyPress(event:any)
  {
    if(event.keyCode==13)
    {
      //navigate to user  or admin dashboard
    }
  }

  // public goToSignup()
  // {
  //   //navigate to signup page
  // }

}
