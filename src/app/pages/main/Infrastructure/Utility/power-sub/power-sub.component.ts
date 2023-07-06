import { Component, OnInit, ViewChild } from '@angular/core';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { AuthService } from 'src/app/services/auth.service';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { ServicesStationService } from 'src/app/shared/Infrastructure/Utilities/services-station.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-power-sub',
  templateUrl: './power-sub.component.html',
  styleUrls: ['./power-sub.component.css'],
})
export class PowerSubComponent implements OnInit {
  menuId: string = '5';
  munCityName: string = this.auth.munCityName;
  constructor(
    private service: ServicesStationService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  message = 'Power Sub-Stations';

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

  public showOverlay = false;
  importMethod() {
    this.showOverlay = true;
    this.service.Import(this.menuId).subscribe({
      next: (data) => {
        this.ngOnInit();
      },
      error: (error) => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        });

        Toast.fire({
          icon: 'warning',
          title: 'Something went wrong',
        });
      },
      complete: () => {
        this.showOverlay = false;
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        });

        Toast.fire({
          icon: 'success',
          title: 'Imported Successfully',
        });
      },
    });
  }
  munCityId: string = this.auth.munCityId;
  setYear: string = this.auth.setYear;

  Add_station: boolean = true;
  Station: any = [];
  station: any = {};
  barangays: any = [];

  Init() {
    this.GetListBarangay();
    this.GetList_Station();
  }

  GetListBarangay() {
    this.service.ListBarangay().subscribe((data) => {
      this.barangays = <any>data;
    });
  }

  GetList_Station() {
    this.service
      .List_Station(this.menuId, this.setYear, this.munCityId)
      .subscribe({
        next: (response) => {
          this.Station = <any>response;
        },
        error: (error) => {
          Swal.fire('Oops!', 'Something went wrong.', 'error');
        },
        complete: () => {},
      });
  }

  Add_Station() {
    this.toValidate.company =
      this.station.company == '' || this.station.company == undefined
        ? true
        : false;
    this.toValidate.stationName =
      this.station.stationName == '' || this.station.stationName == undefined
        ? true
        : false;
    this.toValidate.brgyId =
      this.station.brgyId == '' || this.station.brgyId == null ? true : false;

    this.station.menuId = this.menuId;
    this.station.setYear = this.setYear;
    this.station.munCityId = this.munCityId;

    if (
      !this.toValidate.company &&
      !this.toValidate.brgyId &&
      !this.toValidate.stationName
    ) {
      this.service.Add_Station(this.station).subscribe({
        next: (request) => {
          this.GetList_Station();
        },
        error: (error) => {
          Swal.fire('Oops!', 'Something went wrong.', 'error');
        },
        complete: () => {
          if (!this.isCheck) {
            this.closebutton.nativeElement.click();
          }
          this.station = {};
          Swal.fire('Good job!', 'Data Added Successfully!', 'success');
        },
      });
    } else {
      Swal.fire('', 'Please fill out the required fields.', 'warning');
    }
  }

  Update_Station() {
    this.station.longtitude = this.gmapComponent.markers.lng;
    this.station.latitude = this.gmapComponent.markers.lat;

    this.station.menuId = this.menuId;
    this.station.setYear = this.setYear;
    this.station.munCityId = this.munCityId;

    this.service.Update_Station(this.station).subscribe({
      next: (request) => {
        this.GetList_Station();
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

  Delete_Station(transId: any) {
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
        this.service.Delete_Station(transId).subscribe((request) => {
          this.GetList_Station();
        });
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  }
}
