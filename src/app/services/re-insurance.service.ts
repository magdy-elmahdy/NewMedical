import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { text } from '@fortawesome/fontawesome-svg-core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReInsuranceService {

  baseUrl:any
  token:any = localStorage.getItem("MedicalToken");
      httpOptions:any = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' +this.token
          }).set("ngrok-skip-browser-warning", "true")
  };
  
  constructor(private _HttpClient:HttpClient) {
    if(localStorage.getItem('url')==null){
      this.baseUrl = environment.baseUrl
    }else{
      this.baseUrl = ''
      this.baseUrl = 'https://'+localStorage.getItem('url')
    }
   }

  AddNewReInsuranceCompany(Model:any){
    return this._HttpClient.post(this.baseUrl+'ReInsuranceModels/AddNewReInsurance',Model,this.httpOptions)
  }
  GetAllReInsurance(type:any){
    return this._HttpClient.get(this.baseUrl+'ReInsuranceModels/GetAllReInsurance?type='+type,this.httpOptions)
  }

  GetAllAgencies(){
    return this._HttpClient.get(this.baseUrl+'ReInsuranceModels/GetAllAgencies',this.httpOptions)
  }
  AddTreatySetUP(Model:any){
    return this._HttpClient.post(this.baseUrl+'ReInsuranceTreatySetUp/AddTreatySetUP',Model,this.httpOptions)
  }
}
