import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PricingToolService } from 'src/app/services/pricing-tool.service';
import Swal from 'sweetalert2';
declare var $:any; 
@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})
export class NetworkComponent implements OnInit {
  page:number=1;
  count:number=0;
  tableSize:number=5;
  tableSizes=[5,8,10,15,20];
  term:any;

  loading:boolean=false;
  isClicked:boolean =false;
  AllNetworkArr:any[]=[]
  arrnetwork:any[]=[]
  checkDelet:any[]=[]
  constructor(private _PricingToolService:PricingToolService){}
  Form:FormGroup =new FormGroup({
    'name':new FormControl('',[Validators.required]),
});
EditForm:FormGroup =new FormGroup({
  'id':new FormControl(''),
  'name':new FormControl('',[Validators.required]),
});
WhenModalOpen(){
  this.Form.reset();
  this.arrnetwork=[]
}
// Add Accounts Numbers
view(){
  let Model = Object.assign(this.Form.value)
  console.log(Model);
  
  
    this.arrnetwork.push(Model);
    console.log(this.arrnetwork);
    this.Form.reset()

}
// Add Network
AddNetwork(){
  this.isClicked =true
  this._PricingToolService.AddNetwork(this.arrnetwork).subscribe((res:any)=>{
    this.isClicked = false;
    console.log(res);
    $("#Add").modal('toggle')
    this.getAllNetwork()
    Swal.fire({title:'Network/Networks Added Successfully',timer:3000, timerProgressBar: true})
    this.arrnetwork =[];
  },error=>{
    this.isClicked = false;
    console.log(error);
    Swal.fire({icon: 'error',title: 'Oops...',text: error.error,})
    this.arrnetwork =[];
  })
}
remove(index:number){
  this.arrnetwork.splice(index, 1)
}


  //Delet Benfit Category
  networkId:any
  deleteNetwork(id:any){
   
    this.networkId = id;
    console.log(this.networkId);
    

    // Show SweetAlert2 confirmation dialog
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this item?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // If user confirmed, proceed with the delete API call
        this._PricingToolService.DeleteNetwork(this.networkId).subscribe(
          (data) => {
            // Show success message
            Swal.fire(
              'Deleted!',
              'Network Deleted Successfully',
              'success'
            );
            // Refresh categories list or perform other actions
            this.getAllNetwork();
          },
          (error) => {
            console.log(error);
            
            // Show error message if delete operation fails
            Swal.fire({icon: 'error',title: 'Oops...',text: error.error,})

            // Swal.fire(
            //   'Error!',
            //   'There was an error deleting the Network. Please try again.',
            //   'error'
            // );
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // If user canceled, show cancellation message
        Swal.fire(
          'Cancelled',
          'Your item is safe :)',
          'error'
        );
      }
    });
  }

  // Edite Network
  CurrentNetwork:any
  openEditModal(network:any){
    console.log(network);
    this.CurrentNetwork=network
    this.EditForm.setValue({id: network.id,name:network.name,})
  }
  saveCategoryEdit(){
    this.isClicked = true
    if (this.CurrentNetwork) {
      let Model = Object.assign(this.EditForm.value);
      console.log(Model);    
      this._PricingToolService.EditNetwork(Model).subscribe((res) => {
        this.isClicked = false
        console.log(res);
        $('#EditForm').modal('toggle'); 
        this.getAllNetwork();
        Swal.fire({ title: "Good job!", text: "Network Updated Successfully", icon: "success" })
      }, error => {
        console.log(error);
        this.isClicked = false
        Swal.fire({ icon: "error", title: "Oops...", text: error.error });
      });
    }
  }

  //Pagination Methods
  onTableDataChange(event:any){
  this.page=event;
  this.getAllNetwork();
}
onTableSizeChange(event:any){
  this.tableSize=event.target.value;
  this.page=1;
  this.getAllNetwork();
}
  aaa:any[]=[]
  getAllNetwork(){
    this._PricingToolService.GetAllNetwork().subscribe((data:any)=>{
      console.log(data);
      this.AllNetworkArr = data
      this.checkDelet = data.plans
      console.log(this.checkDelet);
    })
  }
  loadData() {
    this.loading = true;
  
    setTimeout(() => {
      this.loading = false;
    }, 2000); 
  }
  ngOnInit(): void {
    this.loadData()
    this.getAllNetwork()
  }
}
