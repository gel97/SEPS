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
  barangay: any = {};
  addmodal: any = {};
  editmodal: any = {};
  UpdateBarangay: any = {};

  pageSize = 25;
  p: string | number | undefined;
  count: number = 0;
  tableSize: number = 5;
  tableSizes: any = [5, 10, 15, 25, 50, 100];

  date = new DatePipe('en-PH')
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
    this.service.GetBarangay().subscribe(data => {
      this.ViewBarangayOfficial = (<any>data);
      console.log(this.ViewBarangayOfficial)

    })
  }

  GetListBarangay() {
    this.service.ListBarangay().subscribe(data => {
      this.listBarangay = (<any>data);
      console.log(this.listBarangay)
    })
  }

  AddBarangay() {
    this.toValidate.punongBrgy = this.barangay.punongBrgy == "" || this.barangay.punongBrgy == null ? true : false;
    this.toValidate.address = this.barangay.address == "" || this.barangay.address == undefined ? true : false;
    if (this.toValidate.punongBrgy == true || this.toValidate.address == true) {
      Swal.fire(
        '',
        'Please fill out the required fields',
        'warning'
      );
    } else {
    this.barangay.munCityId = this.auth.munCityId;
    this.barangay.activeSetYear = this.auth.activeSetYear;
    this.service.AddBarangay(this.barangay).subscribe(_data => {

      Swal.fire(
        'Good job!',
        'Data Added Successfully!',
        'success'
      );
      this.Init();
      this.barangay = {};

    }, err => {
      Swal.fire(
        'ERROR!',
        'Error',
        'error'
      );

      this.Init();
      this.barangay = {};
    });
  }
}

  onTableDataChange(page: any) { //paginate
    console.log(page)
    this.p = page;
    this.Init();

  }
  onTableSizeChange(event: any) { //paginate
    this.tableSize = event.target.value;
    this.p = 1;
    this.Init();

  }

  editBarangay(editBarangay: any = {}) {
    this.editmodal = editBarangay;
    //passing the data from table (modal)
    this.Init();

  }

  addM() {

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

  updateM() {

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
