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
    return this._HttpClient.post(this.baseUrl+'PricingTool/AddNewNetwork',Model,this.httpOptions)
  }
  GetAllNetwork(){
    return this._HttpClient.get(this.baseUrl+'PricingTool/GetAllNetworks',this.httpOptions)
  }
  GetNetworkById(id:any){
    return this._HttpClient.get(this.baseUrl+'PricingTool/GetNetworkById?id='+id,this.httpOptions)
  }
  EditNetwork(Body:any){
    return this._HttpClient.put(this.baseUrl+'PricingTool/UpdateNetwork',Body)
  }
  DeleteNetwork(id:any){
    return this._HttpClient.delete(this.baseUrl+'PricingTool/DeleteNetwork?id='+id)
  }
   // All  Category
   AddCategory(Model:any){ 
    return this._HttpClient.post(this.baseUrl+'PricingTool/AddCategory',Model,this.httpOptions)
  }
  AddBenfitToCategory(BenfitId:any,CategoryId:any){
    const Model={
      benfitId:BenfitId,
      categoryId:CategoryId
    }
    return this._HttpClient.post(this.baseUrl+'PricingTool/AddBenfitToCategory',Model,this.httpOptions)

  }
  GetAllCategories(){
    return this._HttpClient.get(this.baseUrl+'PricingTool/GetAllCategories',this.httpOptions)
  }
  GetAllCategoriesBenfits(id:any){
    return this._HttpClient.get(this.baseUrl+'PricingTool/GetAllCategoryBenfits?categoryid='+id,this.httpOptions)
  }
  GetCategoryById(id:any){
    return this._HttpClient.get(this.baseUrl+'PricingTool/GetCategoryById?id='+id,this.httpOptions)
  }
  // EditCategory(Body:any){
  //   return this._HttpClient.put(this.baseUrl+'Benfit/EditCategory',Body)
  // }
  EditCategory(Body:any){
    return this._HttpClient.put(this.baseUrl+'PricingTool/EditCategoryWithBenfit',Body)
  }
  DeleteCategory(id:any){
    return this._HttpClient.delete(this.baseUrl+'PricingTool/DeleteCategory?id='+id)
  }
  //All Benfites
  GetAllBenfits(){
    return this._HttpClient.get(this.baseUrl+'PricingTool/GetAllBenfits',this.httpOptions)
  }
  AddBenfit(Model:any){ 
    return this._HttpClient.post(this.baseUrl+'PricingTool/AddBenfit',Model,this.httpOptions)
  }
  GetBenfiteById(id:any){
    return this._HttpClient.get(this.baseUrl+'PricingTool/GetBenfitById?id='+id,this.httpOptions)
  }
  EditBenfit(Body:any){
    return this._HttpClient.put(this.baseUrl+'PricingTool/EditBenfit',Body)
  }
  DeleteBenfit(id:any){
    return this._HttpClient.delete(this.baseUrl+'PricingTool/DeleteBenfit?id='+id)
  }
  // All Age Band
  
  GetAllAgeBands(){
    return this._HttpClient.get(this.baseUrl+'PricingTool/GetAllAgeBands',this.httpOptions)
  }
   AddAgeBand(Model:any){ 
    return this._HttpClient.post(this.baseUrl+'PricingTool/AddAgeBand',Model,this.httpOptions)
  }
  GetAgeBandById(id:any){
    return this._HttpClient.get(this.baseUrl+'PricingTool/GetAgeBandById?id='+id,this.httpOptions)
  }
  EditAgeBand(Body:any){
    return this._HttpClient.put(this.baseUrl+'PricingTool/EditAgeBand',Body)
  }
  DeleteAgeBand(id:any){
    return this._HttpClient.delete(this.baseUrl+'PricingTool/DeleteAgeBand?id='+id)
  }
  // Pricing
  GetAllPricing(){
    return this._HttpClient.get(this.baseUrl+'PricingTool/GetAllPricing',this.httpOptions)
  }
 AddBenfitPricing(Model:any){ 
  return this._HttpClient.post(this.baseUrl+'PricingTool/AddBenfitPricing',Model,this.httpOptions)
 }
 EditBenfitPricing(Model:any){
  return this._HttpClient.put(this.baseUrl+'PricingTool/UpdatePricing',Model)
 }
 deletpricing(id:any){
  return this._HttpClient.delete(this.baseUrl+'PricingTool/DeletePricing?id='+id)

 }
 // Plans
 getAllPlans(){
  return this._HttpClient.get(this.baseUrl+'PricingTool/GetAllPlans',this.httpOptions)
 }
 AddNewPlan(Model:any){
  return this._HttpClient.post(this.baseUrl+'PricingTool/AddNewPlan',Model,this.httpOptions)
 }
 EditPlan(Model:any){
  return this._HttpClient.put(this.baseUrl+'PricingTool/UpdatePlan',Model)
 }
 deletplan(id:any){
  return this._HttpClient.delete(this.baseUrl+'PricingTool/DeletePlan?id='+id)

 }



   
    
   
  
    ///  Get Benfit Types By Id
    GetAllBenfitTypes(id:any){
      return this._HttpClient.get(this.baseUrl+'PricingTool/GetAllBenfitTypes?benfitId='+id,this.httpOptions)
    }
    ///  Get Coverage Types
    GetCoverageTypes(){
      return this._HttpClient.get(this.baseUrl+'Lists/GetCoverageTypes',this.httpOptions)
    }
    
    



   /////////////////////////////// Offer ////////////////////
   AddNewOffer(Model:any){
    return this._HttpClient.post(this.baseUrl+'PricingTool/AddNewOffer',Model,this.httpOptions)
   }
  AddPlansToOffer(Model:any){
    return this._HttpClient.post(this.baseUrl+'PricingTool/AddPlansToOffer',Model ,this.httpOptions)
  }

        // Upload Group File
  AddEmployeesGroupFile(FormData:any){
    return this._HttpClient.post(this.baseUrl+'PricingTool/AddEmployeesGroupFile',FormData,{responseType: 'text',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' +this.t
      }).set("ngrok-skip-browser-warning", "true")
  })
  }

  UpdateOfferWithLossRatio(Body:any,offerId:any){
    return this._HttpClient.put(this.baseUrl+'PricingTool/UpdateOfferWithLossRatio?offerId='+offerId+
      '&lossRatio='+Body.lossRatio+'&targetLossRatio='+Body.targetLossRatio,Body)
  }
  /// 
  GetOfferCalculationById(OfferId:any, Taxes:any){
    return this._HttpClient.get(this.baseUrl+'PricingTool/GetOfferCalculationById?offerId='+OfferId+'&taxes='+Taxes,this.httpOptions)
  }

}
