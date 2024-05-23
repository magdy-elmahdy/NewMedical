import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PolicyService } from 'src/app/services/policy.service';
import Swal from 'sweetalert2';
declare var $:any
@Component({
  selector: 'app-upload-plans-file',
  templateUrl: './upload-plans-file.component.html',
  styleUrls: ['./upload-plans-file.component.scss']
})
export class UploadPlansFileComponent implements OnInit{
  selectedFile:any=''
  isClickedDocumnet:boolean=false
  OfferId:any
  AllOfferPlans:any[]=[]
  AllPolicyExisit:boolean = false
  loading:boolean = false;
  arrTest:any[]=[]
  AddedNewPlans:any[]=[]
  uploadPlanEvent:any=''
  formData:any = new FormData()
  constructor(public _location: Location,private _ToastrService:ToastrService,private _PolicyService:PolicyService, private _ActivatedRoute:ActivatedRoute,private _Router:Router){
    this.OfferId = this._ActivatedRoute.snapshot.paramMap.get('id')
    this.OfferId=Number(this.OfferId)
  }
  

  PlanForm:FormGroup = new FormGroup({
    PlanName:new FormControl('',[Validators.required]),
    AnnualMaxLimit :new FormControl('',[Validators.required]),
    NetPremium :new FormControl('',[Validators.required]),
  })

  uploadFile(event: any){
    // Get File Object
    this.selectedFile = event.target.files[0] ?? null;
    event.target.value='' 
}

  getPlansOfOffer(){
    this._PolicyService.getPlansOfPolicy(this.OfferId).subscribe((data:any)=>{
      this.AllOfferPlans = data;
      console.log(data);
      if(this.AllOfferPlans.length!=0){
        $("#proceesButton").show(400)
      }else{
        $("#proceesButton").hide(400)
      }
    },error=>
    {
      console.log(error)
    })
  }

    
        ///////// Save Files ///////////////////
  SavePlans(){
    this.isClickedDocumnet=true
              /// Append
    for(let i=0;i<this.AddedNewPlans.length;i++){
      this.formData.append('PlansToAdd['+ i +'].planName',this.AddedNewPlans[i].PlanName)
      this.formData.append('PlansToAdd['+ i+ '].annualMaxLimit',Number(this.AddedNewPlans[i].AnnualMaxLimit))
      this.formData.append('PlansToAdd['+ i+ '].netPremium',Number(this.AddedNewPlans[i].NetPremium))
    }this.formData.append('OfferId',this.OfferId);
    this.formData.append('PlanFile',this.selectedFile)
    for (var pair of this.formData.entries()) {
      console.log(pair[0]+ ', ' + pair[1]); 
  }

    this._PolicyService.AddPlansToOffer(this.formData).subscribe(res=>{
      this.AddedNewPlans = []
      $(".remove").hide(400)
      Swal.fire('Plan Added Successfully','','success')
      this.isClickedDocumnet=false
      console.log(res);
      this.clearFormData()
      this.getPlansOfOffer()
    },error=>{
      Swal.fire({icon: 'error',title:error.error,text:''}  )
      this.isClickedDocumnet=false
      console.log(error);
      this.clearFormData()
    })
    this.formData = new  FormData()
  }
            /// Delete Form Data
  clearFormData(){
    for(let i=0;i<this.arrTest.length;i++){
      this.formData.delete('PlansToAdd['+ i +'].planName')
      this.formData.delete('PlansToAdd['+ i+ '].annualMaxLimit')
      this.formData.delete('PlansToAdd['+ i+ '].netPremium')
    }
    this.formData.delete('OfferId');
    this.formData.delete('PlanFile');
  }
  view(){
    var item = this.arrTest.find(item=>this.PlanForm.get('PlanName')?.value == item.PlanName)
    var item2 = this.AllOfferPlans.find(item=>this.PlanForm.get('PlanName')?.value == item.planName) 
    if(item==undefined&&item2==undefined){
      let Model= {
        'PlanName':this.PlanForm.get('PlanName')?.value,
        'AnnualMaxLimit':this.PlanForm.get('AnnualMaxLimit')?.value,
        'NetPremium':this.PlanForm.get('NetPremium')?.value
      }
      this.arrTest.push(Model);
      this.AddedNewPlans.push(Model);
      this.PlanForm.reset()
      this.uploadPlanEvent='';
    }else{
      this._ToastrService.show('The Plan Name is Already Exist')
    }
    console.log(this.AddedNewPlans);
  }
   //Remove item From Loss Participations List
   remove(index:number,planName:any){
    this.arrTest.splice(index, 1)

    var item = this.AddedNewPlans.find(item=>planName == item.PlanName)
    let i = this.AddedNewPlans.indexOf(item)


    this.AddedNewPlans.splice(i, 1)
    console.log(this.AddedNewPlans);
  }
  getNetPre(){
    if(this.PlanForm.get('NetPremium')?.value>this.PlanForm.get('AnnualMaxLimit')?.value){
      this.PlanForm.setErrors({'invalid':true})
    }
  }
  getAnnualMax(){
    if(this.PlanForm.get('NetPremium')?.value>this.PlanForm.get('AnnualMaxLimit')?.value){
      this.PlanForm.setErrors({'invalid':true})
    }
  }
  ngOnInit(): void {
    this.getPlansOfOffer()
  }
}
