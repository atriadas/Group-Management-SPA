import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';


// import { NgSelectComponent } from '@ng-select/ng-select';

// import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { defer, Observable, of } from 'rxjs';
//import { AddFeatureUserComponent } from './add-feature-user.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Data2Service } from '../dataService/data2.service';
import { ManageComponent } from './manage.component';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
//import { DataServiceStub } from '../../services.stub/data.service.stub';

//
// Helper functions for HttpClient spys that return rxjs Observables.
//
// from https://angular.io/guide/testing#async-observable-helpers
/** Create async observable that emits-once and completes
*  after a JS engine turn */
// export function asyncData<T>(data: T) {
//     return defer(() => Promise.resolve(data));
// }
// /** Create async observable error that errors
// *  after a JS engine turn */
// export function asyncError<T>(errorObject: any) {
//     return defer(() => Promise.reject(errorObject));
// }

// describe('AddFeatureUserComponent', () => {
//     let component: AddFeatureUserComponent;
//     let fixture: ComponentFixture<AddFeatureUserComponent>;
//     let spy_logged_in_user;

//     class ActivatedRouteMock {
//         queryParams = new Observable(observer => {
//             const urlParams = {
//                 useruuid: 1,
//                 tenantuuid: 2
//             };
//             observer.next(urlParams);
//             observer.complete();
//         });
//     }
//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             declarations: [AddFeatureUserComponent],
//             imports: [FormsModule, NgbModule, HttpClientModule, RouterTestingModule],
//             providers: [
//                 {
//                     provide: ActivatedRoute,
//                     useValue: ActivatedRouteMock
//                 },
//             ],
//             schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
//         })
//             .compileComponents();
//     });

//     beforeEach(() => {
//         spy_logged_in_user = spyOn(TestBed.get(DataServiceStub), 'getLoggedInUser').and.returnValue(asyncData(true));
//         fixture = TestBed.createComponent(AddFeatureUserComponent);
//         component = fixture.componentInstance;
//         TestBed.get(ActivatedRoute).queryParams = of({ useruuid: 1, tenantuuid: 2 });
//         fixture.detectChanges();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });

//     it('error on getting loggedin user', () => {
//         spy_logged_in_user.and.returnValue(asyncError('an error occurred'));
//         expect(component.errorflag).toBeTruthy();
//     });

    //   it('should fetch value for userId and tid on ngoninit', async(() => {
    //     component.ngOnInit();
    //     let route= TestBed.get(ActivatedRoute)
    //     route.subscribe(x=>{
    //         route=x})
    //      component.userId=route
    //     //component.tid=1
    //     expect(component.userId).toEqual('x_115');
    //    // expect(component.tid).toBeDefined();
    //     // expect(component.userId).toEqual('');


    //   }));
//});




describe('ManageComponent:getUserInfo', () => {
    
    let mockService;
    let component: ManageComponent;
    let fixture: ComponentFixture<ManageComponent>;


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
        mockService = jasmine.createSpyObj(['getUserData']);
        mockService.getUserData.and.returnValue("None");
             TestBed.configureTestingModule({
              declarations: [ ManageComponent],
              imports: [NgSelectModule, FormsModule, NgbModule, HttpClientModule, RouterTestingModule],
              providers: [ { provide: Data2Service, useValue: mockService } ]
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
        component.getuserinfo()
        expect(component.role_id).toEqual(1);
    }));
})
   