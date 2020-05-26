
import { Component, OnInit ,ViewChild,ViewEncapsulation} from '@angular/core';
import { catchError, distinctUntilChanged, switchMap, tap, combineAll } from 'rxjs/operators';
import { concat, Observable, of, Subject } from 'rxjs';
import { Data2Service, HttpData} from '../data2.service';
import { NgSelectComponent} from '@ng-select/ng-select';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';


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
  role_id:number=1;
  userArray:any=[];
  userId:string
  tid:number;
  saveflag:boolean=true;
 // modalOpen:boolean=false
  flag:boolean=false
 


  constructor(private dataService: Data2Service , private router: Router, private route: ActivatedRoute) {}

  @ViewChild("elem", {static: false}) select1Comp: NgSelectComponent;
  @ViewChild("eleme2", {static: false}) select1Comp2: NgSelectComponent;

  selectedPersons:any[]=[]; //MANAGERS
  selectedPersons1:any[]=[]; //MEMBERS
  role:string='None';

  // selectedPersons:any[]= [{group_uuid : "123",group_name: "lala"}]
  // selectedPersons1:any[]= [{group_uuid : "87",group_name: "pupu"}]

  // selectedPersons: [{group_name: string,group_uuid : string }]
  // selectedPersons1: [{group_name: string,group_uuid : string}]

  manuuid:any[]=[]
  menuuid:any[]=[]
  delarray:any[]=[]
  
   
  

  ngOnInit() { 

 
  

    this.route.queryParams
    .subscribe(params => {
      this.userId = params.useruuid;
    });
    this.route.queryParams
    .subscribe(params => {
      this.tid = params.tenantuuid;
    });

    console.log(this.userId)
    console.log(this.tid)
   

    //if(this.role=='Own Recordings'||this.role=='None')
    // {
    //   this.flag=true
    //   console.log("Group Manager Disabled")
    //   this.selectedPersons=[];
    //   this.manuuid=[];
    // }
    // else{
    //   this.flag=false
    //   console.log("Group Manager enabled")
     
    // }

    this.loadPeople();
    this.getuserinfo()
  
    //this.Manage()
    //this.mockfunction()


  }

  // mockfunction()
  // {
    

  //   this.selectedPersons = [
  //     { group_name : "Power", group_uuid : "P"}
  //   ]
  //   console.log(this.selectedPersons)
  // }

  getuserinfo()
  {
    const data = this.dataService.getUserData(this.userId);
    data.subscribe(x => {
      
      this.role = x["Userrole"];
      
      this.selectedPersons1 = x['MembersofGroup'];
      this.selectedPersons = x['ManagerofGroup'];
      console.log(this.selectedPersons)
      for(var i in this.selectedPersons)
      {
       // if(!(this.manuuid.indexOf(this.selectedPersons[i]['group_uuid'])>-1))
        
          this.manuuid.push(this.selectedPersons[i]['group_uuid'])
        
        
      }
      console.log("Manuuid->",this.manuuid)
    
      for(var i in this.selectedPersons1)
      {
        // if(!(this.menuuid.indexOf(this.selectedPersons1[i]['group_uuid'])>-1))
        // {
          this.menuuid.push(this.selectedPersons1[i]['group_uuid'])
        //}
        
      }
      
      console.log("Menuuid->",this.menuuid)

     
    // if(this.role=='None'||this.role=='Own Recordings')
    // {
    //   this.selectedPersons = []
    //   this.manuuid=[]
    // }
    // else
    // {
    //   this.selectedPersons = x['ManagerofGroup'];

    // }
      
      console.log(x)
      console.log(x["Userrole"]);
    
  });
  
  

}

//   Manage(){ //TO GET ALL THE AVAILABLE USERS
//     this.dataService.getUsers(this.tid).subscribe(x => {
        

//           for (const i of (x as any)) {
//             this.userArray.push({
//               Firstname: i.first_name,
//               Lastname: i.last_name,
//               UserId: i.user_uuid
//             });
//           }
//     }
//     )
//     console.log(this.userArray)
//   }
// showModal()
// {
  
//   this.modalOpen=true;
//   console.log(this.userId)
// }


userSelected(id:string) //Selected User
{
  this.userId=id;
  console.log(this.userId)
}


// modalClose()
// {
//   this.modalOpen=false;
// }

  OnAddGroupManager(){  //When Manager is added
    console.log("item added")
   // for(var i in this.selectedPersons) [i]['group_uuid']
    console.log(this.selectedPersons)
    for(var i in this.selectedPersons)
    {
      if(!(this.manuuid.indexOf(this.selectedPersons[i]['group_uuid'])>-1))
      {
        this.manuuid.push(this.selectedPersons[i]['group_uuid'])
      }
      
    }
      
    console.log(this.manuuid)
     this.loadPeople();
     this.saveflag=false
  
    
  }
  OnAddGroupMember(){  //When Member is added
    console.log("item added")
   
    console.log(this.selectedPersons1)

    for(var i in this.selectedPersons1)
    {
      if(!(this.menuuid.indexOf(this.selectedPersons1[i]['group_uuid'])>-1))
      {
        this.menuuid.push(this.selectedPersons1[i]['group_uuid'])
      }
      
    }
      
    console.log(this.menuuid)
     this.loadPeople();
     this.saveflag=false
 
    
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

  OnRemove(){ //when item is removed
    console.log(this.selectedPersons)
    this.delarray = []
    for(var i in this.selectedPersons)
    {
      if(this.manuuid.indexOf(this.selectedPersons[i]['group_uuid'])>-1)
      {
        this.delarray.push(this.selectedPersons[i]['group_uuid'])
      }
      
    }
    this.manuuid = this.delarray
    console.log(this.manuuid)
    // this.select1Comp.close();
    // this.select1Comp2.close();
    this.loadPeople();
    this.saveflag=false
   
  }
  OnRemove1(){
    console.log(this.selectedPersons1)
    this.delarray = []
    for(var i in this.selectedPersons1)
    {
      if(this.menuuid.indexOf(this.selectedPersons1[i]['group_uuid'])>-1)
      {
        this.delarray.push(this.selectedPersons1[i]['group_uuid'])
      }
      
    }
    this.menuuid = this.delarray
    console.log(this.menuuid)
    // this.select1Comp.close();
    // this.select1Comp2.close();
    this.loadPeople();
    this.saveflag=false

  }




  GetRoleValue(args){ //Extracting Selected Role
    //var role = args.value;
   // console.log(args.target.value)
   if(this.role=='Own Recordings'||this.role=='None')
   {
     this.flag=true
     console.log("Group Manager Disabled")
     this.selectedPersons=[];
     this.manuuid=[];
   }
   else{
     this.flag=false
     console.log("Group Manager enabled")
    
   }
    this.role_id=this.roles.indexOf(this.role)+1
    console.log(this.role, this.role_id)
    this.saveflag=false
    //console.log(this.selectedPersons, 'groupIds for manager')
    //console.log(this.selectedPersons1 , 'groupIds for members')
   
  }

  UserDetails() //Save Changes
  {
    //var details:any ={};
    console.log("details Saved");
    console.log(this.role,this.selectedPersons,this.selectedPersons1);
    var userdto:any = {};
    userdto[ "Role_id"] = this.role_id;
    userdto["Group_Members_uuid"] = this.menuuid;
    userdto["Group_Supervisors_uuid"] = this.manuuid;
    var stringData = JSON.stringify(userdto);
    console.log(stringData,this.userId)
    this.dataService.postData(stringData,this.userId)
    this.saveflag=true
    
  }
  
 
  private loadPeople() {  // ng select 

   this.item$= concat(
      this.peopleInput$.pipe(
          distinctUntilChanged(),
          tap(() => this.peopleLoading = true),
          switchMap(term => this.dataService.getPeople(term,this.tid).pipe(
              catchError(() => of([])), // empty list on error
              tap(() => this.peopleLoading = false)
          ))
      )
   )
   

  }

}
