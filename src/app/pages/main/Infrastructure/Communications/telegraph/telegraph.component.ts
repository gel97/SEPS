import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { AuthService } from 'src/app/services/auth.service';
import { TelegraphService } from 'src/app/shared/Infrastructure/Utilities/Communication/telegraph.service';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
@Component({
  selector: 'app-telegraph',
  templateUrl: './telegraph.component.html',
  styleUrls: ['./telegraph.component.css'],
})
export class TelegraphComponent implements OnInit {
  munCityName: string = this.auth.munCityName;
  constructor(
    private service: TelegraphService,
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

  message = 'Telegraph Facilities';

  isAdd: boolean = true;
  listData: any = [];
  data: any = {};
  listBarangay: any = [];

  Init() {
    this.GetListBarangay();
    this.GetListData();
  }

  GetListBarangay() {
    this.service.ListOfBarangay(this.auth.munCityId).subscribe((data) => {
      this.listBarangay = <any>data;
    });
  }

  GetListData() {
    this.service.GetListTelegraph(this.setYear, this.munCityId).subscribe({
      next: (response) => {
        this.listData = <any>response;
      },
      error: (error) => {
        Swal.fire('Oops!', 'Something went wrong.', 'error');
      },
      complete: () => {},
    });
  }

  AddData() {
    this.toValidate.station =
      this.data.station == '' || this.data.station == undefined ? true : false;
    this.toValidate.brgyId =
      this.data.brgyId == '' || this.data.brgyId == null ? true : false;
    this.toValidate.facilities =
      this.data.facilities == '' || this.data.facilities == undefined
        ? true
        : false;
    this.toValidate.services =
      this.data.services == '' || this.data.services == undefined
        ? true
        : false;
    this.toValidate.equipment =
      this.data.equipment == '' || this.data.equipment == undefined
        ? true
        : false;
    this.toValidate.frequency =
      this.data.frequency == '' || this.data.frequency == undefined
        ? true
        : false;

    this.data.setYear = this.setYear;
    this.data.munCityId = this.munCityId;

    if (
      !this.toValidate.station &&
      !this.toValidate.brgyId &&
      !this.toValidate.facilities &&
      !this.toValidate.services &&
      !this.toValidate.equipment &&
      !this.toValidate.frequency
    ) {
      this.service.AddTelegraph(this.data).subscribe({
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
    this.toValidate.station =
      this.data.station == '' || this.data.station == undefined ? true : false;
    this.toValidate.brgyId =
      this.data.brgyId == '' || this.data.brgyId == null ? true : false;
    this.toValidate.facilities =
      this.data.facilities == '' || this.data.facilities == undefined
        ? true
        : false;
    this.toValidate.services =
      this.data.services == '' || this.data.services == undefined
        ? true
        : false;
    this.toValidate.equipment =
      this.data.equipment == '' || this.data.equipment == undefined
        ? true
        : false;
    this.toValidate.frequency =
      this.data.frequency == '' || this.data.frequency == undefined
        ? true
        : false;

    this.data.longtitude = this.gmapComponent.markers.lng;
    this.data.latitude = this.gmapComponent.markers.lat;

    this.data.setYear = this.setYear;
    this.data.munCityId = this.munCityId;

    if (
      !this.toValidate.station &&
      !this.toValidate.brgyId &&
      !this.toValidate.facilities &&
      !this.toValidate.services &&
      !this.toValidate.equipment &&
      !this.toValidate.frequency
    ) {
      this.service.EditTelegraph(this.data).subscribe({
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
    } else {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields.',
        'warning'
      );
    }
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
        this.service.DeleteTelegraph(transId).subscribe((request) => {
          this.GetListData();
        });
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  }
}
