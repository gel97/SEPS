import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HealthWorkersService } from 'src/app/shared/SocialProfile/Health/healthWorkers.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-public-health',
  templateUrl: './public-health.component.html',
  styleUrls: ['./public-health.component.css'],
})
export class PublicHealthComponent implements OnInit {
  constructor(
    private Auth: AuthService,
    private service: HealthWorkersService
  ) { }

  menuId = 7;
  setYear = Number(this.Auth.activeSetYear);
  munCityId = this.Auth.munCityId;
  munCityName = this.Auth.munCityName;

  listData: any = [];
  addData: any = {};
  editData: any = {};
  listMunicipal: any = [];
  listBarangayData: any = [];

  idCounter: number = 1;

  updateForm: boolean = false;

  ngOnInit(): void {
    this.resetForm();
    this.GetHealthWorkers();
    this.getListOfMunicipality();
    this.getListOfBarangay();
    this.listMunicipal();
  }
  resetForm(): void {
    this.addData = {}; // Reset the form fields here
  }

  GetHealthWorkers(): void {
    this.service.GetHealthWorkers(this.setYear, this.munCityId).subscribe({
      next: (response) => {
        this.listData = response;

        //console.log(this.listMunicipal);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('GetHealthWorkers() completed.');
      },
    });
  }

  AddHealthWorkers(addData: any): void {
    addData.setYear = Number(this.setYear);
    addData.munCityId = String(this.munCityId);
    // console.log(addData);
    this.service.AddHealthWorkers(addData).subscribe({
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
        this.GetHealthWorkers();
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
        console.log('AddHealthWorkers() completed.');
      },
    });
  }

  EditHealthWorkers(addData: any): void {
    this.service.EditHealthWorkers(addData).subscribe({
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
        console.log('UpdateHealthWorkers() completed.');
      },
    });
  }

  DeleteHealthWorkers(id: any): void {
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
        this.service.DeleteHealthWorkers(id).subscribe({
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
            console.log('DeleteHealthWorkers() completed.');
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

  getListOfMunicipality(): void {
    this.service.ListOfMunicipality().subscribe((response) => {
      console.log('Municipal: ', response);
      this.listMunicipal = response;
    });
  }
}
