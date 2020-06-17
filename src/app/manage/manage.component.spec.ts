import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { defer, Observable, of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, TemplateRef, DebugElement } from '@angular/core';
import { Data2Service } from '../dataService/data2.service';
import { ManageComponent } from './manage.component';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { By } from '@angular/platform-browser';





describe('ManageComponent:getUserInfo', () => {
    
    let mockService;
    let component: ManageComponent;
    let fixture: ComponentFixture<ManageComponent>;
    const ServiceStub = {
        
        getUserData() {
          return of( {Userrole: "All Recordings",
          MembersofGroup: [{group_uuid:"aa781f9f-8e34-45b8-98e3-e0cb69bfd4bc",
                            group_name:"Mitel Group 1"}],
          ManagerofGroup:[{group_uuid:"aa781f9f-8e34-45b8-98e3-e0cb69bfd4bc",
                             group_name:"Mitel Group 1"}]} )
        },
        getPeople(term:string,tid:number){
            return of({group_uuid:"bhajsnxkxi-8e34-45b8-98e3-e0cb69bfd4bc",group_name:"Shoretel Group"})

        },

        putHTTPData(data:string,userid:string)
        {
            var x="Success 200 ok"
          return (x)
        }
    }




    beforeEach(async(() => {
        // mockService = jasmine.createSpyObj(['getUserData']);
        // mockService.getUserData.and.returnValue( of({UserRole: "All Recordings",
        //                      MembersOfGroup: [{group_uuid:"aa781f9f-8e34-45b8-98e3-e0cb69bfd4bc",
        //                                        group_name:"Mitel Group 1"}],
        //                      ManagersOfGroup:[{group_uuid:"aa781f9f-8e34-45b8-98e3-e0cb69bfd4bc",
        //                                         group_name:"Mitel Group 1"}]}));
             TestBed.configureTestingModule({
              declarations: [ ManageComponent],
              imports: [NgSelectModule, FormsModule, NgbModule, HttpClientModule, RouterTestingModule],
              providers: [ { provide: Data2Service, useValue: ServiceStub } ]
             })
             
             .compileComponents();
          }));


          

    beforeEach(() => {

        fixture = TestBed.createComponent(ManageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
    


    it('should create', () => {
       expect(component).toBeTruthy();
    
    //    component.peopleLoading=true;
    //   // expect(component.item$).toEqual(ServiceStub.getPeople("sh",1))
    //   component.loadPeople();
    //    expect(component.peopleLoading).toBeFalsy();
    });

    it('should getUserInfo', async(() => {
        fixture.detectChanges();
        expect(component.role_id).toEqual(4);
        if(component.role=="None"||component.role=="Own Recordings")
        {
            fixture.detectChanges();
            expect(component.flag).toBeTruthy();
            expect(component.selectedPersons).toEqual([]);
        }
    }));


    it('add a manager',async () => {
        
        component.selectedPersons=[{group_uuid:"aa781f9f-8e34-45b8-98e3-e0cb69bfd4bc",
        group_name:"Mitel Group 1"},{group_uuid:"ab781f9f-8e34-45b8-98e3-e0cb69bfd4bc",
        group_name:"Mitel Group 2"}]
        component.OnAddGroupManager();
        fixture
        expect(component.manuuid).toContain("ab781f9f-8e34-45b8-98e3-e0cb69bfd4bc")
        expect(component.saveflag).toBeFalsy();
    })


    it('add a member',async () => {
      
        component.selectedPersons1=[{group_uuid:"aa781f9f-8e34-45b8-98e3-e0cb69bfd4bc",
        group_name:"Mitel Group 1"},{group_uuid:"ab781f9f-8e34-45b8-98e3-e0cb69bfd4bc",
        group_name:"Mitel Group 2"}]
        component.OnAddGroupMember();
        expect(component.menuuid).toContain("ab781f9f-8e34-45b8-98e3-e0cb69bfd4bc")
        expect(component.saveflag).toBeFalsy();
    })


    it('remove a manager',async () => {
       
        component.selectedPersons=[{group_uuid:"aa781f9f-8e34-45b8-98e3-e0cb69bfd4bc",
        group_name:"Mitel Group 1"}]
        component.OnRemove();
        expect(component.manuuid).not.toContain("ab781f9f-8e34-45b8-98e3-e0cb69bfd4bc")
        expect(component.saveflag).toBeFalsy();
    })

    it('remove a member',async () => {
       
        component.selectedPersons1=[{group_uuid:"aa781f9f-8e34-45b8-98e3-e0cb69bfd4bc",
        group_name:"Mitel Group 1"}]
        component.OnRemove1();
        expect(component.menuuid).not.toContain("ab781f9f-8e34-45b8-98e3-e0cb69bfd4bc")
        expect(component.saveflag).toBeFalsy();
    })

    it('get roles function', async()=>{

        if(component.role=='Own Recordings'||component.role=='None')
        {
          expect(component.flag).toBeTruthy();
          expect(component.selectedPersons).toEqual([])
          expect(component.manuuid).toEqual([])
        }
        else{
            expect(component.flag).toBeFalsy();
        }

    })

    it('should call loadpeople', fakeAsync(() => {
        //spyOn( ,'').and.returnValue(component.peopleInput$);
        let searchField: DebugElement = fixture.debugElement.query(By.css('#ng-select'));
        searchField.nativeElement.value = 'sho';
        searchField.nativeElement.dispatchEvent(new Event('keyup'));
        //tick(500);
        expect(component.item$).not.toBeNull();
          }));

   it('should call Userdetails', async()=>{
       component.UserDetails();
       expect(component.saveflag).toBeTruthy();
       ///spyOn(ServiceStub,"putHTTPData")
       var x=ServiceStub.putHTTPData("lala","jaja");
       expect(x).toEqual("Success 200 ok")


   })



})
   