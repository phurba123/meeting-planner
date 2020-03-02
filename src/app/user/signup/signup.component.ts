import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user.service'
import { ToastrService } from 'ngx-toastr'
import {Router} from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  public firstName: string;
  public lastName: string;
  public mobileNumber: number;
  public email: string;
  public password: any;
  public userName: string;
  public countries:any[]=[];
  public selectedCountry:string;
  public selectedCountryCode:any;

  constructor(
    private userService: UserService,
    private toast: ToastrService,
    private router:Router
  ) { }

  ngOnInit() {
    this.initializeCountries();
  }

  //function for signing up
  public signUp() {
    if (!this.userName) {
      this.toast.warning('UserName is missing', 'UserName required')
    }
    else if (!this.email) {
      this.toast.warning('Email is required', 'Email missing')
    }
    else if (!this.password) {
      this.toast.warning('Password is required', 'Password missing')
    }
    else {
      let userData =
      {
        email: this.email,
        password: this.password,
        userName: this.userName,
        mobileNumber: this.mobileNumber,
        firstName: this.firstName,
        lastName: this.lastName
      }
      console.log(userData);
      this.userService.signUp(userData).subscribe(
        (data) => {
          
          if(data.status === 200)
          {
            this.toast.success('You are signed Up','SignUp Successfull');
            setTimeout(()=>
            {
              this.router.navigate(['login']);
            },1000);
          }
          else
          {
            this.toast.warning(data.message)
          }
        },
        (err) => {
          this.toast.error('Error in signing Up','SignUp Unsuccessfull')
        }
      )
    }
  }
  //end of signup function

  //signup with enter
  public signUpUsingKeyPress(event)
  {
    if(event.keyCode === 13)
    {
      this.signUp();
    }
  }

  //initializing countries
  public initializeCountries()
  {
    this.userService.getCountries().subscribe((data)=>
    {
      for(let x in data)
      {
        let countryObj ={
          code:x,
          country:data[x]
        }
        //push country object in countries array
        this.countries.push(countryObj)
      }
    },
    (err)=>
    {
      console.log(err.error.message)
    })
  }

  //selected single country from template
  public singleCountrySelect(singleCountry)
  {
    this.selectedCountry=singleCountry.country
    console.log(singleCountry);
    this.userService.getCountryCodes().subscribe((data)=>
    {
      for(let x in data)
      {
        if(x === singleCountry.code)
        {
          //storing the code of selected country from template
         this.selectedCountryCode = data[x];
         console.log(this.selectedCountryCode) 
        }
      }
    },
    (err)=>
    {
      console.log(err.error.message)
    })
  }

}
