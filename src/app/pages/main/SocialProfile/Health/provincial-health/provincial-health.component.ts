import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HealthProfileService } from 'src/app/shared/SocialProfile/Health/healthProfile.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-provincial-health',
  templateUrl: './provincial-health.component.html',
  styleUrls: ['./provincial-health.component.css'],
})
export class ProvincialHealthComponent implements OnInit {
  constructor(
    private Auth: AuthService,
    private service: HealthProfileService
  ) { }

  menuId = 7;
  setYear = Number(this.Auth.activeSetYear);
  munCityId = this.Auth.munCityId;

  listData: any = [];
  addData: any = {};
  editData: any = {};
  listMunicipal: any = [];

  idCounter: number = 1;

  updateForm: boolean = false;

  ngOnInit(): void {
    this.resetForm();
    this.GetHealthProfile();
    this.getListOfMunicipality();
  }
  resetForm(): void {
    this.addData = {}; // Reset the form fields here
  }

  GetHealthProfile(): void {
    this.service.GetHealthProfile(this.setYear).subscribe({
      next: (response) => {
        this.listData = response;
        //console.log(this.listMunicipal);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('GetHealthProfile() completed.');
      },
    });
  }

  AddHealthProfile(addData: any): void {
    addData.setYear = Number(this.setYear);
    // console.log(addData);
    this.service.AddHealthProfile(addData).subscribe({
      next: (response) => {
        this.listData.push(response);
        console.log(response);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1000,
        });
        this.GetHealthProfile();
      },
      error: (err) => {
        console.log(err);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Something went wrong!',
          text: err.message,
          showConfirmButton: false,
          timer: 3000,
        });
      },
      complete: () => {
        console.log('AddHealthProfile() completed.');
      },
    });
  }

  EditHealthFacilities(addData: any): void {
    this.service.EditHealthProfile(addData).subscribe({
      next: (response) => {
        //this.GetHealthProfile();
        //this.listData.push(response);
        // console.log(response);
        console.log(response);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your work has been updated',
          showConfirmButton: false,
          timer: 1000,
        });
        this.resetForm();
      },
      error: (err) => {
        console.log(err);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Something went wrong!',
          text: err.message,
          showConfirmButton: false,
          timer: 3000,
        });
      },
      complete: () => {
        console.log('UpdateHealthFacilities() completed.');
      },
    });
  }

  DeleteHealthFacilities(id: any): void {
    Swal.fire({
      title: 'Are you sure you want to delete this health facility?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.DeleteHealthProfile(id).subscribe({
          next: (response) => {
            const index = this.listData.findIndex((d: any) => d.transId === id);
            //console.log(index);
            this.deleteData(id);
            this.listData.splice(index, 1);
            console.log(response);
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'The health facility has been deleted',
              showConfirmButton: false,
              timer: 1000,
            });
          },
          error: (err) => {
            console.log(err);
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Something went wrong!',
              text: err.message,
              showConfirmButton: false,
              timer: 3000,
            });
          },
          complete: () => {
            console.log('DeleteHealthFacility() completed.');
          },
        });
      }
    });
  }

  deleteData(id: number) {
    this.listData = this.listData.filter(
      (data: { id: number }) => data.id !== id
    );
  }

  getListOfMunicipality(): void {
    this.service.ListOfMunicipality().subscribe((response) => {
      console.log('Municipal: ', response);
      this.listMunicipal = response;
    });
  }
}
