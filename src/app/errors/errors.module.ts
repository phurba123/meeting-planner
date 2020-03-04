import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ServerErrorComponent } from './server-error/server-error.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [PageNotFoundComponent, ServerErrorComponent],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class ErrorsModule { }
