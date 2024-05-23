import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { PolicyService } from 'src/app/services/policy.service';
import Swal from 'sweetalert2';
import { MatStepper } from '@angular/material/stepper';
import { DatePipe, formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
declare var $:any

@Component({
  selector: 'app-all-polices',
  templateUrl: './all-polices.component.html',
  styleUrls: ['./all-polices.component.scss'],
  providers: [DatePipe]
})
export class AllPolicesComponent implements OnInit{
  page:number=1;
  count:number=0;
  tableSize:number=20;
  tableSizes=[20,5,8,10,15];
  permissions:any[]= JSON.parse(localStorage.getItem('permissions')!)

  loading:boolean=false
  BusinessTypeValue:any
  BusinessTypes:any
  IndividualOrCorporate:any
  listOfTpa:any
  BrokerValue:any =''
  brokerCustomers:any =''
  OfferDetails:any
  selectedPlanFile:any=''
  selectedGroupFile:any=''
  OfferPlans:any[]=[]
  OfferGroup:any
  removedPlans:any[]=[]
  AddedPlans:any[]=[]
  loadingDetails:boolean=false;
  formData:any = new FormData()
  InsuranceClasses:any[]=[]
  cusDate:any
  FileName: any;
  isClicked:boolean = false

  constructor(public datePipe: DatePipe,private _Router:Router, private _PolicyService:PolicyService, private _AdminService:AdminService, private _ToastrService:ToastrService){
  }
  
  AllOffers:any              
  term:any

  getAllOffers(){
    this.loading=true;
    this._PolicyService.getAllOffers().subscribe((data:any)=>{
      console.log(data);
      this.AllOffers =data;
      this.loading=false;
    })
  }

  ///////////////>* Edit Offer *</////////////

              ///Form
  PricingIndivualForm:FormGroup = new FormGroup({
    'OfferDate':new FormControl('',[Validators.required]),
    'TpaId':new FormControl(''),
    'InsuranceClass':new FormControl('',[Validators.required]),
    'PolicySource':new FormControl('',[Validators.required]),
    'BusinessType':new FormControl('',[Validators.required]),
    'BrokerId':new FormControl(0,[Validators.required]),
  })
              ///Add Plan Form
  PlanForm:FormGroup = new FormGroup({
    'PlanName':new FormControl('',[Validators.required]),
    'AnnualMaxLimit' :new FormControl('',[Validators.required]),
    'NetPremium' :new FormControl('',[Validators.required]),
  })
      // get offer Details To Edit
  getOfferDetailsToEdit(Offer:any){
    this.resetModalWhenOpen()
    this.loadingDetails=true
    this._PolicyService.getOfferById(Offer.id).subscribe((data:any)=>{
      console.log(data);
      
      this.loadingDetails=false
      this.OfferDetails = data;
      this.OfferPlans = data.plans;
      this.OfferGroup = data.customerGroups
      
      this.setValuesToInputs()
    },error=>{
      this.loadingDetails=false
    })
  }
      // Set Values to Inputs
  setValuesToInputs(){
    if(this.OfferDetails.policySourceInt==1){
      $("#BrokerFiled").show()
    }else{
      $("#BrokerFiled").hide()
    }
    if(this.OfferDetails.brokerId==null||this.OfferDetails.brokerId=='null'||this.OfferDetails.brokerId==''){
    this.PricingIndivualForm.get("BrokerId")?.setValue(0)
    }else{
    this.PricingIndivualForm.get("BrokerId")?.setValue(this.OfferDetails.brokerId)
    }
    this.PricingIndivualForm.get("TpaId")?.setValue(this.OfferDetails?.tpaId)
    this.PricingIndivualForm.get("OfferDate")?.setValue(this.OfferDetails?.offerDate)
    this.PricingIndivualForm.get("InsuranceClass")?.setValue(this.OfferDetails?.insuranceClassInt)
    this.PricingIndivualForm.get("PolicySource")?.setValue(this.OfferDetails?.policySourceInt)
    this.PricingIndivualForm.get("BusinessType")?.setValue(this.OfferDetails?.businessTypeInt)
  }
      //////////////////////////////////// SaveUpdate //////////////// //////////////////
    SaveUpdate(){
      this.isClicked = true
              /// Append removed plans
        for(let i=0;i<this.removedPlans.length;i++){
          this.formData.append('PlansToRemove['+ i +']',this.removedPlans[i])
        }
              ///// Append Added Plans
        for(let i=0;i<this.AddedPlans.length;i++){
          this.formData.append('PlansToAdd['+ i +'].planName',this.AddedPlans[i].planName)
          this.formData.append('PlansToAdd['+ i +'].annualMaxLimit',this.AddedPlans[i].annualMaxLimit)
          this.formData.append('PlansToAdd['+ i +'].netPremium',this.AddedPlans[i].netPremium)
        }
        this.formData.append('PlanFile',this.selectedPlanFile) 
        this.formData.append('TpaId',this.PricingIndivualForm.get('TpaId')?.value==null?'':this.PricingIndivualForm.get('TpaId')?.value) 
                // Append group file
        this.formData.append('GroupFile',this.selectedGroupFile)
                // Append Object
        var Model =Object.assign(this.PricingIndivualForm.value,
        {Id:this.OfferDetails.id},
        
        {OfferDate:this.datePipe.transform(this.PricingIndivualForm.get("OfferDate")?.value, 'yyyy-MM-dd')})
        for (const key of Object.keys(Model)) {
          const value = Model[key];
          this.formData.append(key, value);
        }
        console.log(Model);
        
            // Log
        for (var pair of this.formData.entries()) {
          console.log(pair[0]+ ', ' + pair[1]); 
      }

              //  Send updates

      this._PolicyService.updateOffer(this.formData).subscribe(res=>{
      this.isClicked = false
        this._Router.navigate(['/Calculations/'+this.OfferDetails.id]);
        Swal.fire('Offer Updated Successfully','','success')
        this.getAllOffers()
        console.log(res);
        $("#editOffer").modal("toggle")
        this.formData = new FormData()
      },error=>{
        this.isClicked = false
        Swal.fire({icon: 'error',title:error.error,text:''})
        console.log(error);
        this.formData = new FormData()
      })
      
    }




    //get Business Types
    getBusinessTypes(){
      this._AdminService.getBusinessTypes().subscribe(data=>{
        this.BusinessTypes=data;
      })
    }
    getAllIndividualOrCorporate(){
    this._PolicyService.GetListOfIndividualAndCorporate().subscribe(data=>{
      this.IndividualOrCorporate=data;
    })
  }
  getListOfTpa(){
    this._PolicyService.getListOfTpa().subscribe(data=>{
      this.listOfTpa = data;
    })
  }
  getInsuraneClass(){
    this._AdminService.getInsuraneClass().subscribe((data:any)=>{
      this.InsuranceClasses=data;
    })
  }
    // Show & hide Broker Details
  getSourceVal(value:any){
      console.log(value);
      if(value==1){
        $("#BrokerFiled").show(400)
        this.PricingIndivualForm.get('BrokerId')?.setValidators([Validators.required])
        this.PricingIndivualForm.get('BrokerId')?.updateValueAndValidity()
      }else{
        $("#BrokerFiled").hide(400)
        this.PricingIndivualForm.get('BrokerId')?.setValue(0)
        this.PricingIndivualForm.get('BrokerId')?.clearValidators()
        this.PricingIndivualForm.get('BrokerId')?.updateValueAndValidity()

      }
    }

  getTempleteFile(){
    this._PolicyService.getGroupTempleteFile().subscribe(res=>{
      let blob:Blob = res.body as Blob
      this.FileName= 'group templete.xlsx'
      let a= document.createElement('a');
      a.download=this.FileName
      a.href=window.URL.createObjectURL(blob)
      a.click()
    })
  }
       //get Broker Customers
  getBrokerCustomers(){
    this._AdminService.getAllCustomers(3).subscribe(data=>{
      this.brokerCustomers= data
    })
  }
  //Pagination Methods
  onTableDataChange(event:any){
    this.page=event;
    this.getAllOffers();
  }
  onTableSizeChange(event:any){
    this.tableSize=event.target.value;
    this.page=1;
    this.getAllOffers();
  }
  uploadPlanFile(event: any){
    this.selectedPlanFile = event.target.files[0] ?? null;
    event.target.value='' 
}
  uploadGroupFile(event: any){
  this.selectedGroupFile = event.target.files[0] ?? null;
  event.target.value=''
}
    // Show Add New Plan
  showNewPlan(){
    $("#AddPlan").toggle(500)
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
    console.log(item);
    if(item==undefined){
      let Model= {
      'planName':this.PlanForm.get('PlanName')?.value,
      'annualMaxLimit':this.PlanForm.get('AnnualMaxLimit')?.value,
      'netPremium':this.PlanForm.get('NetPremium')?.value,
      'planFile':this.selectedPlanFile,
      'fileName':this.selectedPlanFile.name,
    }
      this.OfferPlans.push(Model);
      this.AddedPlans.push(Model)
      console.log(this.OfferPlans);
      this.PlanForm.reset()
    }else{
      this._ToastrService.show('The Plan Name is Already Exist')
    }
    
  }
  resetModalWhenOpen(){
    this.AddedPlans =[]
    this.removedPlans = []
    this.PlanForm.reset()
    this.selectedPlanFile =''

  }
  // 
  goBack(stepper: MatStepper){
    stepper.previous();
}
  ngOnInit(): void {
    this.getAllOffers()
    this.getBusinessTypes();       
    this.getAllIndividualOrCorporate()
    this.getListOfTpa()
    this.getInsuraneClass()
    this.getBrokerCustomers()
  }

}
