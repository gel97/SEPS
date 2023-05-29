import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HealthHospitalService } from 'src/app/shared/SocialProfile/Health/healthHospital.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { response } from 'express';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
@Component({
  selector: 'app-provincial-hospital',
  templateUrl: './provincial-hospital.component.html',
  styleUrls: ['./provincial-hospital.component.css']
})
export class ProvincialHospitalComponent implements OnInit {

  constructor(private Auth: AuthService, private Service: HealthHospitalService,
    private modifyService: ModifyCityMunService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;

  isCheck: boolean = false;

  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
    console.log("isCheck:", this.isCheck);
  }

  munCityName: string = this.Auth.munCityName;
  menuId = "1";
  dataList: any = [];
  setYear = this.Auth.activeSetYear;
  munCityId = this.Auth.munCityId;
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
      brgyName: data.name,
      label: data.name.charAt(0),
      munCityName: null,
      draggable: true
    };
    this.gmapComponent.setMarker(this.markerObj);
    console.log("marker", this.markerObj);
  }


  ngOnInit(): void {
    this.GetHealthHospital();
    this.ListOfBarangay();
  }

  GetHealthHospital() {
    this.Service.GetHealtHospital(this.setYear).subscribe(response => {
      this.dataList = (<any>response);
      console.log("check", response);
    })
  }


  ListOfBarangay() {
    this.Service.ListOfBarangay(this.munCityId).subscribe(response => {
      this.barangayList = (<any>response);
      console.log("barangay", response);
    })

  }



  AddHealthHospital() {

    this.toValidate.name = this.addData.name == "" || this.addData.name == undefined ? true : false;
    this.toValidate.remarks = this.addData.remarks == "" || this.addData.remarks == undefined ? true : false;
    console.log("trap", this.addData);

    this.dummy_addData = this.addData;
    console.log("trap_2", this.dummy_addData);
    if (!this.toValidate.name || !this.toValidate.remarks) {
      this.addData.setYear = this.setYear;
      this.addData.munCityId = this.munCityId;
      this.addData.menuId = this.menuId;
      console.log("brgylist", this.barangayList);
      this.longtitude;
      this.addData.longtitude = this.longtitude;
      console.log("long", this.longtitude);
      this.latitude;
      this.addData.latitude = this.latitude;
      console.log("lat", this.latitude);

      this.Service.AddHealthHospital(this.addData).subscribe(request => {
        if (!this.isCheck) {
          this.closebutton.nativeElement.click();
        }
        console.log("add", request);
        this.clearData();
        this.GetHealthHospital();
        Swal.fire(
          'Good job!',
          'Data Added Successfully!',
          'success'
          );
      })
    }
    else {
      this.required = true;
      Swal.fire('Missing Data!', 'Please fill out the required fields', 'warning');
    }
  }

  EditHealthHospital() {
    this.toValidate.remarks = this.addData.remarks == '' || this.addData.remarks == null ? true : false;
  this.toValidate.name =  this.addData.name == '' || this.addData.name == undefined ? true : false;

  if (this.toValidate.remarks == true || this.toValidate.name == true) {
    Swal.fire('Missing Data!', 'Please fill out the required fields', 'warning');
  } else {
    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

        this.addData.longtitude = this.gmapComponent.markers.lng;
        this.addData.latitude = this.gmapComponent.markers.lat;

        this.addData.setYear = this.setYear;
        this.addData.munCityId = this.munCityId;
        this.addData.menuId = this.menuId;
        this.addData.tag = 1;
        console.log("edit", this.addData);
        this.Service.EditHealthHospital(this.addData).subscribe(request => {
          console.log("edit", request);
          this.GetHealthHospital();
        })
        Swal.fire('Saved!', '', 'success')
        document.getElementById("exampleModal")?.click();
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }
}

  DeleteHealthHospital(dataItem: any) {
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
        this.Service.DeleteHealtHospital(dataItem.transId).subscribe(request => {
          this.GetHealthHospital();
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
