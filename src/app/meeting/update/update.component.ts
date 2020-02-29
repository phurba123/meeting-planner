import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {
  private authToken;
  public selectedUserName;
  public startDate: Date;
  public endDate: Date;
  public topic;
  public venue;
  public allUsers;

  constructor(
    private userService: UserService,
    private location:Location) { }

  ngOnInit(): void {
    // this.authToken = this.cookie.get('authToken');
    // this.getAllUsers()
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

  //go back to previous location
  public goBack()
  {
    this.location.back();
  }

}
