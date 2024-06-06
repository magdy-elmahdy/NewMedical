import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
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

  loading:boolean=false;
  isClicked:boolean =false;
  arrCate:any[]=[]
  arrTest:any[]=[];
  AllItems:any;
  term:any;

  constructor(private _PricingToolService:PricingToolService, private _ToastrService:ToastrService){}
  
  Form:FormGroup =new FormGroup({
    'arabicName':new FormControl('',[Validators.required]),
    'englishName':new FormControl('',[Validators.required]),
});
  
EDitForm:FormGroup =new FormGroup({
  'id': new FormControl(null),
  'ArabicName':new FormControl('',[Validators.required]),
  'EnglishName':new FormControl('',[Validators.required]),
});


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
  
  remove(index:number){
    this.arrCate.splice(index, 1)
  }
  // Edite Category
  CurrentActivity:any
  openEditModal(Category:any){
    console.log(Category);
    this.CurrentActivity=Category
    this.EDitForm.setValue({id: Category.id,ArabicName:Category.arabicName,EnglishName:Category.englishName})
  }
  formData:any = new FormData();

  saveCategoryEdit(){
    this.isClicked = true
    if (this.CurrentActivity) {
      // const updatedCategory = { ...this.CurrentActivity, ...this.EDitForm.value };
      this.formData.append('id', this.EDitForm.get('id')?.value);
      this.formData.append('ArabicName', this.EDitForm.get('ArabicName')?.value);
      this.formData.append('EnglishName', this.EDitForm.get('EnglishName')?.value);
      for (var pair of this.formData.entries()){
        console.log(pair[0]+ ', ' + pair[1]);
      }      
      this._PricingToolService.EditCategory(this.formData).subscribe((res) => {
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
      this.AllItems =data;
      this.loading=false;
      console.log(this.AllItems);
    },error=>{
      console.log(error);
      this.loading=false;
    })
  }
  ngOnInit(){
    this.getAllItems()
  }
}
