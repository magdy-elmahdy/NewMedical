import { DOCUMENT, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { FilesService } from 'src/app/services/files.service';
import Swal from 'sweetalert2';
declare var $:any;
@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent implements OnInit{

  
  BusinessTypeValue:any ='0'
  insuranceClassValue:any;
  commissionTypeValue:any;
  paymentWayValue:any='0'
  arr:any[]=[]
  CustomerId:any
  CustomerDetails:any
  BusinessTypes:any
  InsuranceClasses:any
  CommisionTypes:any;
  paymentWays:any
  pctCommission:any;
  addCommissionErrorMsg:any;
  addEarlyErrrorMsg:any
  pct:number=0
  amount:number=0
  loading:boolean=false
  validCommistionSelects:boolean=false;
  isClickedGetFile:boolean=false

  selectedFile1:any
  selectedFile2:any
  selectedFile3:any
  selectedFile4:any
  constructor(private _FilesService:FilesService ,private _ActivatedRoute:ActivatedRoute ,private _AdminService:AdminService, public _Location:Location,private _ToastrService:ToastrService){
    this._ActivatedRoute.snapshot.paramMap.get('id');
    this.CustomerId= this._ActivatedRoute.snapshot.paramMap.get('id');
  }

  Form:FormGroup = new FormGroup({
    'from':new FormControl(''),
    'to':new FormControl(''),
    'pre':new FormControl(''),
    'amount':new FormControl(''),
    'includeHolidays':new FormControl(false)
  })
  comisionForm = new FormGroup({
    'per':new FormControl(''),
  })
  check1(e:any){
    this.pct=e.target.value;
  }
  check2(e:any){
    this.amount=e.target.value
  }

  closeButton(){
    document.getElementById("close")?.click()
    document.getElementById("closeStageAge")?.click()
    document.getElementById("closeAddPlan")?.click()

  }
  submitCommissionToCustomerForm(){
    let Model =Object.assign(
      {pct:Number(this.pct/100)},
      {amount:Number(this.amount)},
      {businessType:this.BusinessTypeValue},
      {insuranceClass:this.insuranceClassValue},
      {commissionType:this.commissionTypeValue},
      {paymentWay:this.paymentWayValue},
      {customerId:this.CustomerDetails.id}
      )
      console.log(Model);
      
    this._AdminService.addCommissionToCustomer(Model).subscribe(data=>{
      console.log(data);
      
      document.getElementById("close")?.click()
      Swal.fire(
        'Good job!',
        'Commission Added Successfully',
        'success'
      )
      this._ToastrService.success("Commission Added Successfully","Well Done" )
    },error=>{
      
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.error,
        
      })
      console.log(error);
      this.addCommissionErrorMsg=error.error;
      this._ToastrService.error(this.addCommissionErrorMsg , 'Error Occurred');
    })
    
  }
  SubmitAddEarly(){
    let Model ={
      customerId:this.CustomerDetails.id,
      businessType:this.BusinessTypeValue,
      insuranceClass:this.insuranceClassValue,
      earlyCollectorData:this.arr
    }
    console.log(Model);
    this._AdminService.addEarlyCollect(Model).subscribe(data=>{
      document.getElementById("closeEarly")?.click()
      Swal.fire(
        'Good job!',
        'Early & Collect Added Successfully',
        'success'
      )
      this._ToastrService.success( "Early Collect Added Successfully","Well Done" )
      console.log(data);
      
    },error=>{
      console.log(error.error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.error,
        
      })
      this.addEarlyErrrorMsg=error.error;
      this._ToastrService.error(this.addEarlyErrrorMsg , 'Error Occurred');
    })
    
  }
        // Commistion selects Form Validations
  CommissionSelectValidation(){
    if(this.insuranceClassValue!=null && this.commissionTypeValue!=null){
      this.validCommistionSelects=true;
    }
  }

  getCustomerById(){
    this.loading=true
    this._AdminService.getCustomerById(this.CustomerId).subscribe(data=>{
      this.loading=false
      this.CustomerDetails =data
      console.log(data);
      
    },error=>{
    this.loading=true
    })
  }

  getCommissionTypeValue(e:any){
    console.log(e.value);
    if(e.value==0){
      $("#wayOfPayment").hide(300)
      this.paymentWayValue= '0'
    }else if(e.value=1){
      $("#wayOfPayment").show(300)
    }
  }
   // Add And view Item From Lose Participation List
   view(){
    let Model={
      from:this.Form.get('from')!.value,
      to:this.Form.get('to')!.value,
      pre:this.Form.get('pre')!.value,
      amount:this.Form.get('amount')!.value,
      includeHolidays:this.Form.get('includeHolidays')!.value,
    }
    this.arr.push(Model);
    this.Form.get('from')!.setValue('')
    this.Form.get('to')!.setValue('')
    this.Form.get('pre')!.setValue('')
    this.Form.get('amount')!.setValue('')
    this.Form.get('includeHolidays')!.setValue(false)
    console.log(this.arr);
  }
   //Remove item From Loss Participations List
   remove(index:number){
    this.arr.splice(index, 1)
  }
    //get Business Types
  getBusinessTypes(){
    this._AdminService.getBusinessTypes().subscribe(data=>{
      this.BusinessTypes=data;
    })
  }
    //get Insurance Types
  getInsuraneClass(){
    this._AdminService.getInsuraneClass().subscribe(data=>{
      this.InsuranceClasses=data;
    })
  }
    //get Commission Types
  getCommissionTypes(){
    this._AdminService.getCommissionTypes().subscribe(data=>{
      this.CommisionTypes=data;
    })
  }
    //getPayment Ways
    getPaymentWays(){
    this._AdminService.getPaymentWays().subscribe(data=>{
      this.paymentWays=data;
    })
  }

  coverageCondition(e:any){
    if(e.value==1){
      console.log("1");
      $("#coverageRadio").show(400)
      $("#coverageRadio2").show(400)
      $("#coverageRadio3").show(400)
    }else{
      $("#coverageRadio").hide(400)
      $("#coverageRadio2").hide(400)
      $("#coverageRadio3").hide(400)
    }
  }
    ///////////////////////  Plan Modal  /////////////////////
  typeOfServiceValue:any;
  GeographicalScopeVAlue:any
  palnForm:FormGroup=new FormGroup({
    'planName':new FormControl('',[Validators.required]),
    'annualMaxLimit':new FormControl('',[Validators.required]),
    'accommodationClass':new FormControl('',[Validators.required]),
  })
  submitPlan(){
    let Model =Object.assign(this.palnForm.value,
      {typeOfService:this.typeOfServiceValue},
      {geographicalScope:this.GeographicalScopeVAlue},
      {customerId:this.CustomerId})
      console.log(Model);
    this._AdminService.AddNewPlan(Model).subscribe((data:any)=>{
      console.log(data);
      this.ageForm.reset();
      this.closeButton();
      Swal.fire(
        'Good job!',
        'Plan '+ data.planName +" Added Successfully",
        'success'
      )
      
    },error=>{
      console.log(error);
      
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.error,
      })
    })
      
  }
    ///////////////////////  Age Stages Modal   /////////////////////
    agesOfTpa:any
    ageForm:FormGroup=new FormGroup({
      'from':new FormControl('',[Validators.required]),
      'to':new FormControl('',[Validators.required])
    })
    submitAddAgeToCustomer(){
      let Model= Object.assign(this.ageForm.value,{customerId:Number(this.CustomerId)});
      console.log(Model);
      
      this._AdminService.addAgeToTpaCustomer(Model).subscribe(data=>{
        console.log(data);
        this.getAgesOfTpa();
        Swal.fire(
          'Good job!',
          'Age Added To Customer Successfully',
          'success'
        )
        this.ageForm.reset();
        this.closeButton();
      },error=>{
        console.log(error);
        
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.error,
        })
      })
      
    }
  getAgesOfTpa(){
    this._AdminService.GetAgesOfTpa(this.CustomerId).subscribe(data=>{
      this.agesOfTpa=data;
    })
  }
  goBack(){
    this._Location.back()
  }

  // imageToShow: any;
  imageToShow:any
createImageFromBlob(image: Blob) {
  let reader = new FileReader();
  reader.addEventListener("load", () => {
     this.imageToShow = reader.result;
  }, false);

  if (image) {
     reader.readAsDataURL(image);
  }
}
  loadFile1:boolean = false
  FileName:any
  getCustomerFile(type:any){
    this.isClickedGetFile=true
    this.loading=true
    this._FilesService.getCustomerFile(this.CustomerId ,type).subscribe(res=>{
      this.loading=false
      this.isClickedGetFile=false
      this.FileName= res.headers.get('content-disposition')?.split(';')[1].split('=')[1];
      let a= document.createElement('a');
      a.setAttribute('href',String(res.url))
      a.click()
    },error=>{
      this.loading=false
      this.isClickedGetFile=false
      console.log(error);
    })
  }

    // Selected File 
    selectedFile:any
    FileExtextion:String=''
    ValidExtention:boolean=false
    isClickedDocumnet:boolean=false
    base64:any
    uploadFile(event: any){
      // Get File Object
    this.selectedFile = event.target.files[0] ?? null;
    console.log(this.selectedFile);
  
    var myString = this.selectedFile.name
    this.FileExtextion=myString.substring(myString.lastIndexOf(".")+1)
    if(this.selectedFile.size==3000000 || this.FileExtextion.toLocaleLowerCase()=='pdf'||this.FileExtextion.toLocaleLowerCase()=='jpeg'||this.FileExtextion.toLocaleLowerCase()=='png'||this.FileExtextion.toLocaleLowerCase()=='webp'){
      this.ValidExtention = true
    }else{
      this.ValidExtention = false
      this._ToastrService.info("","Please Inroll Only Pdf Or Image")
    }
  
      // Base 64
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () =>{
      this.base64 = reader.result;
    }

  
  }
  formData:any = new FormData()
    // Save Documnet
    // Save Documnet
    SaveDocument(){
      this.isClickedDocumnet=true
        var formData = new FormData()
        formData.append('customerId',this.CustomerId);
        formData.append('regFile',this.selectedFile1);
        formData.append('taxesFile',this.selectedFile2);
        formData.append('yourAgentFile',this.selectedFile3);
        for (var pair of this.formData.entries()) {
          console.log(pair[0]+ ', ' + pair[1]); 
      }
        this._AdminService.AddFileToCustomerDetails(formData).subscribe(res => {
          this.selectedFile1 = ''
          this.selectedFile2 = ''
          this.selectedFile3 = ''
          $("#addDoument").modal("toggle")
          this.isClickedDocumnet=false
        Swal.fire({title:'Files Uploaded Successfully',timer:2000,timerProgressBar:true,icon:'success'});
        this._ToastrService.success("File Uploaded Successfully", "Good");
        console.log(res);
        }, error => {
          this.isClickedDocumnet=false
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.error,
          });
      });
    }

uploadFile1(event: any){
  this.selectedFile1 = event.target.files[0] ?? null;
  console.log(this.selectedFile1);
  event.target.value='' 
}
uploadFile2(event: any){
  this.selectedFile2 = event.target.files[0] ?? null;
  console.log(this.selectedFile2);

  event.target.value='' 
}
uploadFile3(event: any){
  this.selectedFile3 = event.target.files[0] ?? null;
  console.log(this.selectedFile3);

  event.target.value='' 
}
uploadFile4(event: any){
  this.selectedFile4 = event.target.files[0] ?? null;
  console.log(this.selectedFile4);

  event.target.value='' 
}
  fileType:any
getFileType(fileType:any){
  this.fileType =fileType
}
  ngOnInit(): void {
    this.getCustomerById();
    this.getBusinessTypes();
    this.getInsuraneClass();
    this.getCommissionTypes();
    this.getPaymentWays();
    this.getAgesOfTpa();
  }
}
