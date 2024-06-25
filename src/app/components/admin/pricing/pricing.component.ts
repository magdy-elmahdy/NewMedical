import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PricingToolService } from 'src/app/services/pricing-tool.service';
import Swal from 'sweetalert2';
declare var $:any; 
@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {

  page:number=1;
  count:number=0;
  tableSize:number=5;
  tableSizes=[5,8,10,15,20];

  loading:boolean=false;
  isClicked:boolean =false;
  AllPricingArr:any[]=[]
  arrCate:any[]=[]
  arrTest:any[]=[];
  AllCates:any[]=[]
  AllAgeBand:any;
  term:any;
  AllBenefits:any
  AllBenefitss:any
  AllBenefitTypes:any
  constructor(private _PricingToolService:PricingToolService, private _ToastrService:ToastrService){}
  
  Form:FormGroup =new FormGroup({

    'id':new FormControl(''),
    'categoryId':new FormControl('',[Validators.required]),
    'ageBandId':new FormControl('',[Validators.required]),
    'benfitsId':new FormControl('',[Validators.required]),
    // 'benfitTypeId':new FormControl('',[Validators.required]),
    // 'sumInsured':new FormControl('',[Validators.required]),
    'netRiskPremium':new FormControl('',[Validators.required]),
    // 'loading':new FormControl('',[Validators.required])
});

  WhenModalOpen(){
    // this.AddBankForm.reset()
    // this.arrTest =[];
  }
  ///////// Add //////////////////////
  AddBenfitPricing(){
    this.isClicked =true
    this._PricingToolService.AddBenfitPricing(this.arrTest).subscribe((res:any)=>{
      this.isClicked = false;
      console.log(res);
      $("#AddPricing").modal('toggle')
      // this.getAllItems()
      Swal.fire({title:'Pricing Added Successfully',timer:3000, timerProgressBar: true})
      this.arrTest =[];
      this.getAllPricing()
    },error=>{
      this.isClicked = false;
      console.log(error);
      Swal.fire({icon: 'error',title: 'Oops...',text: error.error,})
      this.arrTest =[];
    })
  }
               //Pagination Methods
  onTableDataChange(event:any){
    this.page=event;
    this.getAllPricing();
  }
  onTableSizeChange(event:any){
    this.tableSize=event.target.value;
    this.page=1;
    this.getAllPricing();
  }

  // Add Accounts Numbers
  view(){
    let Model = Object.assign(this.Form.value)
    this.arrTest.push(Model);
    this.Form.reset()
    console.log(this.arrTest);
  }
  remove(index:number){
    this.arrTest.splice(index, 1)
  }


  // Edit
  CurrentItem:any
  selecteCategory:any
  openEditModal(item:any){
    this.selecteCategory = this.AllPricingArr.find(cat=>cat.category.englishName==item.category?.englishName)
    console.log(this.selecteCategory);
    
    // console.log(item);
    this.CurrentItem = item;
    this.Form.setValue({
      id: item.id,
      netRiskPremium: item.netRiskPremium,
      categoryId: item.category.id,
      benfitsId: item.benfits.id,
      ageBandId: item.ageBand.id
    });
    // this.Form.setValue({id:item.id,netRiskPremium:item.netRiskPremium,categoryId: `${this.selecteCategory.category.englishName} - ${this.selecteCategory.category.arabicName}`,benfitsId: `${item.benfits.englishName} - ${item.benfits.arabicName}`, ageBandId: `${item.ageBand.from} - ${item.ageBand.to}`})
  }
  saveCategoryEdit() {
    // this.isClicked = true
    if (this.CurrentItem) {
      const updatedCategory = {...this.CurrentItem,...this.Form.value };
      console.log(updatedCategory);
      this._PricingToolService.EditBenfitPricing(updatedCategory).subscribe((res) => {
        this.isClicked = false
  
        console.log(res);
        $('#EditPricing').modal('toggle'); 
        this.getAllPricing();
        Swal.fire({ title: "Good job!", text: "Pricing Updated Successfully", icon: "success" })
      }, error => {
        this.isClicked = false
        console.log(error);
        Swal.fire({ icon: "error", title: "Oops...", text: error.error });
      });
    }
  }
  //Delete
  PricingId:any
  deletePricing(id:any){
   
    this.PricingId = id;

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
        this._PricingToolService.deletpricing(this.PricingId).subscribe(
          (data) => {
            // Show success message
            Swal.fire(
              'Deleted!',
              'Pricing Deleted Successfully',
              'success'
            );
            // Refresh categories list or perform other actions
            this.getAllPricing();
          },
          (error) => {
            // Show error message if delete operation fails
            Swal.fire(
              'Error!',
              'There was an error deleting the pricing. Please try again.',
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

    // Get All Categories
  GetAllCategories(){
    this._PricingToolService.GetAllCategories().subscribe((data:any)=>{
      this.AllCates =data;
      console.log(data);
      
    },error=>{
      console.log(error);
    })
  }
    // Get All Edge Band
  getAllEdgeBand(){
      this._PricingToolService.GetAllAgeBands().subscribe((data:any)=>{
        this.AllAgeBand =data;
      },error=>{
        console.log(error);
      })
  }
  // get Cate By Id 
  GetCategoryById(categoryId:any){
    this._PricingToolService.GetCategoryById(categoryId).subscribe((data:any)=>{
      console.log(data);
      this.AllBenefits = data.benfits
    },error=>{
      console.log(error);
      this.loading=false;
    })
  }
  // Get All Benfits
  getAllBenfits(){
    this._PricingToolService.GetAllBenfits().subscribe((data:any)=>{
      console.log(data);
      this.AllBenefitss = data
      
    })
  }
  //////////Selected 
  selectedCategory(){
    this.GetCategoryById(this.Form.get('categoryId')?.value)
  }
  selectedBenefit(){
    this._PricingToolService.GetAllBenfitTypes(this.Form.get('benfitsId')?.value).subscribe((data:any)=>{
      console.log(data);
      this.AllBenefitTypes = data
      console.log(this.AllBenefitTypes);
      
    },error=>{
      console.log(error);
      this.loading=false;
    })
    this.GetCategoryById(this.Form.get('categoryId')?.value)
    // this.AllBenefitTypes
  }
  getAllPricing(){
    this._PricingToolService.GetAllPricing().subscribe((data:any)=>{
      console.log(data);
      this.AllPricingArr=data
    })
  }

  ngOnInit(){
    this.getAllPricing()
    this.GetAllCategories()
    this.getAllEdgeBand()
    this.getAllBenfits()
    // this.getAllCategoriesBenfits()
  }
  AllCategoriesBenfits:any[]=[]
  getAllCategoriesBenfits(){
    this.AllCategoriesBenfits = []
    this._PricingToolService.GetAllCategoriesBenfits(this.Form.get('categoryId')?.value).subscribe((data:any)=>{
      console.log(data);
      this.AllCategoriesBenfits = data
      
    })
  }
}
