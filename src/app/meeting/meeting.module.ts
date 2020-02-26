import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create/create.component';
import { UpdateComponent } from './update/update.component';
import {RouterModule} from '@angular/router'



@NgModule({
  declarations: [CreateComponent, UpdateComponent],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class MeetingModule { }
