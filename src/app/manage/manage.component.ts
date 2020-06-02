
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


  item$: Observable<HttpData[]>;
  peopleLoading = false;
  peopleInput$ = new Subject<string>();
  roles =['None','Own Recordings','Group Recordings','All Recordings']; 
  groupMemberId:string[];
  role_id:number=1;
  userArray:any=[];
  userId:string=''
  tid:number=0;
  saveflag:boolean=true;
  flag:boolean=false
 


  constructor(private dataService: Data2Service , private router: Router, private route: ActivatedRoute) {}

  @ViewChild("elem", {static: false}) select1Comp: NgSelectComponent;
  @ViewChild("eleme2", {static: false}) select1Comp2: NgSelectComponent;

  selectedPersons:any[]=[]; //MANAGERS
  selectedPersons1:any[]=[]; //MEMBERS
  role:string='None';
  manuuid:any[]=[]
  menuuid:any[]=[]
  delarray:any[]=[]
  // mandeluuid:any[]=[]
  // mandel:any[]=[]
  tempman:any[]=[]
  tempman2:any[]=[]
  tempmen:any[]=[]
  
   
  ngOnInit() { 

    console.log("PAGE LOADS")
    this.role=''
    this.selectedPersons=[]
    this.selectedPersons1=[]
    this.menuuid=[]
    this.manuuid=[]
 
    this.route.queryParams
    .subscribe(params => {
      this.userId = params.useruuid;
    });
    this.route.queryParams
    .subscribe(params => {
      this.tid = params.tenantuuid;
    });

    console.log("userId->",this.userId)
    console.log("tid->",this.tid)
    this.getuserinfo()
    this.loadPeople();
  }

  getuserinfo()
  {
    const data = this.dataService.getUserData(this.userId);
    data.subscribe(x => {
      
      this.role = x["Userrole"];
      if(this.role=="None")
      this.role_id=1
      if(this.role=="Own Recordings")
      this.role_id=2
      if(this.role=="Group Recordings")
      this.role_id=3
      if(this.role=="All Recordings")
      this.role_id=4

      console.log("role_>",this.role,"role id_>", this.role_id)
      
      this.selectedPersons1 = x['MembersofGroup'];
      this.selectedPersons = x['ManagerofGroup'];
      console.log(this.selectedPersons)
      for(var i in this.selectedPersons)
      {
       // if(!(this.manuuid.indexOf(this.selectedPersons[i]['group_uuid'])>-1))
        
          this.manuuid.push(this.selectedPersons[i]['group_uuid'])
        
        
      }
      this.tempman=this.selectedPersons
      console.log("Origina manager groups->",this.tempman)
      console.log("Manuuid->",this.manuuid)
    
      for(var i in this.selectedPersons1)
      {
        // if(!(this.menuuid.indexOf(this.selectedPersons1[i]['group_uuid'])>-1))
        // {
          this.menuuid.push(this.selectedPersons1[i]['group_uuid'])
          
        //}
        
      }
      this.tempmen=this.selectedPersons1
      console.log("Origina member groups->",this.tempmen)
      console.log("Menuuid->",this.menuuid)

     
    if(this.role=='None'||this.role=='Own Recordings')
    {
      // for(var i in this.selectedPersons)
      // {
      //   // if(!(this.menuuid.indexOf(this.selectedPersons1[i]['group_uuid'])>-1))
      //   // {
      //     this.mandeluuid.push(this.selectedPersons[i]['group_uuid'])
      //     //this.tempman.push(this.selectedPersons[i])
          
      //   //}
 
      // }
      
      this.flag=true
      console.log("Group Manager disabled")
      this.selectedPersons=[]
    }
    
   // console.log('managers to delete', this. mandeluuid)
    
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


// userSelected(id:string) //Selected User
// {
//   this.userId=id;
//   console.log(this.userId)
// }


// modalClose()
// {
//   this.modalOpen=false;
// }

  OnAddGroupManager(){  //When Manager is added
    console.log("item added")
   // for(var i in this.selectedPersons) [i]['group_uuid']
    console.log(this.selectedPersons)
    // this.tempman=this.selectedPersons
    // this.tempman2=this.selectedPersons
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
    //  if(this.selectedPersons==[])
    //  {
    //    this.tempman=this.tempman2
    //    console.log('temparaay 1',this.tempman,'temp2',this.tempman2)
    //  }
    //  else{
    //   this.tempman =this.selectedPersons
    //   console.log('temparaay 1',this.tempman,'temp2',this.tempman2)

    //  }
    
     this.selectedPersons=[];
     this.manuuid=[];
   }
   else{
     this.flag=false
     //console.log(this.selectedPersons, "before if")
     if(this.selectedPersons.length==0)
     {
      //console.log(this.selectedPersons,"insie")
      this.selectedPersons=this.tempman

     }
    // console.log(this.selectedPersons," after")
    
    // console.log('temparaay 1',this.tempman,'temp2',this.tempman2)
    //  if(this.tempman.length==0)
    //  {
    //    this.selectedPersons=this.tempman2
    //    console.log('temparaay 1',this.tempman,'temp2',this.tempman2)
    //  }
    //  else
    //  {
    //   this.selectedPersons=this.tempman
    //   console.log('temparaay 1',this.tempman,'temp2',this.tempman2)

     //}
    // if(this.tempman.length!=0)
    // {
    //   this.tempman2=this.tempman

    // }
   
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
    console.log("details Saved");
    var managerRemoveUuid:any[]=[]
    var memberRemoveUuid:any[]=[]
    if(this.tempman!=null){
    let managerrem = this.tempman.filter(item => this.selectedPersons.indexOf(item) < 0);
    for(var i in managerrem)
    {
       managerRemoveUuid.push(managerrem[i]["group_uuid"])
    }
    }
    console.log("Manager to remove uuid->",managerRemoveUuid);
    if(this.tempmen!=null)
    {
    let memberrem = this.tempmen.filter(item => this.selectedPersons1.indexOf(item) < 0);
       for(var i in memberrem)
        {
            memberRemoveUuid.push(memberrem[i]["group_uuid"])
        }
     }
    console.log("Member to remove uuid->",memberRemoveUuid);

    var userdto:any = {};
    userdto["Role_id"] = this.role_id;
    userdto["Group_Members_toadd"] = this.menuuid;
    userdto["Group_Members_todelete"] = memberRemoveUuid;
    userdto["Group_Supervisors_toadd"] = this.manuuid;
    userdto["Group_Supervisors_todelete"] = managerRemoveUuid;

    var stringData = JSON.stringify(userdto);
    console.log(stringData,this.userId)
    this.dataService.putHTTPData(stringData,this.userId)
    this.saveflag=true
    setTimeout(() => {  this.ngOnInit(); }, 2000);
   
    
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
