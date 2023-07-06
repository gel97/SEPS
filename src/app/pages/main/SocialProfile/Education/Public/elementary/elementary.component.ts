import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { EducationSchoolsService } from 'src/app/shared/SocialProfile/Education/educationSchools.service';
@Component({
  selector: 'app-elementary',
  templateUrl: './elementary.component.html',
  styleUrls: ['./elementary.component.css'],
})
export class ElementaryComponent implements OnInit {
  menuId: string = '4';
  munCityName: string = this.auth.munCityName;
  constructor(
    private service: EducationSchoolsService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  toValidate: any = {};
  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;
  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };
  isCheck: boolean = false;
  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
    console.log('isCheck:', this.isCheck);
  }

  markerObj: any = {};

  SetMarker(data: any = {}) {
    console.log(data);
    this.markerObj = {
      lat: data.latitude,
      lng: data.longtitude,
      label: data.brgyName.charAt(0),
      brgyName: data.brgyName,
      munCityName: this.munCityName,
      draggable: true,
    };

    this.gmapComponent.setMarker(this.markerObj);
  }

  ngOnInit(): void {
    this.Init();
  }
  munCityId: string = this.auth.munCityId;
  setYear: string = this.auth.setYear;

  isAdd: boolean = true;
  listElems: any = [];
  elementary: any = {};
  listBarangay: any = [];

  Init() {
    this.GetListBarangay();
    this.GetListPublicElemSchool();
  }

  GetListBarangay() {
    this.service.ListOfBarangay(this.auth.munCityId).subscribe((data) => {
      this.listBarangay = <any>data;
    });
  }

  GetListPublicElemSchool() {
    this.service
      .GetListEducationSchools(this.menuId, this.setYear, this.munCityId)
      .subscribe({
        next: (response) => {
          this.listElems = <any>response;
        },
        error: (error) => {
          Swal.fire('Oops!', 'Something went wrong.', 'error');
        },
        complete: () => {},
      });
  }

  AddPublicElemSchool() {
    this.toValidate.name =
      this.elementary.name == '' || this.elementary.name == null ? true : false;
    this.toValidate.schoolId =
      this.elementary.schoolId == '' || this.elementary.schoolId == null
        ? true
        : false;
    this.toValidate.brgyId =
      this.elementary.brgyId == '' || this.elementary.brgyId == null
        ? true
        : false;

    this.elementary.menuId = this.menuId;
    this.elementary.setYear = this.setYear;
    this.elementary.munCityId = this.munCityId;

    if (
      !this.toValidate.name &&
      !this.toValidate.brgyId &&
      !this.toValidate.schoolId 
    ) {
      this.service.AddEducationSchool(this.elementary).subscribe({
        next: (request) => {
          this.GetListPublicElemSchool();
        },
        error: (error) => {
          Swal.fire('Oops!', 'Something went wrong.', 'error');
        },
        complete: () => {
          if (!this.isCheck) {
            this.closebutton.nativeElement.click();
          }
          this.elementary = {};
          Swal.fire('Good job!', 'Data Added Successfully!', 'success');
        },
      });
    } else {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields.',
        'warning'
      );
    }
  }

  EditPublicElemSchool() {
    this.toValidate.name =
      this.elementary.name == '' || this.elementary.name == null ? true : false;
    this.toValidate.schoolId =
      this.elementary.schoolId == '' || this.elementary.schoolId == null
        ? true
        : false;
    this.toValidate.brgyId =
      this.elementary.brgyId == '' || this.elementary.brgyId == null
        ? true
        : false;

    this.elementary.longtitude = this.gmapComponent.markers.lng;
    this.elementary.latitude = this.gmapComponent.markers.lat;

    this.elementary.menuId = this.menuId;
    this.elementary.setYear = this.setYear;
    this.elementary.munCityId = this.munCityId;
    if (
      !this.toValidate.name &&
      !this.toValidate.brgyId &&
      !this.toValidate.schoolId 
    ) {
      this.service.EditEducationSchool(this.elementary).subscribe({
        next: (request) => {
          this.GetListPublicElemSchool();
        },
        error: (error) => {
          Swal.fire('Oops!', 'Something went wrong.', 'error');
        },
        complete: () => {
          // this.closebutton.nativeElement.click();
          Swal.fire('Good job!', 'Data Updated Successfully!', 'success');
          document.getElementById('mEducation')?.click();
        },
      });
    } else {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields.',
        'warning'
      );
    }
  }

  DeletePublicElemSchool(transId: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.DeleteEducationSchool(transId).subscribe((request) => {
          this.GetListPublicElemSchool();
        });
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  }
}
