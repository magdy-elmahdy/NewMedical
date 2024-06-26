import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClaimsService {
  // baseUrl="http://97.74.82.75:1213/api/"
  // baseUrl="https://fa10-197-36-86-72.ngrok-free.app/api/"
  baseUrl:any
  t:any = localStorage.getItem("MedicalToken");
  httpOptions:any = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' +this.t
      }).set("ngrok-skip-browser-warning", "true")
  };
  configGet:any ={headers: new HttpHeaders().set("ngrok-skip-browser-warning", "true")}
  ConfigPost:any = { headers: new HttpHeaders().set('Content-Type', 'application/json')};
  constructor(private _HttpClient:HttpClient) {
    if(localStorage.getItem('url')==null){
      this.baseUrl = environment.baseUrl
    }else{
      this.baseUrl = ''
      this.baseUrl = 'https://'+localStorage.getItem('url')
    }
   }

      // Download Templete Claims File
  getClaimsTempleteFile(){
    return this._HttpClient.get(this.baseUrl+'FileClaims/DownloadClaimsFile',{observe:'response',
    responseType: 'blob',headers: new HttpHeaders().set("ngrok-skip-browser-warning", "true")})
  }


          // Add Claim
  AddClaim(FormData:any){
    return this._HttpClient.post(this.baseUrl+'Claims/GetFileClaim',FormData,this.httpOptions)
  }

  GetAllFileData(id:any){ 
    return this._HttpClient.get(this.baseUrl+'FileClaims/GetAllFileData?ExcelfileId='+id,this.httpOptions)
  }
  UpdateSatus(formData:any){
    return this._HttpClient.post(this.baseUrl+'FileClaims/SaveClaimAndFileClaim',formData,
      {headers: new HttpHeaders({
        'Authorization': 'Bearer ' +this.t
      }).set("ngrok-skip-browser-warning", "true")}
    )
  }
}
