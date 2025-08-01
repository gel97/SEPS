import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import {
  SocialAuthService,
  FacebookLoginProvider,
  SocialUser,
} from 'angularx-social-login';
import { request } from 'http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  title = 'loginGoogle';
  isLogin = false;
  auth2: any;

  @ViewChild('loginRef', { static: true }) loginElement!: ElementRef;
  userFb: any = {};
  userData: any = {};
  user: any = {};
  errorLogin: String = '';
  constructor(
    private service: AuthService,
    private router: Router,
    private zone: NgZone,
    private socialAuthService: SocialAuthService
  ) {}

  ngOnInit(): void {
    // console.log("INIT LOGIN PAGE")
    this.router.navigate(['/']);
    this.checkIfLoggedIn();
    this.initializeGoogleSDK();

    this.googleAuthSDK();
    this.socialAuthService.authState.subscribe((user) => {
      this.userFb = user;
      console.log(this.userFb);
      this.userData = {
        userName: this.userFb.name,
        userId: this.userFb.id,
        profile: this.userFb.photoUrl,
        token: this.userFb.authToken,
      };
      localStorage.setItem('userData', JSON.stringify(this.userData));
      this.user.email = this.userFb.email;
      this.user.fullName = this.userFb.name;
      this.service.signinFb(this.user).subscribe(
        (data) => {
          this.router.navigate(['/']);
        },
        (err) => {
          console.log(err.error);
          this.errorLogin = err.error;
        }
      );
    });
  }
  checkIfLoggedIn() {
    if (this.service.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }
  initializeGoogleSDK() {
    (<any>window)['googleSDKLoaded'] = () => {
      (<any>window)['gapi'].load('auth2', () => {
        this.auth2 = (<any>window)['gapi'].auth2.init({
          client_id: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
          // other options
        });
      });
    };
  }

  loginWithFacebook(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signIn() {
    if (!this.user.username || !this.user.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Credentials',
        text: 'Please enter both username and password.',
      });
      return;
    }

    this.isLogin = true;
    console.log('🔐 Attempting login with:', this.user);

    this.service.signin(this.user).subscribe({
      next: (response) => {
        console.log('✅ Login Response:', response);

        if (response.token != null) {
          // Save the token
          localStorage.setItem('token', response.token);
          console.log('📥 Token saved to localStorage');

          // Guest detection (adjust based on actual response structure)
          if (response.role?.toLowerCase() === 'guest') {
            localStorage.setItem('guest', 'true');
            console.log('👤 Guest mode enabled from backend role');
          } else {
            localStorage.setItem('guest', 'false');
            console.log('👤 Logged in as Regular User');
          }

          this.router.navigate(['/']);
        } else {
          console.warn('⚠️ Login succeeded but no token returned.');
          this.isLogin = false;
        }
      },
      error: (error) => {
        this.isLogin = false;
        this.errorLogin = error.error;

        console.error('❌ Login Error:', error);

        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Incorrect password or email. Please try again!',
          confirmButtonText: 'OK',
        });
      },
    });
  }

  callLoginButton() {
    this.auth2.attachClickHandler(
      this.loginElement.nativeElement,
      {},
      (googleAuthUser: any) => {
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
          token: googleAuthUser.getAuthResponse().id_token,
        };

        localStorage.setItem('guest', JSON.stringify(true));
        localStorage.setItem('munCityId', JSON.stringify(null));

        localStorage.setItem('token', this.userData.token);
        localStorage.setItem('hash', this.userData.hash);
        console.log(this.userData.hash);
        localStorage.setItem('userData', JSON.stringify(this.userData));

        this.user.email = profile.getEmail();
        this.user.fullName = profile.getName();
        this.service.signinGoogle(this.user).subscribe(
          (data) => {
            this.router.navigate(['/']);
            window.location.reload();
          },
          (err) => {
            console.log(err.error);
            this.errorLogin = err.error;
          }
        );

        this.zone.run(() => {
          this.router.navigate(['/']);
        });

        /* Write Your Code Here */
      },
      (error: any) => {
        alert(JSON.stringify(error, undefined, 2));
      }
    );
  }

  googleAuthSDK() {
    (<any>window)['googleSDKLoaded'] = () => {
      (<any>window)['gapi'].load('auth2', () => {
        this.auth2 = (<any>window)['gapi'].auth2.init({
          client_id:
            '448042703114-meekq901piase07aumqv1gp3novjtkeh.apps.googleusercontent.com',
          plugin_name: 'SEPS',
          cookiepolicy: 'single_host_origin',
          scope: 'profile email',
        });
        this.callLoginButton();
      });
    };

    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement('script');
      js.id = id;
      js.src = 'https://apis.google.com/js/platform.js?onload=googleSDKLoaded';

      fjs?.parentNode?.insertBefore(js, fjs);
    })(document, 'script', 'google-jssdk');
  }
}
