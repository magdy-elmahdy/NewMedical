import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { CollectionService } from 'src/app/services/collection.service';
declare var $:any

@Component({
  selector: 'app-print-subbliy',
  templateUrl: './print-subbliy.component.html',
  styleUrls: ['./print-subbliy.component.scss']
})
export class PrintSubbliyComponent {
  page:number=1;
  count:number=0;
  tableSize:number=15;
  tableSizes=[15,10,5];
  isClicked:boolean= false
  brokerCustomers:any
  PortflioCollections:any
  SubbliyDetals:any
  BrokerIdVal:any =''
  TotalMony:number = 0
  loading:boolean = false
  DonePortfolios:any;
  ExchangePermits:any;
  AllPolices:any=[
    {a:"1",b:"Ahmed",c:"Amr",d:"0",e:"6000",f:"6500",g:"400",h:"12-11-2023"},
    {a:"2",b:"Hany",c:"Ali",d:"0",e:"6200",f:"6500",g:"600",h:"13-11-2023"},
    {a:"3",b:"Ahman",c:"Mohamed",d:"0",e:"900",f:"900",g:"1500",h:"5-11-2024"},
    {a:"4",b:"Ramy",c:"Magdy",d:"0",e:"6000",f:"800",g:"300",h:"19-11-2023"}
  ]
  constructor(private _CollectionService:CollectionService, private _ToastrService:ToastrService, private _Router:Router, private _AdminService:AdminService){}

  SearchForm:FormGroup = new FormGroup({
    'code':new FormControl(''),
    'Insured':new FormControl(''),
    'From':new FormControl(''),
    'To':new FormControl(''),
    'Decision':new FormControl('done'),
  })

  selectedFile:any = ''
  uploadPaymnetFile(event: any){
    this.selectedFile = event.target.files[0] ?? null;
    event.target.value=''
  }
  getSubbliyDetails(item:any){
    $("#PolicyDetails").show(500) //
    console.log(item);
    this.SubbliyDetals = item
  }

    // Search
Search(){
  $("#SearchResults").show(500) //
  this.loading = true;
    console.log(this.SearchForm.value);
    let Model =Object.assign(this.SearchForm.value,
      {BrokerId:this.BrokerIdVal})
    console.log(Model);
    this._CollectionService.GetAllPortfolio(Model).subscribe(data=>{
      this.loading = false;
      this.DonePortfolios = data;
      console.log(data);
    },error=>{
      console.log(error);
      this.loading = false;
    })
}
GetApprovedPortfolios(){
  this.loading = true;
  this._CollectionService.GetAllPortfolio(this.SearchForm.value).subscribe((data:any)=>{
    this.loading = false;
    this.DonePortfolios= data;
    console.log(this.DonePortfolios);

  },error=>{
    this.loading = false;
    console.log(error);
    
  })
}
getPortflioCollections(collections:any){
  this.PortflioCollections = collections
}
PrintPermit(id:any){
  // window.open('http://localhost:4200/#/BrokerageModel/'+id,'_blank')
  window.open('http://97.74.82.75:3375/#/BrokerageModel/'+id,'_blank')
}
getExchangePermits(Permits:any){
  console.log(Permits);
  this.ExchangePermits = Permits;
}
        //Pagination Methods
  onTableDataChange(event:any){
    this.page=event;
    this.Search();
  }
  onTableSizeChange(event:any){
    this.tableSize=event.target.value;
    this.page=1;
    this.Search();
  }

  ngOnInit(){
    this.Search();
  }

}
