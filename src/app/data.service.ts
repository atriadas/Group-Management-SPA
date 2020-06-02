import { Injectable} from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, catchError} from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment'



export class HttpData
{
  user_uuid: string;
  user_guiname: string;
  first_name : string;
  last_name: string;
  extension: string;
  tenant_id:  number;
 
}
export class GroupsData{
  group_name: string;
  group_uuid: string;
}

export class GroupInfo{
  group_name: string;
    group_uuid: string;
    members:{
      user_uuid: string;
      user_guiname: string;
      first_name : string;
      last_name: string;
      extension: string;
      tenant_id:  number;
     
    };
    supervisor:{
      user_uuid: string;
      user_guiname: string;
      first_name : string;
      last_name: string;
      extension: string;
      tenant_id:  number;
     
    };
}

export class Update{
  Groupname: string
  members_toadd: string[]=[]
  supervisors_toadd: string[]=[]
  members_todelete: string[]=[]
  supervisors_todelete: string[]=[]

  constructor(Groupname,members_toadd,supervisors_toadd,members_todelete,supervisors_todelete){
    this.Groupname = Groupname;
    this.members_toadd=members_toadd;
    this.supervisors_toadd=supervisors_toadd;
    this.members_todelete=members_todelete;
    this.supervisors_todelete=supervisors_todelete;
  }
}


@Injectable({
  providedIn: 'root'
})


export class DataService{
  
  items:HttpData[]=[];
  constructor(public http: HttpClient) { }
  

  getPeople(term: string = null,tid): Observable<HttpData[]> {
    
    this.getHttpData(term,tid).subscribe(items=>this.items=items);
    return of(this.items).pipe(delay(100));
  }


  
  getHttpData(term: string = null,tid) { //Http Call for users
    
    
  
    if (term) 
    {
      var url='http://'+environment.backend_address+'/FindUser?tid='+tid+'&user='+term
      const item = this.http.get<HttpData[]>(url)
      
      return item
    }

    else 
    {
      return of([]);
    }

  }
 
  getAllGroupsData(tid) //http call for groups
  {
    console.log("get all groups api")
    var url='http://'+environment.backend_address+'/Group/AllGroups?tid='+tid
  const data =this.http.get<GroupsData[]>(url)
  
  return data;

  }

  getGroupInfo(grpID:string)
  {
    console.log("get group info")
    var url='http://'+environment.backend_address+'/Group/GetGroupsInfo?group_uuid='+grpID
    const data=this.http.get<GroupInfo[]>(url)
  
    return data;

  }

  postHTTPData(data,tid){ //Http Post in DB
    console.log("Posting data to DB")
    var url='http://'+environment.backend_address+'/createGroup?tid='+tid
    return this.http.post(url,data).subscribe(res=>this.Success(res),res=>{
      return this.Error(res);
  });
  }  
  Error(res) {
    console.log("Error is seen"); 
    console.debug(res);
  }
  Success(res) {
  
  console.log("Successfully Posted");
  } 

  postData(Data: string,tid){
    this.postHTTPData(Data,tid);
  }


  postUpdatedData(data:string,grpID:string){ //Http Post in DB
    var errorMessage;
      var successMessage;
      console.log(data)
      console.log(grpID)
    console.log("Updating data in the DB")
    var url='http://'+environment.backend_address+'/Group/UpdateGroup?grp_id='+grpID

    return this.http.put(url,data)
    .subscribe(
      (response) => {                           //Next callback
       // console.log('Success:200 OK')
        successMessage=response
        console.log(successMessage)
      },
      (error) => {                              //Error callback
       // console.error('error caughtMissing query param: 400 Bad Request  {"ErrorCode":2,"ErrorLog":"Group uuid is missing"} in component')
        errorMessage = error;
        console.error(errorMessage)
      }
    )
  }  
  
  deleteGroupDb(grpID:string)
  { 
     var errorMessage;
      var successMessage;
    console.log("Group Deleted"+ grpID)
    var url='http://'+environment.backend_address+'/Group/DeleteGroup?group_uuid='+ grpID
   return this.http.delete(url)
   .subscribe(
    (response) => {                           //Next callback
     // console.log('Success:200 OK')
      successMessage=response
      console.log(successMessage)
    },
    (error) => {                              //Error callback
     // console.error('error caughtMissing query param: 400 Bad Request  {"ErrorCode":2,"ErrorLog":"Group uuid is missing"} in component')
      errorMessage = error;
      console.error(errorMessage)
    }
  )
   };  

   getLoggedInUser(auth_token) {
    var errorMessage;
    var successMessage;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +auth_token
    })
    var res=this.http.get('https://authentication.us.dev.api.mitel.io/2017-09-01/token', { headers: headers })
    //res.subscribe(x=>console.log(x)) 
    console.log(res)
    res.subscribe(
      (response) => {                           //Next callback
       // console.log('Success:200 OK')
        successMessage=response
        console.log(successMessage)
      },
      (error : HttpErrorResponse) => {                              //Error callback
       // console.error('error caughtMissing query param: 400 Bad Request  {"ErrorCode":2,"ErrorLog":"Group uuid is missing"} in component')
        errorMessage = error.error['message'];
        console.log('Error thrown -> token:',errorMessage)
      }
    )
    return res
  
  } 
  

}

