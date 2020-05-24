import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule,ReactiveFormsModule } from '@angular/forms'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule} from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {NgxPaginationModule} from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MfilterPipe } from './mfilter.pipe';
import {GroupFilterPipe} from './groupFilter.pipe';
import { SettingsComponent } from './settings/settings.component';
import { ManageComponent } from './manage/manage.component';
import { StartComponent } from './start/start.component';
import { SettingPageComponent } from './setting-page/setting-page.component';



@NgModule({
  declarations: [
    AppComponent,
    MfilterPipe,
    GroupFilterPipe,
    SettingsComponent,
    ManageComponent,
    StartComponent,
    SettingPageComponent
   
  ],
  imports: [
    
    Ng2SearchPipeModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    NgxPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

