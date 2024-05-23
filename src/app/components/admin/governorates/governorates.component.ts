import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PolicyService } from 'src/app/services/policy.service';
import Swal from 'sweetalert2';
declare var $:any

@Component({
  selector: 'app-governorates',
  templateUrl: './governorates.component.html',
  styleUrls: ['./governorates.component.scss']
})
export class GovernoratesComponent {
  page:number=1;
  count:number=0;
  tableSize:number=5;
  tableSizes=[5,8,10,15,20];

  AllItems:any
  loading:boolean=false
  isClicked:boolean=false
  EditId:any
  term:any;
  permissions:any[]= JSON.parse(localStorage.getItem('permissions')!)

  Form:FormGroup =new FormGroup({
    'name':new FormControl('',[Validators.required,Validators.minLength(3)]),
  });
  constructor(private _AuthService:AuthService , private _PolicyService:PolicyService){
  }
      // Get All
  getAllGovernorates(){
    this.loading=true;
    this._PolicyService.getAllGovernorates().subscribe(data=>{
      this.AllItems =data;
      this.loading=false;
      console.log(this.AllItems);
    },error=>{
      this.loading=true;
    })
  }
      // Add Governorates
  AddItem(){
    this.isClicked = true;
    console.log(this.Form.value);
    
    this._PolicyService.AddGovernorates(this.Form.value).subscribe((res:any)=>{
      this.isClicked = false;
      console.log(res);
      $("#Add").modal('toggle')
      this.getAllGovernorates()
      Swal.fire({title:res.name+'Department Added Successfully',timer:2300, timerProgressBar: true})
    },error=>{
      this.isClicked = false;
      console.log(error);
      Swal.fire({icon: 'error',title: 'Oops...',text: error.error,})
    })
  }
  getBranchDetails(item:any){
    console.log(item);
    this.EditId = item.id
    this.Form.get('name')?.setValue(item.name)
  }
 SubmitEditBranch(){
  this.isClicked = true;
  let Model = Object.assign(this.Form.value,
    {id:this.EditId}
  )
  console.log(Model);
  
    this._PolicyService.UpdateGovernorates(Model).subscribe((res:any)=>{
      this.isClicked = false;
      $("#Edit").modal('toggle')
      this.getAllGovernorates()
      Swal.fire({title:res.name+' Governorates Edited Successfully',timer:2300, timerProgressBar: true})
    },error=>{
      this.isClicked = false;
      Swal.fire({icon: 'error',title: 'Oops...',text: error.error})
      console.log(error);
      
    })
  
}
//////////// Delete ////////////
deleteDepartment(item:any){
  console.log(item);
  this._PolicyService.DeleteGovernorates(item.id).subscribe((res:any)=>{
    console.log(res);
    this.getAllGovernorates()
    Swal.fire({title:res,timer:2300, timerProgressBar: true})
  },error=>{
    console.log(error);
    Swal.fire({icon: 'error',title: 'Oops...',text: error.error,})
  })
}
  WhenModalOpen(){
    this.Form.reset()
  }
            //Pagination Methods
  onTableDataChange(event:any){
    this.page=event;
    this.getAllGovernorates();
  }
  onTableSizeChange(event:any){
    this.tableSize=event.target.value;
    this.page=1;
    this.getAllGovernorates();
  }

  ngOnInit(): void {
    this.getAllGovernorates();
  }
}
