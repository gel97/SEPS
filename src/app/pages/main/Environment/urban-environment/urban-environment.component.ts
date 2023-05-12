import { Component, OnInit } from '@angular/core';
import { EnvironmentService } from 'src/app/shared/Environment/environment.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-urban-environment',
  templateUrl: './urban-environment.component.html',
  styleUrls: ['./urban-environment.component.css']
})
export class UrbanEnvironmentComponent implements OnInit {

  constructor(private Service: EnvironmentService, private Auth: AuthService) { }

  menuId = 4;
  setYear = Number(this.Auth.activeSetYear);
  munCityId = this.Auth.munCityId;
  userId = this.Auth.userId;

  listUrban: any = [];
  addData: any = {};
  editData: any = {};

  idCounter: number = 1;
  updateForm: boolean = false;
  click: boolean = true;
  buttonClick() {
    this.click = !this.click;
  }
  onKey(event: KeyboardEvent) {
    this.click = (event.target as HTMLInputElement).value === '' ? true : false;
  }
  ngOnInit(): void {
    this.resetForm();
    this.GetData();
  }

  resetForm(): void {
    this.addData = {}; // Reset the form fields here
  }

  GetData(): void {
    this.Service
      .GetEnvironment(this.menuId, this.setYear, this.munCityId,).subscribe({
        next: (response) => {
          this.listUrban = response;
          // console.log(this.listhazard);
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          console.log('GetUrbanEnvironment() completed.');
        },
      });
  }

  AddUrban(addData: any): void {
    addData.setYear = Number(this.setYear);
    addData.menuId = String(this.menuId);
    addData.id = this.idCounter++;
    addData.userId = this.userId;
    addData.munCityId = this.munCityId;
    this.Service.AddEnvironment(addData).subscribe({
      next: (response) => {
        this.listUrban.push(response);
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
          showConfirmButton: false,
          timer: 3000,
        });
      },
      complete: () => {
        console.log('AddUrbanEnvironment() completed.');
      }
    });
  }

  EditUrban(addData: any): void {
    this.Service.EditEnvironment(addData).subscribe({
      next: (response) => {
        this.GetData();
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
        console.log('UpdateUrbanEnvironment() completed.');
      },
    });
  }

  delete(id: number) {
    this.listUrban = this.listUrban.filter(
      (data: { id: number }) => data.id !== id
    );
  }

  DeleteUrban(id: any): void {
    Swal.fire({
      title: 'Are you sure you want to delete this Urban Environment Data?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.Service.DeleteEnvironment(id).subscribe({
          next: (response) => {
            const index = this.listUrban.findIndex((d: any) => d.transId === id);
            //console.log(index);
            this.delete(id);
            this.listUrban.splice(index, 1);
            console.log(response);
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'The Urban Environment data has been deleted',
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
            console.log('DeleteUrbanEnvironment() completed.');
          },
        });
      }
    });
  }


}

