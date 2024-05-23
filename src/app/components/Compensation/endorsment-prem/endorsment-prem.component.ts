import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppendixService } from 'src/app/services/appendix.service';
import { PolicyService } from 'src/app/services/policy.service';
import Swal from 'sweetalert2';
declare var $:any

@Component({
  selector: 'app-endorsment-prem',
  templateUrl: './endorsment-prem.component.html',
  styleUrls: ['./endorsment-prem.component.scss']
})
export class EndorsmentPremComponent {
  page:number=1;
  count:number=0;
  tableSize:number=5;
  tableSizes=[5,8,10,15,20];
  
  PolicyId:any
  EndorsmentId:any
  PoicyGroup:any
  loading:boolean = false
  netPremVAl:any
  ModelArr:any[]=[]
  isClicked:boolean = false
  term:any
  netPremiumForm:FormGroup = new FormGroup({
    'netPremium':new FormControl('')
  })
  constructor(private _PolicyService:PolicyService,private _AppendixService:AppendixService,private _ActivatedRoute:ActivatedRoute, private _Router:Router){
    this.PolicyId = this._ActivatedRoute.snapshot.paramMap.get('id')
    this.EndorsmentId = this._ActivatedRoute.snapshot.paramMap.get('id2')
  }

        // get Policy Details By Id
  getThePolicyById(){
    this.loading=true;
    this._AppendixService.GetGroupOfEndorsement(this.EndorsmentId).subscribe((data:any)=>{
      this.loading=false;
      console.log(data);
      this.PoicyGroup = data.policyCustomerGroup
    },error=>{
      console.log(error);
      this.loading=false;
    })
  }

  // Final Body
  getNetPremium(target:any,id:any){
    var exist = this.ModelArr.find(item=>item.customerId==id);

    if(exist == undefined){
      let Model = {
        'customerId':id,
        'netPremium':Number(target.value)
      }
      this.ModelArr.push(Model)
      console.log(this.ModelArr);
    }else{
      var index = this.ModelArr.indexOf(exist)
      this.ModelArr.splice(index,1)
      let Model = {
        'customerId':id,
        'netPremium':Number(target.value)
      }
      this.ModelArr.push(Model)
      console.log(this.ModelArr);
    }
    
  }

  UpdatePolicyGroupPremium(){
    this.isClicked= true
    this._PolicyService.UpdatePolicyGroupPremiumEndor(Number(this.PolicyId), Number(this.EndorsmentId), this.ModelArr).subscribe(res=>{
      // Swal.fire('Group Details Edited Successfully','','success')
      Swal.fire({
        icon: 'success',
        title: 'Group Details Edited Successfully',
        showConfirmButton: false,
        // timer: 1500
      })
      this._Router.navigate(['/CancleUpdate/'+this.PolicyId+'/'+this.EndorsmentId])
      this.isClicked= false
      console.log(res);
    },error=>{
      console.log(error);
      Swal.fire({icon: 'error',title:error.error,text:''})
      this.isClicked= false
    })
  }
            //Pagination Methods
  onTableDataChange(event:any){
    this.page=event;
    this.getThePolicyById();
  }
  onTableSizeChange(event:any){
    this.tableSize=event.target.value;
    this.page=1;
    this.getThePolicyById();
  }
  ngOnInit(): void {
    this.getThePolicyById()
  }
}
