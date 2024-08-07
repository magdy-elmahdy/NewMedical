import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import Swal from 'sweetalert2';
declare var $:any;
@Component({
  selector: 'app-commissions',
  templateUrl: './commissions.component.html',
  styleUrls: ['./commissions.component.scss']
})
export class CommissionsComponent {
  page:number=1;
  count:number=0;
  tableSize:number=5;
  tableSizes=[5,8,10,15,20];
  term:any
  permissions:any[]= JSON.parse(localStorage.getItem('permissions')!)

  AllCommissions:any[]=[];
  loading:boolean=false;
  BusinessTypeValue:any ='0'
  insuranceClassValue:any;
  commissionTypeValue:any;
  BusinessTypes:any
  paymentWayValue:any='0'
  CommisionTypes:any;
  paymentWays:any
  pctCommission:any;
  addCommissionErrorMsg:any;
  addEarlyErrrorMsg:any
  pct:number=0
  amount:number=0
  validCommistionSelects:boolean=false;
  CustomerDetails:any
  InsuranceClasses:any
  commissionId:any;
  customerId:any;
  comisionForm = new FormGroup({
    'per':new FormControl(''),
    'amount':new FormControl(''),
  })
  constructor(private _AdminService:AdminService ,private _ActivatedRoute:ActivatedRoute,private _ToastrService:ToastrService){ }

  getAllCommissions(){
    this.loading=true;
    this._AdminService.getAllCommissions().subscribe((data:any)=>{
      this.AllCommissions =data;
      this.loading=false;
      console.log(this.AllCommissions);
    })
  }
  getCommissionDetails(commissionId:any){
    this.commissionId=commissionId;
    
    this._AdminService.getCommissionDetailsById(commissionId).subscribe((data:any)=>{
      console.log(data);
      this.customerId= data.customer.id
      this.comisionForm.get('per')?.setValue(data.pct)
      this.comisionForm.get('amount')?.setValue(data.amount)
      this.insuranceClassValue=String(data.insuranceClass)
      this.BusinessTypeValue=String(data.businessType)
      this.commissionTypeValue=String(data.commissionType)
      this.paymentWayValue=String(data.paymentWay)
      this.pct=data.pct;
      this.amount=data.amount;
      if(data.commissionType==1){
        $("#wayOfPayment").hide(100)
      }else{
        $("#wayOfPayment").show(100)
      }
    })
    
  }
      // Submit Edit Commission to Customer
  submitCommissionToCustomerForm(){
    let Model =Object.assign(
      {pct:Number(this.pct/100)},
      {amount:Number(this.amount)},
      {businessType:Number(this.BusinessTypeValue)},
      {insuranceClass:Number(this.insuranceClassValue)},
      {commissionType:Number(this.commissionTypeValue)},
      {paymentWay:Number(this.paymentWayValue)},
      {id:Number(this.commissionId)},
      {customerId:this.customerId}
      )
      console.log(Model);
    this._AdminService.EditCommissionToCustomer(Model).subscribe(data=>{
      console.log(data);  
      document.getElementById("close")?.click()
      Swal.fire(
        'Good job!',
        'Commission Edited Successfully',
        'success'
      )
      this._ToastrService.success("Commission Edited  Successfully","Well Done" )
      this.getAllCommissions();
    },error=>{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.error,
      })

    })
    
  }

  check1(e:any){
    this.pct=e.target.value;
  }
  check2(e:any){
    this.amount=e.target.value
  }
        // Commistion selects Form Validations
  CommissionSelectValidation(){
    if(this.insuranceClassValue!=null && this.commissionTypeValue!=null){
      this.validCommistionSelects=true;
    }
  }
      //get Insurance Types
  getInsuraneClass(){
    this._AdminService.getInsuraneClass().subscribe(data=>{
      this.InsuranceClasses=data;
    })
  }
  getCommissionTypeValue(e:any){
    if(e.value==1){
      $("#wayOfPayment").hide(300)
      this.paymentWayValue= '1'
    }else if(e.value=1){
      $("#wayOfPayment").show(300)
    }
  }
      //get Commission Types
  getCommissionTypes(){
    this._AdminService.getCommissionTypes().subscribe(data=>{
      this.CommisionTypes=data;
    })
  }
    //getPayment Ways
    getPaymentWays(){
    this._AdminService.getPaymentWays().subscribe(data=>{
      this.paymentWays=data;
    })
  }
    //get Business Types
    getBusinessTypes(){
      this._AdminService.getBusinessTypes().subscribe(data=>{
        this.BusinessTypes=data;
      })
    }
            //Pagination Methods
  onTableDataChange(event:any){
    this.page=event;
    this.getAllCommissions();
  }
  onTableSizeChange(event:any){
    this.tableSize=event.target.value;
    this.page=1;
    this.getAllCommissions();
  }

  ngOnInit(): void {
    // let url='Customers/AddCustomer'
    this.getAllCommissions()
    this.getBusinessTypes();
    this.getInsuraneClass();
    this.getCommissionTypes();
    this.getPaymentWays();
  }
}
