import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { BarangayOfficialService } from 'src/app/shared/Governance/barangay-official.service';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
@Component({
  selector: 'app-barangays',
  templateUrl: './barangays.component.html',
  styleUrls: ['./barangays.component.css']
})
export class BarangaysComponent implements OnInit {
  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;

  constructor(
    private service: BarangayOfficialService,
    private auth: AuthService) { }

  munCityName:string = this.auth.munCityName;
  toValidate: any = {};
  is_update: boolean = false;
  ViewBarangayOfficial: any = [];
  listBarangay: any = [];
  listData: any = [];
  barangay: any = {};
  addmodal: any = {};
  editmodal: any = {};
  UpdateBarangay: any = {};
  inputDisabled:boolean=false;

  ngOnInit(): void {
    this.Init();
  }

  markerObj: any = {};

  SetMarker(data: any = {}) {
    console.log("lnglat: ", data.longitude + " , " + data.latitude)

    this.markerObj = {
      lat: data.latitude,
      lng: data.longitude,
      label: data.brgyName.charAt(0),
      brgyName: data.brgyName,
      munCityName: this.munCityName,
      draggable: true
    };
    this.gmapComponent.setMarker(this.markerObj);
  }


  Init(){
    this.GetBarangay();
    this.GetListBarangay();
  }

  GetBarangay() {
    this.service.GetBarangay().subscribe({
      next: (response) => {
        this.ViewBarangayOfficial = (<any>response);
        console.log("Barangay officials :",response )
      },
      error: (error) => {
      },
      complete: ()=> {
        this.GetListBarangay();
      }
    });
  }

  GetListBarangay() {
    this.service.ListBarangay().subscribe({
      next: (response) => {
        this.listBarangay = (<any>response);
        console.log("Barangay :",response )
      },
      error: (error) => {
      },
      complete: ()=> {
        this.filterList();
      }
    });
  
  }

  filterList(){
    this.listBarangay.forEach((a:any)=>{
      this.ViewBarangayOfficial.forEach((b:any)=>{
        if (a.brgyId == b.brgyId) {
          this.listData.push(b);
        } 

      });

      let isExist = this.listData.filter((x: any) => x.brgyId == a.brgyId);
      if (isExist.length == 0) {
        this.listData.push(a);
      }

    });
    console.log("filter: ", this.listData);
  }


  addM() {
    this.toValidate.punongBrgy = this.addmodal.punongBrgy == "" || this.addmodal.punongBrgy == null ? true : false;
    this.toValidate.address = this.addmodal.address == "" || this.addmodal.address == undefined ? true : false;
    if (this.toValidate.punongBrgy == true || this.toValidate.address == true) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
    this.addmodal.setYear = this.auth.activeSetYear;
    this.service.AddBarangay(this.addmodal).subscribe({
      next: (_data) => {
        this.Init();
        this.addmodal = {};
      },
    });
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Your work has been saved',
      showConfirmButton: false,
      timer: 1000
    });
  }
  }
  updateM() {
    this.toValidate.punongBrgy = this.addmodal.punongBrgy == "" || this.addmodal.punongBrgy == null ? true : false;
    this.toValidate.address = this.addmodal.address == "" || this.addmodal.address == undefined ? true : false;
    if (this.toValidate.punongBrgy == true || this.toValidate.address == true) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {

    this.editmodal.longitude = this.gmapComponent.markers.lng;
    this.editmodal.latitude = this.gmapComponent.markers.lat;

    this.editmodal.setYear = this.auth.activeSetYear;
    this.service.UpdateBarangay(this.editmodal).subscribe({
      next: (_data) => {
        this.Init();
        this.editmodal = {};
      },
    });

    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Your work has been updated',
      showConfirmButton: false,
      timer: 1000
    });

  }
}

  delete(transId:any, index:any){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.Delete_Barangay(transId).subscribe({
          next: (_data) => {
            this.GetBarangay();
          },
          error: (err) => {
            this.GetBarangay();
          },

        });
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })

  }

}
