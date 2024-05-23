import { AnimationDriver } from '@angular/animations/browser';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { ReInsuranceService } from 'src/app/services/re-insurance.service';
import Swal from 'sweetalert2';
declare var $:any
@Component({
  selector: 'app-re-insurance-company',
  templateUrl: './re-insurance-company.component.html',
  styleUrls: ['./re-insurance-company.component.scss']
})
export class ReInsuranceCompanyComponent implements OnInit{
  AllContries:any;
  contryValue:any= '65';
  isClicked:boolean = false;
  AllAgencies:any[]=[]
  AllRates:any
  constructor(private _AdminService:AdminService,private _ReInsuranceService:ReInsuranceService){}
  Form:FormGroup = new FormGroup({
    'name':new FormControl('',[Validators.required]),
    'country':new FormControl(1,[Validators.required]),
    'notes':new FormControl(''),
    'lostedOrNotListed':new FormControl('',[Validators.required]),
    'authorityCode':new FormControl(''),
    'agencyName':new FormControl('',[Validators.required]),
    'agencyRate':new FormControl('',[Validators.required]),
  })
  // All Countries
  getCountries(){
    this._AdminService.getCountries().subscribe(data=>{
      this.AllContries =data;
    })
  }
  // Company Status
  getCompanyStatus(value:any){
    if(value ==true){
      $("#AuthCode").show(400)
      this.Form.get("authorityCode")?.setValidators([Validators.required]);
      this.Form.get("authorityCode")?.updateValueAndValidity();
    }else{
      $("#AuthCode").hide(400)
      this.Form.get("authorityCode")?.setValue('');
      this.Form.get("authorityCode")?.setValidators(null);
      this.Form.get("authorityCode")?.updateValueAndValidity();
    }
  }
  // Raiting Company
  getSelectedRatingAgency(){
    if(this.Form.get("agencyName")?.value=='Other'){
      this.Form.get("agencyName")?.setValue('')
      this.Form.get("agencyRate")?.setValue('')
      $("#agencyRate").hide(300);
      $("#agencyName").hide(300);
      $("#OtherRating").show(300);
      $("#OtherRatingAgency").show(300);
    }else{
      let Exist = this.AllAgencies.find(item=>item.agencyName == this.Form.get("agencyName")?.value);
      console.log(Exist);
      this.AllRates= Exist.rates;
    }
  }
  // Submit 
  SubmitReInCompany(){
    this.isClicked= true;
    let Model = Object.assign(this.Form.value,{brokerOrReInsurance:1});
    console.log(Model);
    this._ReInsuranceService.AddNewReInsuranceCompany(Model).subscribe(res=>{
      this.isClicked= false;
      console.log(res);
      Swal.fire('Good job!',' Added Successfully','success');
    },error=>{
      console.log(error);
      this.isClicked= false;
      Swal.fire({icon: 'error',title: 'Oops...', text: error.error,});
    })
  }
  // GetAllAgencies
  GetAllAgencies(){
    this._ReInsuranceService.GetAllAgencies().subscribe((data:any)=>{
      this.AllAgencies = data;
    })
  }
  ngOnInit(){
    this.getCountries()
    this.GetAllAgencies()
  }
}
