import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { HousingProjectService } from 'src/app/shared/SocialProfile/Housing/housing-project.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-government-housing',
  templateUrl: './government-housing.component.html',
  styleUrls: ['./government-housing.component.css']
})
export class GovernmentHousingComponent implements OnInit {

  constructor(private Auth: AuthService, private service: HousingProjectService) { }

  menuId = "2";
  munCityName: string = this.Auth.munCityName;
  setYear = Number(this.Auth.activeSetYear);
  munCityId = this.Auth.munCityId;
  userId = this.Auth.userId;

  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;

  isCheck: boolean = false;

  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
    console.log("isCheck:", this.isCheck);
  }

  dataList: any = [];
  barangayList: any = [];
  addData: any = {};
  dummy_addData: any = {};
  dummyData: any = {};
  visible: boolean = true;
  not_visible: boolean = true;
  //required == not_visible
  required: boolean = true;
  latitude: any
  longtitude: any
  checker_brgylist: any = {};
  toValidate: any = {};


  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void; }; };

  markerObj: any = {};

  SetMarker(data: any = {}) {
    console.log("lnglat: ", data.longtitude + " , " + data.latitude)


    if (data.longtitude == undefined && data.latitude == undefined) {
      data.longtitude = this.longtitude;
      data.latitude = this.latitude;
    }

    this.markerObj = {
      lat: data.latitude,
      lng: data.longtitude,
      label: data.brgyName.charAt(0),
      brgyName: data.brgyName,
      munCityName: this.munCityName,
      draggable: true
    };
    this.gmapComponent.setMarker(this.markerObj);
    console.log("marker", this.markerObj);
  }


  ngOnInit(): void {
    this.GetData();
    this.GetBarangayList();
  }

  GetData() {
    this.service.GetHousingProject(this.setYear, this.munCityId).subscribe(response => {
      this.dataList = (<any>response);
      console.log("check", response);
    })
  }


  GetBarangayList() {
    this.service.GetBarangayList(this.munCityId).subscribe(response => {
      this.barangayList = (<any>response);
      console.log("barangay", response);
    })

  }

  findBrgyId(brgyId: any) {
    return this.barangayList.find((item: { brgyId: any; }) => item.brgyId === brgyId);
  }

  AddData() {
    console.log("trap", this.addData);
    console.log("brgyid", this.addData.brgyId);
    this.dummy_addData = this.addData;
    console.log("trap_2", this.dummy_addData);

    this.toValidate.brgyId =
      this.addData.brgyId == '' || this.addData.brgyId == null ? true : false;
    this.toValidate.name =
      this.addData.name == '' || this.addData.name == undefined ? true : false;
    if (this.toValidate.brgyId == true || this.toValidate.name == true) {
      Swal.fire('', 'Please fill out the required fields', 'warning');
    } else {
      if (JSON.stringify(this.dummy_addData) != JSON.stringify(this.dummyData) && this.addData.brgyId != undefined) {
        this.addData.setYear = this.setYear;
        this.addData.munCityId = this.munCityId;
        this.addData.menuId = this.menuId;
        this.addData.userId = this.userId;
        console.log("brgylist", this.barangayList);

        const result = this.findBrgyId(this.addData.brgyId);
        this.longtitude = result.longitude;
        this.addData.longtitude = this.longtitude;
        console.log("long", this.longtitude);
        this.latitude = result.latitude;
        this.addData.latitude = this.latitude;
        console.log("lat", this.latitude);

        this.service.AddHousingProject(this.addData).subscribe(request => {
          if (!this.isCheck) {
            this.closebutton.nativeElement.click();
          }
          console.log("add", request);
          this.clearData();
          this.GetData();
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Your work has been saved',
            showConfirmButton: false,
            timer: 1000
          })
        })
      }

      else {
        this.required = true;
        Swal.fire({
          icon: 'warning',
          title: 'Oops...',
          text: 'Missing data!',

        })
      }
    }
  }
  EditData() {
    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: 'Don`t save',
    }).then((result) => {
      if (result.isConfirmed) {

        this.addData.longtitude = this.gmapComponent.markers.lng;
        this.addData.latitude = this.gmapComponent.markers.lat;

        this.addData.setYear = this.setYear;
        this.addData.munCityId = this.munCityId;
        this.addData.menuId = this.menuId;
        this.addData.tag = 1;
        console.log("edit", this.addData);
        this.service.EditHousingProject(this.addData).subscribe(request => {
          console.log("edit", request);
          this.GetData();
        })
        Swal.fire('Saved!', '', 'success')
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }

  DeleteData(dataItem: any) {
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
        this.service.DeleteHousingProject(dataItem.transId).subscribe(request => {
          this.GetData();
        })
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })
  }

  clearData() {
    this.addData = {};
    this.not_visible = false;
    this.visible = true;
    this.required = false;
  }

  editToggle() {
    this.not_visible = true;
    this.visible = false;
  }

}
