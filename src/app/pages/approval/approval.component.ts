import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/Tools/user.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.css'],
})
export class ApprovalComponent implements OnInit {
  constructor(private service: UserService, private Service: AuthService) {}

  user: any = {};
  list_muncity: any = {};
  toValidate: any = {};
  goetag: any = [];
  selectedMunicipality: string = '';
  filteredGoetag: any[] = [];
  geotag: any[] = [];
  ngOnInit(): void {
    this.service.ListMunCity().subscribe((data) => {
      this.list_muncity = <any>data;
    });

    const userId = this.Service.userId;
    this.service.getUser(userId).subscribe((data: any) => {
      console.log('User data received:', data);
      this.user = data;
    });

    this.service.getUsergeotag().subscribe((data: any[]) => {
      console.log('Geotag user data received:', data);
      this.goetag = data;
    });
    this.filteredGoetag = this.goetag;
  }

  CheckIfnotempty(value: string) {
    if (value !== null || value !== '') {
      this.toValidate.munCityId = false;
    }
  }

  assignOrUpdate(user: any) {
  this.service.PostUserApproval(user.userId, user.munCityId).subscribe(
    (res: any) => {
      console.log('Assigned successfully:', res);

      user.assignMode = false;
      user.userType = res.userType;
      user.municipalityName = res.munCityName;
      user.isConfirmed = true;
      user.status = 'Approved';

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: res.message,
        timer: 2000,
        showConfirmButton: false,
      });

      // ✅ Refresh filtered list after update
      this.filterByMunicipality();
    },
    (err) => {
      console.error('Error assigning municipality:', err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong while assigning!',
      });
    }
  );
}
togglePassword(user: any){
  user.showPassword = !user.showPassword
}


  assignGuest(user: any) {
    const payload = 'Guest'; // <-- plain string

    this.service.PostUserApproval(user.userId, payload).subscribe(
      (res: any) => {
        console.log('Assigned as Guest:', res);

        // Update UI
        user.assignMode = false;
        user.userType = 'Guest';
        user.munCityId = null;
        user.municipalityName = null;

        Swal.fire({
          icon: 'success',
          title: 'Assigned as Guest',
          text: res.message,
          timer: 2000,
          showConfirmButton: false,
        });
      },
      (err) => {
        console.error('Error assigning Guest:', err);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to assign user as Guest!',
        });
      }
    );
  }

  cancelAssign(user: any) {
    user.assignMode = false;

    Swal.fire({
      icon: 'info',
      title: 'Cancelled',
      text: 'Assignment cancelled.',
      timer: 1500,
      showConfirmButton: false,
    });
  }


  filterByMunicipality() {
  if (!this.selectedMunicipality) {
    // Show all users
    this.filteredGoetag = this.goetag;
  } else if (this.selectedMunicipality === 'Unassigned') {
    // ✅ Show only users with no userType
    this.filteredGoetag = this.goetag.filter((u: any) => !u.userType);
  } else {
    // Show users for the selected municipality
    this.filteredGoetag = this.goetag.filter(
      (u: { municipalityName: string }) =>
        u.municipalityName === this.selectedMunicipality
    );
  }
}

}
