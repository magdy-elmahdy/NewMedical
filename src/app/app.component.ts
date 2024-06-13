import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as AOS from 'aos';

declare var $:any
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  

})
   

export class AppComponent implements OnInit{
  title = 'Medical';
  opened=false;
  allTreaties:any;
  loader:boolean=true;
  constructor(){
    AOS.init();
  }
  handleSideBar(){
    document.getElementById("menu")?.classList.toggle("is-active");
    this.opened=!this.opened
  }

  ngOnInit(): void {
    const navLinkEls = document.querySelectorAll('.mainSideItem');
    AOS.init();

  }

}
