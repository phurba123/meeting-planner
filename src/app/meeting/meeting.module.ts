import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create/create.component';
import { UpdateComponent } from './update/update.component';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms'



@NgModule({
  declarations: [CreateComponent, UpdateComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ]
})
export class MeetingModule { }
