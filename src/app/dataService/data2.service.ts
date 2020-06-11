// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class Data2Service {

//   constructor() { }
// }
import { Injectable} from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay} from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment'
import { HttpHeaders } from '@angular/common/http';




export class HttpData
{
 group_uuid:string;
 group_name:string;
 
 
}
export class UsersData
{
  user_uuid: string;
  user_guiname: string;
  first_name : string;
  last_name: string;
  extension: string;
  tenant_id:  number;
 
}
// export class Userinfo
// {
//   userrole:string;
//   MemberOfGroups: {
//     groupname:string;

//   } ;
//   ManagerOfGroups: {
//     groupname:string;

//   } ;
// }


@Injectable({
  providedIn: 'root'
})


export class Data2Service{
  
  items:HttpData[]=[];
  constructor(public http: HttpClient) { }

  getPeople(term: string = null,tid:number): Observable<HttpData[]> {
  
    this.getHttpData(term,tid).subscribe(items=>this.items=items);
    
    return of(this.items).pipe(delay(100));
    
  }


  
  getHttpData(term: string = null,tid:number) { //Http Call
    
 
  
    if (term) 
    {
      var url='http://'+environment.backend_address+'/GetUsersGroup?tid='+tid+'&grp_name='+term
      return this.http.get<HttpData[]>(url)
    }

    else 
    {
      return of([]);
    }

  }
  getUserData(useruuid: string = null) { //Http Call
    
 
      var url='http://'+environment.backend_address+'/UserInfo?user_uuid='+useruuid;
      return this.http.get(url)
    

  }

  // getUsers(tid) { //Http Call for users
    
  //   var url='http://'+environment.backend_address+'/FindUser?tid='+tid+'&user='
  //     const item = this.http.get<UsersData[]>(url)
  //     //console.log(item.subscribe(x=>console.log(x)))
      
  //     return item
    
  // }

  
 


  putHTTPData(data:string,uid){ //Http Post in DB
    console.log("Posting data to DB")
    var url='http://'+environment.backend_address+'/Group/ConfigureUsers?user_uuid='+uid
    return this.http.put(url,data).subscribe(res=>this.Success(res),res=>{
      return this.Error(res);
  });
  }  
  Error(res) {
    console.log("Error is seen"); 
    console.debug(res);
  }
  Success(res) {
  console.log(res);
  console.log("Successfully Posted");
  } 

  // postData(Data: string,uid){
  //   this.postHTTPData(Data,uid);
  // }

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




