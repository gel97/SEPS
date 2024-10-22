import { MunCityLocService } from './../../../../shared/Governance/mun-city-loc.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DatePipe } from '@angular/common';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';

@Component({
  selector: 'app-city-location',
  templateUrl: './city-location.component.html',
  styleUrls: ['./city-location.component.css'],
})
export class CityLocationComponent implements OnInit {
  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;

  constructor(
    private service: MunCityLocService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService
  ) {}
  MunLoc: any = [];
  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };
  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }
  munCityName: string = this.auth.munCityName;
  setYear = this.auth.setYear;
  editmodal: any = {};
  MunBuild: any = {};
  UpdateMunLoc: boolean = false;
  UpdateBuild: boolean = false;
  edit: any = {};
  updateForm: boolean = false;

  // UpdateBarangay:any ={};
  listBarangay: any = {};
  isMunLocBuilding: boolean = true;
  dataList: any = [];
  visible: boolean = true;
  not_visible: boolean = true;
  addData: any = {};
  isCheck: boolean = false;
  toValidate: any = {};

  pageSize = 25;
  p: string | number | undefined;
  count: number = 0;
  tableSize: number = 5;
  tableSizes: any = [5, 10, 15, 25, 50, 100];
  searchText = '';

  date = new DatePipe('en-PH');
  ngOnInit(): void {
    this.Init();
  }
  resetForm(): void {
    this.addData = {};
  }

  viewData: boolean = false;
  parentMethod() {
    // alert('parent Method');
    this.viewData = true;
  }
  Init() {
    this.GetListBuilding();
    this.GetmunCity();
  }
  GetmunCity() {
    this.service.GetMunCity().subscribe((data) => {
      this.MunLoc = <any>data;
      console.log(this.MunLoc);
    });
  }
  GetListBuilding() {
    this.service.GetBuilding().subscribe({
      next: (response) => {
        this.setYear;
        this.munCityId;
        this.dataList = <any>response;
        console.log(this.dataList);
      },
    });
  }
  onTableDataChange(page: any) {
    //paginate
    console.log(page);
    this.p = page;
    this.Init();
  }
  clearData() {
    this.addData = {};
    this.not_visible = false;
    this.visible = true;
  }
  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
  }

  munCityId(munCityId: any) {
    throw new Error('Method not implemented.');
  }
  onTableSizeChange(event: any) {
    //paginate
    this.tableSize = event.target.value;
    this.p = 1;
    this.Init();
  }
  // ADD BUILDINGS for Buildings

  AddBuild() {
    this.toValidate.munCityBuildingName =
      this.addData.munCityBuildingName == '' ||
      this.addData.munCityBuildingName == null
        ? true
        : false;

    if (this.toValidate.munCityBuildingName == true) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.addData.munCityId = this.auth.munCityId;
      this.addData.setYear = this.auth.activeSetYear;
      this.service.AddBuilding(this.addData).subscribe(
        (_data) => {
          if (!this.isCheck) {
            this.closebutton.nativeElement.click();
          }
          this.clearData();
          // this.Init();

          Swal.fire('Good job!', 'Data Added Successfully!', 'success');

          this.Init();
          this.addData = {};
        },
        (_err) => {
          Swal.fire('ERROR!', 'Error', 'error');
        }
      );
    }
  }
  editbuilding(editbuilding: any = {}) {
    this.edit = editbuilding;
    //passing the data from table (modal)
    this.Init();
  }
  //EditData for MunBuilding
  EditData() {
    this.toValidate.munCityBuildingName =
      this.edit.munCityBuildingName == '' ||
      this.edit.munCityBuildingName == null
        ? true
        : false;
    if (this.toValidate.munCityBuildingName == true) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.service.UpdateMunBuilding(this.edit).subscribe({
        next: (_data) => {
          this.Init();
          this.edit = {};
        },
        error: (err) => {
          Swal.fire(
            'Error!',
            'An error occurred while updating the data',
            'error'
          );
          console.error(err);
        },
      });
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Your work has been updated',
        showConfirmButton: false,
        timer: 1000,
      });
      document.getElementById('Edit')?.click();
    }
  }

  updateMunBuild() {
    this.MunBuild.longtitude = this.gmapComponent.markers.lng;
    this.MunBuild.latitude = this.gmapComponent.markers.lat;
    this.MunBuild.setYear = this.auth.activeSetYear;

    this.service.UpdateMunBuilding(this.MunBuild).subscribe({
      next: (_data) => {
        this.Init(); // Refresh data
        this.MunBuild = {}; // Clear object
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Geo Building has been updated',
          showConfirmButton: false,
          timer: 1000,
        });
      },
      error: (err) => {
        Swal.fire(
          'Error!',
          'An error occurred while updating the geo building',
          'error'
        );
        console.error(err);
      },
    });
  }

  // for modal for MunuLocGeo
  updateM() {
    this.editmodal.longtitude = this.gmapComponent.markers.lng;
    this.editmodal.latitude = this.gmapComponent.markers.lat;
    this.service
      .UpdateMunCity(this.editmodal)
      .subscribe({ next: (_data) => {} });

    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Your work has been updated',
      showConfirmButton: false,
      timer: 1000,
    });
    this.Init();
    this.editmodal = {};
  }
  //
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
        this.service.DeleteBuilding(transId).subscribe({
          next: (_data) => {},
          error: (err) => {
            Swal.fire('Oops!', 'Something went wrong.', 'error');
          },
          complete: () => {
            this.dataList[index] = {};
            this.dataList[index].brgyId = data.brgyId;
            this.dataList[index].brgyName = data.brgyName;
            this.Init();
            Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
          },
        });
      }
    });
  }

  handleOnTabChange(isMunLocBuilding: boolean) {
    this.isMunLocBuilding = isMunLocBuilding;
    this.searchText = '';
    this.p = 1;
  }

  markerObj: any = {};
  SetMarker(data: any = {}) {
    this.markerObj = {
      lat: data.latitude,
      lng: data.longtitude,
      label: data.munCityName.charAt(0),
      brgyName: '',
      munCityName: data.munCityName,
      draggable: true,
    };
    this.gmapComponent.setMarker(this.markerObj);
  }

  editToggle() {
    this.not_visible = true;
    this.visible = false;
  }
}
