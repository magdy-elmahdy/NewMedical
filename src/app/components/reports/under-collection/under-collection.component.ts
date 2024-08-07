import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReportsService } from 'src/app/services/reports.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-under-collection',
  templateUrl: './under-collection.component.html',
  styleUrls: ['./under-collection.component.scss'],
  providers:[DatePipe]
})
export class UnderCollectionComponent implements OnInit{
  loading:boolean =false;
  AllData:any
  constructor(private _DatePipe:DatePipe,private _ReportsService:ReportsService){}
  Form:FormGroup = new FormGroup({
    start:new FormControl('',[Validators.required]),
    end:new FormControl('',[Validators.required])
  })
  FileName:any
  SubmitForm(){
    this.loading = true
    let Model={
      start:this._DatePipe.transform(this.Form.get('start')?.value,'YYYY/MM/dd'),
      end:this._DatePipe.transform(this.Form.get('end')?.value,'YYYY/MM/dd')
    }
    console.log(Model);
    this._ReportsService.UnderCollection(Model).subscribe((data:any)=>{
      this.loading = false;
      // console.log(data);
      // this.AllData= data;

      let blob:Blob = data.body as Blob
      this.FileName= 'UnderCollectionReport.xlsx'
      let a= document.createElement('a');
      a.download=this.FileName
      a.href=window.URL.createObjectURL(blob)
      a.click()
      
    },error=>{
      this.loading = false;
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.error,
      });
    })
    
  }
  ngOnInit(){
  }
}
