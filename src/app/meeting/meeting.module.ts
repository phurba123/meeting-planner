import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create/create.component';
import { UpdateComponent } from './update/update.component';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';//date/time picker



@NgModule({
  declarations: [CreateComponent, UpdateComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule
  ]
})
export class MeetingModule { }
