import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ThisReceiver } from '@angular/compiler';



@Injectable({
  providedIn: 'root'
})
export class PricingToolService {
  url:any = localStorage.getItem('url')
  baseUrl:any
  
          t:any = localStorage.getItem("MedicalToken");
          httpOptions:any = {
              headers: new HttpHeaders({
                'Authorization': 'Bearer ' +this.t
              }).set("ngrok-skip-browser-warning", "true")
          };
  configGet:any ={headers: new HttpHeaders().set("ngrok-skip-browser-warning", "true")}
  ConfigPost:any = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
  constructor(private _HttpClient:HttpClient){
    if(localStorage.getItem('url')==null){
      this.baseUrl = environment.baseUrl
    }else{
      this.baseUrl = ''
      this.baseUrl = 'https://'+localStorage.getItem('url')
    }
  }
   // All Network
   AddNetwork(Model:any){ 
    return this._HttpClient.post(this.baseUrl+'Benfit/AddNewNetwork',Model,this.httpOptions)
  }
  GetAllNetwork(){
    return this._HttpClient.get(this.baseUrl+'Benfit/GetAllNetworks',this.httpOptions)
  }
  GetNetworkById(id:any){
    return this._HttpClient.get(this.baseUrl+'Benfit/GetNetworkById?id='+id,this.httpOptions)
  }
  EditNetwork(Body:any){
    return this._HttpClient.put(this.baseUrl+'Benfit/UpdateNetwork',Body)
  }
  DeleteNetwork(id:any){
    return this._HttpClient.delete(this.baseUrl+'Benfit/DeleteNetwork?id='+id)
  }
   // All  Category
   AddCategory(Model:any){ 
    return this._HttpClient.post(this.baseUrl+'Benfit/AddCategory',Model,this.httpOptions)
  }
  GetAllCategories(){
    return this._HttpClient.get(this.baseUrl+'Benfit/GetAllCategories',this.httpOptions)
  }
  GetAllCategoriesBenfits(id:any){
    return this._HttpClient.get(this.baseUrl+'Benfit/GetAllCategoryBenfits?categoryid='+id,this.httpOptions)
  }
  GetCategoryById(id:any){
    return this._HttpClient.get(this.baseUrl+'Benfit/GetCategoryById?id='+id,this.httpOptions)
  }
  // EditCategory(Body:any){
  //   return this._HttpClient.put(this.baseUrl+'Benfit/EditCategory',Body)
  // }
  EditCategory(Body:any){
    return this._HttpClient.put(this.baseUrl+'Benfit/EditCategoryWithBenfit',Body)
  }
  DeleteCategory(id:any){
    return this._HttpClient.delete(this.baseUrl+'Benfit/DeleteCategory?id='+id)
  }
  //All Benfites
  GetAllBenfits(){
    return this._HttpClient.get(this.baseUrl+'Benfit/GetAllBenfits',this.httpOptions)
  }
  AddBenfit(Model:any){ 
    return this._HttpClient.post(this.baseUrl+'Benfit/AddBenfit',Model,this.httpOptions)
  }
  GetBenfiteById(id:any){
    return this._HttpClient.get(this.baseUrl+'Benfit/GetBenfitById?id='+id,this.httpOptions)
  }
  EditBenfit(Body:any){
    return this._HttpClient.put(this.baseUrl+'Benfit/EditBenfit',Body)
  }
  DeleteBenfit(id:any){
    return this._HttpClient.delete(this.baseUrl+'Benfit/DeleteBenfit?id='+id)
  }
  // All Age Band
  
  GetAllAgeBands(){
    return this._HttpClient.get(this.baseUrl+'Benfit/GetAllAgeBands',this.httpOptions)
  }
   AddAgeBand(Model:any){ 
    return this._HttpClient.post(this.baseUrl+'Benfit/AddAgeBand',Model,this.httpOptions)
  }
  GetAgeBandById(id:any){
    return this._HttpClient.get(this.baseUrl+'Benfit/GetAgeBandById?id='+id,this.httpOptions)
  }
  EditAgeBand(Body:any){
    return this._HttpClient.put(this.baseUrl+'Benfit/EditAgeBand',Body)
  }
  DeleteAgeBand(id:any){
    return this._HttpClient.delete(this.baseUrl+'Benfit/DeleteAgeBand?id='+id)
  }
  // Pricing
  GetAllPricing(){
    return this._HttpClient.get(this.baseUrl+'Benfit/GetAllPricing',this.httpOptions)
  }
 AddBenfitPricing(Model:any){ 
  return this._HttpClient.post(this.baseUrl+'Benfit/AddBenfitPricing',Model,this.httpOptions)
 }
 EditBenfitPricing(Model:any){
  return this._HttpClient.put(this.baseUrl+'Benfit/UpdatePricing',Model)
 }
 deletpricing(id:any){
  return this._HttpClient.delete(this.baseUrl+'Benfit/DeletePricing?id='+id)

 }
 // Plans
 getAllPlans(){
  return this._HttpClient.get(this.baseUrl+'Benfit/GetAllPlans',this.httpOptions)
 }
 AddNewPlan(Model:any){
  return this._HttpClient.post(this.baseUrl+'Benfit/AddNewPlan',Model,this.httpOptions)
 }
 EditPlan(Model:any){
  return this._HttpClient.put(this.baseUrl+'Benfit/UpdatePlan',Model)
 }
 deletplan(id:any){
  return this._HttpClient.delete(this.baseUrl+'Benfit/DeletePlan?id='+id)

 }



   
    
   
    
    ///  Get Benfit Types By Id
    GetAllBenfitTypes(id:any){
      return this._HttpClient.get(this.baseUrl+'Benfit/GetAllBenfitTypes?benfitId='+id,this.httpOptions)
    }
    
   

}
