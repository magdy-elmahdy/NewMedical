import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PolicyService } from 'src/app/services/policy.service';
import { PricingToolService } from 'src/app/services/pricing-tool.service';
import { arabicTextValidator } from 'src/app/services/text-validators';
import Swal from 'sweetalert2';
declare var $:any
@Component({
  selector: 'app-upload-plans-file',
  templateUrl: './upload-plans-file.component.html',
  styleUrls: ['./upload-plans-file.component.scss']
})
export class UploadPlansFileComponent implements OnInit{
  selectedFile:any=''
  isClickedDocumnet:boolean=false
  OfferId:any
  Type:any
  AllOfferPlans:any[]=[]
  AllPolicyExisit:boolean = false
  loading:boolean = false;
  arrTest:any[]=[]
  AddedNewPlans:any[]=[]
  uploadPlanEvent:any=''
  formData:any = new FormData();
  Benefits:any[]=[]
  SelectedPlanPricing:any
  CategoriesToView:any
  AllPlans:any[]=[]
  ArrPlans:any[]=[]
  AllAdditionalBenefits:any[]=[]
  constructor(public _location: Location,private _ToastrService:ToastrService, private _PricingToolService:PricingToolService,
    private _PolicyService:PolicyService, private _ActivatedRoute:ActivatedRoute,private _Router:Router){
    this.OfferId = this._ActivatedRoute.snapshot.paramMap.get('id')
    this.Type = this._ActivatedRoute.snapshot.paramMap.get('type')
    this.OfferId=Number(this.OfferId)
  }
  

  PlanForm:FormGroup = new FormGroup({
    PlanName:new FormControl('',[Validators.required]),
    AnnualMaxLimit :new FormControl('',[Validators.required]),
    NetPremium :new FormControl('',[Validators.required]),
  })
  AddtionalBenefitForm:FormGroup =new FormGroup({
    'arabicName':new FormControl('',[Validators.required,arabicTextValidator()]),
    'englishName':new FormControl('',[Validators.required]),
    'maxLimit':new FormControl('',[Validators.required]),
    'coverageType':new FormControl('',[Validators.required]),
    'partialPct':new FormControl('')
});
  uploadFile(event: any){
    // Get File Object
    this.selectedFile = event.target.files[0] ?? null;
    event.target.value='' 
}

  getPlansOfOffer(){
    this._PolicyService.getPlansOfPolicy(this.OfferId).subscribe((data:any)=>{
      this.AllOfferPlans = data;
      if(this.AllOfferPlans?.length!=0){
        $("#proceesButton").show(400)
      }else{
        $("#proceesButton").hide(400)
      }
    },error=>
    {
      console.log(error)
    })
  }

        ///////// Save Files ///////////////////
  SavePlans(){
    this.isClickedDocumnet=true
              /// Append
    for(let i=0;i<this.AddedNewPlans.length;i++){
      this.formData.append('PlansToAdd['+ i +'].planName',this.AddedNewPlans[i].PlanName)
      this.formData.append('PlansToAdd['+ i+ '].annualMaxLimit',Number(this.AddedNewPlans[i].AnnualMaxLimit))
      this.formData.append('PlansToAdd['+ i+ '].netPremium',Number(this.AddedNewPlans[i].NetPremium))
    }this.formData.append('OfferId',this.OfferId);
    this.formData.append('PlanFile',this.selectedFile)
    for (var pair of this.formData.entries()) {
      console.log(pair[0]+ ', ' + pair[1]); 
  }

    this._PolicyService.AddPlansToOffer(this.formData).subscribe(res=>{
      this.AddedNewPlans = []
      $(".remove").hide(400)
      Swal.fire('Plan Added Successfully','','success')
      this.isClickedDocumnet=false
      console.log(res);
      this.clearFormData()
      this.getPlansOfOffer()
    },error=>{
      Swal.fire({icon: 'error',title:error.error,text:''})
      this.isClickedDocumnet=false
      console.log(error);
      this.clearFormData()
    })
    this.formData = new  FormData()
  }
            /// Delete Form Data
  clearFormData(){
    for(let i=0;i<this.arrTest.length;i++){
      this.formData.delete('PlansToAdd['+ i +'].planName')
      this.formData.delete('PlansToAdd['+ i+ '].annualMaxLimit')
      this.formData.delete('PlansToAdd['+ i+ '].netPremium')
    }
    this.formData.delete('OfferId');
    this.formData.delete('PlanFile');
  }
  view(){
    var item = this.arrTest.find(item=>this.PlanForm.get('PlanName')?.value == item.PlanName)
    var item2 = this.AllOfferPlans.find(item=>this.PlanForm.get('PlanName')?.value == item.planName) 
    if(item==undefined&&item2==undefined){
      let Model= {
        'PlanName':this.PlanForm.get('PlanName')?.value,
        'AnnualMaxLimit':this.PlanForm.get('AnnualMaxLimit')?.value,
        'NetPremium':this.PlanForm.get('NetPremium')?.value
      }
      this.arrTest.push(Model);
      this.AddedNewPlans.push(Model);
      this.PlanForm.reset()
      this.uploadPlanEvent='';
    }else{
      this._ToastrService.show('The Plan Name is Already Exist')
    }
    console.log(this.AddedNewPlans);
  }
   //Remove item From Loss Participations List
   remove(index:number,planName:any){
    this.arrTest.splice(index, 1)

    var item = this.AddedNewPlans.find(item=>planName == item.PlanName)
    let i = this.AddedNewPlans.indexOf(item)


    this.AddedNewPlans.splice(i, 1)
    console.log(this.AddedNewPlans);
  }
  getNetPre(){
    if(this.PlanForm.get('NetPremium')?.value>this.PlanForm.get('AnnualMaxLimit')?.value){
      this.PlanForm.setErrors({'invalid':true})
    }
  }
  getAnnualMax(){
    if(this.PlanForm.get('NetPremium')?.value>this.PlanForm.get('AnnualMaxLimit')?.value){
      this.PlanForm.setErrors({'invalid':true})
    }
  }

  // TemArrBenefits:any[]=[]
  ArrCategories:any[]=[]
  FinalArrPricing:any[]=[]
  TemArr:any[]=[]
 
  getSelectedPlan(e:any){
    $(".Boxes").hide(300)
    $(".Boxes").show(300)
    this.ArrCategories= [];
    let Plan = this.ArrPlans.find(item=>item.planId==e.target.value);
    this.SelectedPlanPricing=Plan;
  }
  // Status
  getSelectedStatus(e:any,benefitId:any,Check:any,partial:any,Cateid:any,status:any,benefitName:any,CateName:any){
    let id =Cateid
    let Status = status.value
    var Partial =partial.value
    let ExistCategory = this.ArrCategories.find(item=>item.id == id)
    if(e.target.value=='Partial'){
      $("#partial"+benefitId).show(300)
    }else{
      $("#partial"+benefitId).hide(300)
      Partial =partial.value=''
    }
    if(Check.checked){
      let ExistBenefit =  ExistCategory.benfits.find((item:any)=>item?.benefitId==benefitId);
      let Index = ExistCategory.benfits.indexOf(ExistBenefit)
      ExistCategory.benfits.splice(Index,1)
      if(ExistCategory==undefined){
        let Model ={
          id:id,
          name:CateName,
          benfits:[
            {
              name:benefitName,
              benfitId:benefitId,
              coverageType:Status,
              partialPct:Partial
            }
          ]
        }
        this.ArrCategories.push(Model)
      }else{
        let BenefitModel ={
          name:benefitName,
          benfitId:benefitId,
          coverageType:Status,
          partialPct:Partial
        }
        ExistCategory.benfits.push(BenefitModel)
      }
    }
    console.log(this.ArrCategories);
  }

  ////////////// Partial /////////
  getPartialValue(Partial:any,Check:any,categoryId:any,benefitId:any,status:any,benefitName:any,CateName:any){
    let CategoryId =categoryId
    let Status = status.value
    let ExistCategory = this.ArrCategories.find(item=>item.id == CategoryId)
    console.log(ExistCategory);
    if(Number(Partial.value)<=0||Number(Partial.value)>100){
      Partial.value=''
      console.log("not valid");
      this._ToastrService.show('Plase Enter number between 1 : 100')
    }
    if(Check.checked){
      let ExistBenefit = ExistCategory?.benfits.find((item:any)=>item.benfitId==benefitId);
      
      
      let Index = ExistCategory.benfits.indexOf(ExistBenefit)
      ExistCategory.benfits.splice(Index,1)
      if(ExistCategory==undefined){
        let Model ={
          name:CateName,
          id:CategoryId,
          benfits:[
            {
              name:benefitName,
              benfitId:benefitId,
              coverageType:Status,
              partialPct:Partial.value
            }
          ]
        }
        this.ArrCategories.push(Model)
      }else{
        let BenefitModel ={
          name:benefitName,
          benfitId:benefitId,
          coverageType:Status,
          partialPct:Partial.value
        }
        ExistCategory.benfits.push(BenefitModel)
      }
    }
    console.log(this.ArrCategories);
  }
  // Selected Benefit
  getSelectedBenefit(e:any,status:any,categoryId:any,partial:any,benefitName:any,CateName:any){
    let Checked = e.checked
    let BenefitId = e.source.value
    let Status = status.value
    let CategoryId =categoryId
    let Partial =partial.value
    let ExistCategory = this.ArrCategories.find(item=>item.id == CategoryId)
    // True
    if(Checked){
      if(ExistCategory==undefined){
        let Model ={
          name:CateName,
          id:CategoryId,
          benfits:[
            {
              name:benefitName,
              benfitId:BenefitId,
              coverageType:Status,
              partialPct:Partial
            }
          ]
        }
        this.ArrCategories.push(Model)
      }else{
        let BenefitModel ={
          name:benefitName,
          benfitId:BenefitId,
          coverageType:Status,
          partialPct:Partial
        }
        ExistCategory.benfits.push(BenefitModel)
      }
    }
    // False
    else{
      let ExistBenefit =  ExistCategory.benfits.find((item:any)=>item.benfitId==BenefitId);
      let Index = ExistCategory.benfits.indexOf(ExistBenefit)
      ExistCategory.benfits.splice(Index,1)
      console.log(ExistCategory);
      if(ExistCategory.benfits.length==0){
        console.log('Empty');
        let I = this.ArrCategories.indexOf(ExistCategory);
        this.ArrCategories.splice(I,1)
      }
    }
    console.log(this.ArrCategories);

  }
  
  ViewPricingPlans(){
    $("#mainBoxes").hide(300)
    let Model ={
      planName:this.SelectedPlanPricing.planName,
      planId:this.SelectedPlanPricing.planId,
      categories:this.ArrCategories
    }
    this.FinalArrPricing.push(Model)
    console.log(this.FinalArrPricing);
    this.ArrCategories = []
  }

  removeFromPricingPlans(index:number){
    this.FinalArrPricing.splice(index, 1)
  }

  getCategoriesToView(categories:any){
    console.log(categories);
    
    this.CategoriesToView= categories
  }
  // Add To Pricing Plan Arr
  AddToPricingPlanArr(){

  }
  getAllPricingPlans(){
    this._PricingToolService.getAllPlans().subscribe((data:any)=>{
      console.log(data);
      this.ArrPlans = data;
    },error=>{
      console.log(error);
    })
  }
  deleteBenfit(i:any){
    this.AllAdditionalBenefits.splice(i,1)
  }
  AddAdditinalBenefit(){
    $("#AdditionalForm").toggle(300);
  }
  addbenfitinarray(){
    this.AllAdditionalBenefits.push(this.AddtionalBenefitForm.value)
  }
  ////////// Submit Pricing /////////////
  SavePricingPlans(){
    this.isClickedDocumnet = true;
    let Model = {
      offerId:this.OfferId,
      additionalBenfits:this.AllAdditionalBenefits,
      plansToAdd:this.FinalArrPricing
    }
    console.log(Model);
    this._PricingToolService.AddPlansToOffer(Model).subscribe(res=>{
      this.isClickedDocumnet = false;
      console.log(res);
      this._Router.navigate(['/UploadGroupFile',this.OfferId,1])
      Swal.fire('Plans Added Successfully','','success');
    },error=>{
      this.isClickedDocumnet = false;
      console.log(error);
      Swal.fire({icon: 'error',title:error.error,text:''})
    })
    
  }
  // get Coverage 
  // GetCoverageTypes(){
  //   this._PricingToolService.GetCoverageTypes().subscribe(data=>{
  //     console.log(data);
  //     this.CoverageTypes = data;
  //   })
  // }
  ngOnInit(): void {
    
    if(this.Type=='1'){
      // Pricing
      $("#Pricing").show(300)
      $(".NotUse").hide(500)
      this.getAllPricingPlans()
      // this.GetCoverageTypes()
    }
    else if(this.Type=='2'){
      // Not Pricing
      this.getPlansOfOffer();
      $(".NotUse").show(500)
      $("#Pricing").hide(500)
    }
    //////// Pricing ///////
    
  }
  
}
