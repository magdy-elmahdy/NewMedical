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
  selector: 'app-claims-pay',
  templateUrl: './claims-pay.component.html',
  styleUrls: ['./claims-pay.component.scss'],
  providers : [DatePipe]
})
export class ClaimsPayComponent {
  DepositTransfer:any;
  Model:any;
  selectedFile:any = '';
  isClicked:boolean= false;
  brokerCustomers:any;
  BrokerIdVal:any ='';
  TotalMony:number = 0;
  PayedMoney:any = 0;
  Money:any;
  CashedInputs:any;
  CurrentDate:any = new Date();
  ArrCash:any[]=[];
  ArrCredit:any[]=[];
  ArrCheck:any[]=[];
  ArrDeposit:any[]=[];
  ArrTransfer:any[]=[];
  ArrHonsty:any[]=[];
  AddedNewChecks:any[]=[];
  ResponseIds:any[]=[];
  isSubmitted:boolean = false;
  permissions:any[]= JSON.parse(localStorage.getItem('permissions')!)
  AllClaims:any[]=[]
  constructor(private _ToastrService:ToastrService,private _DatePipe:DatePipe ,private _Router:Router,
    private _CollectionService:CollectionService, private _AdminService:AdminService, private _ActivatedRoute:ActivatedRoute){
      this._ActivatedRoute.queryParams.subscribe((data:any)=>{
        this.CashedInputs = data
        console.log(data);
        this.SearchForm.get('claimCode')?.setValue(data?.claimCode)
        this.SearchForm.get('insuredName')?.setValue(data?.insuredName)
        this.SearchForm.get('brokerId')?.setValue(data?.brokerId==null?'':Number(data?.brokerId)||data?.brokerId==0?'':Number(data?.brokerId))
      });
    }

  ///////////////// Payment Way /////////////////
  getPaymentWay(value:any){
    $("#PaymentFile").show(500)
    $("#Bodyy").show(500)
    if(value == 1){
      $("#Money").show(500)
  
  
      $("#CreditCard").hide(500)
      $("#Check").hide(500)
      $("#BankDeposit").hide(500)
      $("#Honesty").hide(500)
      $("#BankTransfer").hide(500)
    }else if(value == 2){
      $("#CreditCard").show(500)
  
  
      $("#Money").hide(500)
      $("#Check").hide(500)
      $("#BankDeposit").hide(500)
      $("#Honesty").hide(500)
      $("#BankTransfer").hide(500)
    }else if(value == 3){
      $("#Check").show(500)
  
  
      $("#CreditCard").hide(500)
      $("#Money").hide(500)
      $("#BankDeposit").hide(500)
      $("#Honesty").hide(500)
      $("#BankTransfer").hide(500)
    }else if(value == 4){
      $("#BankDeposit").show(500)

      $("#Check").hide(500)
      $("#CreditCard").hide(500)
      $("#Money").hide(500)
      $("#Honesty").hide(500)
      $("#BankTransfer").hide(500)
    }else if(value == 5){
      $("#BankTransfer").show(500)

      $("#BankDeposit").hide(500)
      $("#Check").hide(500)
      $("#CreditCard").hide(500)
      $("#Money").hide(500)
      $("#Honesty").hide(500)
    }else if(value == 6){
      $("#Honesty").show(500)

      $("#BankTransfer").hide(500)
      $("#CreditCard").hide(500)
      $("#Money").hide(500)
      $("#Check").hide(500)
      $("#BankDeposit").hide(500)
    }
  }
  uploadPaymnetFile(event: any){
    this.selectedFile = event.target.files[0] ?? null;
    event.target.value=''
  }
  
  SearchForm:FormGroup = new FormGroup({
    'claimCode':new FormControl(''),
    'insuredName':new FormControl(''),
    'brokerId':new FormControl(''),
    'policyCode':new FormControl(''),
    'from':new FormControl(''),
    'to':new FormControl('')
  })
  CheckForm:FormGroup = new FormGroup({
    'amount':new FormControl('',[Validators.required]),
    'paymentDate':new FormControl('',[Validators.required]),
    'checkNumber':new FormControl('',[Validators.required]),
    'bankName':new FormControl('',[Validators.required])
  })  
  TrasferForm:FormGroup = new FormGroup({
    'amount':new FormControl('',[Validators.required]),
    'paymentDate':new FormControl('',[Validators.required]),
    'transferNumber':new FormControl('',[Validators.required]),
    'bankName':new FormControl('',[Validators.required])
  })
  HonestyForm:FormGroup = new FormGroup({
    'amount':new FormControl('',[Validators.required]),
    'policyId':new FormControl('',[Validators.required])
  })

  ///////////////////// Search /////////////////////
  InnerModelSeaerch(){
    $("#SearchResults").show(500)  //
    this.Model = Object.assign(
      {claimCode:this.SearchForm.get('claimCode')?.value==null?'':this.SearchForm.get('claimCode')?.value},
      {insuredName:this.SearchForm.get('insuredName')?.value==null?'':this.SearchForm.get('insuredName')?.value},
      {policyCode:this.SearchForm.get('policyCode')?.value==null?'':this.SearchForm.get('policyCode')?.value},
      {brokerId:this.BrokerIdVal==null?'':this.BrokerIdVal},
      {from:this.SearchForm.get('from')?.value=='Invalid Date'?'':this._DatePipe.transform(this.SearchForm.get('from')?.value,"yyyy-MM-dd")},
      {to:this.SearchForm.get('to')?.value=='Invalid Date'?'':this._DatePipe.transform(this.SearchForm.get('to')?.value,"yyyy-MM-dd")}
      )
    console.log(this.Model);
    
  }
Search(){
  // $("#SearchResults").show(500) //
  // $(".removei").show(500)
  // $(".removeii").show(500)
  // $(".removeiii").show(500)
  $("#Bodyy").show(300)
  this.isClicked = true
  this.InnerModelSeaerch()
  this._CollectionService.SearchClaims(this.Model).subscribe((data:any)=>{
  this.isClicked = false
    $("#SearchResults").show(500)
    this.AllClaims = data
    console.log(this.AllClaims);
  },error=>{
    this.isClicked = false
    console.log(error);
  })
  this._Router.navigate(['/ClaimsPayment'],{
    queryParams:{claimCode:this.Model.claimCode,insuredName:this.Model.insuredName,brokerId:this.BrokerIdVal,
    from:this.Model.from,to:this.Model.to,policyCode:this.Model.policyCode}
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
getCheckedValues(id:any,dueDate:any,installmentDue:any,checked:any, Money:any){
  
  $("#UploadFile").show(500);
  let Exisit = this.ArrTest.find(item=>id==item.collectionId)
  let Exisit2 = this.ResponseIds.find(item=>id==item)
  console.log(Exisit2);


  let Model = {
    collectionId:id,
    dueDate:dueDate,
    installmentDue:installmentDue,
    totalPaid:Number(Money.value)
  }
  if(checked==true){
    if(Exisit==undefined){
      this.ResponseIds.push(id)
    }else{
      let Index = this.ResponseIds.indexOf(Exisit)
      this.ResponseIds.splice(Index)
      this.ResponseIds.push(Model)
    }

    Money.disabled = true
    if(Exisit==undefined){
      this.ArrTest.push(Model)
      this.TotalMony += Number(Money.value)
    }else{
      let Index = this.ArrTest.indexOf(Exisit)
      this.ArrTest.splice(Index)
      this.ArrTest.push(Model)
      this.TotalMony -= Number(Money.value)
    }
  }else{
    Money.disabled = false
      let item = this.ArrTest.find(item=>id==item.collectionId)
      let Index = this.ArrTest.indexOf(item)
      this.ArrTest.splice(Index, 1)
      this.TotalMony -= Number(Money.value)

      let item2 = this.ResponseIds.find(item=>id==item.collectionId)
      let Index2 = this.ResponseIds.indexOf(item2)
      this.ResponseIds.splice(Index2, 1)
  }
  if(this.ResponseIds.length==0){
    this.ListInsuredNames =[]
  }
  this.GetListInsuredNames();
  console.log(this.ArrTest);
  
}

  ////////////  Check  //////////////
viewCheck(){
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
        'paymentDate': this._DatePipe.transform(this.CheckForm.get('paymentDate')?.value, 'YYY-MM-dd')
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

  ////////////  Transfer  //////////////
viewTransfer(){
  // 
  if((this.PayedMoney+Number(this.TrasferForm.get('amount')?.value))>this.TotalMony){
    this._ToastrService.show('Can Not Pay More Than Total Money')
  }else{
    var item = this.ArrTransfer.find(item=>this.TrasferForm.get('transferNumber')?.value == item.transferNumber
    && this.TrasferForm.get('bankName')?.value.toLowerCase() == item.bankName.toLowerCase())
    if(item==undefined){
      let Model={
        'transferNumber':this.TrasferForm.get('transferNumber')?.value,
        'bankName':this.TrasferForm.get('bankName')?.value,
        'amount':this.TrasferForm.get('amount')?.value,
        'paymentDate': this._DatePipe.transform(this.TrasferForm.get('paymentDate')?.value, 'YYY-MM-dd')
      }
      this.PayedMoney+=Number(this.TrasferForm.get('amount')?.value)
      this.ArrTransfer.push(Model);
      this.TrasferForm.reset()
    }else{
      this._ToastrService.show('This Transfer is Already Exist')
    }
  }
  console.log(this.ArrTransfer);
  // 
}
removeTrasfer(index:number, Money:any){
  this.ArrTransfer.splice(index, 1)
  this.PayedMoney -= Number(Money)
  console.log(this.ArrTransfer);
}
    ////////////  viewHonesty  //////////////
viewHonesty(){
  if((this.PayedMoney+Number(this.HonestyForm.get('amount')?.value))>this.TotalMony){
    this._ToastrService.show('Can Not Pay More Than Total Money')
  }else{
    let Exist = this.ListInsuredNames.find(item=>item.policyId==this.HonestyForm.get('policyId')?.value)
    
    let Model={
      'startAmount':this.HonestyForm.get('amount')?.value,
      'policyId':this.HonestyForm.get('policyId')?.value,
      'paymentDateTime': this._DatePipe.transform(this.CurrentDate, 'YYY-MM-dd'),
      'secretariatType':'FromClaim',
      'customerId':Exist.customerId
    }
    this.ArrHonsty.push(Model)
    this.PayedMoney+=Number(this.HonestyForm.get('amount')?.value)
    this.HonestyForm.reset()
  }
  
}
removeHonesty(index:number, Money:any){
  this.ArrHonsty.splice(index, 1)
  this.PayedMoney -= Number(Money)
}
//get Broker Customers
getBrokerCustomers(){
  this._AdminService.getAllCustomers(3).subscribe(data=>{
    this.brokerCustomers= data
  })
}
////////////// GetListInsuredNames ///////////////////
ListInsuredNames:any[]=[]
GetListInsuredNames(){
  let Model ={
    "ids":this.ResponseIds
  }
  this._CollectionService.GetListInsuredNames(Model).subscribe((data:any)=>{
    this.ListInsuredNames = data
    console.log(this.ListInsuredNames);
  })
}
////////////////////////////=>  Add Payment   <=//////////////////
CkeckValue:any[]=[]
AddPayment(){
  this.isSubmitted = true;
  let Model ={
    "totalAmount":this.TotalMony,
    "ways":{
      "bankTransferPayment":this.ArrTransfer,
      "checkPayment":this.ArrCheck,
      "secretariat":this.ArrHonsty,
    },"collections":this.ResponseIds
  }
  let FinalModel= Object.assign(Model,{collections:this.ArrTest})
  console.log(FinalModel);
  this._CollectionService.AddPayment(Model).subscribe(res=>{
    this.isSubmitted = false;
    console.log(res);
    Swal.fire('Good job!','Added Successfully','success')
    this.ListInsuredNames =[]
    this.TotalMony = 0
    this.PayedMoney = 0
    this.ArrTest = []
    $("#PaymnetWays").hide(500)
    $("#TrasferForm").hide(500)
    $("#NewPay").show(500)
    $(".removei").hide(500)
    $(".removeii").hide(500)
    $(".removeiii").hide(500)
    $("#searchBtn").hide(500)
    $("#Check").hide(500)
    $("#UpdateClaimBtn").hide(500)
    $(".HideCheck").hide(500)
    $(".chechBox").hide(500)
    this.ResponseIds = []
  },error=>{
    this.isSubmitted = false;
    console.log(error);
    Swal.fire({icon: 'error',title: 'Oops...',text: error.error})
  })
}
// Get History
  ClaimsHistory:any
  HistoryLoading:Boolean =false;
GetHistory(ExcelFileId:any){
  $("#CollectionPayementWays").hide(300)
  this.HistoryLoading = true
  this._CollectionService.GetClaimHistory(ExcelFileId).subscribe(data=>{
    this.HistoryLoading = false
    console.log(data);  
    this.ClaimsHistory = data;
  },error=>{
    this.HistoryLoading = false
  })
  
}
NewPayment(){
  
  $("#NewPay").hide(500)
  this.ArrCash = []
  this.ArrCheck = []
  this.ArrCredit = []
  this.ArrHonsty = []
  this.ArrTransfer = []
  this.AllClaims = []
  $(".removei").show(500)
  $("#UpdateClaimBtn").show(500)
  $(".removeii").show(500)
  $(".removeiii").show(500)
  $("#searchBtn").show(500)
  $(".chechBox").show(500)
  $("#Check").hide(500)
  $("#BankTransfer").hide(500)
  $("#Honesty").hide(500)
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
  this.getBrokerCustomers()
  this.SearchForm.get('from')?.setValue(new Date(this.CashedInputs.from))
  this.SearchForm.get('to')?.setValue(new Date(this.CashedInputs.to))
  this.SearchForm.get('claimCode')?.setValue(this.CashedInputs.claimCode)
  this.SearchForm.get('insuredName')?.setValue(this.CashedInputs.insuredName)
  this.SearchForm.get('policyCode')?.setValue(this.CashedInputs.policyCode)
  if(Number(this.CashedInputs.brokerId)>0){
    this.BrokerIdVal =Number(this.CashedInputs.brokerId)
  }else{
    this.BrokerIdVal =''
  }
  this.Search()

}
} 
