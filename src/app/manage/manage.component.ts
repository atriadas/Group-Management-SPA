
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { catchError, distinctUntilChanged, switchMap, tap, combineAll } from 'rxjs/operators';
import { concat, Observable, of, Subject, interval, Subscription } from 'rxjs';
import { Data2Service, HttpData } from '../dataService/data2.service';
import { NgSelectComponent } from '@ng-select/ng-select';
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
  roles = ['None', 'Own Recordings', 'Group Recordings', 'All Recordings'];
  groupMemberId: string[];
  role_id: number = 1;
  userArray: any = [];
  userId: string = ''
  tid: number = 0;
  saveflag: boolean = true;
  flag: boolean = false
  accessToken: string;
  refreshToken: string;



  constructor(private dataService: Data2Service, private router: Router, private route: ActivatedRoute) { }

  @ViewChild("elem", { static: false }) select1Comp: NgSelectComponent;
  @ViewChild("eleme2", { static: false }) select1Comp2: NgSelectComponent;

  selectedPersons: any[] = []; //MANAGERS
  selectedPersons1: any[] = []; //MEMBERS
  role: string = 'None';
  manuuid: any[] = []
  menuuid: any[] = []
  delarray: any[] = []
  tempman: any[] = []
  tempman2: any[] = []
  tempmen: any[] = []
  // errorflag:boolean=false
  errorflag: boolean = false
  errorMessage: string
  private updateSubscription: Subscription;
  j = 0


  ngOnInit() {
    //     this.refreshToken="="
    //    // console.log('Access_Token->',this.accessToken,'Refresh_Token->',this.refreshToken )
    //  this.accessToken="=" 

    //  localStorage.setItem("Access_Token", this.accessToken);
    //              localStorage.setItem("Refresh_Token", this.refreshToken);



    // console.log("PAGE LOADS")
    // this.role=''
    // this.selectedPersons=[]
    // this.selectedPersons1=[]
    // this.menuuid=[]
    // this.manuuid=[]

    this.route.queryParams//fetching query params
      .subscribe(params => {
        this.userId = params.useruuid;
      });
    this.route.queryParams
      .subscribe(params => {
        this.tid = params.tenantuuid;
      });
    console.log("userId->", this.userId)
    console.log("tid->", this.tid)
    this.token(); //function to validate and refrsh token
    this.getuserinfo()
    this.loadPeople();
  }


  token() {
    this.j = this.j + 1;

    this.accessToken = localStorage.getItem('Access_Token')// fetching the access toke from local storage
    this.refreshToken = localStorage.getItem('Refresh_Token')

    var validtoken = this.dataService.getLoggedInUser(this.accessToken)

    validtoken
      .subscribe(
        (response) => {                           //Next callback
          console.log('Success:200 OK')
          console.log(response['role'])
          if (response['role'] == "ACCOUNT_ADMIN") {
            this.errorflag = true
            var expiryTime = response['exp'];
            console.log("exp->", expiryTime);
            const now = new Date()
            const secondsSinceEpoch = Math.round(now.getTime() / 1000)
            console.log("current epoch time->", secondsSinceEpoch)
            var remTime = (expiryTime - secondsSinceEpoch) * 1000 //milliseconds
            console.log(remTime);
            var i = 0;

            this.updateSubscription = interval(remTime-2000).subscribe( //Buffer time of 2 secs
              (val) => {
                i = i + 1;
                if (i > 1) {
                  console.log("token expired")
                  var userdto: any = {};
                  userdto["grant_type"] = "refresh_token"
                  userdto["token"] = this.refreshToken
                  var data = this.dataService.getNewToken(JSON.stringify(userdto))
                  data.subscribe(
                    (response) => {
                      console.log('Success:200 OK')
                      var newAccessToken = response["access_token"]
                      var newRefreshToken = response["refresh_token"]
                      localStorage.setItem("Access_Token", newAccessToken);
                      localStorage.setItem("Refresh_Token", newRefreshToken);
                      localStorage.setItem("tokenchange", this.j.toString())//token changed counter
                      console.log("new access token", newAccessToken, "new refresh token", newRefreshToken)
                      this.token();

                    },
                    (error)=>{
                      console.log(error)
                    })
                }
              }
            );


          }
          else {
            this.errorMessage = "Unauthorised: Not an Admin"
          }







        },
        (error) => {
          this.errorflag = false
          this.errorMessage = 'Error:' + error.status + ' ' + error.error['message'];
          console.log('Error thrown -> token:', this.errorMessage)
        }
      )
    console.log(validtoken)

  }

  getuserinfo() {

    console.log("PAGE LOADS")
    this.role = ''
    this.selectedPersons = []
    this.selectedPersons1 = []
    this.menuuid = []
    this.manuuid = []
    const data = this.dataService.getUserData(this.userId, this.accessToken);
    data.subscribe(x => {

      this.role = x["Userrole"];
      if (this.role == "None")
        this.role_id = 1
      if (this.role == "Own Recordings")
        this.role_id = 2
      if (this.role == "Group Recordings")
        this.role_id = 3
      if (this.role == "All Recordings")
        this.role_id = 4

      console.log("role_>", this.role, "role id_>", this.role_id)

      this.selectedPersons1 = x['MembersofGroup'];
      this.selectedPersons = x['SupervisorofGroup'];
      if (this.selectedPersons == null) {
        this.selectedPersons = []
      }
      console.log(this.selectedPersons)
      for (var i in this.selectedPersons) {
        // if(!(this.manuuid.indexOf(this.selectedPersons[i]['group_uuid'])>-1))

        this.manuuid.push(this.selectedPersons[i]['group_uuid'])


      }
      this.tempman = this.selectedPersons
      console.log("Origina manager groups->", this.tempman)
      console.log("Manuuid->", this.manuuid)

      for (var i in this.selectedPersons1) {
        // if(!(this.menuuid.indexOf(this.selectedPersons1[i]['group_uuid'])>-1))
        // {
        this.menuuid.push(this.selectedPersons1[i]['group_uuid'])

        //}

      }
      this.tempmen = this.selectedPersons1
      console.log("Origina member groups->", this.tempmen)
      console.log("Menuuid->", this.menuuid)


      if (this.role == 'None' || this.role == 'Own Recordings') {
        // for(var i in this.selectedPersons)
        // {
        //   // if(!(this.menuuid.indexOf(this.selectedPersons1[i]['group_uuid'])>-1))
        //   // {
        //     this.mandeluuid.push(this.selectedPersons[i]['group_uuid'])
        //     //this.tempman.push(this.selectedPersons[i])

        //   //}

        // }

        this.flag = true
        console.log("Group Manager disabled")
        this.selectedPersons = []
      }

      // console.log('managers to delete', this. mandeluuid)

    });



  }



  OnAddGroupManager() {  //When Manager is added
    console.log("Manager added")
    // for(var i in this.selectedPersons) [i]['group_uuid']
    console.log(this.selectedPersons)
    // this.tempman=this.selectedPersons
    // this.tempman2=this.selectedPersons
    for (var i in this.selectedPersons) {

      if (!(this.manuuid.indexOf(this.selectedPersons[i]['group_uuid']) > -1)) {
        this.manuuid.push(this.selectedPersons[i]['group_uuid'])
      }
      console.log('manuuid on->' + i + "->" + this.manuuid)


    }

    console.log(this.manuuid)
    this.loadPeople();
    this.saveflag = false
  }


  OnAddGroupMember() {  //When Member is added
    console.log("Member added")

    console.log(this.selectedPersons1)

    for (var i in this.selectedPersons1) {
      if (!(this.menuuid.indexOf(this.selectedPersons1[i]['group_uuid']) > -1)) {
        this.menuuid.push(this.selectedPersons1[i]['group_uuid'])
      }
    }
    console.log(this.menuuid)
    this.loadPeople();
    this.saveflag = false


  }


  OnRemove() { //when item is removed
    console.log("Remove Manager function is called")
    console.log(this.selectedPersons)
    this.delarray = []
    for (var i in this.selectedPersons) {
      if (this.manuuid.indexOf(this.selectedPersons[i]['group_uuid']) > -1) {
        this.delarray.push(this.selectedPersons[i]['group_uuid'])
      }
    }
    this.manuuid = this.delarray
    console.log(this.manuuid)
    // this.select1Comp.close();
    // this.select1Comp2.close();
    this.loadPeople();
    this.saveflag = false

  }

  OnRemove1() {
    console.log("Remove Members function is called")
    console.log(this.selectedPersons1)
    this.delarray = []
    for (var i in this.selectedPersons1) {
      if (this.menuuid.indexOf(this.selectedPersons1[i]['group_uuid']) > -1) {
        this.delarray.push(this.selectedPersons1[i]['group_uuid'])
      }

    }
    this.menuuid = this.delarray
    console.log(this.menuuid)
    // this.select1Comp.close();
    // this.select1Comp2.close();
    this.loadPeople();
    this.saveflag = false

  }

  GetRoleValue(args) { //Extracting Selected Role
    //var role = args.value;
    // console.log(args.target.value)
    if (this.role == 'Own Recordings' || this.role == 'None') {
      this.flag = true
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

      this.selectedPersons = [];
      this.manuuid = [];
    }
    else {
      this.flag = false
      console.log(this.selectedPersons, "before if")
      if (this.selectedPersons.length == 0) {
        //console.log(this.selectedPersons,"insie")
        this.selectedPersons = this.tempman

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
    this.role_id = this.roles.indexOf(this.role) + 1
    console.log(this.role, this.role_id)
    this.saveflag = false
    //console.log(this.selectedPersons, 'groupIds for manager')
    //console.log(this.selectedPersons1 , 'groupIds for members')


  }

  UserDetails() //Save Changes
  {
    console.log("details Saved");
    var managerRemoveUuid: any[] = []
    var memberRemoveUuid: any[] = []
    if (this.tempman != null) {
      let managerrem = this.tempman.filter(item => this.selectedPersons.indexOf(item) < 0);
      for (var i in managerrem) {
        managerRemoveUuid.push(managerrem[i]["group_uuid"])
      }
    }
    console.log("Manager to remove uuid->", managerRemoveUuid);
    if (this.tempmen != null) {
      let memberrem = this.tempmen.filter(item => this.selectedPersons1.indexOf(item) < 0);
      for (var i in memberrem) {
        memberRemoveUuid.push(memberrem[i]["group_uuid"])
      }
    }
    console.log("Member to remove uuid->", memberRemoveUuid);

    var userdto: any = {};
    // userdto["Role_id"] = this.role_id;
    // userdto["Group_Members_toadd"] = this.menuuid;
    // userdto["Group_Members_todelete"] = memberRemoveUuid;
    // userdto["Group_Supervisors_toadd"] = this.manuuid;
    // userdto["Group_Supervisors_todelete"] = managerRemoveUuid;


    userdto["Role_id"] = this.role_id;
    userdto["Group_uuid_todelete_AsMember"] = memberRemoveUuid
    userdto["Group_uuid_todelete_AsSupervisors"] = managerRemoveUuid
    userdto["Group_uuid_toadd_AsMember"] = this.menuuid
    userdto["Group_uuid_toadd_AsSupervisors"] = this.manuuid




    var stringData = JSON.stringify(userdto);
    console.log(stringData, this.userId)
    // this.dataService.putHTTPData(stringData,this.userId)
    // .subscribe(response => {
    //   console.log('Success:200 OK', response) 
    //        parent.postMessage("successfully_saved", "*");    
    //  })
    // this.dataService.putHTTPData(stringData,this.userId).then(data => {
    //   console.log('then()=>',data);
    // });

    var res = this.dataService.putHTTPData(stringData, this.userId, this.accessToken)

    res.subscribe(
      (response) => {
        console.log('Success:200 OK')
        parent.postMessage("SAVE_SUCCESSFULL", "*");
      },
      (error) => {
        this.errorMessage = error
        console.log('Error thrown ->', this.errorMessage)
        parent.postMessage("SAVE_FAILED", "*");
      }
    )


    this.saveflag = true

    setTimeout(() => { this.getuserinfo(); }, 3000);
  }


  OnClose() {
    //window.postMessage("Close Modal", "window");
    parent.postMessage("CLOSE_MODAL", "*");
  }

  loadPeople() {  // ng select 

    this.item$ = concat(
      this.peopleInput$.pipe(
        distinctUntilChanged(),
        tap(() => this.peopleLoading = true),
        switchMap(term => this.dataService.getPeople(term, this.tid, this.accessToken).pipe(
          catchError(() => of([])), // empty list on error
          tap(() => this.peopleLoading = false)
        ))
      )
    )
    console.log("load people is called")


  }

}
