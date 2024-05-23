import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PolicyService } from 'src/app/services/policy.service';

@Component({
  selector: 'app-all-policess',
  templateUrl: './all-policess.component.html',
  styleUrls: ['./all-policess.component.scss']
})
export class AllPolicessComponent {
  term:any
  AllPolices:any[]=[];              
  page:number=1;
  count:number=0;
  tableSize:number=10;
  tableSizes=[10,20,5,8,15];
  permissions:any[]= JSON.parse(localStorage.getItem('permissions')!)

  PolicyGroup:any=[]
  EditableGroup:any[]=[]
  CategoryEditGroup:any[]=[]
  GroupToRemove:any=[]
  PolicyPlans:any=[]
  CategoryEdit:any[]=[]

  loading:boolean=false
  brokerInputValidation:Boolean = false
  
  
  loadingDetails:boolean=false;
  formData:any = new FormData()
  InsuranceClasses:any[]=[]
  cusDate:any

  constructor(private _Router:Router, private _PolicyService:PolicyService, private _ToastrService:ToastrService){
  }
  getAllPolices(){
    this.loading=true;
    this._PolicyService.getAllPolices().subscribe((data:any)=>{
      console.log(data);
      this.AllPolices =data;
      this.loading=false;
    })
  }

  //Pagination Methods
  onTableDataChange(event:any){
    this.page=event;
    this.getAllPolices();
  }
  onTableSizeChange(event:any){
    this.tableSize=event.target.value;
    this.page=1;
    this.getAllPolices();
  }

        // WhenModal opened
  WhenOpenModal(){
    this.GroupToRemove = [];
    this.EditableGroup = Array.from(this.PolicyGroup);
    this.CategoryEditGroup = Array.from(this.PolicyGroup);
  }

  ngOnInit(){
    this.getAllPolices()
  }

}
