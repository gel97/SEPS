import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { EnvironmentProfileService } from 'src/app/shared/Environment/environment-profile.service';

@Component({
  selector: 'app-historical-disaster',
  templateUrl: './historical-disaster.component.html',
  styleUrls: ['./historical-disaster.component.css'],
})
export class HistoricalDisasterComponent implements OnInit {
  constructor(
    private service: EnvironmentProfileService,
    private Auth: AuthService
  ) {}

  menuId = 7;
  setYear = Number(this.Auth.activeSetYear);
  munCityId = this.Auth.munCityId;
  userId = this.Auth.userId;

  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };

  message = 'Historical Disaster Profile';

  listHis: any = [];
  addData: any = {};
  editData: any = {};
  idCounter: number = 1;
  updateForm: boolean = false;

  list_of_disaster = [
    { id: 1, type_disas: 'Flooding' },
    { id: 2, type_disas: 'Typhoon with Sheet Flood' },
    { id: 3, type_disas: 'Flashflood ' },
    { id: 4, type_disas: 'Rainfall-induced Landslides' },
    { id: 5, type_disas: 'Coastal/ Storm Surges' },
    { id: 6, type_disas: 'Earthquake ' },
    { id: 7, type_disas: 'Earthquake-induced Landslides Ground Rupture ' },
    { id: 8, type_disas: 'Soil Liquefaction ' },
    { id: 9, type_disas: 'Tsunami' },
    { id: 10, type_disas: 'Volcanic Eruptions ' },
    { id: 11, type_disas: 'Severe Drought/Heatwave ' },
    { id: 12, type_disas: 'Strong Wind ' },
    { id: 13, type_disas: 'Southeast Monsoon/Habagat ' },
  ];

  ngOnInit() {
    this.GetData();
  }

  resetForm(): void {
    this.addData = {};
  }

  parentMethod() {
    // alert('parent Method');
    this.addData = {};
    // this.not_visible = false;
    this.updateForm = false;
    this.resetForm();
    // this.required = false;
  }

  GetData(): void {
    this.service.GetEnvironmentProfile(this.setYear, this.munCityId).subscribe({
      next: (response) => {
        this.listHis = response;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('GetHistoricalDisaster() completed.');
      },
    });
  }

  AddDescription(): void {
    this.addData.setYear = Number(this.setYear);
    this.addData.menuId = String(this.menuId);
    // addData.id = this.idCounter++;
    this.addData.userId = this.userId;
    this.addData.munCityId = this.munCityId;
    this.service.AddEnvironmentProile(this.addData).subscribe({
      next: (response) => {
        this.listHis.push(response);
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
        this.closebutton.nativeElement.click();
        console.log('AddHistoricalDiaster() completed.');
      },
    });
  }

  EditDescription(): void {
    this.service.EditEnvironmentProfile(this.addData).subscribe({
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
        this.closebutton.nativeElement.click();
        console.log('UpdateHistoricalDisaster() completed.');
      },
    });
  }

  deleteDescription(id: number) {
    this.listHis = this.listHis.filter(
      (data: { id: number }) => data.id !== id
    );
  }

  DeleteDescription(id: any): void {
    Swal.fire({
      title: 'Are you sure you want to delete this Historical Disaster Data?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.DeleteEnvironmentProfile(id).subscribe({
          next: (response) => {
            const index = this.listHis.findIndex((d: any) => d.transId === id);
            //console.log(index);
            this.DeleteDescription(id);
            this.listHis.splice(index, 1);
            console.log(response);
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'The Historical Disaster Data has been deleted',
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
            console.log('DeleteHistoricalDisaster() completed.');
          },
        });
      }
    });
  }
}
