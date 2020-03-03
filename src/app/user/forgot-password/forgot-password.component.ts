import { Component, OnInit } from '@angular/core';
import {ToastrService } from 'ngx-toastr'
import { UserService } from 'src/app/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  public email;

  constructor(
    private toastr:ToastrService,
    private userService:UserService,
    private router:Router
  ) { }

  ngOnInit(): void {
  }

  //function for resetting password
  public resetPassword()
  {
    console.log('inside resetPass')
    if(!this.email)
    {
      this.toastr.warning('Email required')
    }
    else
    {
      this.userService.resetPassword(this.email).subscribe((apiResponse)=>
      {
        console.log(apiResponse)
        if(apiResponse['status']===200)
        {
          this.toastr.success(apiResponse['message']);
          setTimeout(()=>
          {
            this.router.navigate(['/login'])
          },1500);
        }
        else if(apiResponse['status']===500)
        {
          // this.router.navigate([''])
        }
        else
        {
          this.toastr.warning(apiResponse['message'])
        }
      },
      (err)=>
      {
        this.toastr.error(err.error.message)
      })
    }
  }//end of resetting function

  public loginUsingKeyPress(event)
  {
    if(event.keyCode===13)
    {
      this.resetPassword()
    }
  }

}
