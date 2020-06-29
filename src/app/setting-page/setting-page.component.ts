import { Component, OnInit, ViewChild, Pipe, PipeTransform, AfterViewInit, ElementRef } from '@angular/core';
import { catchError, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { concat, Observable, of, Subject, interval, Subscription, from } from 'rxjs';
import { DataService, HttpData, Update } from '../dataService/data.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { PaginationInstance } from 'ngx-pagination/dist/ngx-pagination.module';
import { RouterEvent, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-setting-page',
  templateUrl: './setting-page.component.html',
  styleUrls: ['./setting-page.component.css']
})


export class SettingPageComponent implements AfterViewInit {

  progressbarValue = 100;

  item$: Observable<HttpData[]>;
  peopleLoading = false;
  peopleInput$ = new Subject<string>();

  groupName: string = 'New Group';

  numberMember: number = 0;
  numberManager: number = 0;
  customerArray: string[] = []
  customerArray2: string[] = []
  groupUuid: string;
  tid: string;


  addgroupbutton: boolean = false;
  addFlag: number = 1;
  noGroupFlag: number = null;
  isOn = true;
  added: boolean = false;
  saveUpdate: boolean = false;
  SaveDisable = true;
  mainModalOpen: boolean

  selectedPersons: string; //manager
  selectedPersons1: string; // members
  selectedPersonsArr: any[] = [];
  selectedPersonsArr1: any[] = [];
  previousMemberUuid: string[] = [];
  previousManagerUuid: string[] = [];
  newMemberUuid: string[] = [];
  newManagerUuid: string[] = [];
  oldGroupName: string = this.groupName


  term: string = null;
  term2: string = null;
  term3: string = null;

  dataArray: any = [];
  MemDeleteArray: string[] = [];
  ManDeleteArray: string[] = [];
  TempArray: any[] = [];
  TempManArray: any[] = [];
  accessToken: string;
  refreshToken: string;
  errorflag: boolean = false
  errorMessage: string
  j = 0
  private updateSubscription: Subscription;



  constructor(private dataService: DataService, private router: Router, private route: ActivatedRoute) {

    this.selectedPersonsArr1 = ['members']
    this.selectedPersonsArr = ['managers']

  }


  @ViewChild("elem", { static: false }) select1Comp: NgSelectComponent;
  @ViewChild("eleme2", { static: false }) select1Comp2: NgSelectComponent;
  @ViewChild('openModal', { static: false }) openModal: ElementRef;
  @ViewChild('alertButton', { static: false }) alertButton: ElementRef;
  @ViewChild('loadButton', { static: false }) loadButton: ElementRef;
  @ViewChild('closeLoadButton', { static: false }) closeLoadButton: ElementRef;
  @ViewChild('closeAlertButton', { static: false }) closeAlertButton: ElementRef;



  ngAfterViewInit() {




    this.route.queryParams
      .subscribe(params => {
        this.tid = params.tenantuuid;
      });
    console.log('tid=', this.tid)

    this.token()
    this.getdbdata()
    this.loadPeople();



  }
  token() {
    this.j = this.j + 1;

    this.accessToken = localStorage.getItem('Access_Token')// fetching the access toke from local storage
    this.refreshToken = localStorage.getItem('Refresh_Token')
    console.log('Access_Token->', this.accessToken, 'Refresh_Token->', this.refreshToken)
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
            console.log(remTime - 5000);


            this.updateSubscription = interval(remTime - 5000).subscribe( //Buffer time of 5 secs
              (val) => {

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
                    this.updateSubscription.unsubscribe();

                  },
                  (error) => {
                    console.log(error)
                  })

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


  loaderOpen: boolean = false;
  alert1Open: boolean = false;
  exampleModalOpen = false;
  exampleModal1Open = false;


  OnGroupNameChange() {
    if (this.saveUpdate == true) { //Only for new Group
      if (this.groupName != this.oldGroupName) {
        this.SaveDisable = false;
      }
      else {
        this.SaveDisable = true;

      }
    }
  }


  NewGroup() { //when there is no existing group
    this.isOn = false
    this.noGroupFlag = 1
    this.addgroup()
  }

  DelOpen() { //Delete  modal open
    this.exampleModalOpen = true
  }

  closeDeleteModal() { //Delete modal close
    this.exampleModalOpen = false
  }

  CanOpen() { //Cancel modal open
    this.exampleModal1Open = true
  }

  closeCanModal() { //Cancel Modal close on crpss
    this.addgroupbutton = false;
    this.exampleModal1Open = false

  }

  closeCanModalOnCancel() {
    this.exampleModal1Open = false

  }

  // CloseModalOnCross() { //Closing main modal on cross

  //   this.addgroupbutton = false;
  //   this.router.navigateByUrl(''); //back to home page


  // }


  getdbdata() { // TO GET ALL THE GROUPS
    this.dataArray = [];
    this.dataService.getAllGroupsData(this.tid, this.accessToken)
      .subscribe(x => {
        console.log(typeof (x))
        if (x != null && x.length != 0) {
          this.isOn = false
          this.noGroupFlag = 1;
          for (const i of (x as any)) {
            this.dataArray.push({
              Groupname: i.group_name,
              GroupId: i.group_uuid
            });
          }
          console.log("group exsists");
        }
        else {
          this.isOn = true;
          this.noGroupFlag = 0;
          console.log("no groups")
        }

        console.log(this.dataArray);

      })

  }


  startTimer(seconds: number) { // ON SAVE
    console.log("save")
    this.isOn = false;
    // this.loaderOpen = true
    this.loadButton.nativeElement.click();
    const timer$ = interval(20);
    const sub = timer$.subscribe((sec) => {
      this.progressbarValue = 100 - sec * 100 / seconds;
      if (this.progressbarValue == 0) {
        // this.loaderOpen = false 
        // this.alert1Open = true this.alert1Open = false
        this.closeLoadButton.nativeElement.click();
        this.alertButton.nativeElement.click();
        console.log(this.groupName)
        var close = this.closeAlertButton.nativeElement;
        setTimeout(() => { close.click(); }, 2000);
        var postGroup2: any = {}
        postGroup2['Groupname'] = this.groupName
        postGroup2['Supervisor_uuid'] = this.customerArray2
        postGroup2['Members_uuid'] = this.customerArray
        this.dataService.postHTTPData(JSON.stringify(postGroup2), this.tid, this.accessToken);
        //targetWindow.postMessage(message, targetOrigin);
        sub.unsubscribe();
        setTimeout(() => { this.addgroupbutton = false; }, 2000);



      }
    });
    setTimeout(() => { this.getdbdata(); }, 3000);



  }

  updateSave(seconds: number) { //ON UPDATE
    console.log('update');
    this.isOn = false;
    //this.loaderOpen = true
    this.loadButton.nativeElement.click();
    const timer$ = interval(20);
    const sub = timer$.subscribe((sec) => {
      this.progressbarValue = 100 - sec * 100 / seconds;
      if (this.progressbarValue == 0) {
        //this.loaderOpen = false
        //this.alert1Open = true

        this.closeLoadButton.nativeElement.click();
        this.alertButton.nativeElement.click();
        console.log(this.groupName)
        var close = this.closeAlertButton.nativeElement;
        setTimeout(() => { close.click(); }, 2000);
        var postGroup2: any = {}
        postGroup2["Groupname"] = this.groupName
        postGroup2["members_toadd"] = this.customerArray
        postGroup2["supervisors_toadd"] = this.customerArray2
        postGroup2["members_todelete"] = this.MemDeleteArray
        postGroup2["supervisors_todelete"] = this.ManDeleteArray
        this.dataService.postUpdatedData(JSON.stringify(postGroup2), this.groupUuid, this.accessToken, this.tid);
        //targetWindow.postMessage(message, targetOrigin);
        // postGroup3=new Update(this.groupName,this.customerArray,this.customerArray2,
        // this.MemDeleteArray,this.ManDeleteArray);


        // this.dataService.postUpdatedData(postGroup3, this.groupUuid);

        sub.unsubscribe();
        //setTimeout(() => { }, 2000);


      }
    });
    setTimeout(() => { this.getdbdata(); this.addgroupbutton = false; }, 2000);


  }

  compare(arr1, arr2) { //ARRAY COMPARISON IF EVEN ONE ELEMENT EXISTS

    if (!arr1 || !arr2) return

    let result: boolean;

    arr1.forEach((elem1, index) => {
      elem1;
      arr2.forEach((elem2, index) => {
        elem2;
        if (elem1.someProp === elem2.someProp) {
          result = true;//--If elem1 equal elem2
        }
      });
    });

    return result

  }

  compare2(arr1, arr2) { // HOW MANY TIMES TRUE  

    if (!arr1 || !arr2) return

    let result: boolean;
    let count = 0;

    arr1.forEach((elem1, index) => {
      elem1;
      arr2.forEach((elem2, index) => {
        elem2;
        if (elem1.someProp === elem2.someProp) {
          count = count + 1;//--If elem1 equal elem2
        }
      });
    });
    if (count == arr1.length) {
      result = true
    }

    return result

  }


  OnAdd() {  //When Item is added in members


    if (this.selectedPersons1 != null) {
      // console.log(this.selectedPersonsArr1.filter(item => item[3].indexOf(this.selectedPersons1['user_uuid']) > -1))

      if (this.compare([this.selectedPersons1['first_name'], this.selectedPersons1['last_name'], this.selectedPersons1['user_guiname'], this.selectedPersons1['user_uuid']], this.selectedPersonsArr1.filter(item => item[3].indexOf(this.selectedPersons1['user_uuid']) > -1))) {

        console.log("Member Already exists!!")

      }



      else {




        this.SaveDisable = false
        this.selectedPersonsArr1[this.numberMember] = ([this.selectedPersons1['first_name'], this.selectedPersons1['last_name'], this.selectedPersons1['user_guiname'], this.selectedPersons1['user_uuid']]);


        this.numberMember = this.numberMember + 1;
        this.customerArray.push(this.selectedPersons1['user_uuid'])
        if (this.MemDeleteArray.indexOf(this.selectedPersons1['user_uuid']) > -1) {
          this.MemDeleteArray.splice(this.MemDeleteArray.indexOf(this.selectedPersons1['user_uuid']), 1);
          console.log(this.MemDeleteArray, 'existing member removed')
        }

        console.log("New Member added")
        console.log(this.customerArray)
      }
      // if(this.selectedPersonsArr1==this.previousMemberUuid)
      // {
      //   console.log('save is disabled')
      //   console.log(this.selectedPersonsArr1,this.previousMemberUuid)
      //   this.SaveDisable=true
      // }
      // else{
      //   this.SaveDisable=false
      //   console.log('save is enabled')


      // }






    }
    this.selectedPersons1 = null

  }


  transform1() // filter for selected members
  {
    let term = this.term2
    this.TempArray = this.selectedPersonsArr1

    if (!term) {
      console.log('No term')
    }
    else {
      console.log('Change det', term)
      this.TempArray = this.TempArray.filter(item => ((item[0] + ' ' + item[1]).toString().toLowerCase().indexOf(term.toLowerCase())) > -1);
      console.log(this.TempArray)
    }
  }

  transformMan() // filter for selected members
  {
    let term = this.term
    this.TempManArray = this.selectedPersonsArr

    if (!term) {
      console.log('No term')
    }
    else {
      console.log('Change det', term)
      this.TempManArray = this.TempManArray.filter(item => ((item[0] + " " + item[1]).toString().toLowerCase().indexOf(term.toLowerCase())) > -1);
      console.log(this.TempManArray)
    }
  }

  removeFromList(item, flag) { //When Item is removed

    if (flag == 0) { //for members

      var i = this.selectedPersonsArr1.indexOf(item);
      this.MemDeleteArray.push(this.selectedPersonsArr1[i][3]);
      console.log(this.MemDeleteArray)
      this.selectedPersonsArr1.splice(i, 1);
      this.numberMember = this.numberMember - 1;
      this.transform1()//filter function

      if (this.numberMember > 0) {
        this.SaveDisable = false

      }
      else {
        this.SaveDisable = true
      }

      //if(this.compare(this.selectedPersonsArr1,this.previousMemberUuid))
      // {

      //   console.log('save is disabled')
      //   console.log(this.selectedPersonsArr1,this.previousMemberUuid)
      //   this.SaveDisable=true
      // }
      // else{
      //   this.SaveDisable=false
      //   console.log('save is enabled')
      //   console.log(this.selectedPersonsArr1,this.previousMemberUuid)

      // }
    }
    else if (flag == 1) {

      var i = this.selectedPersonsArr.indexOf(item);
      this.ManDeleteArray.push(this.selectedPersonsArr[i][3]);
      console.log(this.ManDeleteArray)
      this.selectedPersonsArr.splice(i, 1);
      this.numberManager = this.numberManager - 1;
      this.transformMan() //filter function
      if (this.numberManager > 0) {
        this.SaveDisable = false

      }
      else {
        this.SaveDisable = true
      }

      // if(this.selectedPersonsArr==this.previousManagerUuid)
      // {
      //   console.log('save is disabled')
      //   this.SaveDisable=true
      // }
      // else{
      //   this.SaveDisable=false
      //   console.log('save is enabled')

      // }
    }

  }

  OnAdd1()  //When Item is added in managers
  {
    if (this.selectedPersons != null) {

      if (this.compare([this.selectedPersons['first_name'], this.selectedPersons['last_name'], this.selectedPersons['user_guiname'], this.selectedPersons['user_uuid']], this.selectedPersonsArr.filter(item => item[3].indexOf(this.selectedPersons['user_uuid']) > -1))) {

        console.log("Manager Already exists!!")

      }

      else {
        this.SaveDisable = false


        this.selectedPersonsArr[this.numberManager] = ([this.selectedPersons['first_name'], this.selectedPersons['last_name'], this.selectedPersons['user_guiname'], this.selectedPersons['user_uuid']]);


        this.numberManager = this.numberManager + 1;
        this.customerArray2.push(this.selectedPersons['user_uuid'])

        if (this.ManDeleteArray.indexOf(this.selectedPersons['user_uuid']) > -1) {
          this.ManDeleteArray.splice(this.ManDeleteArray.indexOf(this.selectedPersons['user_uuid']), 1);
          console.log(this.ManDeleteArray, 'existing manager removed')
        }

        console.log("New Manager added")
        console.log(this.customerArray2)
      }
      console.log(this.selectedPersonsArr, this.previousManagerUuid)

      if (this.selectedPersonsArr == this.previousManagerUuid) {
        console.log(this.selectedPersonsArr, this.previousManagerUuid)
        console.log('save is disabled')
        this.SaveDisable = true
      }
      else {
        this.SaveDisable = false
        console.log('save is enabled')

      }


    }
    this.selectedPersons = null
    //this.item$=null
    //this.loadPeople()
  }

  //PAGINATION

  public config: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 10,
    currentPage: 1,
  }

  public config1: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 10,
    currentPage: 1,
  }

  addgroup() { //ON NEW GROUP ADD
    this.addgroupbutton = true
    console.log("New Group Added")
    this.selectedPersonsArr = []
    this.selectedPersonsArr1 = []
    this.numberMember = 0
    this.numberManager = 0
    this.groupName = 'New Group'
    this.addFlag = 1;
    this.saveUpdate = false;
  }

  mockfunction() { //DUMMY FUNCTION FOR TESTING
    // console.log(this.groupName)
    // console.log(this.previousMemberUuid)
    // for (var i in this.selectedPersonsArr1) {
    //   this.newMemberUuid.push(this.selectedPersonsArr1[i][3])
    // }
    // console.log(this.newMemberUuid)
    // console.log(this.customerArray)
    // console.log(this.customerArray2)

    //     {"Groupname": "Navneet group",
    // "members_toadd":["x_9999"],
    // "supervisors_toadd":["x_2222"],
    // "members_todelete":["x_2222","x_5555"],
    // "supervisors_todelete":["x_9999","x_3333"]
  }


  showdata(grpId: string) { //TO SHOW DATA IN GROUP
    this.saveUpdate = true
    this.SaveDisable = true
    this.groupUuid = grpId;
    const data = this.dataService.getGroupInfo(grpId, this.accessToken);
    this.addgroupbutton = true;
    this.selectedPersonsArr1 = []
    this.selectedPersonsArr = []
    this.previousMemberUuid = []
    this.previousManagerUuid = []
    this.ManDeleteArray = []
    this.MemDeleteArray = []
    this.customerArray = []
    this.customerArray2 = []
    this.term = null;
    this.term2 = null;
    data.subscribe(x => {
      this.selectedPersonsArr1 = []
      this.selectedPersonsArr = []
      this.groupName = x["group_name"];
      this.oldGroupName = x["group_name"];
      console.log(this.groupName)

      var arr1: any = [];
      arr1 = x['members'];

      var arr2: any = [];
      arr2 = x['supervisor'];


      for (var i in arr1) {
        this.selectedPersonsArr1[i] = [arr1[i]['first_name'], arr1[i]['last_name'], arr1[i]['user_guiname'], arr1[i]['user_uuid']];
        this.previousMemberUuid[i] = [arr1[i]['first_name'], arr1[i]['last_name'], arr1[i]['user_guiname'], arr1[i]['user_uuid']];


      }

      console.log(this.selectedPersonsArr1)
      this.numberMember = this.selectedPersonsArr1.length


      for (var i in arr2) {
        this.selectedPersonsArr[i] = [arr2[i]['first_name'], arr2[i]['last_name'], arr2[i]['user_guiname'], arr2[i]['user_uuid']];
        this.previousManagerUuid[i] = [arr2[i]['first_name'], arr2[i]['last_name'], arr2[i]['user_guiname'], arr2[i]['user_uuid']];
      }

      console.log(this.selectedPersonsArr)
      this.numberManager = this.selectedPersonsArr.length


    }
    )
    //this.loadPeople()


    this.addFlag = 2;

  }

  deleteGroup() //DELETE A GROUP
  {
    this.dataService.deleteGroupDb(this.groupUuid, this.tid, this.accessToken)
    this.closeDeleteModal();
    setTimeout(() => { this.getdbdata(); this.addgroupbutton = false; }, 1000);
  }

  private loadPeople() { // TO FETCH DATA MEMBERS AND MANAGERS 

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
    console.log("loadpeople")

  }

}


