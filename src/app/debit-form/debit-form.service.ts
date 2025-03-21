import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class DebitFormService {
  private url="http://localhost/eSafe-gasoline_station/src/assets/api/";
  constructor(private http:HttpClient) { }
  getAllClients(isClient){
    console.log(isClient)
    return this.http.post(this.url +"person/getAllPerson",{'isClient':isClient});
  }
  addInvoice(data){
    return this.http.post(this.url +"operation/addInvoice",data);
  }
  sellWashServOnDebit(data){
    return this.http.post(this.url +"operation/sellWashServiceOnDebit",data);
  }
  sellFuelOnDebit(data){
    return this.http.post(this.url +"operation/sellFuelOnDebit",data);
  }
  addPerson(data){
    return this.http.post(this.url +"person/addPerson",data);
  }
  searchClient(data){
    return this.http.get("http://localhost/eSafe-gasoline_station/src/assets/api/person/searchClientName", {params:{keyword:data}});
  }
}
