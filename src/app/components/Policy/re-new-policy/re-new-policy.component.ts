import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PolicyService } from 'src/app/services/policy.service';
import Swal from 'sweetalert2';
declare var $:any
@Component({
  selector: 'app-re-new-policy',
  templateUrl: './re-new-policy.component.html',
  styleUrls: ['./re-new-policy.component.scss'],
  providers: [DatePipe]
})
export class ReNewPolicyComponent implements OnInit{
  BrokerValue:any =''
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
  MinExpiryDate:any
  isLoading:boolean =false
  InsuranceClassvalue:any
  TpaIdValue:any
  AllBranches:any
  OfferId:any
  loading:boolean=false
  ThePolicy:any
  PolicyId:any
  FileName:any
  validExpiry:any
  periodValue: any;
  minInceptionDate:any;
  constructor(public datePipe: DatePipe,private _ActivatedRoute:ActivatedRoute,private _Router:Router, private _PolicyService:PolicyService, private _ToastrService:ToastrService){
    this.PolicyId = this._ActivatedRoute.snapshot.paramMap.get('id')
    
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
    this.AfterInceptionYear.setDate(this.today.getDate() -5);
    // this.MinExpiryDate.setDate(this.today.getDate() -4);
  }
                ///Form
  MainForm:FormGroup = new FormGroup({
    
    'InceptionDate':new FormControl('',[Validators.required]),
    'ExpiryDate':new FormControl('',[Validators.required]),
    'IssueDate':new FormControl(this.today,[Validators.required]),
    'PaymentPeriod':new FormControl('',[Validators.required]),
    'TpaFees':new FormControl('',[Validators.required]),
    'Brokerage':new FormControl('',[Validators.required]),
    'RegNo':new FormControl('',[Validators.required]),
    'TaxNo':new FormControl('',[Validators.required]),
    'BranchId':new FormControl('',[Validators.required])
    ,
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

     //////////////////////////////////// SaveUpdate //////////////// //////////////////
     SaveUpdate(){
      this.isLoading =true
      let model = Object.assign(this.MainForm.value,
        {InceptionDate:this.datePipe.transform(this.MainForm.get('InceptionDate')?.value,'yyyy-MM-dd')},
        {ExpiryDate:this.datePipe.transform(this.MainForm.get('ExpiryDate')?.value,'yyyy-MM-dd')},
        {IssueDate:this.datePipe.transform(this.MainForm.get('IssueDate')?.value,'yyyy-MM-dd')},
        {Settlement1:this.datePipe.transform(this.MainForm.get('Settlement1')?.value,'yyyy-MM-dd')==null?'':this.datePipe.transform(this.MainForm.get('Settlement1')?.value,'yyyy-MM-dd')},
        {Settlement2:this.datePipe.transform(this.MainForm.get('Settlement2')?.value,'yyyy-MM-dd')==null?'':this.datePipe.transform(this.MainForm.get('Settlement2')?.value,'yyyy-MM-dd')},
        {Settlement3:this.datePipe.transform(this.MainForm.get('Settlement3')?.value,'yyyy-MM-dd')==null?'':this.datePipe.transform(this.MainForm.get('Settlement3')?.value,'yyyy-MM-dd')},
        {Settlement4:this.datePipe.transform(this.MainForm.get('Settlement4')?.value,'yyyy-MM-dd')==null?'':this.datePipe.transform(this.MainForm.get('Settlement4')?.value,'yyyy-MM-dd')},
        {PolicyId:Number(this.PolicyId)},
        {OfferId:Number(this.OfferId)}
        )
      console.log(model);
                  // Append Model
        for (const key of Object.keys(model)) {
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
    
                    // Append group file
        this.formData.append('GroupFile',this.selectedGroupFile)

        for (var pair of this.formData.entries()) {
          console.log(pair[0]+ ', ' + pair[1]); 
      }

      this._PolicyService.ReNewPolicy(this.formData).subscribe((res:any)=>{
        console.log(res);
        this.isLoading =false
        this._Router.navigate(['/PolicyCalculations/'+res.policyId])
        Swal.fire('Policy Renewed Successfully','','success')
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
    // for(let i=0;i<this.AddedPlans.length;i++){
    //   this.formData.delete('PlansToAdd['+ i +'].planName')
    //   this.formData.delete('PlansToAdd['+ i+ '].annualMaxLimit')
    //   this.formData.delete('PlansToAdd['+ i+ '].netPremium')
    // }
    // for(let i=0;i<this.removedPlans.length;i++){
    //   this.formData.delete('PlansToRemove['+ i +']')
    // }
    // this.formData.delete('IssueDate')
    // this.formData.delete('PlanFile')
    // this.formData.delete('OfferId')
    // this.formData.delete('PolicyId')
    // this.formData.delete('InceptionDate')
    // this.formData.delete('PaymentPeriod')
    // this.formData.delete('ExpiryDate')
    // this.formData.delete('GroupFile')
    // this.formData.delete('OfferFile')
    // this.formData.delete('Brokerage')
    // this.formData.delete('TpaFees')
    // this.formData.delete('Settlement1')
    // this.formData.delete('Settlement2')
    // this.formData.delete('Settlement3')
    // this.formData.delete('Settlement4')
    // this.formData.delete('Settlement4')
  }
  uploadPlanFile(event: any){
      this.selectedPlanFile = event.target.files[0] ?? null;
      event.target.value='' 
  }
  uploadGroupFile(event: any){
    this.selectedGroupFile = event.target.files[0] ?? null;
    event.target.value=''
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
      // Payment Period
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
      
      var After6Inception = new Date(this.MainForm.get('InceptionDate')?.value)
      After6Inception.setDate(After6Inception.getDate() + 180)
      this.MainForm.get("Settlement2")?.setValue(After6Inception)

      $(".payment3").hide(400);
      $(".payment4").hide(400);
      this.MainForm.get("Settlement3")?.setValue('')
      this.MainForm.get("Settlement4")?.setValue('')
    }else if(value ==2){          // 3
      $(".payment1").show(400);
      $(".payment2").show(400);
      $(".payment3").show(400);
      $(".payment4").show(400);
      // 4 Mon
      var After4Inception = new Date(this.MainForm.get('InceptionDate')?.value)
      After4Inception.setDate(After4Inception.getDate() + 120)
      this.MainForm.get("Settlement2")?.setValue(After4Inception)
      
      // 8 Mon
      var After8Inception = new Date(this.MainForm.get('InceptionDate')?.value)
      After8Inception.setDate(After8Inception.getDate() + 240)
      this.MainForm.get("Settlement3")?.setValue(After8Inception)
      
      // year
      var AfterYearInception = new Date(this.MainForm.get('InceptionDate')?.value)
      AfterYearInception.setFullYear(AfterYearInception.getFullYear()+1)
      this.MainForm.get("Settlement4")?.setValue(AfterYearInception)
      

    }
  }

        // get Policy Details By Id
  getThePolicyById(){
    this.loading=true;
    this._PolicyService.getThePolicyById(this.PolicyId).subscribe((data:any)=>{
      this.ThePolicy =data;
      this.OfferId = data.offerId
      this.loading=false;
      this.OfferPlans = data.plans;
      this.OfferGroup = data.group

      let inception = new Date(data.expiryDate);
      inception.setDate(inception.getDate() + 2);
      // edit
      this.MainForm.get('InceptionDate')?.setValue(this.datePipe.transform(inception,'yyyy-MM-dd') )
      this.MainForm.get('TpaFees')?.setValue(data.tpaFeesPCT)
      this.MainForm.get('Brokerage')?.setValue(data.brokerage)
      this.MainForm.get('TaxNo')?.setValue(data.taxNo)
      this.MainForm.get('RegNo')?.setValue(data.regNo)
      this.MainForm.get('BranchId')?.setValue(data.branch)
      let Expiry = new Date(this.MainForm.get('InceptionDate')?.value);
      Expiry.setFullYear(Expiry.getFullYear()+1)
      //edit
      this.MainForm.get('ExpiryDate')?.setValue(this.datePipe.transform(Expiry,'yyyy-MM-dd'))
      // Added new
      this.MainForm.get('IssueDate')?.setValue(this.datePipe.transform(data.issueDate,'yyyy-MM-dd'))

      
      // min expiry Date 
      this.MinExpiryDate =new Date()
      this.MinExpiryDate.setDate(inception.getDate());
      console.log(data);
      // min inception Date 
      this.minInceptionDate = new Date(this.ThePolicy.expiryDate)
      this.minInceptionDate.setDate(this.MinExpiryDate.getDate())
      
    })
  }
  getInceptionDate(e:any){
    let NewExpiy = new Date(e.target.value)
    NewExpiy.setFullYear(NewExpiy.getFullYear() + 1)
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
      
      var After6Inception = new Date(this.MainForm.get('InceptionDate')?.value)
      After6Inception.setDate(After6Inception.getDate() + 180)
      this.MainForm.get("Settlement2")?.setValue(After6Inception)

      $(".payment3").hide(400);
      $(".payment4").hide(400);
      this.MainForm.get("Settlement3")?.setValue('')
      this.MainForm.get("Settlement4")?.setValue('')
    }else if(this.periodValue ==2){          // 3
      $(".payment1").show(400);
      $(".payment2").show(400);
      $(".payment3").show(400);
      $(".payment4").show(400);
      // 4 Mon
      var After4Inception = new Date(this.MainForm.get('InceptionDate')?.value)
      After4Inception.setDate(After4Inception.getDate() + 120)
      this.MainForm.get("Settlement2")?.setValue(After4Inception)
      
      // 8 Mon
      var After8Inception = new Date(this.MainForm.get('InceptionDate')?.value)
      After8Inception.setDate(After8Inception.getDate() + 240)
      this.MainForm.get("Settlement3")?.setValue(After8Inception)
      
      // year
      var AfterYearInception = new Date(this.MainForm.get('InceptionDate')?.value)
      AfterYearInception.setFullYear(AfterYearInception.getFullYear()+1)
      this.MainForm.get("Settlement4")?.setValue(AfterYearInception)
    }
        // Check if incption > expiry
    if(this.MainForm.get('InceptionDate')?.value>this.MainForm.get('ExpiryDate')?.value){
      this._ToastrService.show('','Inception Date Must be Before Inception')
      this.MainForm.get('InceptionDate')?.setErrors([Validators.required])
    }
  }
  checkExpiryDate(e:any){
    let NewExpiy = new Date(e.target.value)
    if(this.MainForm.get("InceptionDate")?.value >= NewExpiy){
      this.MainForm.get('ExpiryDate')?.setErrors([Validators.required])
    }else{
      this.MainForm.get('ExpiryDate')?.setErrors(null)
    }

  }

  getAllBranches(){
    this._PolicyService.getAllBranches().subscribe(data=>{
      console.log(data);
      this.AllBranches = data
      
    })
  }
  ngOnInit(){
    this.getThePolicyById()
    this.getAllBranches()
    
  }
}
