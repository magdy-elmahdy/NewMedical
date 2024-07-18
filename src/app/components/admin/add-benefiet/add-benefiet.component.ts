import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { ListsService } from 'src/app/services/lists.service';
import { PricingToolService } from 'src/app/services/pricing-tool.service';
// import { arabicTextValidator } from 'src/app/services/arabic-text.validator';
import { englishOnlyValidator, arabicTextValidator} from 'src/app/services/text-validators';

import Swal from 'sweetalert2';
declare var $:any;
@Component({
  selector: 'app-add-benefiet',
  templateUrl: './add-benefiet.component.html',
  styleUrls: ['./add-benefiet.component.scss']
})
export class AddBenefietComponent implements OnInit {
  page:number=1;
  count:number=0;
  tableSize:number=5;
  tableSizes=[5,8,10,15,20];

  loading:boolean=false;
  isClicked:boolean =false;
  arrCate:any[]=[]
  arrTest:any[]=[];
  AllItems:any;
  term:any;
  AllCates:any[]=[];
  ShowBenefitTypes:any;
  BenfitType:any=''

  constructor(private _PricingToolService:PricingToolService, private _ToastrService:ToastrService){}
  
  Form:FormGroup =new FormGroup({
    'arabicName':new FormControl('',[Validators.required,arabicTextValidator()]),
    'englishName':new FormControl('',[Validators.required,englishOnlyValidator()]),
    'maxLimit':new FormControl(''),
    'categoryId':new FormControl('',[Validators.required])
});
EditForm:FormGroup =new FormGroup({
  'benfitId':new FormControl(''),
  'arabicName':new FormControl('',[Validators.required,arabicTextValidator()]),
  'englishName':new FormControl('',[Validators.required,englishOnlyValidator()]),
  'maxLimit':new FormControl('0'),
  // 'categoryId':new FormControl('',[Validators.required])
});
get arabicText() {
  return this.Form.get('arabicName');
}
get EditarabicText() {
  return this.EditForm.get('arabicName');
}
get englishText(){
  return this.Form.get('englishName')
}
get EditenglishText() {
  return this.EditForm.get('englishName');
}
CheckEngilshText(){
  if(this.Form.get('englishName')?.status == 'INVALID' || this.EditForm.get('englishName')?.status == 'INVALID'){
    this._ToastrService.error('Text Shoud be english', " Well Done")
  }
}
CheckArabicText(){
  if(this.Form.get('arabicName')?.status == 'INVALID' || this.EditForm.get('arabicName')?.status == 'INVALID'){
    this._ToastrService.error('Text Shoud be arabic', " Well Done");
  }
}

  WhenModalOpen(){
    this.Form.reset()
    this.arrTest =[];
    this.arrCate =[];
  }
  ///////// Add Benfit //////////////////////
  addbenfitinarray(){
    let Model = Object.assign(this.Form.value)
    console.log(Model);
    this.arrCate.push(Model)
    this.Form.reset();
  }
  RemoveBenfit(index:number){
    this.arrCate.splice(index, 1)
  }
  // getCategoryNameById(id: number): string {
  //   const category = this.AllCates.find(cate => cate.id === id);
  //   return category ? category.englishName : '';
  // }
  getCategoryName(id: string) {
    console.log(id);
    const category = this.AllCates.find(item => item.id == id);
    console.log(category);
    return category ? `${category.englishName} - ${category.arabicName}` : 'Unknown';
  }
  AddBenfit(){
    console.log(this.arrCate);
    this.isClicked =true
    this._PricingToolService.AddBenfit(this.arrCate).subscribe((res:any)=>{
      this.isClicked = false;
      console.log(res);
      $("#Add").modal('toggle')
      this.getAllItems()
      Swal.fire({title:'Benfit / Benfits Added Successfully',timer:3000, timerProgressBar: true})
      this.arrCate =[];
    },error=>{
      this.isClicked = false;
      console.log(error);
      Swal.fire({icon: 'error',title: 'Oops...',text: error.error,})
      this.arrCate =[];
    })
  }
  //Dlete Benfit
  
 BenfitId:any
 deleteBenfit(id:any){
   console.log(id);
   
   this.BenfitId = id;

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
       this._PricingToolService.DeleteBenfit(this.BenfitId).subscribe(
         (data) => {
           // Show success message
           Swal.fire(
             'Deleted!',
             'Benfit Deleted Successfully',
             'success'
           );
           // Refresh categories list or perform other actions
           this.getAllItems() 
          },
         (error) => {
           // Show error message if delete operation fails
           Swal.fire({icon: 'error',title: 'Oops...',text: error.error,})

          //  Swal.fire(
          //    'Error!',
          //    'There was an error deleting the Benfit. Please try again.',
          //    'error'
          //  );
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
 // Edit
 selectedBenfit:any
 CurrentBenfit:any
 openEditModal(item:any){
  console.log(item);
  this.CurrentBenfit = item
  console.log(this.AllCates);
  
  this.selectedBenfit = this.AllCates.find(category => category.englishName == item.englishName);
  console.log(this.selectedBenfit);
  this.EditForm.setValue({benfitId:item.id, arabicName:item.arabicName,englishName:item.englishName,maxLimit:item.maxLimit})
 }
 saveCategoryEdit() {
  this.isClicked = true
  if (this.CurrentBenfit) {
    const updatedCategory = {...this.CurrentBenfit,...this.EditForm.value };
    console.log(updatedCategory);
    this._PricingToolService.EditBenfit(updatedCategory).subscribe((res) => {
      this.isClicked = false

      console.log(res);
      $('#EditBenfit').modal('toggle'); 
      this.getAllItems();
      Swal.fire({ title: "Good job!", text: "Benfit Updated Successfully", icon: "success" })
    }, error => {
      this.isClicked = false
      console.log(error);
      Swal.fire({ icon: "error", title: "Oops...", text: error.error });
    });
  }
}
  // Show 
  ViewBenefitTypes(item:any){
    $("#benefitTypes").show(400)
    this.ShowBenefitTypes = item.benfitTypes;
    console.log(this.ShowBenefitTypes);
    
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
  // View Benefit Type
  viewBenefitType(){
    var exixs = this.arrTest.find(item=>this.BenfitType == item.type)
    console.log(exixs);
    
    if(exixs==undefined){
      let Model = {type:this.BenfitType}
      this.arrTest.push(Model);
      this.BenfitType = ''
    }else{
      this._ToastrService.show('This Type Already Existed')
    }
    console.log(this.arrTest);
  }
  // Remove Benefit Type
  removeBenefitType(index:number){
    this.arrTest.splice(index, 1)
  }

  // Add To Cate Table
  AddToCateTable(){
    var exixs = this.arrCate.find(item=>this.Form.get('categoryId')?.value == item.categoryId)
    var ExistcateName = this.AllCates.find(item=>this.Form.get('categoryId')?.value == item.id)
    console.log(ExistcateName.categoryName);
    
    if(exixs==undefined){
      let Model = Object.assign(this.Form.value,{benfitTypes:this.arrTest,categoryName:ExistcateName.categoryName})
      this.arrCate.push(Model);
      this.Form.reset();
      this.arrTest=[]
    }else{
      this._ToastrService.show('This Category is Already Existed')
    }
    console.log(this.arrCate);
  }
  // Remove Benefit Type
  RemoveFromCateTable(index:number){
    this.arrCate.splice(index, 1)
  }


    // Get All
  getAllItems(){
    this._PricingToolService.GetAllBenfits().subscribe((data:any)=>{
      this.AllItems =data;
      console.log(this.AllItems);
    },error=>{
      console.log(error);
    })
  }
    // Get All
  getAllCates(){
    this._PricingToolService.GetAllCategories().subscribe((data:any)=>{
      this.AllCates =data;
      console.log(this.AllCates);
    },error=>{
      console.log(error);
    })
  }
  loadData() {
    this.loading = true;
  
    setTimeout(() => {
      this.loading = false;
    }, 2000); 
  }
  ngOnInit(){
    this.loadData()
    this.getAllItems() 
    this.getAllCates() 
  }
}
