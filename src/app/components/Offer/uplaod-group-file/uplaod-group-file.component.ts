import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PolicyService } from 'src/app/services/policy.service';
import { PricingToolService } from 'src/app/services/pricing-tool.service';
import Swal from 'sweetalert2';
declare var $:any
@Component({
  selector: 'app-uplaod-group-file',
  templateUrl: './uplaod-group-file.component.html',
  styleUrls: ['./uplaod-group-file.component.scss']
})
export class UplaodGroupFileComponent implements OnInit{
  showAppearButton: boolean = false;

  FileName:any
  selectedFile:any
  isClickedDocumnet:boolean=false
  OfferId:any
  Type:any
  AllPolicyGroup:any
  loading:boolean = false;
  pricingData: any[] = [];
  constructor(public _location:Location,private _PolicyService:PolicyService ,
    private _PricingToolService:PricingToolService,
     private _Router:Router, private _ActivatedRoute:ActivatedRoute){
    this.OfferId = this._ActivatedRoute.snapshot.paramMap.get('id')
    this.OfferId=Number(this.OfferId)
    this.Type = this._ActivatedRoute.snapshot.paramMap.get('type')
  }
  HaveLoseForm:FormGroup =new FormGroup({
    'lossRatio':new FormControl('',[Validators.required]),
    'targetLossRatio':new FormControl('',[Validators.required])
});
  getTempleteFile(){
    this._PolicyService.getGroupTempleteFile().subscribe(res=>{
      let blob:Blob = res.body as Blob
      this.FileName= 'group templete.xlsx'
      let a= document.createElement('a');
      a.download=this.FileName
      a.href=window.URL.createObjectURL(blob)
      a.click()
    })
  }

  uploadFile(event: any){
    this.selectedFile = event.target.files[0] ?? null;
    console.log(this.selectedFile);
  }
  FormData1:any =new FormData()
        ////////Save File //////////////
  SaveGroup(){
    this.isClickedDocumnet=true
    
    if(this.Type==1){
      // Pricing
      this.FormData1.append('offerId',this.OfferId)
      this.FormData1.append('file',this.selectedFile)
      this._PricingToolService.AddEmployeesGroupFile(this.FormData1).subscribe((res:any)=>{
        this.isClickedDocumnet=false
        console.log(res);
        this.pricingData = res;
        this.FormData1 = new FormData()
        $("#afterUpload").show(400)
      },error=>{
        this.isClickedDocumnet=false
        console.log(error);
        this.FormData1 = new FormData()
      })
      $("#ShowTable").show(300);
    }else if (this.Type==2){
      // Old Way
      var formData = new FormData()
      formData.append('employeesFile',this.selectedFile);
      this._PolicyService.UploadGroupFile(this.OfferId,formData).subscribe(res=>{
        this.isClickedDocumnet=false
        this._Router.navigate(['/Calculations',this.OfferId,2])
        console.log(res);
        this.getGroupOfPolicy()
        Swal.fire(res,'','success')
      },error=>{
        console.log(error);
        Swal.fire({icon: 'error',title:error.error,text:''})
        this.isClickedDocumnet=false
      })
    }
    
  }
  isClicked:boolean = false;
  // Final Save Pricing
  FinalSavePricing(){
    this.isClicked = true
    this._PricingToolService.UpdateOfferWithLossRatio(this.HaveLoseForm.value,this.OfferId).subscribe(res=>{
      console.log(res);
      this.isClicked = false;
      this._Router.navigate(['/Calculations',this.OfferId,1])
    },error=>{
      this.isClicked = false;
      console.log(error);
    })
    
  }
  getGroupOfPolicy(){
    this._PolicyService.getGroupOfPolicy(this.OfferId).subscribe(data=>{
      this.AllPolicyGroup = data;
      console.log(data);
    },error=>
    {
      console.log(error)
    })
  }
  getSelectedOption(value:any){
    console.log(value);
    if(value=='true'){
      $("#HaveLoseRatio").show(400)
      this.HaveLoseForm.get('targetLossRatio')?.setValidators([Validators.required])
      this.HaveLoseForm.get('targetLossRatio')?.updateValueAndValidity()

      this.HaveLoseForm.get('lossRatio')?.setValidators([Validators.required])
      this.HaveLoseForm.get('lossRatio')?.updateValueAndValidity()
      this.showAppearButton = true
    }else{
      $("#HaveLoseRatio").hide(400)
      this.HaveLoseForm.get('targetLossRatio')?.setValidators(null);
      this.HaveLoseForm.get('targetLossRatio')?.updateValueAndValidity()
      this.HaveLoseForm.get('targetLossRatio')?.setValue('')
      this.HaveLoseForm.get('targetLossRatio')?.clearValidators();  
      
      this.HaveLoseForm.get('lossRatio')?.setValidators(null);
      this.HaveLoseForm.get('lossRatio')?.updateValueAndValidity()
      this.HaveLoseForm.get('lossRatio')?.setValue('')
      this.HaveLoseForm.get('lossRatio')?.clearValidators(); 
      this.showAppearButton = true


    }
  }
  ngOnInit(): void {
    if(this.Type=='1'){
      // Pricing
    }
    else if(this.Type=='2'){
      // Not Pricing
      this.getGroupOfPolicy();
    }
  }
}
