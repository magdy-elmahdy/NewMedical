import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit{
  customersTypes:any
  constructor(private _AdminService:AdminService, public _AuthService:AuthService, public _Router:Router){
    console.log(this.roles); 
}
  roles:any= JSON.parse(localStorage.getItem("userType")!)?.roles
  items:any='[button.w-100.px-2.mainSideItem, button.mainSideItem.w-100.collapsed.px-2, button.w-100.collapsed.px-2.mainSideItem, button.w-100.collapsed.px-2.mainSideItem, button.w-100.collapsed.px-2.mainSideItem]'

  // getCustomerTypes(){
  //   this._AdminService.getCustomerTypes().subscribe(data=>{
  //     this.customersTypes=data;
  //   })
  // }

  redirectTo(uri: string) {
    this._Router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    this._Router.navigate([uri]));
 }
 Customers(id:any){
  if(id == null){
    this.redirectTo("AllCustomers/")
  }
  this.redirectTo("AllCustomers/"+id)
 }
  async getActivee(TargetItem:any){

    console.log(TargetItem);
    TargetItem as HTMLElement
    document.querySelector('.activee')?.classList.remove('activee')
    TargetItem.classList.add("activee");
    
  
  
 }
  ngOnInit(): void {
    const navLinkEls = document.querySelectorAll('.mainSideItem');
    console.log(navLinkEls);
    // this.getCustomerTypes();
  }
}
