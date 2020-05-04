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
import { HttpClient } from '@angular/common/http';


export class HttpData
{
 groupname:string;
 
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
      return this.http.get<HttpData[]>(`http://localhost:8089/GetUsersGroup?tid=${tid}&grp_name=${term}`)
    }

    else 
    {
      return of([]);
    }

  }

  getUsers(tid) { //Http Call for users
    
      const item = this.http.get<UsersData[]>('http://localhost:8089/FindUser?tid='+tid+'&user=')
      //console.log(item.subscribe(x=>console.log(x)))
      
      return item
    
  }

  
 


  postHTTPData(data,uid){ //Http Post in DB
    console.log("Posting data to DB")
    return this.http.post('http://localhost:8089/Group/ConfigureUsers?uid='+uid,data).subscribe(res=>this.Success(res),res=>{
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

  postData(Data: string,uid){
    this.postHTTPData(Data,uid);
  }
  

}


