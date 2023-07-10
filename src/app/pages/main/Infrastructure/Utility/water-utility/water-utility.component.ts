import { AuthService } from 'src/app/services/auth.service';
import { ServicesUtilitiesService } from './../../../../../shared/Infrastructure/Utilities/services-utilities.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';

@Component({
  selector: 'app-water-utility',
  templateUrl: './water-utility.component.html',
  styleUrls: ['./water-utility.component.css'],
})
export class WaterUtilityComponent implements OnInit {
  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;

  constructor(
    private service: ServicesUtilitiesService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };

  message = 'Water System Facilities';

  add_service: boolean = true;

  menuId: string = '1';
  munCityName: string = this.auth.munCityName;
  setYear = this.auth.activeSetYear;
  munCityId = this.auth.munCityId;
  toValidate: any = {};
  isCheck: boolean = false;
  visible: boolean = true;
  water: any = {};
  barangays: any = {};
  Services: any = [];

  ngOnInit(): void {
    this.List_services();
    this.list_of_barangay();
  }

  public showOverlay = false;
  importMethod() {
    this.showOverlay = true;
    this.service.Import(this.menuId).subscribe({
      next: (data) => {
        this.ngOnInit();
        if(data.length === 0){
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
            icon: 'info',
            title: 'No data from previous year',
          });
        }
        else
        {
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
        }
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
      complete: () => {},
    });
  }

  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
    console.log('isCheck:', this.isCheck);
  }
  list_of_barangay() {
    this.service.ListBarangay().subscribe((data) => {
      this.barangays = <any>data;
      console.log('fgxtxgcvcgcf', this.barangays);
    });
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

  List_services() {
    this.service
      .List_Services(this.menuId, this.setYear, this.munCityId)
      .subscribe((data) => {
        console.log('Checked_Data', data);
        this.Services = <any>data;
      });
  }

  Add_services() {
    this.toValidate.name =
      this.water.name == '' || this.water.name == null ? true : false;
    this.toValidate.serviceArea =
      this.water.serviceArea == '' || this.water.serviceArea == undefined
        ? true
        : false;
    this.toValidate.brgyId =
      this.water.brgyId == '' || this.water.brgyId == undefined ? true : false;

    if (
      this.toValidate.name == true ||
      this.toValidate.serviceArea == true ||
      this.toValidate.brgyId == true
    ) {
      Swal.fire('', 'Please fill out the required fields', 'warning');
    } else {
      this.water.menuId = this.menuId;
      this.water.setYear = this.setYear;
      this.water.munCityId = this.munCityId;
      this.service.Add_Services(this.water).subscribe((data) => {
        console.log('checke_data', data);
        this.closebutton.nativeElement.click();
        Swal.fire('Good job!', 'Data Added Successfully!', 'success');
        this.List_services();
        this.water = {};
      });
    }
  }

  Update_services() {
    this.water.longtitude = this.gmapComponent.markers.lng;
    this.water.latitude = this.gmapComponent.markers.lat;
    this.service.Update_Services(this.water).subscribe({
      next: (_data) => {
        this.closebutton.nativeElement.click();
        this.List_services();
      },
    });

    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Your work has been updated',
      showConfirmButton: false,
      timer: 1000,
    });
    this.water = {};
  }

  delete(transId: any, index: any) {
    Swal.fire({
      text: 'Do you want to remove this file?',
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!',
    }).then((result) => {
      if (result.value) {
        for (let i = 0; i < this.Services.length; i++) {
          if (this.Services[i].transId == transId) {
            this.Services.splice(i, 1);
            Swal.fire('Deleted', 'Removed successfully', 'success');
          }
        }

        this.service.Delete_Services(transId).subscribe((_data) => {});
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }
}
