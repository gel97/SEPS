import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { SafetyStatisticsService } from 'src/app/shared/SocialProfile/PublicOrder/safety-statistics.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { isEmptyObject } from 'jquery';



@Component({
  selector: 'app-crime-stat',
  templateUrl: './crime-stat.component.html',
  styleUrls: ['./crime-stat.component.css']
})
export class CrimeStatComponent implements OnInit {

  constructor(
    private Auth: AuthService,
    private service: SafetyStatisticsService
  ) { }

  setYear = Number(this.Auth.activeSetYear);
  menuId = 7;
  munCityId = this.Auth.munCityId;
  munCityName = this.Auth.munCityName;

  listData: any = [];
  addData: any = {};
  editData: any = {};
  listMunicipal: any = [];

  idCounter: number = 1;
  updateForm: boolean = false;
  hasData:boolean = false;



  ngOnInit(): void {
    this.resetForm();
    this.GetSafetyStatistics();
    this.listMunicipal();

  }
  resetForm(): void {
    this.addData = {}; // Reset the form fields here
  }

  GetSafetyStatistics(): void {
    this.service.GetSafetyStatistics(this.setYear, this.munCityId).subscribe({
      next: (response) => {
        if(response.length >0)
        {
          this.listData = response;

          this.hasData = true;
        }
        else{
          this.hasData = false;
        }
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
      },
    });
  }

  AddSafetyStatistics(addData: any): void {
    if(isEmptyObject(addData))
    {
      Swal.fire(
        'Missing Data!',
        'Please fill out the input fields.',
        'warning'
        );
    }
    else{
      addData.setYear = Number(this.setYear);
      addData.munCityId = String(this.munCityId);
      this.service.AddSafetyStatistics(addData).subscribe({
        next: (response) => {
          this.listData.push(response);
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Your work has been saved',
            showConfirmButton: false,
            timer: 1000,
          });
          this.GetSafetyStatistics();
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
        },
      });
    }
    
  }

  EditSafetyStatistics(addData: any): void {
    if(isEmptyObject(addData)){
      Swal.fire(
        'Missing Data!',
        'Please fill out the input fields.',
        'warning'
        );
    }
    else{
      this.service.EditSafetyStatistics(addData).subscribe({
        next: (response) => {
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
        },
      });
    }
    
  }

  DeleteSafetyStatistics(id: any): void {
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
        this.service.DeleteSafetyStatistics(id).subscribe({
          next: (response) => {
            const index = this.listData.findIndex((d: any) => d.transId === id);
            this.deleteData(id);
            this.listData.splice(index, 1);
            this.hasData = false;
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
      this.listMunicipal = response;
    });
  }



}
