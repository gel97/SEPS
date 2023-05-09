import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HealthHospitalService } from 'src/app/shared/SocialProfile/Health/healthHospital.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { response } from 'express';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
@Component({
  selector: 'app-provincial-hospital',
  templateUrl: './provincial-hospital.component.html',
  styleUrls: ['./provincial-hospital.component.css']
})
export class ProvincialHospitalComponent implements OnInit {

  constructor(private Auth: AuthService, private service: HealthHospitalService) { }
  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;
  menuId = 7;
  setYear = Number(this.Auth.activeSetYear);
  munCityId = this.Auth.munCityId;
  munCityName: string = this.Auth.munCityName;
  listData: any = [];
  addData: any = {};
  editData: any = {};
  listMunicipal: any = [];
  visible: boolean = true;
  not_visible: boolean = true;
  idCounter: number = 1;
  isCheck: boolean = false;
  latitude: any
  longtitude: any
  checker_brgylist: any = {};

  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void; }; };

  markerObj: any = {};
  SetMarker(data: any = {}) {
    console.log("lnglat: ", data.longtitude + " , " + data.latitude)


    if (data.longtitude == undefined && data.latitude == undefined) {
      data.longtitude = this.longtitude;
      data.latitude = this.latitude;
    }

    this.markerObj = {
      lat: data.latitude,
      lng: data.longtitude,
      label: data.brgyName.charAt(0),
      brgyName: data.brgyName,
      munCityName: this.munCityName,
      draggable: true
    };
    this.gmapComponent.setMarker(this.markerObj);
    console.log("marker", this.markerObj);
  }


  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
    console.log("isCheck:", this.isCheck);
  }
  updateForm: boolean = false;

  ngOnInit(): void {
    this.resetForm();
    this.GetHealthHospital();

  }
  resetForm(): void {
    this.addData = {}; // Reset the form fields here
    this.not_visible = false;
    this.visible = true;
  }

  GetHealthHospital(): void {
    this.service.GetHealtHospital(this.setYear).subscribe({
      next: (response) => {
        this.listData = response;
        //console.log(this.listMunicipal);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('GetHealthhospital() completed.');
      },
    });
  }

  AddHealthHospital(addData: any): void {
    addData.setYear = Number(this.setYear);
    // console.log(addData);
    this.service.AddHealthHospital(addData).subscribe({
      next: (response) => {
        this.listData.push(response);
        console.log(response);
        this.resetForm();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1000,
        });
        this.GetHealthHospital();
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
        console.log('AddHealthHospital() completed.');
      },
    });
  }

  EditHealthHospital(addData: any): void {
    this.service.EditHealthHospital(addData).subscribe({

      next: (response) => {
        this.GetHealthHospital();
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
        console.log('UpdateHealthHospital() completed.');
      },
    });
  }

  DeleteHealthHospital(id: any): void {
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
        this.service.DeleteHealtHospital(id).subscribe({
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
            console.log('DeleteHealthHospital() completed.');
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

  editToggle() {
    this.not_visible = true;
    this.visible = false;
  }

}