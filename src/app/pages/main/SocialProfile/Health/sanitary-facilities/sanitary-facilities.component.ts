import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HealthSanitaryService } from 'src/app/shared/SocialProfile/Health/healthSanitary.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sanitary-facilities',
  templateUrl: './sanitary-facilities.component.html',
  styleUrls: ['./sanitary-facilities.component.css'],
})
export class SanitaryFacilitiesComponent implements OnInit {
  constructor(
    private Auth: AuthService,
    private service: HealthSanitaryService
  ) { }

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
    this.GetHealthSanitary();
    this.getListOfBarangay();
  }
  resetForm(): void {
    this.addData = {}; // Reset the form fields here
  }

  GetHealthSanitary(): void {
    this.service.GetHealthSanitary(this.setYear, this.munCityId).subscribe({
      next: (response) => {
        this.listData = response;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('GetHealthSanitary() completed.');
      },
    });
  }

  AddHealthSanitary(addData: any): void {
    addData.setYear = Number(this.setYear);
    addData.id = this.idCounter++;
    // console.log(addData);
    this.service.AddHealthSanitary(addData).subscribe({
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
        console.log('AddHealthSanitary() completed.');
      },
    });
  }

  EditHealthSanitary(addData: any): void {
    this.service.EditHealthSanitary(addData).subscribe({
      next: (response) => {
        this.GetHealthSanitary();
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
        console.log('UpdateHealthSanitary() completed.');
      },
    });
  }

  DeleteHealthSanitary(id: any): void {
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
        this.service.DeleteHealthSanitary(id).subscribe({
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
            console.log('DeleteHealthSanitary() completed.');
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
