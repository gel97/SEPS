import { Component, OnInit } from '@angular/core';
import { response } from 'express';
import { UserService } from 'src/app/shared/Tools/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import {
  SocialAuthService,
  FacebookLoginProvider,
  SocialUser,
} from 'angularx-social-login';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css'],
})
export class UpdateUserComponent implements OnInit {
  // listData: any = [];
  editmodal: any = {};
  email: string = '';
  token: string = '';

  listData: any[] = [
    { id: 1, username: 'user1', password: 'pass1', showPassword: false },
    { id: 2, username: 'user2', password: 'pass2', showPassword: false },
    // other users
  ];
  UserId: any;

  constructor(
    private service: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private socialAuthService: SocialAuthService
  ) {}

  ngOnInit(): void {
    this.GetUser();
    this.route.queryParams.subscribe((params) => {
      const email = params['email'];
      const token = params['token'];
      // Use email and token for verification
    });
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.autoLoginAndRedirect(token);
    }
  }
  autoLoginAndRedirect(token: string) {
    const requestData = { token }; // Include the token in the request data
    this.service.verifyToken(requestData).subscribe(
      (response: any) => {
        // Logic to automatically log in the user and redirect to the reset form page
        this.authService.setSession(response); // Assuming setSession logs the user in
        this.router.navigate(['/reset-form/reset_form']);
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Token',
          text: 'The reset token is invalid or has expired.',
          confirmButtonText: 'OK',
        }).then(() => {
          this.router.navigate(['/login']);
        });
      }
    );
  }
  GetUser() {
    this.service.GetUser().subscribe({
      next: (data) => {
        // Store the data without logging it to the console
        this.listData = data;
      },
      error: (error) => {
        // Display a generic error message to the user
        Swal.fire('Error!', 'Failed to load user data', 'error');

        // Optionally log the error without exposing sensitive data
        console.error('Failed to load user data:', error.message);
      },
    });
  }

  // GetUser() {
  //   this.service.GetUser().subscribe({
  //     next: (data) => {
  //       this.listData = data;
  //     },
  //     error: (error) => {
  //       Swal.fire('Error!', 'Failed to load user data', 'error');
  //     },
  //   });
  // }
  editUser(editUser: any = {}) {
    this.editmodal = editUser;
    this.GetUser();
  }
  UpdateUser() {
    // Validate if currentPassword and newPassword are provided
    if (!this.editmodal.currentPassword || !this.editmodal.newPassword) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
      return;
    }

    // Show confirmation dialog before updating the password
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to change your password?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, change it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        // Close the modal immediately
        document.getElementById('closeModalButton')?.click();

        // Call the service to update the user
        this.service.UpdateUser(this.editmodal).subscribe({
          next: (_data) => {
            // Refresh the user list
            this.GetUser();

            // Reset the edit modal data
            this.editmodal = {};

            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Your password has been updated',
              showConfirmButton: false,
              timer: 1000,
            });
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Current password is incorrect',
            });
          },
        });
      }
    });
  }
  togglePasswordVisibility(item: any): void {
    item.showPassword = !item.showPassword;
  }
  sendResetLink() {
    if (this.email) {
      const baseUrl = window.location.origin;
      const resetPath = baseUrl.includes('localhost')
        ? '/reset-form/reset_form'
        : '/SEPS/reset-form/reset_form';

      const requestData = {
        EmailAddress: this.email,
        ResetUrl: `${baseUrl}${resetPath}`,
      };
      // const requestData = {
      //   EmailAddress: this.email,
      //   ResetUrl: `${window.location.origin}/reset-form/reset_form`,
      // };

      Swal.fire({
        title: 'Sending Email...',
        html: 'Please wait while we process your request...',
        didOpen: () => Swal.showLoading(),
      });

      this.service.sendPasswordResetLink(requestData).subscribe(
        (response: any) => {
          Swal.close();
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'A reset link has been sent to your email address.',
            confirmButtonText: 'OK',
          }).then(() => {
            this.signOut();
          });
        },
        (error) => {
          Swal.close();
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text:
              error.error.message ||
              'An error occurred while sending the reset link.',
            confirmButtonText: 'OK',
          });
        }
      );
    }
  }

  // Dummy function to generate a token; replace this with your actual token generation logic
  generateToken(): string {
    return 'some-generated-token';
  }
  signOut() {
    this.authService.clearSession();
    this.socialAuthService.signOut();
    this.router.navigate(['login']);
  }
}
