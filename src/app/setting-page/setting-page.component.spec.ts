import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingPageComponent } from './setting-page.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { defer, Observable, of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, TemplateRef, Pipe, Component } from '@angular/core';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { MfilterPipe } from '../filter/mfilter.pipe';
import {GroupFilterPipe} from '../filter/groupFilter.pipe';
import { DataService } from '../dataService/data.service';

xdescribe('SettingPageComponent', () => {
  let component: SettingPageComponent;
  let fixture: ComponentFixture<SettingPageComponent>;
//   const ServiceStub = {
//     getAllGroupsData() {
//     return of( [{group_uuid:"aa781f9f-8e34-45b8-98e3-e0cb69bfd4bc",group_name:"Mitel Group 1"},
//                {group_uuid:"aa781f9f-8e34-45b8-98e3-e0cb69bfd4bc",group_name:"Mitel Group 1"}]
//                )
//             }
//         }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingPageComponent,MfilterPipe,GroupFilterPipe ],
      imports: [NgSelectModule, FormsModule, NgbModule, HttpClientModule, RouterTestingModule,NgxPaginationModule]
      //,
      //providers: [ { provide: DataService, useValue: ServiceStub } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create Settings Component', () => {
    expect(component).toBeTruthy();
  });

  it('should disable/enable Save Buton on Group Name Change',()=>{
    component.saveUpdate=true
    component.OnGroupNameChange();
    expect(component.saveUpdate).toBeTruthy()
    // component.saveUpdate=true
    // fixture.detectChanges()
        if(component.groupName!=component.oldGroupName)
        {
        expect(component.SaveDisable).toBeFalsy();
        }
        else{
        expect(component.SaveDisable).toBeTruthy();
    
        }

  });
    
  it('should call on New Group', ()=>{
     component.NewGroup();
     expect(component.isOn).toBeFalsy();
     expect(component.noGroupFlag).toEqual(1);
  });

  it('should call on Del Open', ()=>{
    component.DelOpen();
    expect(component.exampleModalOpen).toBeTruthy()
 });
 it('should call on closeDeleteModal', ()=>{
    component.closeDeleteModal();
    expect(component.exampleModalOpen).toBeFalsy()
 });
 it('should call on CanOpen', ()=>{
    component.CanOpen();
    expect(component.exampleModal1Open).toBeTruthy()
 });
 it('should call on  closeCanModal', ()=>{
    component. closeCanModal();
    expect(component.exampleModal1Open).toBeFalsy()
    expect(component.addgroupbutton).toBeFalsy()
 });
 

//  addgroup() { //ON NEW GROUP ADD
//     this.addgroupbutton=true
//     console.log("New Group Added")
//     this.selectedPersonsArr = []
//     this.selectedPersonsArr1 = []
//     this.numberMember = 0
//     this.numberManager = 0
//     this.groupName = 'New Group'
//     this.addFlag = 1;
//     this.saveUpdate = false;
//   }

  it('should call on  addgroup', ()=>{
    component.addgroup();
    expect(component.selectedPersonsArr).toEqual([])
    expect(component.selectedPersonsArr1).toEqual([])
    expect(component.numberManager).toEqual(0)
    expect(component.numberMember).toEqual(0)
    expect(component.groupName).toEqual('New Group')
    expect(component.addFlag).toEqual(1)
    expect(component.saveUpdate).toBeFalsy()
 });
 

});
