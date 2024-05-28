import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReportsService } from 'src/app/services/reports.service';
declare var $:any

@Component({
  selector: 'app-customers-report',
  templateUrl: './customers-report.component.html',
  styleUrls: ['./customers-report.component.scss'],
  providers : [DatePipe]
})
export class CustomersReportComponent {
  constructor(private _ReportsService:ReportsService, private _DatePipe:DatePipe){}
 
  isClicked:boolean =false
  AllData:any
  SearchForm:FormGroup = new FormGroup({
    'start':new FormControl('',[Validators.required]),
    'end':new FormControl('',[Validators.required])
  })
  FileName:any

  Search(){
    this.isClicked = true;
    $("#SearchResults").show(300);
    let Model ={
      start:this._DatePipe.transform(this.SearchForm.get('start')?.value,"yyyy-MM-dd"),
      end:this._DatePipe.transform(this.SearchForm.get('end')?.value,"yyyy-MM-dd"),
    }
    console.log(Model);
    this._ReportsService.DisplayCustomersReport(Model).subscribe(data=>{
      this.isClicked = false;
      this.AllData = data;
      console.log(data);
    },error=>{
      console.log(error);
      this.isClicked = false;
    })
  }
  // Export File 
  exportFile(){
    let Model ={
      start:this._DatePipe.transform(this.SearchForm.get('start')?.value,"yyyy-MM-dd"),
      end:this._DatePipe.transform(this.SearchForm.get('end')?.value,"yyyy-MM-dd"),
    }
    console.log(Model);
    this._ReportsService.downloadCustomersReport(Model).subscribe(res=>{
      this.isClicked = false;
      console.log(res);
      let blob:Blob = res.body as Blob
      this.FileName= 'CustomersReport.xlsx'
      let a= document.createElement('a');
      a.download=this.FileName
      a.href=window.URL.createObjectURL(blob)
      a.click()
    },error=>{
      this.isClicked = false;
      console.log(error);
    })
  }
}