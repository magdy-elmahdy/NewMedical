import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { CollectionService } from 'src/app/services/collection.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pending-portfolio',
  templateUrl: './pending-portfolio.component.html',
  styleUrls: ['./pending-portfolio.component.scss']
})
export class PendingPortfolioComponent {
  isClicked:boolean= false;
  isClicked2:boolean= false;
  loading:boolean= false;
  brokerCustomers:any;
  BrokerIdVal:any ='';
  TotalMony:number = 0;
  AllPortfolio:any;
  PortflioCollections:any;
  
  constructor(private _ToastrService:ToastrService, private _Router:Router
    ,private _AdminService:AdminService,
    private _CollectionService:CollectionService){}


  SearchForm:FormGroup = new FormGroup({
    'code':new FormControl(''),
    'Insured':new FormControl(''),
    'From':new FormControl(''),
    'To':new FormControl(''),
    'Decision':new FormControl('Waiting'),
  })

  selectedFile:any = '';
  uploadPaymnetFile(event: any){
    this.selectedFile = event.target.files[0] ?? null;
    event.target.value=''
  }
  ArrTest:any[]=[];
  getApproveDecision(id:any,target:any){
    let Exist= this.ArrTest.find(item=>item.portfolioId ==id);
    let Model= {
      portfolioId:id,
      isApproved :JSON.parse(target.value)
    }
    console.log(this.ArrTest);
    
    if(Exist==undefined){
      this.ArrTest.push(Model)
    }else{
      let Index = this.ArrTest.indexOf(Exist)
      this.ArrTest.splice(Index,1)
      this.ArrTest.push(Model)
    }
    console.log(this.ArrTest);
  }

    ////////////////////=> Search <=//////////////////
Search(){
  this.loading = true;
    console.log(this.SearchForm.value);
    let Model =Object.assign(this.SearchForm.value,
      {BrokerId:this.BrokerIdVal})
    console.log(Model);
    this._CollectionService.GetAllPortfolio(Model).subscribe(data=>{
      this.loading = false;
      this.AllPortfolio = data;
      console.log(data);
    },error=>{
      console.log(error); 
      this.loading = false;
    })
}

  ///////////////////  Sumbit Portfolios //////////////
SumbitPortfolios(){
  this.isClicked2 = true
  console.log(this.ArrTest);
  this._CollectionService.ApprovePendingPortfolio(this.ArrTest).subscribe(res=>{
    this.isClicked2 = false;
    console.log(res);
    this.Search();
    Swal.fire('Good job!','Portfolio/Portfolios Submitted Successfully','success');
    this._Router.navigate(['/PrintSubbliy']);
    this.ArrTest = [];
  },error=>{
    this.isClicked2 = false;
    console.log(error);
    Swal.fire({icon: 'error',title: 'Oops...',text: error.error,});
  })
  
}
getPortflioCollections(collections:any){
  this.PortflioCollections = collections
  console.log(this.PortflioCollections);
}
//get Broker Customers
getBrokerCustomers(){
  this._AdminService.getAllCustomers(3).subscribe(data=>{
    this.brokerCustomers= data;
  })
}
// Get View Portflio
getViewPortflio(Portflio:any){
  const queryParams: any = {};
    queryParams.myArray = JSON.stringify(Portflio);
    const navigationExtras: NavigationExtras = {
      queryParams
    };
    let newRelativeUrl = this._Router.createUrlTree(['/PortfolioModel'],navigationExtras);
    let baseUrl = window.location.href.replace(this._Router.url, '');
    window.open(baseUrl + newRelativeUrl, '_blank');
}
  ngOnInit() {
    this.getBrokerCustomers()
    this.Search()
  }
}
