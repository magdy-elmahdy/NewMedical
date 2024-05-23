import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PolicyService } from 'src/app/services/policy.service';
import Swal from 'sweetalert2';
declare var $:any

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent {
  page:number=1;
  count:number=0;
  tableSize:number=5;
  tableSizes=[5,8,10,15,20];

  AllBranches:any;
  loading:boolean=false
  EditId:any
  term:any;
  permissions:any[]= JSON.parse(localStorage.getItem('permissions')!)

  AddDepartmentForm:FormGroup =new FormGroup({
    'name':new FormControl('',[Validators.required,Validators.minLength(3)]),
});
  constructor(private _AuthService:AuthService ,private _PolicyService:PolicyService){

  }
  
 
      // Get All
  getAllDepartments(){
    this.loading=true;
    this._PolicyService.getAllDepartments().subscribe(data=>{
      this.AllBranches =data;
      this.loading=false;
      console.log(this.AllBranches);
    },error=>{
      this.loading=true;
    })
  }
      // Add Department
  AddDepartment(){
    console.log(this.AddDepartmentForm.value);
    
    this._PolicyService.AddDepartment(this.AddDepartmentForm.value).subscribe((res:any)=>{
      console.log(res);
      $("#Add").modal('toggle')
      this.getAllDepartments()
      Swal.fire({title:res.name+' Department Added Successfully',timer:2300, timerProgressBar: true})
    },error=>{
      console.log(error);
      Swal.fire({icon: 'error',title: 'Oops...',text: error.error,})
    })
  }
  getBranchDetails(Branch:any){
    console.log(Branch);
    this.EditId = Branch.id
    this.AddDepartmentForm.get('name')?.setValue(Branch.name)
  }
 SubmitEditBranch(){
  let Model = Object.assign(this.AddDepartmentForm.value,
    {id:this.EditId}
  )
  console.log(Model);
  
    this._PolicyService.UpdateDepartment(Model).subscribe((res:any)=>{
      $("#Edit").modal('toggle')
      this.getAllDepartments()
      Swal.fire({title:res.name+' Department Edited Successfully',timer:2300, timerProgressBar: true})
    },error=>{
      Swal.fire({icon: 'error',title: 'Oops...',text: error.error})
      console.log(error);
      
    })
  
}
//////////// Delete ////////////
deleteDepartment(item:any){
  console.log(item);
  this._PolicyService.DeleteDepartment(item.id).subscribe((res:any)=>{
    console.log(res);
    this.getAllDepartments()
    Swal.fire({title:res,timer:2300, timerProgressBar: true})
  },error=>{
    console.log(error);
    Swal.fire({icon: 'error',title: 'Oops...',text: error.error,})
  })
}
  WhenModalOpen(){
    this.AddDepartmentForm.reset()
  }
            //Pagination Methods
  onTableDataChange(event:any){
    this.page=event;
    this.getAllDepartments();
  }
  onTableSizeChange(event:any){
    this.tableSize=event.target.value;
    this.page=1;
    this.getAllDepartments();
  }

  ngOnInit(): void {
    this.getAllDepartments();
  }
}
