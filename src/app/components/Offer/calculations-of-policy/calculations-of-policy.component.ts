import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PolicyService } from 'src/app/services/policy.service';
import { PricingToolService } from 'src/app/services/pricing-tool.service';

@Component({
  selector: 'app-calculations-of-policy',
  templateUrl: './calculations-of-policy.component.html',
  styleUrls: ['./calculations-of-policy.component.scss']
})
export class CalculationsOfPolicyComponent implements OnInit{

  OfferId:any
  PolicyCaluculations:any
  loading:boolean = false;
  TaxValue:any
  PolicyGroup:any
  OfferDetails:any
  PolicyDetails: any;
  Type: any;
  constructor(private _PolicyService:PolicyService,private _ActivatedRoute:ActivatedRoute, private _Router:Router,
    private _PricingToolService:PricingToolService
  ){
    this.OfferId = this._ActivatedRoute.snapshot.paramMap.get('id');
    this.Type = this._ActivatedRoute.snapshot.paramMap.get('type')
  }
  Form:FormGroup=new FormGroup({
    'supervisionAndOversight':new FormControl('',[Validators.required]),
    'issuanceCosts':new FormControl('',[Validators.required]),
    'propotinalFees':new FormControl('',[Validators.required]),
    'dimensionalFees':new FormControl('',[Validators.required]),
    'companyProfit':new FormControl('',[Validators.required])
  })


  Model:any
  getPolicyCalculations(){
    this.loading = true
    this.Model =this.Form.value
    // console.log(Model);
    if(this.Form.get('supervisionAndOversight')?.value==''&& this.Form.get('issuanceCosts')?.value==''&& this.Form.get('propotinalFees')?.value==''){
      this.Model={
      supervisionAndOversight:'',
      issuanceCosts:'',
      propotinalFees:'',
      dimensionalFees:'',
      companyProfit:''
      }
    }else{
      this.Model = this.Form.value
    }
    
    this._PolicyService.getOfferCalculations(this.OfferId).subscribe(data=>{
      console.log(data);
      this.PolicyCaluculations = data
      this.Form.get('supervisionAndOversight')?.setValue(this.PolicyCaluculations?.supervisionAndOversight)
      this.Form.get('issuanceCosts')?.setValue(this.PolicyCaluculations?.issuanceCosts)
      this.Form.get('propotinalFees')?.setValue(this.PolicyCaluculations?.propotinalFees)
      this.Form.get('dimensionalFees')?.setValue(this.PolicyCaluculations?.dimensionalFees)
      this.Form.get('companyProfit')?.setValue(this.PolicyCaluculations?.companyProfit)
      this.loading = false
    },error=>{
      console.log(error);
      this.loading = true
    })
  }
  redirectTo(uri: string) {
    this._Router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    this._Router.navigate([uri]));
 }
  // re Calculate Policy
  SubmitGetCalculations(){
    console.log(this.Form.value);
    this.getPolicyCalculations()
  }
  reCalculate(){  ////////////////////////////////////////////
    this.loading = true
    console.log(this.TaxValue);
    this._PolicyService.getOfferCalculationsWithTax(this.OfferId, this.TaxValue/100).subscribe(data=>{
      this.loading = false
      this.PolicyCaluculations = data;
    },error=>{
      console.log(error);
      this.loading = true
    })
  }
  getOfferById(){
    this._PolicyService.getOfferById(this.OfferId).subscribe((data:any)=>{
      this.OfferDetails = data.customerGroups;
      console.log(this.OfferDetails);
      
    })
  }

  PricingTax:any=0.02
  // Offer Pricing Calcualtions
  getOfferPricingCalculations(){
    this.loading = true 
    this.Model =this.Form.value
    
    this._PricingToolService.GetOfferCalculationById(this.OfferId,this.PricingTax).subscribe(data=>{
      console.log(data);
      this.PolicyCaluculations = data
      this.loading = false
    },error=>{
      console.log(error);
      this.loading = true
    })
  }

  ngOnInit(): void {
    
    if(this.Type=='1'){
      // Pricing
      this.getOfferPricingCalculations()
    }
    else if(this.Type=='2'){
      // Not Pricing
      this.getPolicyCalculations();
      this.getOfferById();
    }
  }
}
  

