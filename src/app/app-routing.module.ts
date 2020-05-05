import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageComponent } from './manage/manage.component';
import { SettingsComponent } from './settings/settings.component';
import { StartComponent } from './start/start.component';
import { AppComponent } from './app.component';


const routes: Routes = [
  { path: 'Settings', component: SettingsComponent },
  { path: 'Manage', component: ManageComponent },
  { path: '', redirectTo: '',pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
