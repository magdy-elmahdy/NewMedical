import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { CollectionService } from 'src/app/services/collection.service';
import Swal from 'sweetalert2';
declare var $:any
@Component({
  selector: 'app-collection-user',
  templateUrl: './collection-user.component.html',
  styleUrls: ['./collection-user.component.scss'],
  providers:[DatePipe]
})
export class CollectionUserComponent implements OnInit{

  isClicked:boolean= false;
  brokerCustomers:any;
  TestArr:any[]=[];
  loading:boolean =false;
  BrokerIdVal:any ='';
  TotalMony:number = 0;
  AllCollections:any;
  constructor(private _ToastrService:ToastrService, private _Router:Router,
     private _AdminService:AdminService,private _CollectionService:CollectionService,private _DatePipe:DatePipe){}
 
    SearchForm:FormGroup = new FormGroup({
      'Code':new FormControl(''),
      'Insured':new FormControl(''),
      'From':new FormControl(''),
      'To':new FormControl('')
    })

      // Search
  Search(){
    this.isClicked = true;
    console.log(this.SearchForm.value);
    let Model =Object.assign(this.SearchForm.value,
      {BrokerId:this.BrokerIdVal},
      {From:this.SearchForm.get('From')?.value==''?'':this._DatePipe.transform(this.SearchForm.get('From')?.value,"yyyy-MM-dd")},
      {To:this.SearchForm.get('To')?.value==''?'':this._DatePipe.transform(this.SearchForm.get('To')?.value,"yyyy-MM-dd")}

      )
    console.log(Model);
    this._CollectionService.GetAllCollections(Model).subscribe(data=>{
      this.isClicked = false;
      this.AllCollections = data;
      console.log(data);
    },error=>{
      console.log(error);
      this.isClicked = false;
    })
  }
  checkIfAxceeded(e:any, IndexIdDate:any,LaterDate:any,checkBtn:any){  
    LaterDate as HTMLInputElement
    checkBtn.disabled=true;
    this.AllCollections[IndexIdDate].remainder =e.max-e.value
    if(Number(e.value)<Number(e.max)){
      $('#Remain'+IndexIdDate).show(500)
    }else if(Number(e.value)>Number(e.max)){
      $('#Remain'+IndexIdDate).hide(500)
      LaterDate.value =''
    }else{
      $('#Remain'+IndexIdDate).hide(500)
      LaterDate.value =''
    }
  }
  ArrTest:any[]=[]
  /////// Checked Values  ////
  getCheckedValues(id:any,checked:any, Money:any, LaterDate:any,policyId:any,collectionType:any){
    $("#UploadFile").show(500)
    let Exisit = this.ArrTest.find(item=>id==item.collectionId)
    let Model ={
      collectionId:id,
      amount:Money.value,
      date:LaterDate.value,
      policyId:policyId,
      collectionType:collectionType
    }

    if(checked==true){
      Money.disabled = true
      LaterDate.disabled = true
      if(Exisit==undefined){
        
        this.ArrTest.push(Model)
        this.TotalMony += Number(Money.value)
      }else{
        let Index = this.ArrTest.indexOf(Exisit)
        this.ArrTest.splice(Index)
        this.ArrTest.push(Model)
      }
    }else{
      this.TotalMony -= Number(Money.value)
      Money.disabled = false
      LaterDate.disabled = false
      let item = this.ArrTest.find(item=>id==item.collectionId)
      let Index = this.ArrTest.indexOf(item)
      this.ArrTest.splice(Index, 1)
    }
    console.log(this.ArrTest);
  }
  getLaterDate(checkBtn:any){
    checkBtn.disabled=false;
  }
  /////////////////// Add Portfolio ///////////
  AddPortfolio(){
    let Model ={
      convertCollections:this.ArrTest
    }
    console.log(Model);
    this._CollectionService.CreatePortfolio(Model).subscribe(res=>{
      this.ArrTest = [];
      console.log(res);
      this.Search();
      Swal.fire('Good job!','Portfolio/Portfolios Created Successfully','success');
      this.Search()
    },error=>{
      console.log(error);
      Swal.fire({icon: 'error',title: 'Oops...',text: error.error,})
    })
  }
  selectedFile:any = ''
  uploadPaymnetFile(event: any){
    this.selectedFile = event.target.files[0] ?? null;
    event.target.value=''
  }


  //get Broker Customers
  getBrokerCustomers(){
    this._AdminService.getAllCustomers(3).subscribe(data=>{
      this.brokerCustomers= data
    })
  }
  // Get All Collections
  // GetAllCollections(){
  //   this.isClicked = true;
  //   this._CollectionService.GetAllCollections().subscribe(data=>{
  //     this.isClicked = false;
  //     console.log(data);
  //     this.AllPolices = data
  //   },error=>{
  //     console.log(error);
  //     this.isClicked = false;
  //   })
  // }
  ngOnInit(){
    this.getBrokerCustomers();
    this.Search();
  }
}
