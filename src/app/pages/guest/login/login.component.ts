import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  title = 'loginGoogle';
    
  auth2: any;
    
  @ViewChild('loginRef', {static: true }) loginElement!: ElementRef;
     
  userData:any = {};
  user:any={};
  errorLogin:String ="";
constructor(private service:AuthService ,private router: Router,private zone: NgZone) { }

ngOnInit(): void {
  console.log("INIT LOGIN PAGE")
  this.googleAuthSDK();
}

signIn (){
  console.log(this.user);
  this.service.signin(this.user).subscribe(data=>{
      if(data.token!= null){
        alert(<any>data.token);
        localStorage.setItem("token", data.token);
        this.router.navigate(['/']); //navigate to homepage if authenticated          
      }

    
  },
  err => {
      console.log(err.error)
      this.errorLogin = err.error;
  });
}
callLoginButton() {
  console.log("jrerer");
     
  this.auth2.attachClickHandler(this.loginElement.nativeElement, {},
    (googleAuthUser:any) => {
      let profile = googleAuthUser.getBasicProfile();
      console.log('Token || ' + googleAuthUser.getAuthResponse().id_token);
      console.log('ID: ' + profile.getId());
      console.log('Name: ' + profile.getName());
      console.log('Image URL: ' + profile.getImageUrl());
      console.log('Email: ' + profile.getEmail());

      this.userData = {
        userName: profile.getName(),
        userId: profile.getId(),
        profile: profile.getImageUrl(),
        token: googleAuthUser.getAuthResponse().id_token
      }
     
      localStorage.setItem("token", this.userData.token);
      localStorage.setItem("userData", JSON.stringify(this.userData));
      this.zone.run(() => {
        this.router.navigate(['/']);
      });
   
     /* Write Your Code Here */
  
    }, (error:any) => {
      alert(JSON.stringify(error, undefined, 2));
    });
}

googleAuthSDK() {
     
  (<any>window)['googleSDKLoaded'] = () => {
    (<any>window)['gapi'].load('auth2', () => {
      this.auth2 = (<any>window)['gapi'].auth2.init({
        client_id: '448042703114-meekq901piase07aumqv1gp3novjtkeh.apps.googleusercontent.com',
        plugin_name:'SEPS',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });
      this.callLoginButton();
    });
  }
   
  (function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement('script'); 
    js.id = id;
    js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
    
    fjs?.parentNode?.insertBefore(js, fjs);
  }(document, 'script', 'google-jssdk'));
 
}

}
