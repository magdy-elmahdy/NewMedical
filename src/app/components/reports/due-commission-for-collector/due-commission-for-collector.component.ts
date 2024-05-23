import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { ReportsService } from 'src/app/services/reports.service';
import Swal from 'sweetalert2';
declare var $:any

@Component({
  selector: 'app-due-commission-for-collector',
  templateUrl: './due-commission-for-collector.component.html',
  styleUrls: ['./due-commission-for-collector.component.scss'],
  providers : [DatePipe]
})
export class DueCommissionForCollectorComponent {
  constructor(private _ReportsService:ReportsService, private _DatePipe:DatePipe,private _AdminService:AdminService){}
  isClicked:boolean =false
  MedicalPublicationsStatistics:any
  SearchForm:FormGroup = new FormGroup({
    'To':new FormControl(''),
    'PolicyCode':new FormControl(''),
    'ClientName':new FormControl(''),
    'BrokerId':new FormControl(''),
  })
  FileName:any
  brokerCustomers:any

  Search(){
    this.isClicked = true;
    $("#SearchResults").show(300);
    
    let Model =Object.assign(this.SearchForm.value,
      { From:'',
        To:this.SearchForm.get('To')?.value==''||this.SearchForm.get('To')?.value==null?'':this._DatePipe.transform(this.SearchForm.get('To')?.value,"yyyy-MM-dd")
      }
    )
    console.log(Model);
    
    this._ReportsService.DueCommissionForUnderCollector(Model).subscribe(res=>{
      this.isClicked = false;
      console.log(res);
      let blob:Blob = res.body as Blob
      this.FileName= " عمولات مستحقة لاقساط تحت التحصيل.xlsx"

      let a= document.createElement('a');
      a.download=this.FileName;
      a.href=window.URL.createObjectURL(blob);
      a.click();

    },error=>{
      console.log(error);
      
      this.isClicked = false;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'There are no data',
      });
      
    })
  }
    //get Broker Customers
    getBrokerCustomers(){
      this._AdminService.getAllCustomers(3).subscribe(data=>{
        this.brokerCustomers= data;
      })
    }


    ngOnInit(): void {

      this.getBrokerCustomers();
    }
}
