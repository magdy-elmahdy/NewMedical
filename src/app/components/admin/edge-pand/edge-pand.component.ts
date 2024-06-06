import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PricingToolService } from 'src/app/services/pricing-tool.service';
import Swal from 'sweetalert2';
declare var $:any; 
@Component({
  selector: 'app-edge-pand',
  templateUrl: './edge-pand.component.html',
  styleUrls: ['./edge-pand.component.scss']
})
export class EdgePandComponent implements OnInit {
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
  AllArr:any[]=[]

  constructor(private _PricingToolService:PricingToolService, private _ToastrService:ToastrService){}
  
  Form:FormGroup =new FormGroup({
    'from':new FormControl('',[Validators.required]),
    'to':new FormControl('',[Validators.required])
});
EditFrom:FormGroup = new FormGroup({
  'id': new FormControl(null),
  'From':new FormControl('',[Validators.required]),
  'To':new FormControl('',[Validators.required])
})
  maxto:any
  WhenModalOpen(){
    console.log(this.AllArr);
    this.maxto = Math.max(...this.AllArr.map(obj => obj.to));
    console.log(this.maxto);
    this.Form.reset()
    this.arrCate=[]
    this.Form.get('from')?.setValue(this.maxto + 1)
    // this.arrTest =[];
  }
  maxValue:any
  newFrom:any
  addExprrosure(){
  
      if (this.Form.valid) {
        const newExposure = {
          from: this.Form.get('from')?.value,
          to: this.Form.get('to')?.value,
        };
        let Model = Object.assign(newExposure
      )
        console.log(Model);
  
        this.arrCate.push(Model);
        this.maxValue = Math.max(...this.arrCate.map(obj => obj.to));
        console.log(Number(this.maxValue));
        
       
        // Set new 'from' value for the next input
        this.newFrom = newExposure.to + 1;
  
        // Reset the form and set the new 'from' value
        this.Form.reset({ from: this.newFrom, to: ''});
      } else {
        alert('Please fill all required fields.');
      }
  }
  // Add age
  AddAgeBand(){
    this.isClicked =true
    this._PricingToolService.AddAgeBand(this.arrCate).subscribe((res:any)=>{
      this.isClicked = false;
      console.log(res);
      $("#Add").modal('toggle')
      this.getAllItems()
      Swal.fire({title:'Age / Ages Added Successfully',timer:3000, timerProgressBar: true})
      this.arrCate =[];
    },error=>{
      this.isClicked = false;
      console.log(error);
      Swal.fire({icon: 'error',title: 'Oops...',text: error.error,})
      this.arrCate =[];
    })
  }
  //  Delet Age Band
ageBandId:any
deleteAgeBand(id:any){
  this.ageBandId = id;

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
      this._PricingToolService.DeleteAgeBand(this.ageBandId).subscribe(
        (data) => {
          // Show success message
          Swal.fire(
            'Deleted!',
            'Age BAnd Deleted Successfully',
            'success'
          );
          // Refresh categories list or perform other actions
          this.getAllItems();
        },
        (error) => {
          // Show error message if delete operation fails
          Swal.fire(
            'Error!',
            'There was an error deleting the Age Band. Please try again.',
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
// Edit
AgeBandItem:any
openEditModal(item:any){
  console.log(item);
  this.AgeBandItem = item
  this.EditFrom.setValue({id:item.id,From:item.from,To:item.to})
}
formData:any = new FormData();

saveCategoryEdit(){
  this.isClicked = true
  if (this.AgeBandItem) {
    this.formData.append('id', this.EditFrom.get('id')?.value);
    this.formData.append('From', this.EditFrom.get('From')?.value);
    this.formData.append('To', this.EditFrom.get('To')?.value);
    for (var pair of this.formData.entries()){
      console.log(pair[0]+ ', ' + pair[1]);
    }  
    // const updatedCategory = { ...this.AgeBandItem, ...this.EditFrom.value };
    // console.log(updatedCategory);
    this._PricingToolService.EditAgeBand(this.formData).subscribe((data) => {
      this.isClicked = false

      console.log(data);
      $('#EditForm').modal('toggle'); 
      this.getAllItems();
      Swal.fire({ title: "Good job!", text: "Category Updated Successfully", icon: "success" })
                  // Close modal EditNewExposer
    }, error => {
      console.log(error);
      this.isClicked = false

      Swal.fire({ icon: "error", title: "Oops...", text: error.error });
    });
  }
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
  // View 
  view(){
    var exixs = this.arrCate.find(item=>this.Form.value.from == item.from)
    console.log(exixs);
    
    if(exixs==undefined){
      this.arrCate.push(this.Form.value);
      this.Form.get('from')?.setValue(this.Form.get('to')?.value+1)
      this.Form.get('to')?.setValue(null)
    }else{
      this._ToastrService.show('This item already existed')
    }
    console.log(this.arrCate);
  }
  // Remove
  remove(index:number){
    this.arrCate.splice(index, 1)
  }
  getTo(){
    console.log(this.Form.get('to')?.value);
    if(this.Form.get('from')?.value>=this.Form.get('to')?.value){
      this.Form.get('to')?.setErrors({text:'incorrect'})
      // this._ToastrService.show('Invalid interval')
    }
  }

    // Get All
  getAllItems(){
    this.loading=true;
    this._PricingToolService.GetAllAgeBands().subscribe((data:any)=>{
      this.AllItems =data;
      this.AllArr = data
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
