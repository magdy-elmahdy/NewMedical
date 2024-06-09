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
  constructor(private _PricingToolService:PricingToolService){}
  Form:FormGroup =new FormGroup({
    'planName':new FormControl('',[Validators.required]),
    'annualMaxLimit':new FormControl('',[Validators.required]),
});
  NewForm:FormGroup = new FormGroup({
    'covergeRegion':new FormControl('',[Validators.required]),
    'coverageType':new FormControl('',[Validators.required]),
    'note':new FormControl(''),
    'partialPercantage':new FormControl('',[Validators.required]),
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
  view(){

    let Model = Object.assign(this.NewForm.value)
    this.arrTest.push(Model);
      this.NewForm.reset()
    console.log(this.arrTest);
  }
  remove(index:number){
    this.arrTest.splice(index, 1)
  }
  viewArr(){
    let Model =Object.assign(this.Form.value,{coverageRegions:this.arrTest}) 
    // let Model = [];
    // Model.push(this.Form.value);
    // Model.push(this.arrTest);
    console.log(Model);
    this.MainArr.push(Model)
    // this.Form.reset()
  }
  AddPlan(){
    this.isClicked =true
    // let Model = Object.assign(this.Form.value,{coverageRegions:this.arrTest})
    // console.log(Model);
    this._PricingToolService.AddNewPlan(this.MainArr).subscribe((res:any)=>{
      this.isClicked = false;
      console.log(res);
      $("#AddPlan").modal('toggle')
      this.getAllPlans()
      Swal.fire({title:'Plan Added Successfully',timer:3000, timerProgressBar: true})
      this.arrTest =[];
    },error=>{
      this.isClicked = false;
      console.log(error);
      Swal.fire({icon: 'error',title: 'Oops...',text: error.error,})
      this.arrTest =[];
    })
  }
  getAllPlans(){
    this._PricingToolService.getAllPlans().subscribe((data:any)=>{
      console.log(data);
      this.AllPlansArr = data
    })
  }
  ngOnInit(): void {
    this.getAllPlans();
  }

}
