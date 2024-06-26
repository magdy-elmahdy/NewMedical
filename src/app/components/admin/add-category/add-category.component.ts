import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { englishOnlyValidator, arabicTextValidator} from 'src/app/services/text-validators';
import { PricingToolService } from 'src/app/services/pricing-tool.service';
import Swal from 'sweetalert2';
declare var $:any; 


@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {
  page:number=1;
  count:number=0;
  tableSize:number=5;
  tableSizes=[5,8,10,15,20];
  term:any;

  loading:boolean=false;
  isClicked:boolean =false;
  arrCate:any[]=[]
  arrTest:any[]=[];
  AllItems:any;
  categoryid:any
  categoryBenfitArr:any[]=[]

  constructor(private _PricingToolService:PricingToolService, private _ToastrService:ToastrService){}
  
  Form:FormGroup =new FormGroup({
    'id': new FormControl(null),
    'arabicName':new FormControl('',[Validators.required,arabicTextValidator()]),
    'englishName':new FormControl('',[Validators.required,englishOnlyValidator()]),
});
  
EDitForm:FormGroup =new FormGroup({
    'benfitId':new FormControl('',[Validators.required]),
});
get arabicText() {
  return this.Form.get('arabicName')
}
get englishText(){
  return this.Form.get('englishName')
}

getText(){
  if(this.Form.get('arabicName')?.status == 'INVALID'){
    this._ToastrService.error('Text Shoud be arabic', " Well Done");
  }
}


  WhenModalOpen(){
    this.Form.reset();
    this.arrCate=[]
  }
  // Add Accounts Numbers
  view(){
    // var exixs = this.arrCate.find(item=>this.Form.value.arabicName == item.arabicName)
    // console.log(exixs);
    let Model = Object.assign(this.Form.value)
    console.log(Model);
    
    
    // if(exixs==undefined){
      this.arrCate.push(Model);
      console.log(this.arrCate);
      this.Form.reset()
    // }else{
    //   this._ToastrService.show('This Category already existed')
    // }
    // console.log(this.arrCate);
  }
  // Add Bank
  AddCategory(){
    this.isClicked =true
    this._PricingToolService.AddCategory(this.arrCate).subscribe((res:any)=>{
      this.isClicked = false;
      console.log(res);
      $("#Add").modal('toggle')
      this.getAllItems()
      Swal.fire({title:'Category/Categories Added Successfully',timer:3000, timerProgressBar: true})
      this.arrCate =[];
    },error=>{
      this.isClicked = false;
      console.log(error);
      Swal.fire({icon: 'error',title: 'Oops...',text: error.error,})
      this.arrCate =[];
    })
  }
  remove(index:number){
    this.arrCate.splice(index, 1)
  }
             //Pagination Methods
  onTableDataChange(event:any){
    this.page=event;
    this.getAllItems();
  }
  onTableSizeChange(event:any){
    this.tableSize=event.target.value;
    this.page=1;
    this.getAllItems();
  }
  

 
  editaddArr:any[]=[]
  benefitIdCounter: number = 1;

  editAdd() {
    // Clone the form value to avoid direct mutation
    let Model = Object.assign({}, this.EDitForm.value);
  
    // Assign a unique ID to the new benefit
    const newBenefit = {
      ...Model,
      id: this.benefitIdCounter++
    };
  
    console.log(newBenefit);
  
    // Push the new benefit to the editaddArr
    this.editaddArr.push(newBenefit);
    console.log(this.editaddArr);
  
    // Optionally, reset the form and the editaddArr after adding
    // this.editaddArr = [];
    // this.EDitForm.reset();
  }
  getCategoryBenfit() {
    if (this.CurrentActivity && this.CurrentActivity.id) {
      this._PricingToolService.GetAllCategoriesBenfits(this.CurrentActivity.id).subscribe((data: any) => {
        // console.log(data);
        this.categoryBenfitArr = data;
      });
    }
  }
  removeBenfit(index:number){
    this.categoryBenfitArr.splice(index,1)
  }
  AllBenfitsArr:any
  getAllBenfits(){
    this._PricingToolService.GetAllBenfits().subscribe((data:any)=>{
      // console.log(data);
      this.AllBenfitsArr = data
      // console.log(this.AllBenfitsArr);
      
    })
  }
  // Edite Category
  CurrentActivity:any
  openEditModal(Category:any){
    console.log(Category);
    this.CurrentActivity=Category
    this.Form.setValue({id: Category.id,arabicName:Category.arabicName,englishName:Category.englishName})
    // this.EDitForm.setValue({id:Category.benfits.id,arabicName:Category.benfits.arabicName,englishName:Category.benfits.englishName,maxLimit:Category.benfits.maxLimit,})
    
    this.editaddArr = Category.benefits
    this.getCategoryBenfit()

  }
  formData:any = new FormData();
  AddBenfit(){
    const selectedCategoryId = this.Form.get('id')?.value;
    console.log(selectedCategoryId);
    let benefitId = this.EDitForm.value.benfitId;
    console.log(benefitId);
    // let selectedBenefit = this.AllBenfitsArr.find((benfit:any) => benfit.id == benefitId);
    // console.log(selectedBenefit);
    // if (selectedBenefit) {
    //   this.categoryBenfitArr.push(selectedBenefit);
    // }
    
  this._PricingToolService.AddBenfitToCategory(benefitId,selectedCategoryId).subscribe((data:any)=>{
    console.log(data);
    console.log(benefitId);
    let selectedBenefit = this.AllBenfitsArr.find((benfit:any) => benfit.id == benefitId);
    console.log(selectedBenefit);
    if (selectedBenefit) {
      this.categoryBenfitArr.push(selectedBenefit);
    }
    console.log( this.categoryBenfitArr);
    Swal.fire({title:'Benfit Added Successfully',timer:3000, timerProgressBar: true})
  },error=>{
    console.log(error);
    Swal.fire({icon: 'error',title: 'Oops...',text: error.error,})
  })
  }

  saveCategoryEdit(){
    this.isClicked = true
    if (this.CurrentActivity) {
      let Model = Object.assign(this.Form.value, { benfitId: this.categoryBenfitArr.map(benefit => benefit.id) });
      console.log(Model);    
      this._PricingToolService.EditCategory(Model).subscribe((res) => {
        this.isClicked = false
        console.log(res);
        $('#EditForm').modal('toggle'); 
        this.getAllItems();
        Swal.fire({ title: "Good job!", text: "Category Updated Successfully", icon: "success" })
        this.formData = new FormData();
      }, error => {
        console.log(error);
        this.isClicked = false
        this.formData = new FormData();
        Swal.fire({ icon: "error", title: "Oops...", text: error.error });
      });
    }
  }
  //Delet Benfit Category
  categoryId:any
  deleteCategory(id:any){
   
    this.categoryId = id;

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
        this._PricingToolService.DeleteCategory(this.categoryId).subscribe(
          (data) => {
            // Show success message
            Swal.fire(
              'Deleted!',
              'Category Deleted Successfully',
              'success'
            );
            // Refresh categories list or perform other actions
            this.getAllItems();
          },
          (error) => {
            // Show error message if delete operation fails
            Swal.fire(
              'Error!',
              'There was an error deleting the Category. Please try again.',
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

    // Get All
    getAllItems(){
    this.loading=true;
    this._PricingToolService.GetAllCategories().subscribe((data:any)=>{
      this.loading=false;
      // console.log(this.AllItems);
      if(data.length>0){
        
        this.AllItems =data;
      }else{
        this.AllItems ='';
      }
      
    },error=>{
      console.log(error);
      this.loading=false;
    })
  }
 

  ngOnInit(){
    // this.getCategoryBenfit()
    this.getAllItems()
    this.getAllBenfits()
  }
}
