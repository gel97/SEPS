import { Component, OnInit } from '@angular/core';
import { EnvironmentService } from 'src/app/shared/Environment/environment.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-environmental-hazards',
  templateUrl: './environmental-hazards.component.html',
  styleUrls: ['./environmental-hazards.component.css']
})
export class EnvironmentalHazardsComponent implements OnInit {

  constructor(private service: EnvironmentService, private Auth: AuthService) { }


  menuId = 5;
  setYear = Number(this.Auth.activeSetYear);
  munCityId = this.Auth.munCityId;
  userId = this.Auth.userId;

  listHazard: any = [];
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
  ngOnInit() {
    this.resetForm();
    this.GetData();
  }

  resetForm(): void {
    this.addData = {}; // Reset the form fields here
  }

  GetData(): void {
    this.service
      .GetEnvironment(this.menuId, this.setYear, this.munCityId,).subscribe({
        next: (response) => {
          this.listHazard = response;
          // console.log(this.listhazard);
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          console.log('GetEnvironmentalHazard() completed.');
        },
      });
  }

  AddDescription(addData: any): void {
    addData.setYear = Number(this.setYear);
    addData.menuId = String(this.menuId);
    addData.id = this.idCounter++;
    addData.userId = this.userId;
    addData.munCityId = this.munCityId;
    this.service.AddEnvironment(addData).subscribe({
      next: (response) => {
        this.listHazard.push(response);
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
        console.log('AddEnvironmentalHazard() completed.');
      }
    });
  }


  EditDescription(addData: any): void {
    this.service.EditEnvironment(addData).subscribe({
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
        console.log('UpdateEnvironmentHazard() completed.');
      },
    });
  }

  deleteDescription(id: number) {
    this.listHazard = this.listHazard.filter(
      (data: { id: number }) => data.id !== id
    );
  }

  DeleteDescription(id: any): void {
    Swal.fire({
      title: 'Are you sure you want to delete this Environment Hazard Data?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.DeleteEnvironment(id).subscribe({
          next: (response) => {
            const index = this.listHazard.findIndex((d: any) => d.transId === id);
            //console.log(index);
            this.deleteDescription(id);
            this.listHazard.splice(index, 1);
            console.log(response);
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'The Environment Hazard Data has been deleted',
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
            console.log('DeleteEnvironmentHazard() completed.');
          },
        });
      }
    });
  }


}