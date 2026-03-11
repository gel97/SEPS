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
    this.list_muncity = data;
  });

  this.service.getUsergeotag().subscribe((data: any[]) => {
    this.goetag = data.map(u => ({
      ...u,
      // Siguraduha nga bisag unsa nga case sa JSON (Upper/Lower), ma-map og sakto
      userType: u.userType || u.UserType,
      municipalityName: u.municipalityName || u.MunicipalityName || 'Not assigned',
      Status: u.Status || u.status || 'ACTIVE',
      showPassword: false
    }));
    this.filteredGoetag = [...this.goetag];
    this.filterByMunicipality();
  });
}

  CheckIfnotempty(value: string) {
    if (value !== null || value !== '') {
      this.toValidate.munCityId = false;
    }
  }

 assignOrUpdate(user: any) {
  const roleType = user.isValidatorMode ? 'Validator' : 'Geotagger';
  
  // Siguraduhon nato nga limpyo ang ID (e.g., "Validator-112319")
  let targetId = user.munCityId;
  if (user.isValidatorMode && !targetId.toString().startsWith('Validator-')) {
    targetId = `Validator-${user.munCityId}`;
  }

  this.service.PostUserApproval(user.userId, targetId, roleType).subscribe(
    (res: any) => {
      // Pangitaa ang ngalan sa munisipyo para sa table display
      const selectedCity = this.list_muncity.find((m: any) => m.munCityId == user.munCityId);
      
      const index = this.goetag.findIndex((u: any) => u.userId === user.userId);
      if (index !== -1) {
        this.goetag[index] = {
          ...this.goetag[index],
          userType: res.userType || targetId, // Kani ang naay ID
          municipalityName: selectedCity ? selectedCity.munCityName : (res.munCityName || 'Assigned'),
          isConfirmed: true,
          status: 'Approved',
          assignMode: false
        };
      }

      Swal.fire({ icon: 'success', title: 'Success!', text: `Assigned as ${roleType} successfully.`, timer: 2000, showConfirmButton: false });

      // Refresh ang table
      this.filterByMunicipality();
    }
  );
}
togglePassword(user: any){
  user.showPassword = !user.showPassword
}


  assignGuest(user: any) {
    //const payload = 'Guest'; // <-- plain string

    this.service.PostUserApproval(user.userId, 'Guest', 'Guest').subscribe(
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
    user.isValidatorMode = false;
    Swal.fire({
      icon: 'info',
      title: 'Cancelled',
      text: 'Assignment cancelled.',
      timer: 1500,
      showConfirmButton: false,
    });
  }


filterByMunicipality() {
  const selected = this.selectedMunicipality;
  
  if (!selected || selected === "") {
    this.filteredGoetag = [...this.goetag];
  } 
  else if (selected === 'Validator') {
    // Kinahanglan mogamit og .toLowerCase().includes('validator') 
    // aron masakpan ang "Validator-112319"
    this.filteredGoetag = this.goetag.filter((u: any) => 
      u.userType?.toLowerCase().includes('validator')
    );
  } 
  else if (selected === 'Unassigned') {
    this.filteredGoetag = this.goetag.filter((u: any) => !u.userType);
  } 
  else {
    // Filter base sa Municipality Name
    this.filteredGoetag = this.goetag.filter((u: any) => 
      u.municipalityName === selected
    );
  }
}
deactivateUser(user: any) {
  Swal.fire({
    title: 'Are you sure?',
    text: 'This user will be deactivated and cannot log in.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, deactivate',
  }).then((result) => {
    if (result.isConfirmed) {
      this.service.Deactivate(user.userId).subscribe({
  next: (res: any) => {
    // I-check kung string ba ang res, kung string, i-parse nato
    let response = res;
    if (typeof res === 'string') {
      try {
        response = JSON.parse(res);
      } catch (e) {
        response = res; 
      }
    }

    if (response.text === 'User deactivated successfully' || response === 'User deactivated successfully') {
      user.Status = 'DEACTIVATED';
      Swal.fire({
        icon: 'success',
        title: 'Deactivated',
        text: 'User deactivated successfully',
        timer: 2000,
        showConfirmButton: false,
      });
      this.filterByMunicipality();
    } else {
      // Logic para sa error
    }
  },
  error: (err) => {
    // Kon ang status 200 pero niari gihapon, parsing error kini
    if (err.status === 200) {
       // I-treat as success kung ang text sulod sa error match sa success message
       user.Status = 'DEACTIVATED';
       Swal.fire({ icon: 'success', title: 'Deactivated', timer: 2000 });
       this.filterByMunicipality();
    } else {
       console.error('Deactivate error:', err);
       Swal.fire({
         icon: 'error',
         title: 'Failed',
         text: 'Error connection or server issues.',
       });
    }
  }
});
    }
  });
}
activateUser(user: any) {
  Swal.fire({
    title: 'Are you sure?',
    text: 'This user will be activated and will be able to log in to the system.',
    icon: 'info',
    showCancelButton: true,
    confirmButtonColor: '#3085d6', 
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, activate it!',
  }).then((result) => {
    if (result.isConfirmed) {
      this.service.Activate(user.userId).subscribe({
        next: (res: any) => {
          // Handle potential text/plain parsing issues
          let response = res;
          if (typeof res === 'string') {
            try {
              response = JSON.parse(res);
            } catch (e) {
              response = res;
            }
          }

          // Check for success message from backend
          if (response.text === 'User activated successfully' || response === 'User activated successfully') {
            user.Status = 'ACTIVE'; 
            Swal.fire({
              icon: 'success',
              title: 'Activated',
              text: 'User activated successfully!',
              timer: 2000,
              showConfirmButton: false,
            });
            this.filterByMunicipality(); 
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Failed',
              text: response.text || 'Failed to activate user.',
            });
          }
        },
        error: (err) => {
          // Handle status 200 parsing errors (common with text responses)
          if (err.status === 200) {
            user.Status = 'ACTIVE';
            Swal.fire({ 
              icon: 'success', 
              title: 'Activated', 
              text: 'User activated successfully!',
              timer: 2000,
              showConfirmButton: false 
            });
            this.filterByMunicipality();
          } else {
            console.error('Activate error:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Could not activate the user. Please check your connection.',
            });
          }
        },
      });
    }
  });
}



}
