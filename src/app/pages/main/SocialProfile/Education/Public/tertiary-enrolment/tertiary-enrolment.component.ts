import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { AuthService } from 'src/app/services/auth.service';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { EducationTertiaryService } from 'src/app/shared/SocialProfile/Education/educationTertiary.service';

@Component({
  selector: 'app-tertiary-enrolment',
  templateUrl: './tertiary-enrolment.component.html',
  styleUrls: ['./tertiary-enrolment.component.css']
})
export class TertiaryEnrolmentComponent implements OnInit {
  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;
  
  munCityName: string = this.auth.munCityName;
  constructor(
    private service: EducationTertiaryService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }
  
  toValidate: any = {};
 
  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };
  isCheck: boolean = false;
  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
  }

 

  ngOnInit(): void {
    this.Init();
  }
  munCityId: string = this.auth.munCityId;
  setYear: string = this.auth.setYear;

  isAdd: boolean = true;
  list: any = [];
  data: any = {};
  listBarangay: any = [];

  Init() {
    this.GetListBarangay();
    this.GetListData();
  }

  markerObj: any = {};

  SetMarker(item: any = {}) {
    console.log(item);
    console.log(this.data);

    this.markerObj = {
      lat: item.latitude,
      lng: item.longtitude,
      label: item.brgyName.charAt(0),
      brgyName: item.brgyName,
      munCityName: this.munCityName,
      draggable: true,
    };

    this.gmapComponent.setMarker(this.markerObj);
  }

  GetListBarangay() {
    this.service.ListOfBarangay(this.auth.munCityId).subscribe((data) => {
      this.listBarangay = <any>data;
    });
  }

  GetListData() {
    this.service
      .GetListEducationTertiary( this.setYear, this.munCityId)
      .subscribe({
        next: (response) => {
          this.list = <any>response;
          console.log(this.list );
        },
        error: (error) => {
          Swal.fire('Oops!', 'Something went wrong.', 'error');
        },
        complete: () => {},
      });
  }

  AddData() {
    this.toValidate.school =
      this.data.school == '' || this.data.school == null ? true : false;
    this.toValidate.brgyId =
      this.data.brgyId == '' || this.data.brgyId == null ? true : false;

    this.data.setYear = this.setYear;
    this.data.munCityId = this.munCityId;

    if (!this.toValidate.school && !this.toValidate.brgyId) {
      this.service.AddEducationTertiary(this.data).subscribe({
        next: (request) => {
          this.GetListData();
        },
        error: (error) => {
          Swal.fire('Oops!', 'Something went wrong.', 'error');
        },
        complete: () => {
          if (!this.isCheck) {
            this.closebutton.nativeElement.click();
          }
          this.data = {};
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

  EditData() {
    console.log(this.data);

    this.data.longtitude = this.gmapComponent.markers.lng;
    this.data.latitude = this.gmapComponent.markers.lat;

    this.data.setYear = this.setYear;
    this.data.munCityId = this.munCityId;

    this.service.EditEducationTertiary(this.data).subscribe({
      next: (request) => {
        this.GetListData();
      },
      error: (error) => {
        Swal.fire('Oops!', 'Something went wrong.', 'error');
      },
      complete: () => {
        this.closebutton.nativeElement.click();
        Swal.fire('Good job!', 'Data Updated Successfully!', 'success');
      },
    });
  }

  DeleteData(transId: any) {
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
        this.service.DeleteEducationTertiary(transId).subscribe((request) => {
          this.GetListData();
        });
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  }
}
