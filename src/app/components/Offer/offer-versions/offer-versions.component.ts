import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PolicyService } from 'src/app/services/policy.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-offer-versions',
  templateUrl: './offer-versions.component.html',
  styleUrls: ['./offer-versions.component.scss']
})
export class OfferVersionsComponent implements OnInit{
  page:number=1;
  count:number=0;
  tableSize:number=20;
  tableSizes=[20,8,10,15,5];

  loading:boolean= false
  OfferVersions:any;
  versionPlans:any[]=[];
  versionGroup:any[]=[];
  versionDetailsLoading:boolean = false
  offerId:any
  
  constructor(private _PolicyService:PolicyService,private _ActivatedRoute:ActivatedRoute){
      this.offerId = this._ActivatedRoute.snapshot.paramMap.get('id');
  }



    // Offer Versions
  getOfferVersions(){
    this.loading = true
    this._PolicyService.getOfferVersions(this.offerId).subscribe(data=>{
      console.log(data);
      
      this.loading = false
      this.OfferVersions = data;
      console.log(this.versionPlans);
    },error=>{
      this.loading = false;
    })
  }



  // Version Details
  getVersionDetails(VersionNo:any){
    this.versionDetailsLoading = true

    this._PolicyService.getVersionDetails(this.offerId,VersionNo).subscribe((data:any)=>{
      this.versionDetailsLoading = false
      // plans
      this.versionPlans = data.plans
      // Group
      this.versionGroup = data.customerGroups
      console.log(this.versionGroup);
    },error=>{
      this.versionDetailsLoading = false
      console.log(error);
      Swal.fire({
        icon: 'error',
        title:error.error,
      })
    })
  }




//Pagination Methods
  onTableDataChange(event:any){
    this.page=event;
    this.getOfferVersions();
  }
  onTableSizeChange(event:any){
    this.tableSize=event.target.value;
    this.page=1;
    this.getOfferVersions();
  }
  ngOnInit(): void {
    this.getOfferVersions();
  }

}
