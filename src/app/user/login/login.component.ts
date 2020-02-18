import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email:any;

  constructor() { }

  ngOnInit() {
  }

  public signIn():void{
    // sign in related 
  }

  public goToSignup()
  {
    //navigate to signup page
  }

}
