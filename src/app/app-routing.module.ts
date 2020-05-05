import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageComponent } from './manage/manage.component';
import { SettingsComponent } from './settings/settings.component';


const routes: Routes = [
  { path: 'Home', component: SettingsComponent },
  { path: 'Manage', component: ManageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
