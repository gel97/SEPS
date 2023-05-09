import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HealthMalnutritionService } from 'src/app/shared/SocialProfile/Health/healthMalnutrition.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-malnutrition-revised',
  templateUrl: './malnutrition-revised.component.html',
  styleUrls: ['./malnutrition-revised.component.css'],
})
export class MalnutritionRevisedComponent implements OnInit {
  constructor(
    private Auth: AuthService,
    private service: HealthMalnutritionService
  ) {}

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
    this.GetHealthMalnutrition();
    this.getListOfBarangay();
  }
  resetForm(): void {
    this.addData = {}; // Reset the form fields here
  }

  GetHealthMalnutrition(): void {
    this.service.GetHealthMalnutrition(this.setYear, this.munCityId).subscribe({
      next: (response) => {
        this.listData = response;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('GetHealthMalnutrition() completed.');
      },
    });
  }

  AddHealthMalnutrition(addData: any): void {
    addData.setYear = Number(this.setYear);
    addData.id = this.idCounter++;
    // console.log(addData);
    this.service.AddHealthMalnutrition(addData).subscribe({
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
        console.log('AddHealthMalnutrition() completed.');
      },
    });
  }

  EditHealthMalnutrition(addData: any): void {
    this.service.EditHealthMalnutrition(addData).subscribe({
      next: (response) => {
        this.GetHealthMalnutrition();
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
        console.log('UpdateHealthMalnutrition() completed.');
      },
    });
  }

  DeleteHealthMalnutrition(id: any): void {
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
        this.service.DeleteHealthMalnutrition(id).subscribe({
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
            console.log('DeleteHealthMalnutrition() completed.');
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
