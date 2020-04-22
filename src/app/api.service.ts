import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpdata:HttpClient) { }

  getDbData()
  {
    return this.httpdata.get('http://localhost:8089/users/Group?data=1');
  }
}
