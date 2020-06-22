import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule,ReactiveFormsModule } from '@angular/forms'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app/app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule} from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {NgxPaginationModule} from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MfilterPipe } from './filter/mfilter.pipe';
import {GroupFilterPipe} from './filter/groupFilter.pipe';
import { ManageComponent } from './manage/manage.component';
import { SettingPageComponent } from './setting-page/setting-page.component';



@NgModule({
  declarations: [
    AppComponent,
    MfilterPipe,
    GroupFilterPipe,
    ManageComponent,
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

