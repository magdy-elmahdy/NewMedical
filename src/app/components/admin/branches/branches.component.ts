import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { PolicyService } from 'src/app/services/policy.service';
import Swal from 'sweetalert2';
declare var $:any

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.scss']
})
export class BranchesComponent {
  page:number=1;
  count:number=0;
  tableSize:number=5;
  tableSizes=[5,8,10,15,20];
  permissions:any[]= JSON.parse(localStorage.getItem('permissions')!)

  AllBranches:any;
  loading:boolean=false
  EditId:any
  term:any

  AddBranchForm:FormGroup =new FormGroup({
    'name':new FormControl('',[Validators.required,Validators.minLength(3)]),
    'code':new FormControl('',[Validators.required,Validators.minLength(3)])
});
  constructor(private _Router:Router,private _ToastrService:ToastrService,private _AuthService:AuthService ,private _PolicyService:PolicyService){
    if(!this.permissions.includes('Permissions.Branches.View')){
      this._ToastrService.show('عفوا ! ليس لديك صلاحية')
      this._Router.navigate(['/Forbidden'])
    }
  }
  
  
      // Get All
  getAllBranches(){
    this.loading=true;
    this._PolicyService.getAllBranches().subscribe(data=>{
      this.AllBranches =data;
      this.loading=false;
      console.log(this.AllBranches);
    },error=>{
      this.loading=true;
    })
  }
      // Add Branch
  AddBranch(){
    this._PolicyService.AddBranch(this.AddBranchForm.value).subscribe((res:any)=>{
      console.log(res);
      $("#Add").modal('toggle')
      this.getAllBranches()
      Swal.fire({title:res.name+' Branch Added Successfully',timer:2300, timerProgressBar: true})
    },error=>{
      console.log(error);
      Swal.fire({icon: 'error',title: 'Oops...',text: error.error,})
    })
  }
  getBranchDetails(Branch:any){
    console.log(Branch);
    this.EditId = Branch.id
    this.AddBranchForm.get('name')?.setValue(Branch.name)
    this.AddBranchForm.get('code')?.setValue(Branch.code)
  }
 SubmitEditBranch(){
  let Model = Object.assign(this.AddBranchForm.value,
    {id:this.EditId}
  )
    this._PolicyService.UpdateBranches(Model).subscribe((res:any)=>{
      $("#Edit").modal('toggle')
      this.getAllBranches()
      Swal.fire({title:res.name+' Branch Edited Successfully',timer:2300, timerProgressBar: true})
    },error=>{
      Swal.fire({icon: 'error',title: 'Oops...',text: error.error})
      console.log(error);
      
    })
  
}
  WhenModalOpen(){
    this.AddBranchForm.reset()
  }
            //Pagination Methods
  onTableDataChange(event:any){
    this.page=event;
    this.getAllBranches();
  }
  onTableSizeChange(event:any){
    this.tableSize=event.target.value;
    this.page=1;
    this.getAllBranches();
  }

  ngOnInit(): void {
    this.getAllBranches();
  }
}
