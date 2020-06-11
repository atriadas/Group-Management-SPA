import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';


// import { NgSelectComponent } from '@ng-select/ng-select';

// import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { defer, Observable, of } from 'rxjs';

import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Data2Service } from '../dataService/data2.service';
import { ManageComponent } from './manage.component';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';





describe('ManageComponent:getUserInfo', () => {
    
    let mockService;
    let component: ManageComponent;
    let fixture: ComponentFixture<ManageComponent>;
    const ServiceStub = {
        getUserData() {
          return of( [{UserRole: "All Recordings",
          MembersOfGroup: [{group_uuid:"aa781f9f-8e34-45b8-98e3-e0cb69bfd4bc",
                            group_name:"Mitel Group 1"}],
          ManagersOfGroup:[{group_uuid:"aa781f9f-8e34-45b8-98e3-e0cb69bfd4bc",
                             group_name:"Mitel Group 1"}]}] )
        }
      }


    // class MockService {
    //              getData = new Observable(observer => {
    //                  const data = {
    //                      UserRole: "All Recordings",
    //                      MembersOfGroup: [{group_uuid:"aa781f9f-8e34-45b8-98e3-e0cb69bfd4bc",
    //                                        group_name:"Mitel Group 1"}],
    //                      ManagersOfGroup:[{group_uuid:"aa781f9f-8e34-45b8-98e3-e0cb69bfd4bc",
    //                                        group_name:"Mitel Group 1"}]
    //                  };
    //                  observer.next(data);
    //                  observer.complete();
    //              });
    //        }



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
        // TestBed.get(Data2Service).getData = of({ UserRole: "All Recordings",
        // MembersOfGroup: [{group_uuid:"aa781f9f-8e34-45b8-98e3-e0cb69bfd4bc",
        //                   group_name:"Mitel Group 1"}],
        // ManagersOfGroup:[{group_uuid:"aa781f9f-8e34-45b8-98e3-e0cb69bfd4bc",
        //                   group_name:"Mitel Group 1"}] });
        fixture.detectChanges();
      });
    


    it('should create', () => {
       expect(component).toBeTruthy();
    });

    it('should getUserInfo', async(() => {
        fixture.detectChanges();
        expect(component.role_id).toEqual(4);
    }));
})
   