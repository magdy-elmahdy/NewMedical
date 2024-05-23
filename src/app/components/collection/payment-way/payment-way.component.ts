import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { CollectionService } from 'src/app/services/collection.service';
import { PolicyService } from 'src/app/services/policy.service';
import Swal from 'sweetalert2';
declare var $:any
@Component({
  selector: 'app-payment-way',
  templateUrl: './payment-way.component.html',
  styleUrls: ['./payment-way.component.scss'],
  providers : [DatePipe]
})
export class PaymentWayComponent implements OnInit{
  Secretariats:any[]=[];
  PortflioDateStablish:any = new Date();
  DepositTransfer:any;
  selectedFile:any = '';
  isClicked:boolean= false;
  isSubmitted:boolean= false;
  brokerCustomers:any;
  BrokerIdVal:any ='';
  TotalMony:number = 0;
  PayedMoney:number = 0;
  RemainedMoney:number = 0;
  PortflioCollections:any;
  AllBanks:any;
  portfolioId:any=null;
  CurrentDate:any = new Date();
  CurrentOneDate:any = new Date();
  CreatedAt:any = new Date();
  CurrentPostponedDate:any = new Date();
  ArrCash:any[]=[];
  ArrCredit:any[]=[];
  ArrCheck:any[]=[];
  ArrPosponedCheck:any[]=[];
  ArrDeposit:any[]=[];
  ArrTransfer:any[]=[];
  ArrHonsty:any[]=[];
  AddedNewChecks:any[]=[];
  bankAccounts:any;

  constructor(private _ToastrService:ToastrService,private _DatePipe:DatePipe,
    private _CollectionService:CollectionService, private _AdminService:AdminService,
    private _Router:Router,
    private _PolicyService:PolicyService){
      // this.CurrentPostponedDate.setDate( this.CurrentPostponedDate.getDate() + 1 )
      this.CurrentOneDate.setDate( this.CurrentOneDate.getDate() + 1 )
    }
 

  ///////////////// Payment Way /////////////////
  getPaymentWay(value:any){
    $("#PaymentFile").show(500)
    $("#Bodyy").show(500)
    if(value == 1){
      $("#Money").show(500)

      $("#postponedCheck").hide(500)
      $("#FinishHonesty").hide(500)
      $("#CreditCard").hide(500)
      $("#Check").hide(500)
      $("#BankDeposit").hide(500)
      $("#Honesty").hide(500)
      $("#BankTransfer").hide(500)
    }else if(value == 2){
      $("#CreditCard").show(500)

      $("#postponedCheck").hide(500)
      $("#FinishHonesty").hide(500)
      $("#Money").hide(500)
      $("#Check").hide(500)
      $("#BankDeposit").hide(500)
      $("#Honesty").hide(500)
      $("#BankTransfer").hide(500)
    }else if(value == 3){
      $("#Check").show(500)

      $("#postponedCheck").hide(500)
      $("#FinishHonesty").hide(500)
      $("#CreditCard").hide(500)
      $("#Money").hide(500)
      $("#BankDeposit").hide(500)
      $("#Honesty").hide(500)
      $("#BankTransfer").hide(500)
    }else if(value == 4){
      $("#BankDeposit").show(500)

      $("#postponedCheck").hide(500)
      $("#FinishHonesty").hide(500)
      $("#Check").hide(500)
      $("#CreditCard").hide(500)
      $("#Money").hide(500)
      $("#Honesty").hide(500)
      $("#BankTransfer").hide(500)
    }else if(value == 5){
      $("#BankTransfer").show(500)

      $("#postponedCheck").hide(500)
      $("#FinishHonesty").hide(500)
      $("#BankDeposit").hide(500)
      $("#Check").hide(500)
      $("#CreditCard").hide(500)
      $("#Money").hide(500)
      $("#Honesty").hide(500)
    }else if(value == 6){
      $("#Honesty").show(500)

      $("#postponedCheck").hide(500)
      $("#FinishHonesty").hide(500)
      $("#BankTransfer").hide(500)
      $("#CreditCard").hide(500)
      $("#Money").hide(500)
      $("#Check").hide(500)
      $("#BankDeposit").hide(500)
    }else if(value == 7){
      $("#FinishHonesty").show(500)

      $("#postponedCheck").hide(500)
      $("#Honesty").hide(500)
      $("#BankTransfer").hide(500)
      $("#CreditCard").hide(500)
      $("#Money").hide(500)
      $("#Check").hide(500)
      $("#BankDeposit").hide(500)
    }else if(value == 8){
      $("#postponedCheck").show(500)

      $("#FinishHonesty").hide(500)
      $("#Honesty").hide(500)
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
    'code':new FormControl(''),
    'Insured':new FormControl(''),
    'From':new FormControl(''),
    'To':new FormControl(''),
    'Decision':new FormControl('approved'),
  })
  PostponedCheckForm:FormGroup = new FormGroup({
    'checkNumber':new FormControl('',[Validators.required]),
    'bankName':new FormControl('',[Validators.required]),
    'amount':new FormControl('',[Validators.required]),
    'paymentDate':new FormControl('',[Validators.required]),  
    'collectionId':new FormControl(''),
  })
  CheckForm:FormGroup = new FormGroup({
    'checkNumber':new FormControl('',[Validators.required]),
    'bankName':new FormControl('',[Validators.required]),
    'amount':new FormControl('',[Validators.required]),
    'paymentDate':new FormControl('',[Validators.required])
  })
  CashForm:FormGroup = new FormGroup({
    'amount':new FormControl('',[Validators.required]),
    'paymentDate':new FormControl('')
  })
  CreditForm:FormGroup = new FormGroup({
    'cardHolderName':new FormControl('',[Validators.required]),
    'cardNumber':new FormControl(''),
    'bankName':new FormControl('',[Validators.required]),
    'expiryDate':new FormControl(''),
    'amount':new FormControl('',[Validators.required])
  })
  DepositForm:FormGroup = new FormGroup({
    'transferNumber':new FormControl('',[Validators.required]),
    'bankName':new FormControl('',[Validators.required]),
    'amount':new FormControl('',[Validators.required]),
    'paymentDate':new FormControl('',[Validators.required])
  })
  TrasferForm:FormGroup = new FormGroup({
    'transferNumber':new FormControl('',[Validators.required]),
    'bankName':new FormControl('',[Validators.required]),
    'amount':new FormControl('',[Validators.required]),
    'paymentDate':new FormControl('',[Validators.required])
  })
  HonestyForm:FormGroup = new FormGroup({
    'secretariatId':new FormControl('',[Validators.required]),
    'amount':new FormControl('',[Validators.required]),
    'paymentDateTime':new FormControl('',[Validators.required])
  })
  FinishHonestyForm:FormGroup = new FormGroup({
    'secretariatId':new FormControl('',[Validators.required]),
    'amount':new FormControl('',[Validators.required]),
    'paymentDateTime':new FormControl('',[Validators.required])
  })
  CheckValues:any[]=[]
  SecretariatsArr:any[]=[]
  CurrentCollection:any
  getCheckedValues(checked:any ,Portfolio:any,index:any,collections:any,CreatedAt:any){
    this.CurrentCollection = collections
    this.PortflioDateStablish = new Date();
    this.PortflioDateStablish = new Date(CreatedAt);
    
    this.CurrentPostponedDate = new Date();
    this.CurrentPostponedDate = new Date(CreatedAt);
    this.CurrentPostponedDate.setDate( this.CurrentPostponedDate.getDate() + 1 )

    this.CreatedAt = new Date();
    this.CreatedAt = new Date(CreatedAt);
    
    for(let i=0;i<this.ApprovedPortfolios.length;i++){
      this.CheckValues[i] = false;
    }
    this.CheckValues[index]=true;

    // $("#PaymnetWays").show(500);
    this.TotalMony= Portfolio.amount;
    this.RemainedMoney= Portfolio.amount;
    
    this.GetCustomersOfPortfolio(Portfolio.id)
    this.SecretariatsArr = Portfolio.secretariats
    
    if(checked==true){
      this.portfolioId = Portfolio.id;
    }else{
      this.portfolioId = null;
    }
    console.log(this.portfolioId);
    
  }
  ////////////////////// Search ///////////////////////
Search(){
  this.loading = true;
    let Model =Object.assign(this.SearchForm.value,
      {BrokerId:this.BrokerIdVal})
    console.log(Model);
    this._CollectionService.GetAllPortfolio(Model).subscribe(data=>{
      console.log(data);
      
      this.loading = false;
      this.ApprovedPortfolios = data;
    },error=>{
      console.log(error);
      this.loading = false;
    })
}

viewCheck(){
  if((this.PayedMoney+Number(this.CheckForm.get('amount')?.value))>this.TotalMony){
    this._ToastrService.show('Can Not Pay More Than Total Money')
  }else{
    var item = this.ArrCheck.find(item=>this.CheckForm.get('checkNumber')?.value == item.checkNumber && this.CheckForm.get('bankName')?.value.toLowerCase() == item.bankName.toLowerCase())
    if(item==undefined){
      let Model= {
        'checkNumber':this.CheckForm.get('checkNumber')?.value,
        'bankName':this.CheckForm.get('bankName')?.value,
        'amount':this.CheckForm.get('amount')?.value,
        'paymentDate': this._DatePipe.transform(this.CheckForm.get('paymentDate')?.value, 'YYYY-MM-dd')
      }
      this.PayedMoney = this.PayedMoney+=Number(this.CheckForm.get('amount')?.value);
      this.RemainedMoney = this.TotalMony - this.PayedMoney;
      this.ArrCheck.push(Model);
      this.CheckForm.reset()
      console.log(this.ArrCheck);
    }else{
      this._ToastrService.show('This Ckeck is Already Exist')
    }
  }
  
  
}
removeCheck(index:number,Money:any){
  this.ArrCheck.splice(index, 1)
  this.PayedMoney-=Number(Money);
  this.RemainedMoney = this.TotalMony - this.PayedMoney;
}

//////////// Postponed Check  /////////////////
viewPostponedCheck(){
  if((this.PayedMoney+Number(this.PostponedCheckForm.get('amount')?.value))>this.TotalMony){
    this._ToastrService.show('Can Not Pay More Than Total Money');
  }else{
    var item = this.ArrPosponedCheck.find(item=>this.PostponedCheckForm.get('checkNumber')?.value == item.checkNumber && this.PostponedCheckForm.get('bankName')?.value.toLowerCase() == item.bankName.toLowerCase())
    if(item==undefined){
      let Model= {
        'checkNumber':this.PostponedCheckForm.get('checkNumber')?.value,
        'bankName':this.PostponedCheckForm.get('bankName')?.value,
        'amount':this.PostponedCheckForm.get('amount')?.value,
        'paymentDate': this._DatePipe.transform(this.PostponedCheckForm.get('paymentDate')?.value, 'YYYY-MM-dd'),
        'collectionId':this.PostponedCheckForm.get('collectionId')?.value
      }
      this.CurrentPostponedDate =new Date(this.PostponedCheckForm.get('paymentDate')?.value);
      this.CurrentPostponedDate.setDate( this.CurrentPostponedDate.getDate())
      
      this.PayedMoney = this.PayedMoney+=Number(this.PostponedCheckForm.get('amount')?.value);
      this.RemainedMoney = this.TotalMony - this.PayedMoney;
      this.ArrPosponedCheck.push(Model);
      this.PostponedCheckForm.reset()
      console.log(this.ArrPosponedCheck);
    }else{
      this._ToastrService.show('This Ckeck is Already Exist')
    }
  }
  
  
}
removePostponedCheck(index:number,Money:any){
  this.ArrPosponedCheck.splice(index, 1)
  this.PayedMoney-=Number(Money);
  this.RemainedMoney = this.TotalMony - this.PayedMoney;

  let latestDate=new Date()
  for (let i = 0; i < this.ArrPosponedCheck.length; i++) {

    let currentDate = new Date(this.ArrPosponedCheck[i].paymentDate);

    if (currentDate > latestDate) {
      latestDate = currentDate;
    }
  }
  console.log(latestDate);
  
  
  if(this.ArrPosponedCheck.length!=0){
    console.log("Arr Has items");
    this.CurrentPostponedDate = new Date(latestDate);
    this.CurrentPostponedDate.setDate(latestDate.getDate());
  }else{
    console.log("Arr is empty");
    this.CurrentPostponedDate = new Date();
    this.CurrentPostponedDate.setDate(this.CreatedAt.getDate() + 1 );
  }
}

    ////////////  Cash  /////////////////
viewCash(){
  if((this.PayedMoney+Number(this.CashForm.get('amount')?.value))>this.TotalMony){
    this._ToastrService.show('Can Not Pay More Than Total Money')
  }else{
    let Model={
      amount:this.CashForm.get('amount')?.value,
      paymentDate:this._DatePipe.transform(this.CurrentDate, 'YYYY-MM-dd')
    }
    this.ArrCash.push(Model)
    this.PayedMoney+=Number(this.CashForm.get('amount')?.value);
    this.RemainedMoney = this.TotalMony - this.PayedMoney;
    this.CashForm.reset();
  }
  
}
removeCash(index:number, Money:any){
  this.ArrCash.splice(index, 1)
  this.PayedMoney -= Number(Money);
  this.RemainedMoney = this.TotalMony - this.PayedMoney;
}
    ////////////  Credit  //////////////
viewCredit(){
  if((this.PayedMoney+Number(this.CreditForm.get('amount')?.value))>this.TotalMony){
    this._ToastrService.show('Can Not Pay More Than Total Money')
  }else{
    let Model={
      'cardHolderName':this.CreditForm.get('cardHolderName')?.value,
      'cardNumber':this.CreditForm.get('cardNumber')?.value,
      'expiryDate': this._DatePipe.transform(this.CreditForm.get('expiryDate')?.value, 'YYYY-MM-dd'),
      'amount':this.CreditForm.get('amount')?.value,
      'bankName':this.CreditForm.get('bankName')?.value,
    }
    this.ArrCredit.push(Model)
    this.PayedMoney+=Number(this.CreditForm.get('amount')?.value);
    this.RemainedMoney = this.TotalMony - this.PayedMoney;
    this.CreditForm.reset()
  }
  
}
removeCredit(index:number, Money:any){
  this.ArrCredit.splice(index, 1)
  this.PayedMoney -= Number(Money);
  this.RemainedMoney = this.TotalMony - this.PayedMoney;
}
    ////////////  Transfer  //////////////
viewTransfer(){
  if((this.PayedMoney+Number(this.TrasferForm.get('amount')?.value))>this.TotalMony){
    this._ToastrService.show('Can Not Pay More Than Total Money')
  }else{
    let Model={
      'transferNumber':this.TrasferForm.get('transferNumber')?.value,
      'bankName':this.TrasferForm.get('bankName')?.value,
      'amount':this.TrasferForm.get('amount')?.value,
      'paymentDate': this._DatePipe.transform(this.TrasferForm.get('paymentDate')?.value, 'YYYY-MM-dd')
    }
    this.ArrTransfer.push(Model)
    this.PayedMoney+=Number(this.TrasferForm.get('amount')?.value);
    this.RemainedMoney = this.TotalMony - this.PayedMoney;
    this.TrasferForm.reset()
  }
  
}
removeTrasfer(index:number, Money:any){
  this.ArrTransfer.splice(index, 1)
  this.PayedMoney -= Number(Money);
  this.RemainedMoney = this.TotalMony - this.PayedMoney;
}

    ////////////  Deposit  //////////////
viewDeposit(){
  if((this.PayedMoney+Number(this.DepositForm.get('amount')?.value))>this.TotalMony){
    this._ToastrService.show('Can Not Pay More Than Total Money')
  }else{
    let Exist = this.ArrDeposit.find(item=>item.depositNumber==this.DepositForm.get('transferNumber')?.value);
    console.log(Exist);
    
    if(Exist!=undefined){
      this._ToastrService.show('This Transfer Number already exist')
    }else{
      let Model={
        'depositNumber':this.DepositForm.get('transferNumber')?.value,
        'bankName':this.DepositForm.get('bankName')?.value,
        'amount':this.DepositForm.get('amount')?.value,
        'paymentDate': this._DatePipe.transform(this.DepositForm.get('paymentDate')?.value, 'YYYY-MM-dd')
      }
      this.ArrDeposit.push(Model);
      this.PayedMoney = this.PayedMoney+=Number(this.DepositForm.get('amount')?.value);
      this.RemainedMoney = this.TotalMony - this.PayedMoney;
      this.DepositForm.reset();
    }
  }
  
}
removeDeposit(index:number, Money:any){
  this.ArrDeposit.splice(index, 1)
  this.PayedMoney -= Number(Money)
  this.RemainedMoney = this.TotalMony - this.PayedMoney;
}

    ////////////  viewHonesty  //////////////
  // SecretRate
  SecretAmount:any
  FinishSecretAmount:any
  getClientName(){
    let Exist = this.Secretariats.find(item=>item.id==this.HonestyForm.get('secretariatId')?.value);
    console.log(Exist);
    this.SecretAmount = Exist.amount
    // console.log("Hello");
  }
  ///// Finish ////
  getFinishClientName(){
    let Exist = this.SecretariatsArr.find(item=>item.id==this.FinishHonestyForm.get('secretariatId')?.value);
    console.log(Exist);
    this.FinishSecretAmount = Exist.amount
  }

  viewHonesty(){
    let Exist = this.Secretariats.find(item=>item.id==this.HonestyForm.get('secretariatId')?.value);
    console.log(Exist);
    
    let Exist2 = this.ArrHonsty.find(item=>item.customerId==this.HonestyForm.get('secretariatId')?.value);
    if(Exist2==undefined){
      let Model={
        'name':Exist.name,
        'customerId':this.HonestyForm.get('secretariatId')?.value,
        'paymentDateTime': this._DatePipe.transform(this.HonestyForm.get('paymentDateTime')?.value, 'YYYY-MM-dd'),
        'amount':this.HonestyForm.get('amount')?.value
      }
      this.ArrHonsty.push(Model)
      this.PayedMoney-=Number(this.HonestyForm.get('amount')?.value);
      this.RemainedMoney = this.TotalMony - this.PayedMoney;
      this.HonestyForm.reset()
    }else{
      this._ToastrService.show('This Secretariats is Already Exist');
    }
    console.log(this.ArrHonsty);
  }

  removeHonesty(index:number, Money:any){
    this.ArrHonsty.splice(index, 1)
    this.PayedMoney = this.PayedMoney += Number(Money)
    this.RemainedMoney = this.TotalMony - this.PayedMoney;
    console.log(Money);
  }
  // Finish Honsty///////
  ArrFinishHonsty:any[]=[]
  viewFinishHonesty(){
    let Exist = this.SecretariatsArr.find(item=>item.id==this.FinishHonestyForm.get('secretariatId')?.value);
    console.log(Exist);
    if((this.PayedMoney+Number(this.FinishHonestyForm.get('amount')?.value))>this.TotalMony){
      this._ToastrService.show('Can Not Pay More Than Total Money')
    }else{
      let Exist2 = this.ArrFinishHonsty.find(item=>item.secretariatId==this.FinishHonestyForm.get('secretariatId')?.value);
      if(Exist2==undefined){
        let Model={
          'insuredName':Exist.insuredName,
          'secretariatId':this.FinishHonestyForm.get('secretariatId')?.value,
          'paymentDateTime': this._DatePipe.transform(this.FinishHonestyForm.get('paymentDateTime')?.value, 'YYYY-MM-dd'),
          'amount':this.FinishHonestyForm.get('amount')?.value
        }
        this.ArrFinishHonsty.push(Model)
        this.PayedMoney = this.PayedMoney+=Number(this.FinishHonestyForm.get('amount')?.value)
        this.RemainedMoney = this.TotalMony - this.PayedMoney;
        this.FinishHonestyForm.reset()
        console.log(this.ArrFinishHonsty);
      }else{
        this._ToastrService.show('This Secretariats is Already Exist');
      }
      }
  }
  removeFinishHonesty(index:number, Money:any){
    this.ArrFinishHonsty.splice(index, 1)
    this.PayedMoney = this.PayedMoney -= Number(Money)
    this.RemainedMoney = this.TotalMony - this.PayedMoney;
  }


    // get Temp
    FileName:any
    getTempleteFile(){
      this._CollectionService.getTempleteFile().subscribe(res=>{
        let blob:Blob = res.body as Blob
        this.FileName= 'test.pdf'
        let a= document.createElement('a');
        a.download=this.FileName
        a.href=window.URL.createObjectURL(blob)
        a.click()
      })
    }
    loading:boolean=false;
    ApprovedPortfolios:any
    getPortflioCollections(collections:any){
      this.PortflioCollections = collections
    }
  
    NewPayment(){
      $(".NewPay").hide(500)
      this.ArrCash = []
      this.ArrCheck = []
      this.ArrCredit = []
      this.ArrHonsty = []
      this.ArrTransfer = []
      this.ArrPosponedCheck = []
      $(".remove").show(500)
      $("#UpdateClaimBtn").show(500)
      $("#searchBtn").show(500)
      $(".chechBox").show(500)

      $("#Check").hide(400);
      $("#Money").hide(400);
        // this.GetApprovedPortfolios();

      // $(".chechBox").show(500)
      $("#postponedCheck").hide(500)
      $("#BankTransfer").hide(500)
      $("#Honesty").hide(500)
      $("#CreditForm").hide(400);
      $("#CashForm").hide(400);
    }
    // Create Secretratr
  GetCustomersOfPortfolio(id:any){
    this._CollectionService.GetCustomersOfPortfolio(id).subscribe((data:any)=>{
      console.log(data);
      this.Secretariats = data;
    },error=>{
      console.log(error);
    })
  }
    //get Broker Customers
getBrokerCustomers(){
  this._AdminService.getAllCustomers(3).subscribe(data=>{
    this.brokerCustomers= data
  })
}   
//////////   Final Pay   /////////////////////
FinalArrHonsty:any[]=[]
ExchangePermits:any;
arrayOfValues:any;
AddPayment(){
  this.isSubmitted = true;
  this.FinalArrHonsty = []
  for(let i=0;i<this.ArrHonsty.length;i++){
    let Model={
      'paymentDateTime':this.ArrHonsty[i].paymentDateTime,
      'customerId':this.ArrHonsty[i].customerId,
      'amount':this.ArrHonsty[i].amount,
    }
    this.FinalArrHonsty.push(Model)
  }
  let FinalModel={
    'portfolioId':this.portfolioId,
    'paymentWays':{
      'bankTransferPayment':this.ArrTransfer,
      'checkPayment':this.ArrCheck,
      'createSecretariat':this.FinalArrHonsty,
      'useSecretariat':this.ArrFinishHonsty,
      'cashPayments':this.ArrCash,
      'visaPayments':this.ArrCredit,
      'bankDepositPayments':this.ArrDeposit,
      'postdatedCheckPayments':this.ArrPosponedCheck
    }
  }
  console.log(FinalModel);
  this._CollectionService.AddPortfolioPayments(FinalModel).subscribe((res:any)=>{
    this.ExchangePermits=res.exchangePermits
    // $("#Print").modal("toggle");
    this.Search();
    this.isSubmitted = false;
    console.log(res);
    Swal.fire('Good job!','Payment Added Successfully','success');
    this.TotalMony = 0;
    this.PayedMoney = 0;
    $("#PaymnetWays").hide(400);
    this.portfolioId = null;
    $(".remove").hide(400);
    $("#Honesty").hide(400);
    $("#BankTransfer").hide(400);
    $("#Check").hide(400);
    $("#CreditForm").hide(400);
    $("#CashForm").hide(400);
    $("#searchBtn").hide(500)
    $(".NewPay").show(400);
    $(".chechBox").hide(500);
    const queryParams: any = {};
    queryParams.myArray = JSON.stringify(res);
    const navigationExtras: NavigationExtras = {
      queryParams
    };
    let newRelativeUrl = this._Router.createUrlTree(['/PortfolioModel'],navigationExtras);
    let baseUrl = window.location.href.replace(this._Router.url, '');
    window.open(baseUrl + newRelativeUrl, '_blank');
  },error=>{
    this.isSubmitted = false;
    console.log(error);
    Swal.fire({icon: 'error',title: 'Oops...',text: error.error,})
  })
}
  AllItems:any[]=[1,2,3]

  PrintPortfolio(id:any){
    // window.open('http://localhost:4200/#/PortfolioModel/'+id,'_blank')
    window.open('http://97.74.82.75:3375/#/PortfolioModel/'+id,'_blank')
  }
  PrintPermit(id:any){
    // window.open('http://localhost:4200/#/BrokerageModel/'+id,'_blank')
    window.open('http://97.74.82.75:3375/#/BrokerageModel/'+id,'_blank')
  }
  // arrayOfValues:any={message:'',paymentWays:{item1:5,item2:10},exchangePermits:[1,2,3]}
  TestPassObjectInParam(){
    const queryParams: any = {};
    queryParams.myArray = JSON.stringify(this.arrayOfValues);
    const navigationExtras: NavigationExtras = {
      queryParams
    };
    let newRelativeUrl = this._Router.createUrlTree(['/PortfolioModel'],navigationExtras);
    let baseUrl = window.location.href.replace(this._Router.url, '');
    window.open(baseUrl + newRelativeUrl, '_blank');
  }
    // Get All Banks
    getAllBanks(){
      this.loading=true;
      this._PolicyService.getAllBanks().subscribe(data=>{
        this.AllBanks =data;
        this.loading=false;
        console.log(this.AllBanks);
      },error=>{
        this.loading=false;
      })
    }
  ////// set Numbers
  setDepositNumber(){
    console.log(this.DepositForm.get('bankName')?.value);
    // this.DepositForm.get('bankName')?.value
    let Exist = this.AllBanks.find((item:any)=>item.bankId==this.DepositForm.get('bankName')?.value);
    console.log(Exist);
    // this.DepositForm.get('transferNumber')?.setValue(Exist.bank)
    this.bankAccounts = Exist.bankAccounts
    
  }
  ngOnInit(){
    this.getBrokerCustomers();
    this.Search();
    this.getAllBanks();
  } 
}
