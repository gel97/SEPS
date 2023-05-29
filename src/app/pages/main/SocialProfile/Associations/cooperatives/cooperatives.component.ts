import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { AssociationService } from 'src/app/shared/SocialProfile/Association/association.service';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';

@Component({
  selector: 'app-cooperatives',
  templateUrl: './cooperatives.component.html',
  styleUrls: ['./cooperatives.component.css']
})

export class CooperativesComponent implements OnInit {

  constructor(private Auth: AuthService, private Service: AssociationService,
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
  menuId = "5";
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
  updateForm:boolean=false;

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
    this.GetAssociation();
    this.ListOfBarangay();
  }



  GetAssociation() {
    this.Service.GetAssociation(this.menuId, this.setYear, this.munCityId).subscribe(response => {

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

  findBrgyId(brgyId: any) {
    return this.barangayList.find((item: { brgyId: any; }) => item.brgyId === brgyId);
  }


  AddAssociation() {
    this.toValidate.brgyId = this.addData.brgyId == "" || this.addData.brgyId == null ? true : false;
    this.toValidate.name = this.addData.name == "" || this.addData.name == undefined ? true : false;

    // this.toValidate.status = this.comm.status =="" || this.comm.status == undefined?true:false;



    if (this.toValidate.brgyId == true || this.toValidate.name == true) {
      Swal.fire(
        '',
        'Please fill out the required fields',
        'warning'
      );
    } else {

      this.addData.setYear = this.setYear;
      this.addData.munCityId = this.munCityId;
      this.addData.menuId = this.menuId;
      console.log("brgylist", this.barangayList);

      const result = this.findBrgyId(this.addData.brgyId);
      this.longtitude = result.longitude;
      this.addData.longtitude = this.longtitude;
      console.log("long", this.longtitude);
      this.latitude = result.latitude;
      this.addData.latitude = this.latitude;
      console.log("lat", this.latitude);
      this.Service.AddAssociation(this.addData).subscribe(request => {
        if (!this.isCheck) {
          this.closebutton.nativeElement.click();
        }
        console.log(request);
        Swal.fire(
          'Good job!',
          'Data Added Successfully!',
          'success'
        );

        this.addData = {};
        this.dataList.push(request);
      },);
    }
  }

  EditAssociation() {
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
        this.Service.EditAssociation(this.addData).subscribe(request => {
          console.log("edit", request);
          this.GetAssociation();
        })
        Swal.fire('Saved!', '', 'success')
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }

  DeleteAssociation(dataItem: any) {
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
        this.Service.DeleteAssociation(dataItem.transId).subscribe(request => {
          this.GetAssociation();
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

