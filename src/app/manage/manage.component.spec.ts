// import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

// import { ManageComponent } from './manage.component';
// import { NgSelectComponent } from '@ng-select/ng-select';

// import { NgSelectModule } from '@ng-select/ng-select';
// import { FormsModule } from '@angular/forms';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { HttpClientModule } from '@angular/common/http';
// import { RouterModule } from '@angular/router';
// import { RouterTestingModule } from '@angular/router/testing';
// import { Data2Service } from '../data2.service';

// describe('ManageComponent', () => {
//   let component: ManageComponent;
//   let fixture: ComponentFixture<ManageComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ManageComponent],
//       imports: [NgSelectModule, FormsModule, NgbModule, HttpClientModule, RouterTestingModule]


//     })
//       .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(ManageComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should fetch value for userId and tid on ngoninit', async(() => {
//     component.ngOnInit();
//     component.userId="x_114"
//     component.tid=1
//      expect(component.userId).toBeDefined();
//      expect(component.tid).toBeDefined();
//     // this.route.queryParams
//     // .subscribe(params => {
//     //   component.userId = params.useruuid;
//     // });
//     // this.route.queryParams
//     // .subscribe(params => {
//     //   component.tid = params.tenantuuid;
//     // });
//     // expect(component.userId).toEqual('');
//     // expect(component.tid).toEqual(null);
//     // console.log(component.userId)
//     // console.log(component.tid)

//   }));

//   it('should call on add group manager', async(() => {
//     component.OnAddGroupManager();
//     expect(component.saveflag).toBeFalsy();
//   }));

//   it('should call on add group members', async(() => {
//     component.OnAddGroupMember();
//     expect(component.saveflag).toBeFalsy();
//   }));

//   it('should call revome managers', async(() => {
//     component.OnRemove();
//     expect(component.saveflag).toBeFalsy();
//   }));

//   it('should call on remove members', async(() => {
//     component.OnRemove1();
//     expect(component.saveflag).toBeFalsy();
//   }));

//   it('should call user details', async(() => {
//     component.UserDetails();
//     expect(component.saveflag).toBeTruthy();
//   }));


//   describe("getuserinfo", function () {
//     it('should match roles', async(() => {
//       component.getuserinfo();
//       component.userId="x_114"
//       component.role="Own Recording";
//       fixture.detectChanges();

    
//      // expect(component.flag).toBeTruthy();
    
//       // inject([Data2Service], (data2Service) => {

//       //   var mockroles = ['None', 'Own Recordings', 'Group Recordings', 'All Recordings'];
//       //   const data = this.dataService.getUserData();
//       //   data.subscribe(x => {

//       //     this.role = x["Userrole"];
//       //expect(component.role).toEqual("None"||"Own Recordings"||"Group Recordings"||"All Recordings") 
//       // expect(component.role).toEqual()
//       // expect(component.role).toEqual()
//       // expect(component.role).toEqual("All Recordings")
//           //   this.role_id = 1
//           // if (this.role == "Own Recordings")
//           //   this.role_id = 2
//           // if (this.role == "Group Recordings")
//           //   this.role_id = 3
//           // if (this.role == "All Recordings")
//           //   this.role_id = 4

//           // console.log(this.role, this.role_id)

//           // expect(component.roles).not.toEqual('');
//           // expect(component.tid).not.toEqual(null);
//         // }
//         // );
//       }));
//   });
// });
