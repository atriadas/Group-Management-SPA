import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageComponent } from './manage/manage.component';
import { SettingsComponent } from './settings/settings.component';
import { StartComponent } from './start/start.component';
import { AppComponent } from './app.component';
import { SettingPageComponent } from './setting-page/setting-page.component';


const routes: Routes = [
  { path: 'Settings', component: SettingPageComponent },
  { path: 'Manage', component: ManageComponent },
  //{ path: '', component: StartComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
