import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AgricultureService } from 'src/app/shared/Socio-Economic/Agriculture/agriculture.service';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';

@Component({
  selector: 'app-fisheries-aquaculture',
  templateUrl: './fisheries-aquaculture.component.html',
  styleUrls: ['./fisheries-aquaculture.component.css']
})
export class FisheriesAquacultureComponent implements OnInit {

  constructor(private Auth: AuthService, private Service: AgricultureService) { }

  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;

  isCheck: boolean = false;

  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
    console.log("isCheck:", this.isCheck);
  }

  munCityName: string = this.Auth.munCityName;

  menuId = "3";
  toValidate:any={};
  dataList: any = [];
  addData: any = {};
  barangayList: any = [];
  listofHarvest: any = [{ id: `1`, type: `Bangus` }, { id: `2`, type: `Tilapia` }, { id: `3`, type: `Shrimp` },
                        { id: `4`, type: `Crabs` }, { id: `5`, type: `Cream Dory` }, { id: `6`, type: `Hito` }, { id: `7`, type: `Others` }];
  listofFishing: any = [{ id: `1`, type: `` }, { id: `2`, type: `` }, { id: `3`, type: `` }];
  visible: boolean = true;
  not_visible: boolean = true;
  dummy_addData: any = {};
  dummyData: any = {};

  required: boolean = true;
  latitude: any
  longtitude: any


  setYear = this.Auth.activeSetYear;
  munCityId = this.Auth.munCityId;

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
    this.GetListAgriculture();
    this.GetBarangayList();
  }

  GetListAgriculture() {
    this.Service.GetListAgriculture(this.menuId, this.setYear, this.munCityId).subscribe(response => {
      this.dataList = (<any>response);
      console.log("check", response);
    })
  }

  GetBarangayList() {
    this.Service.GetBarangayList(this.munCityId).subscribe(response => {
      this.barangayList = (<any>response);
      console.log("barangay", response);
    })

  }

  findBrgyId(brgyId: any) {
    return this.barangayList.find((item: { brgyId: any; }) => item.brgyId === brgyId);
  }

  AddAgriculture() {
    this.toValidate.brgyId = this.addData.brgyId == "" || this.addData.brgyId == null ? true : false;
    this.toValidate.name = this.addData.name== "" || this.addData.name == undefined ? true : false;

    if (this.toValidate.brgyId  == true || this.toValidate.votingCntrNo == true) {
      Swal.fire(
        '',
        'Please fill out the required fields',
        'warning'
      );
    } else {
    this.dummy_addData = this.addData;
    if (JSON.stringify(this.dummy_addData) != JSON.stringify(this.dummyData) && this.addData.brgyId != undefined) {

      this.addData.setYear = this.setYear;
      this.addData.munCityId = this.munCityId;
      this.addData.menuId = this.menuId;

      const result = this.findBrgyId(this.addData.brgyId);
      this.longtitude = result.longitude;
      this.addData.longtitude = this.longtitude;
      console.log("long", this.longtitude);
      this.latitude = result.latitude;
      this.addData.latitude = this.latitude;
      console.log("lat", this.latitude);

      this.Service.AddAgriculture(this.addData).subscribe(request => {

        if (!this.isCheck) {
          this.closebutton.nativeElement.click();
        }

        console.log("add", request);
        this.GetListAgriculture();
        Swal.fire(
          'Good job!',
          'Data Added Successfully!',
          'success'
        );
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

  EditAgriculture() {
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
        this.Service.EditAgriculture(this.addData).subscribe(request => {
          console.log("edit", request);
          this.GetListAgriculture();


        })
        Swal.fire('Saved!', '', 'success')
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }

  DeleteAgriculture(dataItem: any) {
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
        this.Service.DeleteAgriculture(dataItem.transId).subscribe(request => {
          this.GetListAgriculture();
        })
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })
  }

}
