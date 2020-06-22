// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class Data2Service {

//   constructor() { }
// }
import { Injectable} from '@angular/core';
import { Observable, of , Subject, throwError } from 'rxjs';
import { delay, catchError } from 'rxjs/operators';
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

  getPeople(term: string = null,tid:number,auth_token): Observable<HttpData[]> {
  
    this.getHttpData(term,tid,auth_token).subscribe(items=>this.items=items);
    
    return of(this.items).pipe(delay(100));
    
  }


  
  getHttpData(term: string = null,tid:number,auth_token:string) { //Http Call
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +auth_token
    })
    
 
  
    if (term) 
    {
      var url='http://'+environment.backend_address+'/GetUsersGroup?tid='+tid+'&grp_name='+term
      return this.http.get<HttpData[]>(url,{ headers: headers })
    }

    else 
    {
      return of([]);
    }

  }
  getUserData(useruuid: string = null ,auth_token) { //Http Call 
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Authorization': 'Bearer ' +auth_token
    // })
    
 
      var url='http://'+environment.backend_address+'/UserInfo?user_uuid='+useruuid;
      return this.http.get(url) //,{ headers: headers }
    

  }

  // getUsers(tid) { //Http Call for users
    
  //   var url='http://'+environment.backend_address+'/FindUser?tid='+tid+'&user='
  //     const item = this.http.get<UsersData[]>(url)
  //     //console.log(item.subscribe(x=>console.log(x)))
      
  //     return item
    
  // }

  
 


  putHTTPData(data:string,uid,auth_token){ //Http Post in DB //SHOWS ERROR EVEN ON SUCCESS
    console.log("Posting data to DB")
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +auth_token
    })
    var url='http://'+environment.backend_address+'/Group/ConfigureUsers?user_uuid='+uid
     return this.http.put(url,data, { headers: headers });

    // return this.http.put(url,data).pipe(
    //   catchError(err => {
    //     console.log('err', err);
    //     return throwError('error',err);
    //   }),s
      
    // )
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

//  export class MessageService {
//     private subject = new Subject<any>();

//     sendMessage(message: string) {
//         this.subject.next({ text: message });
//     }

//     clearMessages() {
//         this.subject.next();
//     }

//     getMessage(): Observable<any> {
//         return this.subject.asObservable();
//     }
// }
  






