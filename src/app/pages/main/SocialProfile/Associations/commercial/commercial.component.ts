import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AssociationService } from 'src/app/shared/SocialProfile/Association/association.service';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';

@Component({
  selector: 'app-commercial',
  templateUrl: './commercial.component.html',
  styleUrls: ['./commercial.component.css'],
})
export class CommercialComponent implements OnInit {
  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;

  constructor(
    private Auth: AuthService,
    private service: AssociationService,
    private modifyService: ModifyCityMunService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  menuId = '4';
  munCityId = this.Auth.munCityId;
  munCityName: string = this.Auth.munCityName;
  munName = this.Auth.munCityName;
  setYear = Number(this.Auth.activeSetYear);

  addData: any = {};
  editData: any = {};
  listData: any = {};
  listBarangayData: any = [];
  idCounter: number = 1;
  updateForm: boolean = false;
  markerObj: any = {};
  toValidate: any = {};
  latitude: any;
  longtitude: any;

  ngOnInit(): void {
    this.resetForm();
    this.getListOfBarangay();
    this.GetAssociation();
  }

  resetForm(): void {
    this.addData = {};
  }

  SetMarker(data: any = {}) {
    console.log('lnglat: ', data.longtitude + ' , ' + data.latitude);

    if (data.longtitude == undefined && data.latitude == undefined) {
      data.longtitude = this.longtitude;
      data.latitude = this.latitude;
    }

    this.markerObj = {
      lat: data.latitude,
      lng: data.longtitude,
      label: data.brgyName.charAt(0),
      brgyName: data.brgyName,
      munCityName: this.munName,
      draggable: true,
    };
    this.gmapComponent.setMarker(this.markerObj);
    console.log('marker', this.markerObj);
  }

  GetAssociation(): void {
    this.service
      .GetAssociation(this.menuId, this.setYear, this.munCityId)
      .subscribe({
        next: (response) => {
          this.listData = response;
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          console.log('GetAssociations() completed.');
        },
      });
  }

  AddAssociation(addData: any): void {
    this.toValidate.brgyId =
      this.addData.brgyId == '' || this.addData.brgyId == null ? true : false;
    this.toValidate.name =
      this.addData.estabName == '' || this.addData.name == undefined
        ? true
        : false;

    if (this.toValidate.brgyId == true || this.toValidate.name == true) {
      Swal.fire('', 'Please fill out the required fields', 'warning');
    } else {
      this.addData.longtitude = this.gmapComponent.markers.lng;
      this.addData.latitude = this.gmapComponent.markers.lat;
      this.addData.setYear = Number(this.setYear);
      this.addData.menuId = String(this.menuId);
      this.addData.location = this.munName;
      this.addData.id = this.idCounter++;
      this.service.AddAssociation(this.addData).subscribe({
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
          console.log('AddAssociations() completed.');
        },
      });
    }
  }

  //   AddAssociation(addData: any): void {
  //         addData.longtitude = this.gmapComponent.markers.lng;
  //         addData.latitude = this.gmapComponent.markers.lat;
  //         addData.setYear = Number(this.setYear);
  //         addData.menuId = String(this.menuId);
  //         addData.location = this.munName;
  //         addData.id = this.idCounter++;
  //         this.service.AddAssociation(addData).subscribe({
  //             next: (response) => {
  //                 this.listData.push(response);
  //                 console.log(response);
  //                 Swal.fire({
  //                     position: 'center',
  //                     icon: 'success',
  //                     title: 'Your work has been saved',
  //                     showConfirmButton: false,
  //                     timer: 1000,
  //                 });
  //                 this.resetForm();
  //             },
  //             error: (err) => {
  //                 console.log(err);
  //                 Swal.fire({
  //                     position: 'center',
  //                     icon: 'error',
  //                     title: 'Something went wrong!',
  //                     text: err.message,
  //                     showConfirmButton: false,
  //                     timer: 3000,
  //                 });
  //             },
  //             complete: () => {
  //                 console.log('AddAssociations() completed.');
  //             },
  //         });

  // }

  EditAssociation(): void {
    this.toValidate.brgyId =
      this.addData.brgyId == '' || this.addData.brgyId == null ? true : false;
    this.toValidate.name =
      this.addData.estabName === '' || this.addData.name == undefined
        ? true
        : false;

    if (this.toValidate.brgyId == true || this.toValidate.name == true) {
      Swal.fire('', 'Please fill out the required fields', 'warning');
    } else {
      // this.gmapComponent.markers.lat = this.GetAssociation();
      // this.gmapComponent.markers.lng = this.GetAssociation();

      this.addData.longtitude = this.gmapComponent.markers.lng;
      this.addData.latitude = this.gmapComponent.markers.lat;

      this.service.EditAssociation(this.addData).subscribe({
        next: (response) => {
          this.GetAssociation();

          this.addData.longtitude = this.gmapComponent.markers.lng;
          this.addData.latitude = this.gmapComponent.markers.lat;

          //this.listData.push(response);
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
          console.log('UpdateAssociation() completed.');
        },
      });
    }
  }

  DeleteAssociation(id: any): void {
    Swal.fire({
      title: 'Are you sure you want to delete this Organization Record?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.DeleteAssociation(id).subscribe({
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
