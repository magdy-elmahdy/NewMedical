import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
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
  ConfigPost:any = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
  constructor(private _HttpClient:HttpClient){
    if(localStorage.getItem('url')==null){
      this.baseUrl = environment.baseUrl
    }else{
      this.baseUrl = ''
      this.baseUrl = 'https://'+localStorage.getItem('url')
    }
  }

    ///  Get All Collections
  GetAllCollections(data:any){
    let params = new HttpParams()
    params = params.append('Code',data?.Code).append('Insured',data?.Insured)
    .append('BrokerId',data?.BrokerId)
    .append('From',data?.From).append('To',data?.To)
    return this._HttpClient.get(this.baseUrl+'Collections/GetAll' ,{params,
      headers: new HttpHeaders({
          'Authorization': 'Bearer ' +this.t
      }).set("ngrok-skip-browser-warning", "true")
    })
  }
          // Create Portfolio
  CreatePortfolio(Body:any){
    return this._HttpClient.post(this.baseUrl+'Portfolio/CreatePortfolio',Body,this.httpOptions)
  }
          // Sumbit Portfolios
  SumbitPortfolios(Body:any){
    return this._HttpClient.post(this.baseUrl+'Portfolio/SumbitPortfolios',Body,this.httpOptions)
  }
          // Sumbit Portfolios
  ApprovePendingPortfolio(Body:any){
    return this._HttpClient.post(this.baseUrl+'Portfolio/ApprovePortfolio',Body,this.httpOptions)
  }
      // Download Templete Claims File
  getTempleteFile(){
    return this._HttpClient.get(this.baseUrl+'',{observe:'response',
    responseType: 'blob',headers: new HttpHeaders().set("ngrok-skip-browser-warning", "true")})
  }

  GetAllPortfolio(data:any){
    
    let params = new HttpParams()
    params = params.append('code',data?.code).append('Insured',data?.Insured).append('From',data?.From).append('To',data?.To)
    .append('BrokerId',data?.BrokerId).append('Decision',data?.Decision)
    
    return this._HttpClient.get(this.baseUrl+'Portfolio/GetAll',Object.assign(this.httpOptions,{params}))
  }
  ////// Search Tpa Commissions  //////
  GetAllTpaCommissions(data:any){
    let params = new HttpParams()
    params = params.append('PolicyCode',data?.PolicyCode).append('TpaId',data?.TpaId)
                    .append('From',data?.From).append('To',data?.To)
    return this._HttpClient.get(this.baseUrl+'TpaFees/GetAllTpaCommissions' ,Object.assign(this.httpOptions,{params}));
  }
  ////// Search Claims //////
  SearchClaims(data:any){
    return this._HttpClient.post(this.baseUrl+'Claims/SearchClaim',data ,this.httpOptions);
  }
  UpdateClaim(Body:any){
    return this._HttpClient.put(this.baseUrl+'Claims/UpdateClaimCollection',Body ,this.httpOptions)
  }
  GetListInsuredNames(Body:any){
    return this._HttpClient.post(this.baseUrl+'Payment/GetListInsuredNames' ,Body,this.httpOptions)
  }
  AddPayment(body:any){
    return this._HttpClient.post(this.baseUrl+'Payment/AddClaimPayment',body ,this.httpOptions)
  }
  AddTpaCommissionPayment(body:any){
    return this._HttpClient.post(this.baseUrl+'Commissions/TpaCommissionPayment',body ,this.httpOptions)
  }
  GetClaimHistory(id:any){
    return this._HttpClient.get(this.baseUrl+'Claims/GetClaimHistory?claimCode='+id ,this.httpOptions)
  }
  getCollectionPaymentWays(collectionId:any){
    return this._HttpClient.get(this.baseUrl+'Claims/GetCollectionPaymentWays?CollectionId='+collectionId ,this.httpOptions)
  }
  AddPortfolioPayments(Body:any){
    return this._HttpClient.post(this.baseUrl+'Portfolio/PortfolioPayments',Body ,this.httpOptions)
  }
  
  getPortfolioTemplate(portfolioId:any){
    return this._HttpClient.get(this.baseUrl+'Portfolio/PortfolioTemplate?portfolioId='+portfolioId ,this.httpOptions)
  }
  CreateSecretariatWithoutPolicy(body:any){
    return this._HttpClient.post(this.baseUrl+'Secretariat/CreateSecretariatWithoutPolicy',body ,this.httpOptions)
  }
  GetBrokerageCollections(data:any){
    let params = new HttpParams()
    params = params.append('PolicyCode',data?.PolicyCode).append('PortfolioCode',data?.PortfolioCode)
    .append('BrokerId',data?.BrokerId).append('canBePaid',data?.canBePaid)
    .append('From',data?.From).append('To',data?.To)
    return this._HttpClient.get(this.baseUrl+'Collections/GetAllBrokerageCollections',Object.assign(this.httpOptions,{params}))
  }
           // Create Portfolio
  CreateExchangePermit(Body:any){
    return this._HttpClient.post(this.baseUrl+'ExchangePermits/CreateExchangePermit',Body,this.httpOptions)
  }
  // 
  GetCustomersOfPortfolio(portfolioId:any){
    return this._HttpClient.get(this.baseUrl+'Portfolio/GetCustomersOfPortfolio?portfolioId='+portfolioId ,this.httpOptions)
  }

  // get All Exchange Permits
  getAllExchangePermits(){
    return this._HttpClient.get(this.baseUrl+'ExchangePermits/GetAllExchangePermits' ,this.httpOptions)
  }

  
  // Paying Commistions
  GetAllBrokerageCommissions(data:any){
    let params = new HttpParams()
    params = params.append('PolicyCode',data?.PolicyCode).append('PortfolioCode',data?.PortfolioCode)
    .append('BrokerId',data?.BrokerId).append('From',data?.From).append('To',data?.To).append('PermitNumber',data?.PermitNumber)
    return this._HttpClient.get(this.baseUrl+'Commissions/GetAllBrokerageCommissions',{params,
      headers: new HttpHeaders({
          'Authorization': 'Bearer ' +this.t
      }).set("ngrok-skip-browser-warning", "true")
    })
  }

  BrokerageCommissionPayment(body:any){
    return this._HttpClient.post(this.baseUrl+'Commissions/BrokerageCommissionPayment',body ,this.httpOptions)
  }
}
