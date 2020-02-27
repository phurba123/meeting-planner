import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { SignupComponent } from './user/signup/signup.component';
import { AdminComponent } from './role/admin/admin.component';
import { NormalComponent } from './role/normal/normal.component';
import { PageNotFoundComponent } from './errors/page-not-found/page-not-found.component';
import { CreateComponent } from './meeting/create/create.component';
import { UpdateComponent } from './meeting/update/update.component';

// all routes in our application
const routes: Routes = [
  {path:'login',component:LoginComponent},
  {path:'',redirectTo:'login',pathMatch:'full'},
  {path:'signup',component:SignupComponent},

  {path:'role/admin',component:AdminComponent},
  {path:'role/user',component:NormalComponent},

  {path:'meeting/create',component:CreateComponent},
  {path:'meeting/:meetingId/update',component:UpdateComponent},

  {path:'**',component:PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
