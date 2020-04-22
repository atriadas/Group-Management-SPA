
import { Component, OnInit, ViewChild, Pipe, PipeTransform } from '@angular/core';
import { catchError, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { concat, Observable, of, Subject, interval, Subscription, from } from 'rxjs';
import { DataService, HttpData } from './data.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { PaginationInstance } from 'ngx-pagination/dist/ngx-pagination.module';
import { CustomerList } from './models/customerList-model'
import { ApiService } from './api.service';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {

  progressbarValue = 100;
  item$: Observable<HttpData[]>;
  peopleLoading = false;
  peopleInput$ = new Subject<string>();
  groupName: string = 'New Group';
  numberMember: number = 0;
  numberManager: number = 0;
  //customer: CustomerList
  customerArray: string[] = []
  customerArray2: string[] = []
  // customerArray: CustomerList[] = []
  // customerArray2: CustomerList[] = []
  map = new Map<string, CustomerList>();
  addFlag: number = 1;
  noGroupFlag: number = 0;
  isOn: boolean = false
  selectedPersons: string; //manager
  selectedPersons1: string; // members
  selectedPersonsArr: any;
  selectedPersonsArr1: any;
  term: string = null;
  term2: string = null;
  term3: string = null;
  dataArray: any = [];
  added: boolean = false;
  // postGroup:PostGroupData;


  constructor(private dataService: DataService, private api: ApiService) {

    this.selectedPersonsArr1 = ['poka']
    this.selectedPersonsArr = ['lala']

  }


  @ViewChild("elem", { static: false }) select1Comp: NgSelectComponent;
  @ViewChild("eleme2", { static: false }) select1Comp2: NgSelectComponent;




  ngOnInit() {

    this.loadPeople();

  }


  loaderOpen: boolean = false;
  alert1Open: boolean = false;
  exampleModalOpen = false;
  exampleModal1Open = false;

  NewGroup() {
    this.isOn = false
    this.noGroupFlag = 1
  }

  DelOpen() {
    this.exampleModalOpen = true
  }
  closeDeleteModal() {
    this.exampleModalOpen = false
  }
  CanOpen() {
    this.exampleModal1Open = true
  }
  closeCanModal() {
    this.exampleModal1Open = false
  }

  getdbdata() {
    this.dataArray = [];
    //this.dataService.getPeople('at')
    this.dataService.getAllGroupsData()
      .subscribe(x => {
        if (x!= null) {
         
          
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
        }

        console.log(this.dataArray);

      })

  }
  startTimer(seconds: number) {
    this.isOn = false;
    this.loaderOpen = true

    const timer$ = interval(20);

    const sub = timer$.subscribe((sec) => {
      this.progressbarValue = 100 - sec * 100 / seconds;
      if (this.progressbarValue == 0) {
        this.loaderOpen = false
        this.alert1Open = true
        console.log(this.groupName)
        setTimeout(() => { this.alert1Open = false }, 2000);
        //this.addToarrayList()
        var postGroup2: any = {}
        postGroup2['Groupname'] = this.groupName
        postGroup2['Manager_uuid'] = this.customerArray2
        postGroup2['Members_uuid'] = this.customerArray
        this.dataService.postData(JSON.stringify(postGroup2))
        this.getdbdata();
        sub.unsubscribe();
      }
    });

  }


  OnAdd() {  //When Item is added in members

    if (this.selectedPersonsArr1.indexOf([this.selectedPersons1['first_name'], this.selectedPersons1['last_name'], this.selectedPersons1['user_guiname']]) === -1) {


      if (this.selectedPersons1 != null) {
        // this.customerArray = []
        console.log(this.selectedPersons1)
        console.log("item added in members");

        this.selectedPersonsArr1[this.numberMember] = ([this.selectedPersons1['first_name'], this.selectedPersons1['last_name'], this.selectedPersons1['user_guiname']]);
        console.log(this.selectedPersonsArr1);
        console.log(this.selectedPersons1);
        this.numberMember = this.numberMember + 1;
        this.customerArray.push(this.selectedPersons1['user_uuid'])
        console.log("New data added")



        console.log(this.customerArray)

        // this.customer = new CustomerList(this.customerArray,this.customerArray2)
        // this.customer.memberLength=this.numberMember;
        // console.log(this.customer)

      }
    }
  }

  removeFromList(item, flag) { //When Item is removed in members

    if (flag == 0) {
      var i = this.selectedPersonsArr1.indexOf(item);
      this.selectedPersonsArr1.splice(i, 1);
      this.numberMember = this.numberMember - 1;
    }
    else if (flag == 1) {
      var i = this.selectedPersonsArr.indexOf(item);
      this.selectedPersonsArr.splice(i, 1);
      this.numberManager = this.numberManager - 1;
    }

  }




  OnAdd1()  //When Item is added in managers
  {
    if (this.selectedPersons != null) {
      console.log("item added in managers");

      this.selectedPersonsArr[this.numberManager] = ([this.selectedPersons['first_name'], this.selectedPersons['last_name'], this.selectedPersons['user_guiname']]);
      console.log(this.selectedPersonsArr);
      console.log(this.selectedPersons);
      this.numberManager = this.numberManager + 1;
      // this.customerArray2.push(this.selectedPersonsArr)
      console.log("New Manager added")
      this.customerArray2.push(this.selectedPersons['user_uuid'])
      // this.postGroup.Manager_uuid.push(this.selectedPersonsArr[3])
      console.log(this.customerArray)

      // this.customer.arr2 = this.customerArray2;
      // this.customer.managerLength=this.numberManager;
      // console.log(this.customer)

    }
  }

  removeFromList1(i) { //When Item is removed in managers

    this.selectedPersonsArr.splice(i, 1);
    this.numberManager = this.numberManager - 1;
  }


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

  // addToarrayList(){
  //   this.customer = new CustomerList(this.customerArray,this.customerArray2)
  //   this.customer.memberLength=this.numberMember;
  //   this.customer.managerLength = this.numberManager;
  //   console.log(this.customer)
  //   this.map.set(this.groupName,this.customer)
  //   console.log(this.map)
  //   //this.groupName = ''
  //   this.customerArray = []
  //   this.customerArray2 = []
  //   this.addFlag=2;

  // }

  getKeys(map) {
    return Array.from(map.keys());
  }


  addgroup() {
    this.selectedPersonsArr = []
    this.selectedPersonsArr1 = []
    this.numberMember = 0
    this.numberManager = 0
    this.groupName = 'New Group'
    this.addFlag = 1;
    console.log(this.dataArray);

  }

  mockfunction() {
    this.dataService.getGroupInfo();
  }


  showdata(grpId: string) {
    const data = this.dataService.getGroupInfo();

    this.selectedPersonsArr1 = []
    this.selectedPersonsArr = []
    this.groupName = data["group_name"];

    // this.customer = this.map.get(grpname)
    // this.customerArray= this.customer.arr
    // this.customerArray2 = this.customer.arr2

    for (var i in data['members']) {
      this.selectedPersonsArr1.push([i['first_name'], i['last_name'], i['user_guiname']]);
    }
    for (var i in data['supervisor']) {
      this.selectedPersonsArr.push([i['first_name'], i['last_name'], i['user_guiname']]);
    }
    this.numberManager = this.selectedPersonsArr.length
    this.numberMember = this.selectedPersonsArr1.length
    this.addFlag = 2;
  }

  private loadPeople() {

    this.item$ = concat(
      this.peopleInput$.pipe(
        distinctUntilChanged(),
        tap(() => this.peopleLoading = true),
        switchMap(term => this.dataService.getPeople(term).pipe(
          catchError(() => of([])), // empty list on error
          tap(() => this.peopleLoading = false)
        ))
      )
    )
    console.log("loadpeople")

  }

}

