import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { AuthService } from 'src/app/services/auth.service';
import { EducationSchoolsService } from 'src/app/shared/SocialProfile/Education/educationSchools.service';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';

@Component({
  selector: 'app-secondary',
  templateUrl: './secondary.component.html',
  styleUrls: ['./secondary.component.css'],
})
export class SecondaryComponent implements OnInit {
  menuId: string = '2';
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
  }

  markerObj: any = {};

  SetMarker(data: any = {}) {
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
  secondary: any = {};
  listBarangay: any = [];

  Init() {
    this.GetListBarangay();
    this.GetListPrivateSecSchool();
  }

  GetListBarangay() {
    this.service.ListOfBarangay(this.auth.munCityId).subscribe((data) => {
      this.listBarangay = <any>data;
    });
  }

  GetListPrivateSecSchool() {
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

  AddPrivateSecSchool() {
    this.toValidate.name =
      this.secondary.name == '' || this.secondary.name == null ? true : false;
    this.toValidate.schoolId =
      this.secondary.schoolId == '' || this.secondary.schoolId == null
        ? true
        : false;
    this.toValidate.brgyId =
      this.secondary.brgyId == '' || this.secondary.brgyId == null
        ? true
        : false;

    this.secondary.menuId = this.menuId;
    this.secondary.setYear = this.setYear;
    this.secondary.munCityId = this.munCityId;

    if (
      !this.toValidate.name &&
      !this.toValidate.brgyId &&
      !this.toValidate.schoolId
    ) {
      this.service.AddEducationSchool(this.secondary).subscribe({
        next: (request) => {
          this.GetListPrivateSecSchool();
        },
        error: (error) => {
          Swal.fire('Oops!', 'Something went wrong.', 'error');
        },
        complete: () => {
          if (!this.isCheck) {
            this.closebutton.nativeElement.click();
          }
          this.secondary = {};
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

  EditPrivateSecSchool() {
    this.toValidate.name =
      this.secondary.name == '' || this.secondary.name == null ? true : false;
    this.toValidate.schoolId =
      this.secondary.schoolId == '' || this.secondary.schoolId == null
        ? true
        : false;
    this.toValidate.brgyId =
      this.secondary.brgyId == '' || this.secondary.brgyId == null
        ? true
        : false;

    this.secondary.longtitude = this.gmapComponent.markers.lng;
    this.secondary.latitude = this.gmapComponent.markers.lat;

    this.secondary.menuId = this.menuId;
    this.secondary.setYear = this.setYear;
    this.secondary.munCityId = this.munCityId;

    if (
      !this.toValidate.name &&
      !this.toValidate.brgyId &&
      !this.toValidate.schoolId 
    ) {
      this.service.EditEducationSchool(this.secondary).subscribe({
        next: (request) => {
          this.GetListPrivateSecSchool();
        },
        error: (error) => {
          Swal.fire('Oops!', 'Something went wrong.', 'error');
        },
        complete: () => {
          this.closebutton.nativeElement.click();
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

  DeletePrivateSecSchool(transId: any) {
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
          this.GetListPrivateSecSchool();
        });
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  }
}
