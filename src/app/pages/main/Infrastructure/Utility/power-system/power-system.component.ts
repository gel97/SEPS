import { Component, OnInit, ViewChild } from '@angular/core';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { AuthService } from 'src/app/services/auth.service';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { ServicesUtilitiesService } from 'src/app/shared/Infrastructure/Utilities/services-utilities.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-power-system',
  templateUrl: './power-system.component.html',
  styleUrls: ['./power-system.component.css'],
})
export class PowerSystemComponent implements OnInit {
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

  message = 'Power System Facilities';
  add_service: boolean = true;

  menuId: string = '4';
  munCityName: string = this.auth.munCityName;
  setYear = this.auth.activeSetYear;
  munCityId = this.auth.munCityId;
  toValidate: any = {};
  isCheck: boolean = false;
  visible: boolean = true;
  power: any = {};
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
      this.power.name == '' || this.power.name == null ? true : false;
    this.toValidate.serviceArea =
      this.power.serviceArea == '' || this.power.serviceArea == undefined
        ? true
        : false;
    this.toValidate.brgyId =
      this.power.brgyId == '' || this.power.brgyId == undefined ? true : false;

    if (
      this.toValidate.name == true ||
      this.toValidate.serviceArea == true ||
      this.toValidate.brgyId == true
    ) {
      Swal.fire('', 'Please fill out the required fields', 'warning');
    } else {
      this.power.menuId = this.menuId;
      this.power.setYear = this.setYear;
      this.power.munCityId = this.munCityId;
      this.service.Add_Services(this.power).subscribe((data) => {
        console.log('checke_data', data);
        this.closebutton.nativeElement.click();
        Swal.fire('Good job!', 'Data Added Successfully!', 'success');
        this.List_services();
        this.power = {};
      });
    }
  }

  Update_services() {
    this.power.longtitude = this.gmapComponent.markers.lng;
    this.power.latitude = this.gmapComponent.markers.lat;
    this.service.Update_Services(this.power).subscribe({
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
    this.power = {};
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
