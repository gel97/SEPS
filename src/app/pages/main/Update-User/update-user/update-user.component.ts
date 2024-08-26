import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/Tools/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css'],
})
export class UpdateUserComponent implements OnInit {
populateForm(_t15: any) {
throw new Error('Method not implemented.');
}
newPassword: any;
  closebutton: any;
data: any;
  constructor(private service: UserService) {}

  list_muncity: any = {};
  searchText = '';
  listData: any = [];

  selectedUser: any = {};
  toValidate: any = {
    currentPassword: false,
    newPassword: false,
    newUsername: false,
  };
  isLoadingSubmit = false;
  ngOnInit(): void {
    this.Init();
  }
  

  Init() {
    this.GetUser();
  }
  GetUser() {
    this.service.GetUser().subscribe((data) => {
      this.listData = <any>data;
      console.log(this.listData);
    });
  }

  SelectUser(user: any){
    this.SelectUser = { ...user}; // Clone the selected user object
  }

  UpdateUser() {
    // Validate inputs
    this.toValidate.currentPassword = !this.selectedUser.currentPassword;
    this.toValidate.newPassword = !this.selectedUser.newPassword;
    this.toValidate.newUsername = !this.selectedUser.newUsername;
  
    if (
      !this.toValidate.currentPassword &&
      !this.toValidate.newPassword &&
      !this.toValidate.newUsername
    ) {
      Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to save the changes?",
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, save it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.service.UpdateUser(this.selectedUser).subscribe({
            next: (response: any) => {
              // Check if the response is a success message
              if (response === 'Password updated successfully' || response === 'User details updated successfully') {
                Swal.fire({
                  icon: 'success',
                  title: 'Updated Successfully!',
                  showConfirmButton: false,
                  timer: 1500,
                });
                this.closebutton.nativeElement.click();
                this.Init(); // Refresh user list
              } else {
                // Handle unexpected responses
                Swal.fire({
                  icon: 'error',
                  title: 'Error!',
                  text: 'An unexpected response was received.',
                });
              }
            },
            error: (error) => {
              let errorMessage = 'Something went wrong during the update process.';
              if (error.status === 400) {
                errorMessage = error.error || 'Current password is incorrect';
              } else if (error.status === 404) {
                errorMessage = 'User not found';
              }
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: errorMessage,
              });
            },
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error!',
        text: 'Please fill out all fields correctly.',
      });
    }
  }
  
  
}

  // validatePassword(password: string): boolean {
  //   const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
  //   return passwordPattern.test(password);
  // }


