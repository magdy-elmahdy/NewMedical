import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PricingToolService } from 'src/app/services/pricing-tool.service';
import Swal from 'sweetalert2';
declare var $:any; 
@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent implements OnInit {
  page:number=1;
  count:number=0;
  tableSize:number=5;
  tableSizes=[5,8,10,15,20];
  term:any;

  loading:boolean=false;
  isClicked:boolean =false;
  AllcovergeRegion = [
    { id: 1, name: 'InsideEgypt'},
    { id: 2, name: 'OutSideEgypt'}
  ];
  AllcovergeType = [
    { id: 1, name: 'Partial'},
    { id: 2, name: 'Full'},
    { id: 3, name: 'UnCovered'}
  ];
  arrTest:any[]=[]
  MainArr:any[]=[]
  ShowProducts:any[]=[];
  AllCates:any[]=[]
  AllBenefitss:any[]=[]
  planCategories:any[]=[]
  isTableVisible = false;
  isthisTableVisible = true;
  constructor(private _PricingToolService:PricingToolService){}
  Form:FormGroup =new FormGroup({
    // 'id':new FormControl(''),
    'planName':new FormControl('',[Validators.required]),
    'annualMaxLimit':new FormControl('',[Validators.required]),
});
  NewForm:FormGroup = new FormGroup({
    'covergeRegion':new FormControl('',[Validators.required]),
    'coverageType':new FormControl('',[Validators.required]),
    'note':new FormControl(''),
    'partialPercantage':new FormControl(''),
  })
  CategoryForm:FormGroup = new FormGroup({
    'categoryId':new FormControl('',[Validators.required]),
  })
  benfitsForm:FormGroup = new FormGroup({
    'benfitsIds':new FormControl('',[Validators.required]),
  })

  AllPlansArr:any
  //Pagination Methods
  onTableDataChange(event:any){
    this.page=event;
    this.getAllPlans();
  }
  onTableSizeChange(event:any){
    this.tableSize=event.target.value;
    this.page=1;
    this.getAllPlans();
  }
  selectType(){
    if(this.NewForm.get('coverageType')?.value === 'Partial'){
      this.NewForm.get('partialPercantage')?.setValidators([Validators.required])
      this.NewForm.get('partialPercantage')?.updateValueAndValidity
    }else{
      this.NewForm.get('partialPercantage')?.setValidators(null)
      this.NewForm.get('partialPercantage')?.setValue('')
      this.NewForm.get('partialPercantage')?.clearAsyncValidators()
      this.NewForm.get('partialPercantage')?.updateValueAndValidity()
    }
  }
  WhenOpenModal(){
    this.Form.reset()
    this.NewForm.reset()
    this.arrTest=[]
    this.MainArr=[]
  }
  view(){

    let Model = Object.assign(this.NewForm.value)
    const isDuplicate = this.arrTest.some(plan => plan.covergeRegion === this.NewForm.value.covergeRegion);
    if (!isDuplicate) {
      this.arrTest.push(Model);
      console.log('Plan added:', Model);
    } else {
      Swal.fire({ title: "Sorry!", text: "You have one choice for each covergeRegion", icon: "info" })
    }
    // this.arrTest.push(Model);
      this.NewForm.reset()
    console.log(this.arrTest);
  }
  remove(index:number){
    this.arrTest.splice(index, 1)
  }
  viewArr(){
    let Model =Object.assign(this.Form.value,{coverageRegions:this.arrTest}) 
    console.log(Model);
    this.MainArr.push(Model)
    console.log(this.MainArr);
  }
 
    //Remove 
    RemoveFromMainTable(index:number){
      this.MainArr.splice(index, 1)
    }



// Get All Benfits from category
Currentid:any
categoryBenfitArr:any[]=[]
getCategoryBenfit(categoryid:any) {
  const categoryIdNumber = Number(categoryid);
this._PricingToolService.GetAllCategoriesBenfits(categoryIdNumber).subscribe((data: any) => {
  // console.log(data);
  this.categoryBenfitArr = data;
  console.log(this.categoryBenfitArr);
  
});
}
selecteCategory(){
  const selectedCategoryId = this.CategoryForm.get('categoryId')?.value;
  console.log(selectedCategoryId);
  this.getCategoryBenfit(selectedCategoryId)
}
removeBenfit(index:number){
  this.categoryBenfitArr.splice(index, 1)
}
AddNewBenfit(){
  let benefitId = this.benfitsForm.value.benfitsIds;
  console.log(benefitId);
  let selectedBenefit = this.AllBenefitss.find((benfit:any) => benfit.id == benefitId);
  console.log(selectedBenefit);
  if (selectedBenefit) {
    this.categoryBenfitArr.push(selectedBenefit);
  }
  console.log( this.categoryBenfitArr);

}

// AddNewCategory(){
//   let Model = Object.assign(Number(this.CategoryForm.value),{benfitsIds:this.categoryBenfitArr.map(benefit => benefit.id)})
//   console.log(Model);
//   this.planCategories.push(Model)
// }
AddNewCategory() {
  const categoryId = Number(this.CategoryForm.get('categoryId')?.value);
  const benfitsIds = this.categoryBenfitArr.map(benefit => benefit.id);
  const selectedCategory = this.AllCates.find(category => category.id === categoryId);
  const categoryNameEnglish = selectedCategory ? selectedCategory.englishName : 'Unknown Category';
  // const categoryNames = this.categoryBenfitArr.map(benefit => {
  //   const benefitDetail = this.AllBenefitss.find(ben => ben.id === benefit.id);
  //   return benefitDetail ? benefitDetail.englishName : 'Unknown Benefit';
  // });
  const Model = {
    categoryId: categoryId,
    benfitsIds: benfitsIds,
    benfitdata: this.categoryBenfitArr,
    categoryNameEnglish: categoryNameEnglish

    // benfitsNames: benfitsNames,
    // benfitsNamesinArabic:benfitsNamesinArabic,
  };
  console.log(Model);
  this.planCategories.push(Model);
}
RemoveFromCategoriesTable(index:number){
  this.planCategories.splice(index, 1)
}
ViewCoverageRegions(item:any){
  console.log(item);
  this.ShowProducts =item.benfitdata

  // this.isTableVisible = true; 
  console.log( this.ShowProducts);
  
}


  AddPlan(){
    this.isClicked =true
    let Model = Object.assign(this.Form.value,{coverageRegions:this.arrTest},{planCategories:this.planCategories})

    console.log(Model);
    this.MainArr.push(Model)
    this._PricingToolService.AddNewPlan(this.MainArr).subscribe((res:any)=>{
      this.isClicked = false;
      console.log(res);      
      Swal.fire({title:'Plan Added Successfully',timer:3000, timerProgressBar: true})
      this.getAllPlans()
      $("#AddPlan").modal('toggle')
      this.arrTest =[];
    },error=>{
      this.isClicked = false;
      console.log(error);
      Swal.fire({icon: 'error',title: 'Oops...',text: error.error,})
      this.arrTest =[];
    })
  }
  editMode = false;
  currentPlanIndex: number | null = null;
  openEditModal(plan: any) {
    this.editMode = true;
    this.currentPlanIndex = this.AllPlansArr.indexOf(plan);
    
    this.Form.patchValue({
      id:plan.id,
      planName: plan.planName,
      annualMaxLimit: plan.annualMaxLimit
    });
    
    // Clear arrTest before adding new values
    this.arrTest = [];
    
    // Iterate over coverageRegions array and add each region to arrTest
    plan.coverageRegions.forEach((region: any) => {
      this.arrTest.push({
        covergeRegion: region.covergeRegion,
        coverageType: region.coverageType,
        note: region.note,
        partialPercantage: region.partialPercantage
      });
    });
    
    // Optionally, you can set NewForm with the first region's data (if any)
    if (plan.coverageRegions.length > 0) {
      this.NewForm.patchValue({
        covergeRegion: plan.coverageRegions[0].covergeRegion,
        coverageType: plan.coverageRegions[0].coverageType,
        note: plan.coverageRegions[0].note,
        partialPercantage: plan.coverageRegions[0].partialPercantage
      });
    }
    this.MainArr = [{
      planName: plan.planName,
      annualMaxLimit: plan.annualMaxLimit,
      coverageRegions: plan.coverageRegions
    }];
    // this.isTableVisible = true
  }
  
  EditPlan() {
    this.isClicked =true
    const updatedPlan = {
      id: this.Form.get('id')?.value,
      planName: this.Form.get('planName')?.value,
      annualMaxLimit: this.Form.get('annualMaxLimit')?.value,
      coverageRegions: this.arrTest
    };
    console.log(updatedPlan);
    

    this._PricingToolService.EditPlan(updatedPlan).subscribe((data:any)=>{
      this.isClicked = false;
      console.log(data);
      Swal.fire({title:'Plan Added Successfully',timer:3000, timerProgressBar: true})
      this.getAllPlans()
      $("#EditPlan").modal('toggle')
    },error=>{
      this.isClicked = false;
      console.log(error);
      Swal.fire({icon: 'error',title: 'Oops...',text: error.error,})
    })
}

  //Delete
  PlanId:any
  deletePlan(id:any){
   
    this.PlanId = id;

    // Show SweetAlert2 confirmation dialog
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this item?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // If user confirmed, proceed with the delete API call
        this._PricingToolService.deletplan(this.PlanId).subscribe(
          (data) => {
            // Show success message
            Swal.fire(
              'Deleted!',
              'Plan Deleted Successfully',
              'success'
            );
            // Refresh categories list or perform other actions
            this.getAllPlans();
          },
          (error) => {
            // Show error message if delete operation fails
            Swal.fire(
              'Error!',
              'There was an error deleting the Plan. Please try again.',
              'error'
            );
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // If user canceled, show cancellation message
        Swal.fire(
          'Cancelled',
          'Your item is safe :)',
          'error'
        );
      }
    });
  }
   // Get All Plans
  getAllPlans(){
    this._PricingToolService.getAllPlans().subscribe((data:any)=>{
      console.log(data);
      this.AllPlansArr = data
    })
  }
  // Get All Categories
  GetAllCategories(){
  this._PricingToolService.GetAllCategories().subscribe((data:any)=>{
    this.AllCates =data;
    console.log(data);
    
  },error=>{
    console.log(error);
  })
}
 // Get All Benfits
 getAllBenfits(){
  this._PricingToolService.GetAllBenfits().subscribe((data:any)=>{
    console.log(data);
    this.AllBenefitss = data
    
  })
}
showCategoryForm: boolean = false;

toggleCategoryForm() {
  this.showCategoryForm = !this.showCategoryForm;
}
  ngOnInit(): void {
    this.getAllPlans();
    this.GetAllCategories();
    this.getAllBenfits()
  }

}
