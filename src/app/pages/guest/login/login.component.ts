import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import {
  SocialAuthService,
  FacebookLoginProvider,
  SocialUser,
} from 'angularx-social-login';
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
  userFb: SocialUser | null = null;
  userData: any = {};
  user: any = {};
  errorLogin: string = '';

  constructor(
    private service: AuthService,
    private router: Router,
    private zone: NgZone,
    private socialAuthService: SocialAuthService
  ) {}

  ngOnInit(): void {
    this.checkIfLoggedIn();
    this.initializeGoogleSDK();
    this.googleAuthSDK();

    this.socialAuthService.authState.subscribe((user) => {
      this.userFb = user;
      if (!user) return;

      this.userData = {
        userName: user.name,
        userId: user.id,
        profile: user.photoUrl,
        token: user.authToken,
      };

      localStorage.setItem('userData', JSON.stringify(this.userData));
      this.user.email = user.email;
      this.user.fullName = user.name;

      this.service.signinFb(this.user).subscribe(
        () => this.router.navigate(['/']),
        (err) => (this.errorLogin = err.error)
      );
    });
  }

  checkIfLoggedIn() {
    if (this.service.isLoggedIn()) {
      this.router.navigate(['/']);
    }
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
  this.service.signin(this.user).subscribe({
    next: (response) => {
      if (response.token) {
        localStorage.setItem('token', response.token);

        if (response.role?.toLowerCase() === 'guest') {
          localStorage.setItem('guest', 'true');
        } else {
          localStorage.setItem('guest', 'false');
        }

        this.router.navigate(['/']);
      } else {
        this.isLogin = false;
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Login succeeded but no token returned.',
        });
      }
    },
    error: (error) => {
  const message =
    typeof error.error === 'string'
      ? error.error
      : error.error?.message || '';

  // 🔴 DEACTIVATED ACCOUNT
  if (message.toLowerCase().includes('deactivated')) {
    Swal.fire({
      icon: 'error',
      title: 'Account Deactivated',
      text: message,
      confirmButtonText: 'OK',
    }).then(() => {
      this.isLogin = false;
    });
    return;
  }

  // 🟡 PENDING APPROVAL
  if (message.toLowerCase().includes('not been assigned')) {
    Swal.fire({
      icon: 'warning',
      title: 'Pending Approval',
      text: message,
      confirmButtonText: 'OK',
    }).then(() => {
      this.isLogin = false;
    });
    return;
  }

  // 🔴 DEFAULT
  Swal.fire({
    icon: 'error',
    title: 'Login Failed',
    text: 'Incorrect username or password.',
    confirmButtonText: 'OK',
  }).then(() => {
    this.isLogin = false;
  });
}
,
  });
}


  // ✅ Facebook login
  loginWithFacebook(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  // ✅ Google login setup
  callLoginButton() {
    this.auth2.attachClickHandler(
      this.loginElement.nativeElement,
      {},
      (googleAuthUser: any) => {
        let profile = googleAuthUser.getBasicProfile();
        this.userData = {
          userName: profile.getName(),
          userId: profile.getId(),
          profile: profile.getImageUrl(),
          token: googleAuthUser.getAuthResponse().id_token,
        };

        localStorage.setItem('guest', JSON.stringify(true));
        localStorage.setItem('munCityId', JSON.stringify(null));
        localStorage.setItem('token', this.userData.token);
        localStorage.setItem('userData', JSON.stringify(this.userData));

        this.user.email = profile.getEmail();
        this.user.fullName = profile.getName();

        this.service.signinGoogle(this.user).subscribe(
          () => this.zone.run(() => this.router.navigate(['/'])),
          (err) => (this.errorLogin = err.error)
        );
      },
      (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Google Login Failed',
          text: JSON.stringify(error),
        });
      }
    );
  }

  initializeGoogleSDK() {
    (<any>window)['googleSDKLoaded'] = () => {
      (<any>window)['gapi'].load('auth2', () => {
        this.auth2 = (<any>window)['gapi'].auth2.init({
          client_id: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
        });
      });
    };
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
      let js: any,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement('script');
      js.id = id;
      js.src = 'https://apis.google.com/js/platform.js?onload=googleSDKLoaded';
      fjs?.parentNode?.insertBefore(js, fjs);
    })(document, 'script', 'google-jssdk');
  }
}
