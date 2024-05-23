import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppendixService } from 'src/app/services/appendix.service';
import { PolicyService } from 'src/app/services/policy.service';
import Swal from 'sweetalert2';

declare var $:any

@Component({
  selector: 'app-cancel-update',
  templateUrl: './cancel-update.component.html',
  styleUrls: ['./cancel-update.component.scss']
})
export class CancelUpdateComponent {
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
  PolicyCaluculations:any
  constructor(private _PolicyService:PolicyService,private _AppendixService:AppendixService,private _ActivatedRoute:ActivatedRoute, private _Router:Router){
    this.PolicyId = this._ActivatedRoute.snapshot.paramMap.get('id')
    this.EndorsmentId = this._ActivatedRoute.snapshot.paramMap.get('id2')
  }
  CancelingEndorsmentForm:FormGroup = new FormGroup({
    stamp:new FormControl('',[Validators.required]),
    supervision:new FormControl('',[Validators.required]),
    policyHolders:new FormControl('',[Validators.required]),
    imprintStamp:new FormControl('',[Validators.required]),
    issueFees:new FormControl('',[Validators.required]),
    grossPremium:new FormControl('',[Validators.required]),
    policyRevision:new FormControl('',[Validators.required]),
    taxes:new FormControl('',[Validators.required]),
    totalSumInsured:new FormControl('',[Validators.required]),
    tpaFeesPCT:new FormControl('',[Validators.required]),
    brokeragePCT:new FormControl('',[Validators.required]),
  })
        // get Policy Details By Id
  getEndorsementById(){
    this.isClicked=true;
    this._AppendixService.getEndorsementById(this.EndorsmentId).subscribe((data:any)=>{
      this.isClicked=false;
      console.log(data);
      this.PoicyGroup = data.group
      this.PolicyCaluculations = data
      this.setFormValues()
    },error=>{
      console.log(error);
      this.isClicked=false;
    })  
  }

            //Pagination Methods
  onTableDataChange(event:any){
    this.page=event;
    this.getEndorsementById();
  }
  onTableSizeChange(event:any){
    this.tableSize=event.target.value;
    this.page=1;
    this.getEndorsementById();
  }




  UpdateEndorsement(){
    this.isClicked = true;
  let Model = Object.assign(this.CancelingEndorsmentForm.value,
    {taxes:this.CancelingEndorsmentForm.get('taxes')?.value/100},
    {policyId:Number(this.PolicyId)},
    {id:Number(this.EndorsmentId)})
  console.log(Model);
    this._AppendixService.UpdateEndorsement(Model).subscribe((data:any)=>{
      this.isClicked = false;
      console.log(data);
      this.PolicyCaluculations =data
    },error=>{
      console.log(error);
      this.isClicked = false;
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.error,
      });
    })
    // this.setFormValues()
}
  setFormValues(){
    this.CancelingEndorsmentForm.patchValue({
      stamp:this.PolicyCaluculations?.stamp,
      supervision:this.PolicyCaluculations?.supervision,
      policyHolders:this.PolicyCaluculations?.policyHolders,
      imprintStamp:this.PolicyCaluculations?.imprintStamp,
      issueFees:this.PolicyCaluculations?.issueFees,
      grossPremium:this.PolicyCaluculations?.grossPremium,
      policyRevision:this.PolicyCaluculations?.policyRevision,
      taxes:this.PolicyCaluculations?.taxes*100,
      totalSumInsured:this.PolicyCaluculations?.totalSumInsured
    })
  }
  ActivateEndorsement(){
    this._AppendixService.SaveEndorsement(Number(this.EndorsmentId)).subscribe(res=>{
      console.log(res);
      this.getEndorsementById()
    })
  }
  updateGrossPriVal(){
    this.CancelingEndorsmentForm.get('grossPremium')?.setValue(
      this.CancelingEndorsmentForm.get('stamp')?.value+
      this.CancelingEndorsmentForm.get('issueFees')?.value+
      this.CancelingEndorsmentForm.get('imprintStamp')?.value+
      this.CancelingEndorsmentForm.get('policyRevision')?.value+
      this.CancelingEndorsmentForm.get('policyHolders')?.value+
      this.CancelingEndorsmentForm.get('supervision')?.value+Number(this.PolicyCaluculations?.netPremium)
    )
  }
  ngOnInit(){
    this.getEndorsementById()
  }
}
