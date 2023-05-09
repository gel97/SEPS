import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HealthFacilitiesService } from 'src/app/shared/SocialProfile/Health/healthFacilities.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-private-hospital',
  templateUrl: './private-hospital.component.html',
  styleUrls: ['./private-hospital.component.css'],
})
export class PrivateHospitalComponent implements OnInit {
  constructor(
    private Auth: AuthService,
    private service: HealthFacilitiesService
  ) { }
  menuId = 4;
  setYear = Number(this.Auth.activeSetYear);
  munCityId = this.Auth.munCityId;

  listData: any = [];
  addData: any = {};
  editData: any = {};
  listBarangayData: any = [];
  idCounter: number = 1;
  updateForm: boolean = false;

  ngOnInit(): void {
    this.resetForm();
    this.GetHealthFacilities();
    this.getListOfBarangay();
  }
  resetForm(): void {
    this.addData = {}; // Reset the form fields here
  }

  GetHealthFacilities(): void {
    this.service
      .GetHealthFacilities(this.menuId, this.setYear, this.munCityId)
      .subscribe({
        next: (response) => {
          this.listData = response;
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          console.log('GetHealthFacilities() completed.');
        },
      });
  }

  AddHealthFacilities(addData: any): void {
    addData.setYear = Number(this.setYear);
    addData.menuId = String(this.menuId);
    addData.id = this.idCounter++;
    // console.log(addData);
    this.service.AddHealthFacilities(addData).subscribe({
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
        console.log('AddHealthFacilities() completed.');
      },
    });
  }

  EditHealthFacilities(addData: any): void {
    this.service.EditHealthFacilities(addData).subscribe({
      next: (response) => {
        this.GetHealthFacilities();
        //this.listData.push(response);
        console.log(response);
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
        this.service.DeleteHealthFacilities(id).subscribe({
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

  getListOfBarangay(): void {
    this.service.ListOfBarangay(this.munCityId).subscribe((response) => {
      console.log('Barangay: ', response);
      this.listBarangayData = response;
    });
  }
}
