import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { ReInsuranceService } from 'src/app/services/re-insurance.service';
import Swal from 'sweetalert2';
declare var $:any;

@Component({
  selector: 'app-medical-treaty-setup',
  templateUrl: './medical-treaty-setup.component.html',
  styleUrls: ['./medical-treaty-setup.component.scss']
})
export class MedicalTreatySetupComponent implements OnInit{
  AllContries:any;
  contryValue:any= '65';
  BusinessTypes:any
  AllReInsurCompanies:any[]=[]
  AllReInsurBrokers:any[]=[]
  InsuranceClasses:any[]=[]
  arrTest:any[]=[];
  isClicked:boolean= false
  constructor(private _AdminService:AdminService, private _ToastrService:ToastrService,private _ReInsuranceService:ReInsuranceService){}
  Form:FormGroup = new FormGroup({
    'businessType':new FormControl(null,[Validators.required]),
    'insuranceClass':new FormControl(null,[Validators.required]),
    'underWritingYear':new FormControl(null,[Validators.required]),
    'from':new FormControl(null,[Validators.required]),
    'to':new FormControl(null,[Validators.required]),
    'retantion':new FormControl(null,[Validators.required]),
    'additionalRetantion':new FormControl(null),
    'treatyCommission':new FormControl(null,[Validators.required]),
    'profitCommission':new FormControl(null,[Validators.required]),
    'managmentExpenses':new FormControl(null,[Validators.required]),
    'premiumCap':new FormControl(null,[Validators.required]),
    'premiumReserve':new FormControl(null,[Validators.required]),
    'cashCall':new FormControl(null)
  })
  AppendForm:FormGroup=new FormGroup({
    'reInsuranceCompanyId':new FormControl(null,[Validators.required]),
    'reInsuranceBrokerId':new FormControl(null),
    'reInsuranceCompanyPct':new FormControl(null,[Validators.required]),
    'reInsuranceBrokerPct':new FormControl(null),
  })
 
  // Selected Broker
  getSelectedBroker(brokerShare:any){
    // console.log(this.AppendForm.get('reInsuranceBrokerId')?.value);
    
    if(this.AppendForm.get('reInsuranceBrokerId')?.value!=''){
      this.AppendForm.get('reInsuranceBrokerPct')?.setValidators([Validators.required])
      this.AppendForm.get('reInsuranceBrokerPct')?.updateValueAndValidity()
      brokerShare.disabled=false;
      
    }else{
      this.AppendForm.get('reInsuranceBrokerPct')?.setValidators(null)
      this.AppendForm.get('reInsuranceBrokerPct')?.updateValueAndValidity()
      this.AppendForm.get('reInsuranceBrokerPct')?.setValue(null)
      brokerShare.disabled=true
    }
  }
  //// View ////
  View(){
    var item = this.arrTest.find(item=>this.AppendForm.get('reInsuranceCompanyId')?.value == item.reInsuranceCompanyId)
    if(item==undefined){
      let additionalRetantion = this.Form.get("additionalRetantion")?.value==null?0:this.Form.get("additionalRetantion")?.value ;
      let retantion =this.Form.get("retantion")?.value==null?0:this.Form.get("retantion")?.value;
      if((additionalRetantion+retantion+this.AppendForm.get('reInsuranceCompanyPct')?.value)>100){
        this._ToastrService.show('Company Share Accedded its limit')
      }else{
        if((this.AppendForm.get('reInsuranceBrokerPct')?.value)>50){
          this._ToastrService.show('Broker Share Cant not acceed 50%')
        }else{
          let company = this.AllReInsurCompanies.find(item=>item.id==this.AppendForm.get("reInsuranceCompanyId")?.value);
          let broker = this.AllReInsurBrokers.find(item=>item.id==this.AppendForm.get("reInsuranceBrokerId")?.value);
          console.log(company);
          let Model=Object.assign(this.AppendForm.value,{company:company.name,broker:broker?.name==undefined?'':broker?.name})
          this.arrTest.push(Model);
          this.AppendForm.reset()
        }
        
      }
      
    }else{
      this._ToastrService.show('The Company is Already Exist')
    }
    console.log(this.arrTest);
    this.AppendForm.get('reInsuranceBrokerPct')?.setErrors(null)
  }
  //Remove 
  remove(index:number){
    this.arrTest.splice(index, 1)

  }
  //////////// Submit ReInsurance Treaty setup /////////////
  treatySetupName:any
  SubmitReInsurTreatySetup(){
    this.isClicked =true;
    let Model = Object.assign(this.Form.value,{share:this.arrTest})
    console.log(Model);
    this._ReInsuranceService.AddTreatySetUP(Model).subscribe((res:any)=>{
      this.isClicked =false;
      console.log(res);
      this.treatySetupName = res.treatySetupName
      Swal.fire('Good job!',' Added Successfully','success');
      $("#TreatySetup").show(300)
      $("#New").show(300)
      $("#Save").hide(300)
    },error=>{
      this.isClicked =false;
      console.log(error);
      Swal.fire({icon: 'error',title: 'Oops...', text: error.error,});
    })
    
  }
   // Company Status
  getCompanyStatus(value:any){
    if(value =='1'){
      $("#AuthCode").show(400)
    }else{
      $("#AuthCode").hide(400)
    }
  }
  // All Countries
  getCountries(){
    this._AdminService.getCountries().subscribe(data=>{
      this.AllContries =data
    })
  }
  //get Business Types
  getBusinessTypes(){
    this._AdminService.getBusinessTypes().subscribe(data=>{
      this.BusinessTypes=data;
      this.Form.get("businessType")?.setValue('0')
    })
  }
  // get Insurane Classes
  getInsuraneClass(){
    this._AdminService.getInsuraneClass().subscribe((data:any)=>{
      this.InsuranceClasses=data;
    })
  }
  GetAllReInsurCompanies(){
    this._ReInsuranceService.GetAllReInsurance(1).subscribe((data:any)=>{
      this.AllReInsurCompanies = data;
    })
  }
  GetAllReInsurBrokers(){
    this._ReInsuranceService.GetAllReInsurance(2).subscribe((data:any)=>{
      this.AllReInsurBrokers = data;
    })
  }
  new(){
    this.Form.reset();
    this.arrTest=[];
    $("#Save").show(300)
    $("#New").hide(300)
    $("#TreatySetup").hide(300)
  }
  ngOnInit(){
    this.GetAllReInsurCompanies()
    this.GetAllReInsurBrokers()
    this.getCountries()
    this.getBusinessTypes()
    this.getInsuraneClass()
  }
}
