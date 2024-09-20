import { Component, OnInit } from '@angular/core';
import { response } from 'express';
import { UserService } from 'src/app/shared/Tools/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import {
  SocialAuthService,
  FacebookLoginProvider,
  SocialUser,
} from 'angularx-social-login';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-form',
  templateUrl: './reset-form.component.html',
  styleUrls: ['./reset-form.component.css'],
})
export class ResetFormComponent implements OnInit {
  showCurrentPassword = false;
  showNewPassword = false;
  editmodal: any = {};
  listData: any[] = [
    { id: 1, username: 'user1', password: 'pass1', showPassword: false },
    { id: 2, username: 'user2', password: 'pass2', showPassword: false },
    // other users
  ];
  userId: any;
  isUpdating = false;
  token: string | null | undefined;

  constructor(
    private service: UserService,
    private authService: AuthService,
    private socialAuthService: SocialAuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.GetUser();
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
        this.listData = data;
      },
      error: (error) => {
        Swal.fire('Error!', 'Failed to load user data', 'error');
      },
    });
  }

  editUser(editUser: any = {}) {
    this.editmodal = { ...editUser }; // Ensure we copy the user data correctly
    this.GetUser();
  }

  UpdateUser() {
    if (
      !this.editmodal.email ||
      !this.editmodal.currentPassword ||
      !this.editmodal.newPassword
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Information',
        text: 'Email, current password, and new password are required.',
      });
      return;
    }

    const passwordPattern =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordPattern.test(this.editmodal.newPassword)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Password',
        text: 'The new password must meet the specified requirements.',
      });
      return;
    }

    const updateData = {
      email: this.editmodal.email,
      currentPassword: this.editmodal.currentPassword,
      newPassword: this.editmodal.newPassword,
    };

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
        this.isUpdating = true;
        this.service.UpdateUser(updateData).subscribe({
          next: (response) => {
            if (response.constructor) {
              Swal.fire({
                icon: 'success',
                title: 'Successful Password Reset',
                text: 'You will be logged out now.',
                showConfirmButton: false,
                timer: 1000,
              }).then(() => {
                this.signOut(); // Call signOut after the password is updated
              });
            } else {
              this.GetUser();
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Your password has been updated',
                showConfirmButton: false,
                timer: 1000,
              });
            }
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text:
                error.error.message ||
                'An error occurred while updating the password',
            });
          },
          complete: () => {
            this.isUpdating = false;
          },
        });
      }
    });
  }

  signOut() {
    this.authService.clearSession();
    this.socialAuthService.signOut();
    this.router.navigate(['login']);
  }

  togglePasswordVisibility(item: any): void {
    item.showPassword = !item.showPassword;
  }
}
