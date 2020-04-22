import { Injectable} from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';



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


@Injectable({
  providedIn: 'root'
})


export class DataService{
  
  items:HttpData[]=[];
  constructor(public http: HttpClient) { }
  

  getPeople(term: string = null): Observable<HttpData[]> {
    
    this.getHttpData(term).subscribe(items=>this.items=items);
    return of(this.items).pipe(delay(100));
  }


  
  getHttpData(term: string = null) { //Http Call for users
    
    
  
    if (term) 
    {
      const item = this.http.get<HttpData[]>('http://localhost:8089/FindUser?tid=1&user='+term)
      
      return item
    }

    else 
    {
      return of([]);
    }

  }
 
  getAllGroupsData() //http call for groups
  {
    console.log("get all groups api")
  const data =this.http.get<GroupsData[]>(' http://localhost:8089/Group/AllGroups?tid=2')
  
  return data;

  }

  getGroupInfo(grpID:string)
  {
    console.log("get group info")
    const data=this.http.get<GroupInfo[]>("http://localhost:8089/Group/GetGroupsInfo?group_uuid="+grpID)
  
    return data;

  }

  postHTTPData(data){ //Http Post in DB
    console.log("Posting data to DB")
    return this.http.post('http://localhost:8089/createGroup?tid=2',data).subscribe(res=>this.Success(res),res=>{
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

  postData(Data: string){
    this.postHTTPData(Data);
  }
  

}


