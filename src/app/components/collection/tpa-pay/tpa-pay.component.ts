import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { CollectionService } from 'src/app/services/collection.service';
import Swal from 'sweetalert2';
declare var $:any
@Component({
  selector: 'app-tpa-pay',
  templateUrl: './tpa-pay.component.html',
  styleUrls: ['./tpa-pay.component.scss'],
  providers : [DatePipe]
})
export class TpaPayComponent{
  DepositTransfer:any
  Model:any
  selectedFile:any = ''
  isClicked:boolean= false
  TpaCustomers:any
  // BrokerIdVal:any =''
  TotalMony:number = 0
  PayedMoney:any = 0
  Money:any;
  CashedInputs:any;
  CurrentDate:any = new Date()
  ArrCash:any[]=[];
  ArrCheck:any[]=[];
  ArrDeposit:any[]=[];
  AddedNewChecks:any[]=[];
  isSubmitted:boolean = false
  AllClaims:any[]=[]
  constructor(private _ToastrService:ToastrService,private _DatePipe:DatePipe ,private _Router:Router,
    private _CollectionService:CollectionService, private _AdminService:AdminService, private _ActivatedRoute:ActivatedRoute){
    }

  ///////////////// Payment Way /////////////////
  getPaymentWay(value:any){
    $("#PaymentFile").show(500)
    $("#Bodyy").show(500)
    if(value == 1){
      $("#Money").show(500)
  
      $("#Check").hide(500)
    }else if(value == 2){
  
      $("#Money").hide(500)
      $("#Check").hide(500)
    }else if(value == 3){
      $("#Check").show(500)
  
      $("#Money").hide(500)
    }else if(value == 4){

      $("#Check").hide(500)
      $("#Money").hide(500)
    }else if(value == 5){

      $("#Check").hide(500)
      $("#Money").hide(500)
    }else if(value == 6){
      $("#Money").hide(500)
      $("#Check").hide(500)
    }
  }
  uploadPaymnetFile(event: any){
    this.selectedFile = event.target.files[0] ?? null;
    event.target.value=''
  }
  
  SearchForm:FormGroup = new FormGroup({
    'PolicyCode':new FormControl(''),
    'TpaId':new FormControl('',[Validators.required]),
    'From':new FormControl(''),
    'To':new FormControl('')
  })
  CashForm:FormGroup = new FormGroup({
    'amount':new FormControl('',[Validators.required]),
    'paymentDate':new FormControl('',[Validators.required]),
  })
  CheckForm:FormGroup = new FormGroup({
    'amount':new FormControl('',[Validators.required]),
    'paymentDate':new FormControl('',[Validators.required]),
    'checkNumber':new FormControl('',[Validators.required]),
    'bankName':new FormControl('',[Validators.required])
  })  

  ///////////////////// Search /////////////////////
  InnerModelSeaerch(){
    $("#SearchResults").show(500)  //
    this.Model = Object.assign(
      {TpaId:this.SearchForm.get('TpaId')?.value==null?'':this.SearchForm.get('TpaId')?.value},
      {PolicyCode:this.SearchForm.get('PolicyCode')?.value==null?'':this.SearchForm.get('PolicyCode')?.value},
      {From:this.SearchForm.get('From')?.value=='Invalid Date'||this.SearchForm.get('From')?.value==''?'':this._DatePipe.transform(this.SearchForm.get('From')?.value,"yyyy-MM-dd")},
      {To:this.SearchForm.get('To')?.value=='Invalid Date'||this.SearchForm.get('To')?.value==''?'':this._DatePipe.transform(this.SearchForm.get('To')?.value,"yyyy-MM-dd")}
    )
    console.log(this.Model);
  }
Search(){

  $("#Bodyy").show(300)
  this.isClicked = true
  this.InnerModelSeaerch()
  this._CollectionService.GetAllTpaCommissions(this.Model).subscribe((data:any)=>{
  this.isClicked = false
    $("#SearchResults").show(500)
    this.AllClaims = data
    console.log(this.AllClaims);
  },error=>{
    this.isClicked = false
    console.log(error);
  })

}

checkIfAxceeded(e:any, input:any, IndexIdDate:any,CheckBox:any){
  input as HTMLInputElement
  this.AllClaims[IndexIdDate].remaining =e.max-e.value
  
  if(Number(e.value)<Number(e.max)){
    
  }else if(Number(e.value)>Number(e.max)){
    input.value= e.max
    CheckBox.disabled=false
    this.AllClaims[IndexIdDate].remaining =0
    this._ToastrService.show('','Can not Exceed Max Value')
  }else if(Number(e.value)==Number(e.max)){
  }
  if(e.value>0){
    CheckBox.disabled=false
  }else{
    CheckBox.disabled=true
  }
}

ArrTest:any[]=[]
getCheckedValues(amount:any,id:any,checked:any){
  let Exisit = this.ArrTest.find(item=>id==item.tpaCollectionId)
  if(checked==true){
    if(Exisit==undefined){
      this.ArrTest.push(id)
      this.TotalMony =this.TotalMony+= Number(amount)
    }else{
      let Index = this.ArrTest.indexOf(Exisit)
      this.ArrTest.splice(Index)
      this.ArrTest.push(id)
      this.TotalMony -= Number(amount)
    }
  }else{
      let item = this.ArrTest.find(item=>id==item)
      let Index = this.ArrTest.indexOf(item)
      this.ArrTest.splice(Index, 1)
      this.TotalMony -= Number(amount)
  }
  console.log(this.ArrTest);
  
}
    ////////////  Cash  /////////////////
viewCash(){
  if((this.PayedMoney+Number(this.CashForm.get('amount')?.value))>this.TotalMony){
    this._ToastrService.show('Can Not Pay More Than Total Money')
  }else{
    let Model={
      amount:this.CashForm.get('amount')?.value,
      paymentDate:this._DatePipe.transform(this.CashForm.get('paymentDate')?.value, 'YYYY-MM-dd')
    }
    this.ArrCash.push(Model)
    this.PayedMoney+=Number(this.CashForm.get('amount')?.value)
    this.CashForm.reset();
  }
}
removeCash(index:number, Money:any){
  this.ArrCash.splice(index, 1)
  this.PayedMoney -= Number(Money)
}
  ////////////  Check  //////////////
  CheckPaymentType:any;
  
viewCheck(){
  // console.log(this.dateTest);
  if(this.CurrentDate <=this.CheckForm.get('paymentDate')?.value){
    this.CheckPaymentType ='PostdatedCheck'
  }else{
    this.CheckPaymentType ='DueCheck'
  }
  // console.log(item.bankName);
  if((this.PayedMoney+Number(this.CheckForm.get('amount')?.value))>this.TotalMony){
    this._ToastrService.show('Can Not Pay More Than Total Money')
  }else{
    var item = this.ArrCheck.find(item=>this.CheckForm.get('checkNumber')?.value == item.checkNumber
    && this.CheckForm.get('bankName')?.value.toLowerCase() == item.bankName.toLowerCase())
    if(item==undefined){
      let Model= {
        'amount':this.CheckForm.get('amount')?.value,
        'bankName':this.CheckForm.get('bankName')?.value,
        'checkNumber':this.CheckForm.get('checkNumber')?.value,
        'paymentDate': this._DatePipe.transform(this.CheckForm.get('paymentDate')?.value, 'YYY-MM-dd'),
        "checkPaymentType": this.CheckPaymentType
      }
      this.PayedMoney+=Number(this.CheckForm.get('amount')?.value)
      this.ArrCheck.push(Model);
      this.CheckForm.reset()
    }else{
      this._ToastrService.show('This Ckeck is Already Exist')
    }
  }
  console.log(this.ArrCheck);
  
}
 //Remove item From Loss Participations List
 removeCheck(index:number,Money:any){
  this.ArrCheck.splice(index, 1)
  this.PayedMoney-=Number(Money)
  console.log(this.ArrCheck);
}


//get TPA Customers
getTPACustomers(){
  this._AdminService.getAllCustomers(2).subscribe(data=>{
    this.TpaCustomers= data
    // console.log(data);
    
  })
}

////////////////////////////=>  Add Payment   <=//////////////////
CkeckValue:any[]=[]
AddPayment(){
  this.isSubmitted = true;
  let Model ={
    "tpaCollections":this.ArrTest,
    "tpaId":this.SearchForm.get("TpaId")?.value,
    "totalAmount":this.TotalMony,
    "paymentWays":{
      "checkPayment":this.ArrCheck,
      "cashPayment":this.ArrCash,
    },
  }
  console.log(Model);
  this._CollectionService.AddTpaCommissionPayment(Model).subscribe(res=>{
    this.isSubmitted = false;
    console.log(res);
    Swal.fire('Good job!','Added Successfully','success')
    this.TotalMony = 0
    this.PayedMoney = 0
    this.ArrTest = []
    $("#PaymnetWays").hide(500)
    $("#NewPay").show(500)
    $(".removei").hide(500)
    $(".removeii").hide(500)
    $(".removeiii").hide(500)
    $("#searchBtn").hide(500)
    $("#Check").hide(500)
    $(".HideCheck").hide(500)
    $(".chechBox").hide(500)
  },error=>{
    this.isSubmitted = false;
    console.log(error);
    Swal.fire({icon: 'error',title: 'Oops...',text: error.error})
  })
}

NewPayment(){
  
  $("#NewPay").hide(500)
  this.ArrCash = []
  this.ArrCheck = []
  this.AllClaims = []
  this.ArrTest = []
  $(".removei").show(500)
  $("#UpdateClaimBtn").show(500)
  $(".removeii").show(500)
  $(".removeiii").show(500)
  $("#searchBtn").show(500)
  $(".chechBox").show(500)
  $("#Check").hide(500)
}
// Get Collection Payment Ways
loadingPaymentWays:boolean = false;
CollectionPaymentWays:any={}
GetCollectionPaymentWays(CollectionId:any){
  $("#CollectionPayementWays").show(500)
  this.loadingPaymentWays = true;
  this._CollectionService.getCollectionPaymentWays(CollectionId).subscribe((data:any)=>{
    this.loadingPaymentWays = false;
    this.CollectionPaymentWays= data
    console.log(data);
  },error=>{
    this.loadingPaymentWays = false;
  })
}
ngOnInit(){
  this.getTPACustomers()
}
}
