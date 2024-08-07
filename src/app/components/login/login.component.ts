import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserModel } from 'src/app/Models/user.model';
import { CookieService } from 'ngx-cookie-service';

declare var $:any
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  
  res:any;
  errorEsist:boolean =false;
  isClicked:boolean =false;
  
  constructor(private _CookieService:CookieService,private _AuthService:AuthService, private _ToastrService:ToastrService, private _Router:Router){
  }

  // _JwtHelperService =new JwtHelperService()
  // t:any = localStorage.getItem("TOKEN");
    loginForm:FormGroup =new FormGroup({
      'userName':new FormControl('',[Validators.required,Validators.minLength(5),Validators.maxLength(22)]),
      'password':new FormControl('',[Validators.required,Validators.minLength(3),Validators.maxLength(22)])
    });

    redirectTo(uri: string) {
      this._Router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this._Router.navigate([uri]));
   }
    async submitLoginForm(){
      this.isClicked=true;
      let Model = this.loginForm.value;
      this._AuthService.logInForm(Model).subscribe(async (res:any)=>{
       await localStorage.setItem("userType",window.atob(res.token?.split('.')[1]))  ///
       await localStorage.setItem('MedicalToken',res.token)///////////////// Token
       await localStorage.setItem('permissions',JSON.stringify(res.permissions))
      //  Coocie 
      this._CookieService.set('MedicalToken',res.token)

        // this._ToastrService.success(res.massage, "Well Done");


        await this._Router.navigate(['/WelcomePage'])
        
        await  window.location.reload()
        // await  Swal.fire('Good job!',res.massage,'success')
        this.isClicked=false;
      },error=>{
        this.errorEsist =true;
        this._ToastrService.error('Invalid User Name Or Password', "Error Occurred");
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Invalid User Name Or Password',
        })
        this.isClicked=false;
        console.log(error);
        
      })
    }
    
login:AnimationOptions={
  path:'assets/imgs/login.json'
}

ngOnInit(): void {
}
}
