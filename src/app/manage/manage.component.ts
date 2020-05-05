
import { Component, OnInit ,ViewChild,ViewEncapsulation} from '@angular/core';
import { catchError, distinctUntilChanged, switchMap, tap, combineAll } from 'rxjs/operators';
import { concat, Observable, of, Subject } from 'rxjs';
import { Data2Service, HttpData} from '../data2.service';
import { NgSelectComponent} from '@ng-select/ng-select';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {

  //isbeingSearched: boolean = false;

  item$: Observable<HttpData[]>;
  peopleLoading = false;
  peopleInput$ = new Subject<string>();
  roles =['None','Own Recordings','Group Recordings','All Recordings']; 
  groupMemberId:string[];
  role_id:number
  userArray:any=[];
  userId:string
  modalOpen:boolean=false
 


  constructor(private dataService: Data2Service) {}

  @ViewChild("elem", {static: false}) select1Comp: NgSelectComponent;
  @ViewChild("eleme2", {static: false}) select1Comp2: NgSelectComponent;

  selectedPersons:string;
  selectedPersons1:string;
  role:string='None';
  

  ngOnInit() { 

    this.loadPeople();
    

  }

  Manage(){
    this.dataService.getUsers(1).subscribe(x => {
        

          for (const i of (x as any)) {
            this.userArray.push({
              Firstname: i.first_name,
              Lastname: i.last_name,
              UserId: i.user_uuid
            });
          }
    }
    )
    console.log(this.userArray)
  }
showModal(id:string)
{
  this.userId=id;
  this.modalOpen=true;
}
modalClose()
{
  this.modalOpen=false;
}

  OnAddGroupManager(){  //When Item is added
    console.log("item added")
    console.log(this.selectedPersons)
     this.loadPeople();
 
    
  }
  OnAddGroupMember(){  //When Item is added
    console.log("item added")
    console.log(this.selectedPersons1)
     this.loadPeople();
 
    
  }

  // OnBlur(){
  //   console.log("OnBlue");
  //   this.isbeingSearched = false;
  //   this.select1Comp.close();//for first ngselect component
  // }

  // OnBlur2(){
  //   console.log("OnBlue");
  //   this.isbeingSearched = false;
  //   this.select1Comp2.close();//for second ngselect component
  // }

  // OnRemove(){ //when item is removed
  //   console.log("item removed")
  //   this.select1Comp.close();
  //   this.select1Comp2.close();
  //   this.loadPeople();
   
  // }


  GetRoleValue(args){ //Extracting Selected Role
    //var role = args.value;
   // console.log(args.target.value)
    this.role_id=this.roles.indexOf(this.role)+1
    console.log(this.role, this.role_id)
    
  }

  UserDetails() //Save Changes
  {
    //var details:any ={};
    console.log("details Saved");
    console.log(this.role,this.selectedPersons,this.selectedPersons1);
    var userdto:any = {};
    userdto[ "Role_id"] = this.role_id;
    userdto["Group_Members_uuid"] = this.selectedPersons1;
    userdto["Group_Supervisors_uuid"] = this.selectedPersons;
    var stringData = JSON.stringify(userdto);
    console.log(stringData,this.userId)
    //this.dataService.postData(stringData,this.userId)
    
  }
  
 
  private loadPeople() { 

   this.item$= concat(
      this.peopleInput$.pipe(
          distinctUntilChanged(),
          tap(() => this.peopleLoading = true),
          switchMap(term => this.dataService.getPeople(term,2).pipe(
              catchError(() => of([])), // empty list on error
              tap(() => this.peopleLoading = false)
          ))
      )
   )
   

  }

}
