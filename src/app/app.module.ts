import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserModule } from './user/user.module';

import {FormsModule} from '@angular/forms'

// imports needed for ngx-toastr
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';//upto here

import { RoleModule } from './role/role.module';
import { ErrorsModule } from './errors/errors.module';
import { UserService } from './user.service';
import {HttpClientModule} from '@angular/common/http'
import { CookieService } from 'ngx-cookie-service';
import { MeetingModule } from './meeting/meeting.module';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    UserModule,
    MeetingModule,
    ErrorsModule,
    FormsModule,
    RoleModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    AppRoutingModule,
  ],
  providers: [UserService,CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
