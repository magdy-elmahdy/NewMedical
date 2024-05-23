import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LottieTransferState } from 'ngx-lottie';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { PolicyService } from 'src/app/services/policy.service';
import Swal from 'sweetalert2';
declare var $:any
@Component({
  selector: 'app-convert-to-policy',
  templateUrl: './convert-to-policy.component.html',
  styleUrls: ['./convert-to-policy.component.scss'],
  providers: [DatePipe]
})
export class ConvertToPolicyComponent {
  customerDetails:any
  brokerInputValidation:Boolean = false
  BusinessTypes:any
  BusinessTypeValue:any
  IndividualOrCorporate:any
  BrokerValue:any =''
  OfferDetails:any
  selectedPlanFile:any=''
  selectedGroupFile:any=''
  selectedPdfFile:any=''
  OfferPlans:any[]=[]
  OfferGroup:any
  removedPlans:any[]=[]
  AddedPlans:any[]=[]
  loadingDetails:boolean=false;
  formData:any = new FormData()
  InsuranceClasses:any[]=[]
  today:any = new Date()
  Before5Days:any = new Date()
  aYearFromNow:any = new Date();
  AfterInceptionYear:any = new Date();
  After1Week:any = new Date()
  After3Month:any = new Date()
  After4Month:any = new Date()
  After6Month:any = new Date()
  After8Month:any = new Date()
  After9Month:any = new Date()
  After12Month:any = new Date()
  MinExpiryDate:any = new Date()
  isLoading:boolean =false
  InsuranceClassvalue:any
  TpaIdValue:any
  OfferId:any
  FileName:any
  maxInception:any =new Date()
  periodValue: any;
  listOfTpa: any;
  MaxTpaFees:any
  AllBranches:any
  date3:String=''
  constructor( private _ActivatedRoute:ActivatedRoute,public datePipe: DatePipe,private _AdminService:AdminService,private _ToastrService:ToastrService, private _PolicyService:PolicyService,private _Router:Router){
    this.OfferId = this._ActivatedRoute.snapshot.paramMap.get('id')
    console.log(this.OfferId);

    this.Before5Days.setDate(this.today.getDate() -5);
    this.After1Week.setDate(this.today.getDate() +7);
    this.After3Month.setDate(this.today.getDate() +90);
    this.After4Month.setDate(this.today.getDate() +120);
    this.After6Month.setDate(this.today.getDate() +180);
    this.After8Month.setDate(this.today.getDate() +240);
    this.After9Month.setDate(this.today.getDate() +270);
    this.After12Month.setDate(this.today.getDate() +365);
    this.aYearFromNow.setFullYear(this.aYearFromNow.getFullYear() + 1);
    this.AfterInceptionYear.setFullYear(this.today.getFullYear() + 1);
    this.AfterInceptionYear.setDate(this.today.getDate() -6);
    this.MinExpiryDate.setDate(this.today.getDate() -4);
  }
              ///Form
  MainForm:FormGroup = new FormGroup({
    
    'InceptionDate':new FormControl('',[Validators.required]),
    'ExpiryDate':new FormControl('',[Validators.required]),
    'PaymentPeriod':new FormControl('',[Validators.required]),
    'brokerage':new FormControl('',[Validators.required]),
    'tpaId':new FormControl('',[Validators.required]),
    'tpaFees':new FormControl('',[Validators.required]),
    'BranchId':new FormControl('',[Validators.required]),
    'customerId':new FormControl('',[Validators.required]),
    'TaxNo':new FormControl('',[Validators.required]),
    'RegNo':new FormControl('',[Validators.required]),
    
    'Settlement1':new FormControl(''),
    'Settlement2':new FormControl(''),
    'Settlement3':new FormControl(''),
    'Settlement4':new FormControl(''),
  })
                ///Add Plan Form
  PlanForm:FormGroup = new FormGroup({
    'PlanName':new FormControl('',[Validators.required]),
    'AnnualMaxLimit' :new FormControl('',[Validators.required]),
    'NetPremium' :new FormControl('',[Validators.required]),
  })
    // Show Add New Plan
    showNewPlan(){
      $("#AddPlan").toggle(500)
    }
  getBrokerVal(){
    if(this.BrokerValue== ''){
      this.brokerInputValidation= true
    }else{
      this.brokerInputValidation= false
    }
  }
  uploadGroupFile(event: any){
    this.selectedGroupFile = event.target.files[0] ?? null;
    event.target.value=''
  }
  uploadPlanFile(event: any){
    this.selectedPlanFile = event.target.files[0] ?? null;
    event.target.value='' 
  }
      // Show & hide Broker Details
      getSourceVal(value:any){
        console.log(value);
        if(value==1){
          $("#BrokerFiled").show(400)
          this.brokerInputValidation= true  
          this.MainForm.get('BrokerId')?.setValidators([Validators.required])
        }else{
          $("#BrokerFiled").hide(400)
          this.MainForm.get('BrokerId')?.setValue(0)
          this.MainForm.get('BrokerId')?.clearValidators()
          this.MainForm.get('BrokerId')?.updateValueAndValidity()
  
        }
      }
        // get offer Details To Edit
  getOfferDetails(){
      this.loadingDetails=true
      this._PolicyService.getOfferById(this.OfferId).subscribe((data:any)=>{
      console.log(data);
      
      this.loadingDetails=false
      this.OfferDetails = data;
      this.OfferPlans = data.plans;
      this.OfferGroup = data.customerGroups
      this.MaxTpaFees = this.OfferDetails?.tpaFees
      this.MainForm.get('BranchId')?.setValue(this.OfferDetails.branchId)

      
      this.MainForm.get('tpaFees')?.setValue(this.OfferDetails.tpaFees*100)
      this.MainForm.get('tpaId')?.setValue(this.OfferDetails.tpaId)
      this.MainForm.get('brokerage')?.setValue(this.OfferDetails.brokage*100)
      this.MainForm.get('TaxNo')?.setValue(this.OfferDetails.taxNo)
      this.MainForm.get('RegNo')?.setValue(this.OfferDetails.regNo)
      this.MainForm.get('Branch')?.setValue(this.OfferDetails.branch)
      this.MainForm.get('InceptionDate')?.setValue(this.Before5Days)
      // this.MainForm.get('InceptionDate')?.setValue(this.today)
      this.MainForm.get('ExpiryDate')?.setValue(this.AfterInceptionYear)
      this.maxInception = new Date(this.MainForm.get('ExpiryDate')?.value)
      this.maxInception.setDate(this.maxInception.getDate()-1)
    },error=>{
      this.loadingDetails=false
    })
  }

        //////////////////////////////////// SaveUpdate //////////////// //////////////////
  SaveUpdate(){
          this.isLoading =true
          let model = Object.assign(this.MainForm.value,
            {InceptionDate:this.datePipe.transform(this.MainForm.get('InceptionDate')?.value,'yyyy-MM-dd')},
            {ExpiryDate:this.datePipe.transform(this.MainForm.get('ExpiryDate')?.value,'yyyy-MM-dd')},
            {Settlement1:this.datePipe.transform(this.MainForm.get('Settlement1')?.value,'yyyy-MM-dd')==null?'':this.datePipe.transform(this.MainForm.get('Settlement1')?.value,'yyyy-MM-dd')},
            {Settlement2:this.datePipe.transform(this.MainForm.get('Settlement2')?.value,'yyyy-MM-dd')==null?'':this.datePipe.transform(this.MainForm.get('Settlement2')?.value,'yyyy-MM-dd')},
            {Settlement3:this.datePipe.transform(this.MainForm.get('Settlement3')?.value,'yyyy-MM-dd')==null?'':this.datePipe.transform(this.MainForm.get('Settlement3')?.value,'yyyy-MM-dd')},
            {Settlement4:this.datePipe.transform(this.MainForm.get('Settlement4')?.value,'yyyy-MM-dd')==null?'':this.datePipe.transform(this.MainForm.get('Settlement4')?.value,'yyyy-MM-dd')},
            {OfferId:Number(this.OfferId)},
            {tpaFees:Number(this.MainForm.get('tpaFees')?.value)/100},
            {brokerage:Number(this.MainForm.get('brokerage')?.value)/100},
            
            )
          console.log(model);
                      // Append Model
            for (const key of Object.keys(model)){
              const value = model[key];
              this.formData.append(key, value);
            }
            console.log(model);
            
          //         /// Append removed plans
            for(let i=0;i<this.removedPlans.length;i++){
              this.formData.append('PlansToRemove['+ i +']',this.removedPlans[i])
            }
        //           ///// Append Added Plans
            for(let i=0;i<this.AddedPlans.length;i++){
              this.formData.append('PlansToAdd['+ i +'].planName',this.AddedPlans[i].planName)
              this.formData.append('PlansToAdd['+ i +'].annualMaxLimit',this.AddedPlans[i].annualMaxLimit)
              this.formData.append('PlansToAdd['+ i +'].netPremium',this.AddedPlans[i].netPremium)
            }

        //         // OfferFile
        this.formData.append('OfferFile',this.selectedPdfFile)
        this.formData.append('PlanFile',this.selectedPlanFile)
        this.formData.append('GroupFile',this.selectedGroupFile)
                //   //// Append group file

        for (var pair of this.formData.entries()){
          console.log(pair[0]+ ', ' + pair[1]); 
        }

          this._PolicyService.ConvertOfferToPolicy(this.formData).subscribe((res:any)=>{
            this.isLoading =false
            console.log(res);
            Swal.fire('Offer Converted To Policy Successfully','','success')
            this._Router.navigate(['/groupNetPremium/'+res.policyId]);
            this.clearFormData()
          },error=>{
            this.isLoading =false
            Swal.fire({icon: 'error',title:error.error,text:''})
            console.log(error);
            this.clearFormData()
          })
    }
                /// Delete Form Data
  clearFormData(){
    this.formData = new FormData()

  }
   //get Business Types
   getBusinessTypes(){
    this._AdminService.getBusinessTypes().subscribe(data=>{
      this.BusinessTypes=data;
    })
  }
    // Show Currernt Group
  showCurrentGroup(){
    $("#currentGroup").toggle(500)
  }
   //Remove item From Table
   remove(index:number,planId:any,name:any){
    var item = this.AddedPlans.find(item=>item.planName == name)
    if(item !=undefined){
      let index = this.AddedPlans.indexOf(item)
      this.AddedPlans.splice(index,1)
      console.log(this.AddedPlans);
    }
    
    this.OfferPlans.splice(index, 1)
    console.log(this.OfferPlans);
        //remove
    if(planId!=undefined){
    this.removedPlans.push(planId)
    }
    console.log(this.removedPlans);
  }
  view(){
    var item = this.OfferPlans.find(item=>this.PlanForm.get('PlanName')?.value == item.planName)

    if(item==undefined){
      let Model= {
      'planName':this.PlanForm.get('PlanName')?.value,
      'annualMaxLimit':this.PlanForm.get('AnnualMaxLimit')?.value,
      'netPremium':this.PlanForm.get('NetPremium')?.value,
    }
      this.OfferPlans.push(Model);
      this.AddedPlans.push(Model)
      console.log(this.OfferPlans);
      this.PlanForm.reset()
    }else{
      this._ToastrService.show('The Plan Name is Already Exist')
    }
    
  }
  getInsuraneClass(){
    this._AdminService.getInsuraneClass().subscribe((data:any)=>{
      this.InsuranceClasses=data;
    })
  }
  getTempleteFile(){
    this._PolicyService.GetPolicyGroupTemplateFile().subscribe(res=>{
      let blob:Blob = res.body as Blob
      this.FileName= 'groupOfPolicy.xlsx'
      let a= document.createElement('a');
      a.download=this.FileName
      a.href=window.URL.createObjectURL(blob)
      a.click()
    })
  }
  uploadPdfFile(e:any){
    this.selectedPdfFile = e.target.files[0] ?? null;
    console.log(this.selectedPdfFile);
    // e.target.value='' 
  }

    /////////////////////////////////////////

  getPaymentPeriod(value:any){
    
    this.MainForm.get("Settlement1")?.setValue(this.MainForm.get('InceptionDate')?.value)
    this.periodValue=value
    if(value ==0){                // 1 
      $(".payment1").show(400);

      $(".payment2").hide(400);
      $(".payment3").hide(400);
      $(".payment4").hide(400);
      this.MainForm.get("Settlement2")?.setValue('')
      this.MainForm.get("Settlement3")?.setValue('')
      this.MainForm.get("Settlement4")?.setValue('')
    }else if(value ==1){          // 2
      $(".payment1").show(400);
      $(".payment2").show(400);
      
      // 6
      const Month6 = this.addMonths(new Date(this.MainForm.get('InceptionDate')?.value), 6 , 6);
      this.MainForm.get("Settlement2")?.setValue(this.datePipe.transform(Month6,'YYYY-MM-dd'))

      $(".payment3").hide(400);
      $(".payment4").hide(400);
      this.MainForm.get("Settlement3")?.setValue('')
      this.MainForm.get("Settlement4")?.setValue('')
    }else if(value ==2){          // 3
      $(".payment1").show(400);
      $(".payment2").show(400);
      $(".payment3").show(400);
      $(".payment4").show(400);

      // 3
      const Month3 = this.addMonths(new Date(this.MainForm.get('InceptionDate')?.value), 3 , 3);
      this.MainForm.get("Settlement2")?.setValue(this.datePipe.transform(Month3,'YYYY-MM-dd'))

      // 6
      const Month6 = this.addMonths(new Date(this.MainForm.get('InceptionDate')?.value), 6 , 6);
      this.MainForm.get("Settlement3")?.setValue(this.datePipe.transform(Month6,'YYYY-MM-dd'))

      // 9
      const Month9 = this.addMonths(new Date(this.MainForm.get('InceptionDate')?.value), 9 , 9);
      this.MainForm.get("Settlement4")?.setValue(this.datePipe.transform(Month9,'YYYY-MM-dd'))

      
    }
  }

  checkExpiryDate(){
    this.maxInception = ''
    this.maxInception = new Date(this.MainForm.get('ExpiryDate')?.value)
    this.maxInception.setDate(this.maxInception.getDate()-1)
  }

  getInception(e:any){
    let NewExpiy = new Date(e.target.value)
    NewExpiy.setFullYear(NewExpiy.getFullYear() + 1)
    NewExpiy.setDate(NewExpiy.getDate()-1)
    this.MainForm.get('ExpiryDate')?.setValue(NewExpiy)

    this.MainForm.get("Settlement1")?.setValue(this.MainForm.get('InceptionDate')?.value)
    this.periodValue
    if(this.periodValue ==0){                // 1 
      $(".payment1").show(400);

      $(".payment2").hide(400);
      $(".payment3").hide(400);
      $(".payment4").hide(400);
      this.MainForm.get("Settlement2")?.setValue('')
      this.MainForm.get("Settlement3")?.setValue('')
      this.MainForm.get("Settlement4")?.setValue('')
    }else if(this.periodValue ==1){          // 2
      $(".payment1").show(400);
      $(".payment2").show(400);
      // 6
      const Month6 = this.addMonths(new Date(this.MainForm.get('InceptionDate')?.value), 6 , 6);
      this.MainForm.get("Settlement2")?.setValue(this.datePipe.transform(Month6,'YYYY-MM-dd'))

      $(".payment3").hide(400);
      $(".payment4").hide(400);
      this.MainForm.get("Settlement3")?.setValue('')
      this.MainForm.get("Settlement4")?.setValue('')
    }else if(this.periodValue ==2){          // 3
      $(".payment1").show(400);
      $(".payment2").show(400);
      $(".payment3").show(400);
      $(".payment4").show(400);
      // 3 Mon
      const Month3 = this.addMonths(new Date(this.MainForm.get('InceptionDate')?.value), 3 , 3);
      this.MainForm.get("Settlement2")?.setValue(this.datePipe.transform(Month3,'YYYY-MM-dd'))
      
      // 6 Mon
      const Month6 = this.addMonths(new Date(this.MainForm.get('InceptionDate')?.value), 6 ,6);
      this.MainForm.get("Settlement3")?.setValue(this.datePipe.transform(Month6,'YYYY-MM-dd'))
      
      // 9 mon
      const Month9 = this.addMonths(new Date(this.MainForm.get('InceptionDate')?.value), 9 ,9);
      this.MainForm.get("Settlement4")?.setValue(this.datePipe.transform(Month9,'YYYY-MM-dd'))


    }
        // Check if incption > expiry
    if(this.MainForm.get('InceptionDate')?.value>this.MainForm.get('ExpiryDate')?.value){
      this._ToastrService.show('','Inception Date Must be Before Inception')
      this.MainForm.get('InceptionDate')?.setErrors([Validators.required])
    }
  }

  getListOfTpa(){
    this._PolicyService.getListOfTpa().subscribe(data=>{
      this.listOfTpa = data;
      console.log(data);
    })
  }
  getTpaCustomer(id:any){
    this.MainForm.get('tpaFees')?.setValue('')
    this._AdminService.getFeesOfTpa(id).subscribe((data:any)=>{
      this.MainForm.get('tpaFees')?.setValue(data?.fees*100)
      this.MaxTpaFees = data.fees
  })
    
  }
  getAllBranches(){
    this._PolicyService.getAllBranches().subscribe(data=>{
      console.log(data);
      this.AllBranches = data
      
    })
  }
  

  addMonths(date : Date, months : number, count:number) {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + months);
    const diffDate = this.getMonthDifference(newDate , date);
    if(diffDate > count)
    {
      console.log("True");
      newDate.setMonth(newDate.getMonth() -1);
      newDate.setDate(this.getLastDayOfMonth(newDate));
    }
    return newDate;
  }
  getMonthDifference(startDate : Date, endDate : Date) {
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
  
    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth();
  
    return Math.abs((endYear - startYear) * 12 + (endMonth - startMonth));
  }
  
  getLastDayOfMonth(date : Date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }
  
  // Get Corporate  & Indivudual
  getAllIndividualOrCorporate(){
    this._PolicyService.GetListOfIndividualAndCorporate().subscribe(data=>{
      this.IndividualOrCorporate=data;
    })
  }
  getCustomerId(){
    this._AdminService.getCustomerById(this.MainForm.get('customerId')?.value).subscribe((data:any)=>{
      console.log(data);
      this.customerDetails = data
      this.MainForm.get('TaxNo')?.setValue(data.taxNo)
      this.MainForm.get('RegNo')?.setValue(data.regNo)
    })
  }
  
  checkTax(){
    if(this.MainForm.get("taxNo")?.value==null){
    }else{
      if(String(this.MainForm.get("taxNo")?.value).length<9){
        this.MainForm.get("taxNo")?.setErrors({incorrect:true})
      }else if(String(this.MainForm.get("taxNo")?.value).length==9){
        this.MainForm.get("taxNo")?.setErrors(null)
      }else if(String(this.MainForm.get("taxNo")?.value).length>9){
        this._ToastrService.show("Tax number can not be more than 9")
        this.MainForm.get("taxNo")?.setErrors({incorrect:true})
      }
    }
  }
  ngOnInit(): void {
    this.getAllIndividualOrCorporate();       
    this.getBusinessTypes();       
    this.getInsuraneClass()
    this.getOfferDetails()
    this.getListOfTpa()
    this.getAllBranches()
  }
}
