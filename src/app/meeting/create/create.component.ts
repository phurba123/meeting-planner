import { Component, OnInit } from '@angular/core';
import {UserService} from '../../user.service'
import {CookieService} from 'ngx-cookie-service';
import {Location} from '@angular/common'

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  providers:[Location]
})
export class CreateComponent implements OnInit {
  private authToken;
  private receiverUserName;
  public selectedUserName;
  public startDate:Date;
  public endDate:Date;
  public topic;
  public venue;
  public allUsers:any;

  constructor(
    private userService : UserService,
    private cookie :CookieService,
    public location:Location
  ) { }


  ngOnInit(): void {
    this.authToken=this.cookie.get('authToken');
    this.receiverUserName = this.cookie.get('receiverUserName');
    console.log('receiverUserName',this.receiverUserName);

    setTimeout(()=>
    {
      this.getAllUsers()
    },100)
  }

  //getting all the users
  public getAllUsers() {
    this.userService.getAllUsers(this.authToken).subscribe(
      (apiResponse) => {
        this.allUsers = apiResponse.data;
        console.log('all users', this.allUsers)
      },
      (error) => {
        console.log('error while getting all users')
      });
  }

  //go back
  public goBack()
  {
    console.log('inside go back')
    // not workiing as of now
    this.location.back()
  }

}
