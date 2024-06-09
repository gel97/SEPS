import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { GeoProfileService } from 'src/app/shared/Governance/geo-profile.service';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { isEmptyObject } from 'jquery';

@Component({
  selector: 'app-geo-profile',
  templateUrl: './geo-profile.component.html',
  styleUrls: ['./geo-profile.component.css'],
})
export class GeoProfileComponent implements OnInit {
  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };

  munCityName: string = this.auth.munCityName;
  listGeoProf: any = [];
  listBarangay: any = [];

  isAdd: boolean = false;
  listData: any = [];
  data: any = {};

  constructor(
    private service: GeoProfileService,

    private auth: AuthService,
    private modifyService: ModifyCityMunService
  ) {}
  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  ngOnInit(): void {
    this.Init();
  }

  Init() {
    this.GetGeoProfile();
    this.GetListBarangay();
  }

  GetGeoProfile() {
    this.service
      .GetGeoProfile(this.auth.setYear, this.auth.munCityId)
      .subscribe({
        next: (response) => {
          this.listGeoProf = <any>response;
          console.log(this.listGeoProf);
          this.FilterList();
        },
        error: (error) => {
          console.error('Error fetching health malnutrition data', error);
        },
      });
  }

  GetListBarangay() {
    this.service.ListBarangay(this.auth.munCityId).subscribe({
      next: (response) => {
        this.listBarangay = <any>response;
        this.FilterList();
      },
      error: (error) => {
        console.error('Error fetching barangay list', error);
      },
    });
  }

  FilterList() {
    let isExist;
    this.listData = [];

    this.listBarangay.forEach((a: any) => {
      this.listGeoProf.forEach((b: any) => {
        if (a.brgyId == b.brgyId) {
          isExist = this.listData.filter((x: any) => x.brgyId == a.brgyId);
          if (isExist.length == 0) {
            this.listData.push(b);
          }
        }
      });

      isExist = this.listData.filter((x: any) => x.brgyId == a.brgyId);
      if (isExist.length == 0) {
        this.listData.push({
          brgyId: a.brgyId,
          brgyName: a.brgyName,
        });
      }
    });
  }

  AddData() {
    if (isEmptyObject(this.data)) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.data.munCityId = this.auth.munCityId;
      this.data.setYear = this.auth.activeSetYear;
      this.service.AddGeoProfile(this.data).subscribe({
        next: (request) => {
          let index = this.listData.findIndex(
            (obj: any) => obj.brgyId === this.data.brgyId
          );
          if (index !== -1) {
            this.listData[index] = request;
          } else {
            this.listData.push(request);
          }
        },
        complete: () => {
          this.data = {};
          this.closebutton.nativeElement.click();
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Your work has been saved',
            showConfirmButton: false,
            timer: 1000,
          });
        },
      });
    }
  }

  EditData() {
    this.data.setYear = this.auth.activeSetYear;
    this.service.EditGeoProfile(this.data).subscribe({
      next: (request) => {
        let index = this.listData.findIndex(
          (obj: any) => obj.brgyId === this.data.brgyId
        );
        if (index !== -1) {
          this.listData[index] = request;
        }
        this.closebutton.nativeElement.click();
        this.data = {};
      },
      complete: () => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your work has been updated',
          showConfirmButton: false,
          timer: 1000,
        });
      },
    });
  }

  DeleteData(transId: any, index: any, data: any) {
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
        this.service.DeleteGeoProfile(transId).subscribe({
          next: (_data) => {},
          error: (err) => {
            Swal.fire('Oops!', 'Something went wrong.', 'error');
          },
          complete: () => {
            this.listData[index] = {};
            this.listData[index].brgyId = data.brgyId;
            this.listData[index].brgyName = data.brgyName;
            Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
          },
        });
      }
    });
  }
}
