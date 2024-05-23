import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PolicyService } from 'src/app/services/policy.service';
declare var $:any

@Component({
  selector: 'app-all-endorsment',
  templateUrl: './all-endorsment.component.html',
  styleUrls: ['./all-endorsment.component.scss'],
  providers: [DatePipe]
})
export class AllEndorsmentComponent implements OnInit{
  page:number=1;
  count:number=0;
  tableSize:number=20;
  tableSizes=[5,8,10,15,20];
  term:any;
  AllData:any;
  loading:boolean = false;
  constructor(private _PolicyService:PolicyService ,private _DatePipe:DatePipe){}
  SearchForm:FormGroup = new FormGroup({
    'PolicyCode':new FormControl(''),
    'EndorsementCode':new FormControl(''),
    'EndorsementType':new FormControl(''),
    'From':new FormControl(''),
    'To':new FormControl('')
  })


  Search(){
    this.loading = true;
    $("#SearchResults").show(300);
    console.log(this.SearchForm.get('From')?.value);
    
    let Model ={
      From:this.SearchForm.get('From')?.value==''?'':this._DatePipe.transform(this.SearchForm.get('From')?.value,"yyyy-MM-dd"),
      To:this.SearchForm.get('To')?.value==''?'':this._DatePipe.transform(this.SearchForm.get('To')?.value,"yyyy-MM-dd"),
      PolicyCode:this.SearchForm.get("PolicyCode")?.value,
      EndorsementCode:this.SearchForm.get("EndorsementCode")?.value,
      EndorsementType:this.SearchForm.get("EndorsementType")?.value
    }
    console.log(Model);
    
    this._PolicyService.getAllEndorsements(Model).subscribe(data=>{
      this.loading = false;
      this.AllData = data;
      console.log(data);
    },error=>{
      console.log(error);
      this.loading = false;
    })
  }
          //Pagination Methods
  onTableDataChange(event:any){
    this.page=event;
    this.Search();
  }
  onTableSizeChange(event:any){
    this.tableSize=event.target.value;
    this.page=1;
    this.Search();
  }

  ngOnInit(): void {
  }
}
