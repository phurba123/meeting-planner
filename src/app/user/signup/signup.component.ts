import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  public firstName:any;
  public lastName:any;
  public mobileNumber:number;
  public email:any;
  public password:any;

  constructor() { }

  ngOnInit() {
  }

}
