import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin/admin.component';
import { NormalComponent } from './normal/normal.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';




@NgModule({
  declarations: [AdminComponent, NormalComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    
  ]
})
export class RoleModule { }
