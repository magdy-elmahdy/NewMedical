import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ListsService } from 'src/app/services/lists.service';
import { PolicyService } from 'src/app/services/policy.service';
import Swal from 'sweetalert2';
declare var $:any
@Component({
  selector: 'app-add-beds',
  templateUrl: './add-beds.component.html',
  styleUrls: ['./add-beds.component.scss']
})
export class AddBedsComponent implements OnInit{
  genderVal: any;
  relationVal: any;
  CustomerId: any;
  policyId: any;
  bloodTypeVal: any;
  smokingVal: any;
  anyFamilyNonInsured:any=null
  arr:any[]=[]
  RelationShips:any
  GenderArr:any=[{id:0 , value:'Male'},{id:1 , value:'Female'}]
  constructor(private _Router:Router,private _PolicyService:PolicyService , private _ActivatedRoute:ActivatedRoute, public _ListsService:ListsService){
    this.CustomerId = this._ActivatedRoute.snapshot.paramMap.get('customerId');
    this.policyId = this._ActivatedRoute.snapshot.paramMap.get('policyId');
  }

    
  
  Form:FormGroup = new FormGroup({
    'name':new FormControl('',[Validators.required]),
    'nationality':new FormControl('',[Validators.required]),
    'dateOfBirth':new FormControl('',[Validators.required]),
    'height':new FormControl('',[Validators.required]),
    'weight':new FormControl('',[Validators.required]),
    'job':new FormControl('',[Validators.required]), //occupation
    'bloodType':new FormControl('',[Validators.required]),
    'notes':new FormControl('')
  })

  //Submit Add Family
  SubmitAddFamily(){
    
    let Model = {
      customerFamily:this.arr,
      policyId:Number(this.policyId),
      anyFamilyNonInsured:this.anyFamilyNonInsured
    }
    console.log(Model);
    
    this._PolicyService.AddCustomerFamily(Model).subscribe(res=>{
      console.log(res);
      this._Router.navigate(['/SelectPlanToPolicy/family/'+this.CustomerId+'/'+this.policyId])
      Swal.fire(
        'Good job!',
        'Family Added Successfully',
        'success'
      )
    },error=>{
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.error,
      })
    })

  }
  // Not Insured Persons Status
  getNotInsuredPersonsStatus(value:any){
    if(value=='true'){
      $("#notInsuredPersons").show(400);
      this.anyFamilyNonInsured=''
    }else{
      $("#notInsuredPersons").hide(400)
      this.anyFamilyNonInsured=null
    }
    
  }
// Add And view Item 
view(){
  // let genderVa =this.arr.find(item=>item.==item.value)
  let Model= Object.assign(this.Form.value,{
    gender:Number(this.genderVal),
    relationship:this.relationVal,
    smoker:JSON.parse(this.smokingVal),
    dateOfBirth:String(this.Form.get("dateOfBirth")?.value).substring(0,16)
  },)
  this.arr.push(Model);
  console.log(this.arr);

  this.Form.reset()
  this.relationVal=''
  this.genderVal=''
  this.bloodTypeVal=''
  this.smokingVal=''
}
   //Remove item From Loss Participations List
   remove(index:number){
    this.arr.splice(index, 1)
  }
      /// get RelationShips
  getRelationShips(){ 
    this._ListsService.getRelationShips().subscribe((data:any)=>{
      this.RelationShips =data;
    })
  }

  ngOnInit(): void {
    this.getRelationShips();
  }
}
