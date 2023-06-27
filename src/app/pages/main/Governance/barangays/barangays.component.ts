import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { BarangayOfficialService } from 'src/app/shared/Governance/barangay-official.service';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
@Component({
  selector: 'app-barangays',
  templateUrl: './barangays.component.html',
  styleUrls: ['./barangays.component.css'],
})
export class BarangaysComponent implements OnInit {
  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;
  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };

  constructor(
    private service: BarangayOfficialService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  munCityName: string = this.auth.munCityName;
  toValidate: any = {};
  isAdd: boolean = false;

  ViewBarangayOfficial: any = [];
  listBarangay: any = [];

  listData: any = [];
  data: any = {};

  ngOnInit(): void {
    this.Init();
  }

  Init() {
    this.GetBarangay();
    this.GetListBarangay();
  }

  GetBarangay() {
    this.service.GetBarangay().subscribe({
      next: (response) => {
        this.ViewBarangayOfficial = <any>response;
        if (this.ViewBarangayOfficial.length > 0) {
          this.viewData = true;
        } else {
          this.viewData = false;
        }
        console.log(this.ViewBarangayOfficial);
      },
      error: (error) => {},
      complete: () => {
        this.GetListBarangay();
      },
    });
  }

  message = 'Barangays';
  viewData: boolean = false;
  parentMethod() {
    alert('parent Method');
    this.viewData = true;
  }

  GetListBarangay() {
    this.service.ListBarangay().subscribe({
      next: (response) => {
        this.listBarangay = <any>response;
      },
      error: (error) => {},
      complete: () => {
        this.FilterList();
      },
    });
  }

  // dataTrap: any = [];
  FilterList() {
    let isExist;
    this.listData = [];

    this.listBarangay.forEach((a: any) => {
      this.ViewBarangayOfficial.forEach((b: any) => {
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
        // this.dataTrap.push({
        //   landArea: a.landArea,
        //   address: a.address,
        //   contactNo: a.contactNo,
        //   purokNo: a.purokNo,
        //   longitude: a.longitude,
        //   latitude: a.latitude
        // });
        // this.dataTrap.push({
        //   transId: a.transId,
        // });
      }
      // console.log('transid', this.dataTrap);
    });

    // console.log('barangay12345', this.listData);
    // if (this.listData != null) {
    //   this.viewData = true;
    //   console.log('tru or false', this.viewData);
    // } else {
    //   this.viewData = false;
    // }
  }

  AddData() {
    this.toValidate.punongBrgy =
      this.data.punongBrgy == '' || this.data.punongBrgy == null ? true : false;
    this.toValidate.address =
      this.data.address == '' || this.data.address == undefined ? true : false;
    if (this.toValidate.punongBrgy == true || this.toValidate.address == true) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.data.setYear = this.auth.activeSetYear;
      this.service.AddBarangay(this.data).subscribe({
        next: (request) => {
          let index = this.listData.findIndex(
            (obj: any) => obj.brgyId === this.data.brgyId
          );
          this.listData[index] = request;
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
    this.toValidate.punongBrgy =
      this.data.punongBrgy == '' || this.data.punongBrgy == null ? true : false;
    this.toValidate.address =
      this.data.address == '' || this.data.address == undefined ? true : false;
    if (this.toValidate.punongBrgy == true || this.toValidate.address == true) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      if (
        this.gmapComponent.markers.lng !== undefined &&
        this.gmapComponent.markers.lat !== undefined
      ) {
        this.data.longitude = this.gmapComponent.markers.lng;
        this.data.latitude = this.gmapComponent.markers.lat;
      }

      this.data.setYear = this.auth.activeSetYear;
      this.service.UpdateBarangay(this.data).subscribe({
        next: (request) => {
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
        this.service.Delete_Barangay(transId).subscribe({
          next: (_data) => {},
          error: (err) => {
            Swal.fire('Oops!', 'Something went wrong.', 'error');
          },
          complete: () => {
            this.listData[index] = {};
            this.listData[index].brgyId = data.brgyId;
            this.listData[index].brgyName = data.brgyName;
            this.Init();
            Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
          },
        });
      }
    });
  }

  markerObj: any = {};
  SetMarker(data: any = {}) {
    this.markerObj = {
      lat: data.latitude,
      lng: data.longitude,
      label: data.brgyName.charAt(0),
      brgyName: data.brgyName,
      munCityName: this.munCityName,
      draggable: true,
    };
    this.gmapComponent.setMarker(this.markerObj);
  }
}
