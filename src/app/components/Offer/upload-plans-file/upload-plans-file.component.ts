import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PolicyService } from 'src/app/services/policy.service';
import { PricingToolService } from 'src/app/services/pricing-tool.service';
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
  AllPlans:any[]=[
    {
      planName:'Gold',
      planId:'1',
      Anuual:'6000',
      benefits:[
        {id:1,name:'Eye'},
        {id:2,name:'Teeth'},
        {id:3,name:'Hand'},
        {id:4,name:'Liver'},
      ]
    },
    {
      planName:'Premium',
      planId:'2',
      Anuual:'8000',
      benefits:[
        {id:5,name:'Cancer'},
        {id:6,name:'Tongue'},
        {id:7,name:'Hidech'},
      ]
    },
    {
      planName:'Math',
      planId:'3',
      Anuual:'10000',
      benefits:[
        {id:8,name:'Eye'},
        {id:9,name:'Teeth'},
        {id:10,name:'Liver'},
      ]
    },
  ]
  ArrPlans:any[]=[
    {
      planName:'Gold',
      planId:6,
      Categories:[
        {
          categoryName:'In Patient',
          categoryId:10,
          benefits:[
            {name:'Eye',id:1,sum:2000},
            {name:'Teeth',id:2,sum:4000},
            {name:'Stomic',id:3,sum:6000},
            {name:'Diabit',id:4,sum:5000},
          ]
        },
        {
          categoryName:'Out Patient',
          categoryId:20,
          benefits:[
            {name:'Eye',id:5,sum:3000},
            {name:'Headaches',id:6,sum:4000},
            {name:'Stomic',id:7,sum:6000},
            {name:'Diabit',id:8,sum:7000},
          ]
        },
      ]

    },
    {
      planName:'Platinum',
      planId:12,
      Categories:[
        {
          categoryName:'InSide',
          categoryId:30,
          benefits:[
            {name:'Diarrhea',id:9,sum:2000},
            {name:'Teeth',id:10,sum:4000},
            {name:'Allergies',id:11,sum:6000},
            {name:'Diabit',id:12,sum:5000},
          ]
        },
        {
          categoryName:'OutSide',
          categoryId:40,
          benefits:[
            {name:'Eye',id:13,sum:3000},
            {name:'Headaches',id:14,sum:4000},
            {name:'Mononucleosis',id:15,sum:6000},
            {name:'Diabit',id:16,sum:7000},
          ]
        },
        {
          categoryName:'Mix',
          categoryId:50,
          benefits:[
            {name:'COVID-19',id:16,sum:3000},
            {name:'Headaches',id:17,sum:4000},
            {name:'Stomic',id:18,sum:6000},
            {name:'Monkeypox',id:19,sum:7000},
          ]
        },
      ]

    }
  ]
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
      Swal.fire({icon: 'error',title:error.error,text:''}  )
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
  // Toggle
  toggleItem(e:any,i:any, item:any){
    $('#'+i).toggle(600)
  }
  TemArr:any[]=[]
 
  getSelectedPlan(e:any){
    $(".Boxes").hide(300)
    $(".Boxes").show(300)
    this.ArrCategories= [];
    let Plan = this.ArrPlans.find(item=>item.planId==e.target.value)
    this.SelectedPlanPricing=Plan
  }
  // Status
  getSelectedStatus(e:any,benefitId:any,Check:any,partial:any,categoryId:any,status:any){
    let CategoryId =categoryId
    let Status = status.value
    var Partial =partial.value
    let ExistCategory = this.ArrCategories.find(item=>item.categoryId == CategoryId)
    if(e.target.value=='Partial'){
      $("#partial"+benefitId).show(300)
    }else{
      $("#partial"+benefitId).hide(300)
      Partial =partial.value=''
    }
    if(Check.checked){
      let ExistBenefit =  ExistCategory.benefits.find((item:any)=>item.id==benefitId);
      let Index = ExistCategory.benefits.indexOf(ExistBenefit)
      ExistCategory.benefits.splice(Index,1)
      if(ExistCategory==undefined){
        let Model ={
          categoryId:CategoryId,
          benefits:[
            {
              id:benefitId,
              status:Status,
              partial:Partial
            }
          ]
        }
        this.ArrCategories.push(Model)
      }else{
        let BenefitModel ={
          id:benefitId,
          status:Status,
          partial:Partial
        }
        ExistCategory.benefits.push(BenefitModel)
      }
    }
    console.log(this.ArrCategories);
  }

  ////////////// Partial /////////
  getPartialValue(Partial:any,Check:any,categoryId:any,benefitId:any,status:any){
    let CategoryId =categoryId
    let Status = status.value
    console.log(Partial.value);
    
    let ExistCategory = this.ArrCategories.find(item=>item.categoryId == CategoryId)
    if(Number(Partial.value)<=0||Number(Partial.value)>100){
      Partial.value=''
      console.log("not valid");
      this._ToastrService.show('Plase Enter number between 1 : 100')
    }
    if(Check.checked){
      let ExistBenefit =  ExistCategory.benefits.find((item:any)=>item.id==benefitId);
      let Index = ExistCategory.benefits.indexOf(ExistBenefit)
      ExistCategory.benefits.splice(Index,1)
      if(ExistCategory==undefined){
        let Model ={
          categoryId:CategoryId,
          benefits:[
            {
              id:benefitId,
              status:Status,
              partial:Partial.value
            }
          ]
        }
        this.ArrCategories.push(Model)
      }else{
        let BenefitModel ={
          id:benefitId,
          status:Status,
          partial:Partial.value
        }
        ExistCategory.benefits.push(BenefitModel)
      }
    }
    console.log(this.ArrCategories);
  }
  // Selected Benefit
  getSelectedBenefit(e:any,status:any,categoryId:any,partial:any){
    let Checked = e.checked
    let BenefitId = e.source.value
    let Status = status.value
    let CategoryId =categoryId
    let Partial =partial.value

    let ExistCategory = this.ArrCategories.find(item=>item.categoryId == CategoryId)
    // True
    if(Checked){
      if(ExistCategory==undefined){
        let Model ={
          categoryId:CategoryId,
          benefits:[
            {
              id:BenefitId,
              status:Status,
              partial:Partial
            }
          ]
        }
        this.ArrCategories.push(Model)
      }else{
        let BenefitModel ={
          id:BenefitId,
          status:Status,
          partial:Partial
        }
        ExistCategory.benefits.push(BenefitModel)
      }
    }
    // False
    else{
      let ExistBenefit =  ExistCategory.benefits.find((item:any)=>item.id==BenefitId);
      let Index = ExistCategory.benefits.indexOf(ExistBenefit)
      ExistCategory.benefits.splice(Index,1)
    }
    console.log(this.ArrCategories);
    
    
    
    
    // let item = this.AllPlans[MainIndex]
    // if(e.checked==true){
    //   // let Exist =this.ArrPricing.find(item=>item.planId ==planId);
    //   // let ExistBenefit=Exist.benefits.find((item:any)=>item.id==e.source.value)
    //   // console.log(ExistBenefit);
    //   // let Model = Object.assign(Exist,{ExistBenefit})
    //   // this.ArrPricing.push(Model);
    //   // console.log(this.ArrPricing);
    // }else{
    //   // let Exist =this.AllPlans.find(item=>item.planId ==planId);
    //   // let ExistBenefit=Exist.benefits.find((item:any)=>item.id==e.source.value);
    //   // let Index = this.ArrPricing[MainIndex].benefitss.indexOf(Benefit)
    //   // console.log(Index);
      
    //   // this.ArrPricing = this.ArrPricing[MainIndex].benefitss.splice(Index,1)  
    //   for(let i=0;i<item.benefits.length;i++){
    //     if(item.benefits.id!=e.source.value){
    //       let m ={
    //         id:item.benefits.id,
    //         name:item.benefits.name
    //       }
    //       this.TemArr.push(m)
    //     }
    //   }
    //   let Model =  Object.assign(item,{benefits:this.TemArr})
    //   this.ArrPricing
      
    // }
    // console.log(this.ArrPricing);
    
  }
  
  ViewPricingPlans(){
    let Model ={
      planId:this.SelectedPlanPricing.planId,
      Categories:this.ArrCategories
    }
    this.FinalArrPricing.push(Model)
    console.log(this.FinalArrPricing);
    this.ArrCategories = []
  }

  removeFromPricingPlans(index:number){
    this.FinalArrPricing.splice(index, 1)
  }

  getCategoriesToView(Categories:any){
    console.log(Categories);
    this.CategoriesToView= Categories
    
    
  }
  // Add To Pricing Plan Arr
  AddToPricingPlanArr(){

  }
  getAllPricingPlans(){
    this._PricingToolService.getAllPlans().subscribe(data=>{
      console.log(data);
    },error=>{
      console.log(error);
    })
  }
  ngOnInit(): void {
    this.getPlansOfOffer();
    if(this.Type=='1'){
      // Pricing
      $("#Pricing").show(300)
      $(".NotUse").hide(500)
    }
    else if(this.Type=='2'){
      // Not Pricing
      $(".NotUse").show(500)
      $("#Pricing").hide(500)
    }
    /// Pricing //
    this.getAllPricingPlans()
  }
  
}
