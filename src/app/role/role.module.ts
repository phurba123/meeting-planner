import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin/admin.component';
import { NormalComponent } from './normal/normal.component';



@NgModule({
  declarations: [AdminComponent, NormalComponent],
  imports: [
    CommonModule
  ]
})
export class RoleModule { }
