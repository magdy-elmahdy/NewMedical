import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReportsService } from 'src/app/services/reports.service';
import Swal from 'sweetalert2';
declare var $:any

@Component({
  selector: 'app-paied-collector-premium',
  templateUrl: './paied-collector-premium.component.html',
  styleUrls: ['./paied-collector-premium.component.scss'],
  providers: [DatePipe]
})
export class PaiedCollectorPremiumComponent {
  constructor(private _ReportsService:ReportsService, private _DatePipe:DatePipe){}
  isClicked:boolean =false
  MedicalPublicationsStatistics:any
  SearchForm:FormGroup = new FormGroup({
    'from':new FormControl(''),
    'to':new FormControl(''),
    'policyCode':new FormControl(''),
    'ClientName':new FormControl('')
  })
  FileName:any;

  Search(){
    this.isClicked = true;
    $("#SearchResults").show(300);
    let Model ={
      
      PolicyCode:this.SearchForm.get("policyCode")?.value,
      ClientName:this.SearchForm.get("ClientName")?.value,
      From:this.SearchForm.get('from')?.value==''||this.SearchForm.get('from')?.value==null?'':this._DatePipe.transform(this.SearchForm.get('from')?.value,"yyyy-MM-dd"),
      To:this.SearchForm.get('to')?.value==''||this.SearchForm.get('to')?.value==null?'':this._DatePipe.transform(this.SearchForm.get('to')?.value,"yyyy-MM-dd")
    }
    console.log(Model);
    
    this._ReportsService.PaiedAndCollectorPremium(Model).subscribe(res=>{
      this.isClicked = false;
      console.log(res);
      let blob:Blob = res.body as Blob;
      this.FileName= "تقرير المسدد-المحصل.xlsx";
      // this.FileName= ' من'+Model.From +' إلي'+Model.To+ " تقرير الخزينه.xlsx"

      let a= document.createElement('a');
      a.download=this.FileName;
      a.href=window.URL.createObjectURL(blob);
      a.click();

    },error=>{
      let e = error as JSON;
      this.isClicked = false;
      console.log(e);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'There are no data',
      });
    })
  }
}
