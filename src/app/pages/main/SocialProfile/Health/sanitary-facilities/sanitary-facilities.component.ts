import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HealthSanitaryService } from 'src/app/shared/SocialProfile/Health/healthSanitary.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sanitary-facilities',
  templateUrl: './sanitary-facilities.component.html',
  styleUrls: ['./sanitary-facilities.component.css'],
})
export class SanitaryFacilitiesComponent implements OnInit {
  constructor(
    private Auth: AuthService,
    private Service: HealthSanitaryService
  ) {}

  isCheck: boolean = false;

  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
    console.log('isCheck:', this.isCheck);
  }

  munCityName: string = this.Auth.munCityName;
  dataList: any = [];
  setYear = this.Auth.activeSetYear;
  munCityId = this.Auth.munCityId;
  barangayList: any = [];
  addData: any = {};
  dummy_addData = 'string';
  dummyData: any = {};
  visible: boolean = true;
  not_visible: boolean = true;
  //required == not_visible
  required: boolean = true;
  latitude: any;
  longtitude: any;
  checker_brgylist: any = {};
  toValidate: any = {};
  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };
  
  ngOnInit(): void {
    this.GetHealthSanitary();
    this.GetBarangayList();
  }

  GetHealthSanitary() {
    this.Service.GetHealthSanitary(this.setYear, this.munCityId).subscribe(
      (response) => {
        this.dataList = <any>response;
        console.log('check', response);
      }
    );
  }

  GetBarangayList() {
    this.Service.ListOfBarangay(this.munCityId).subscribe((response) => {
      this.barangayList = <any>response;
      console.log('barangay', response);
    });
  }

  findBrgyId(brgyId: any) {
    return this.barangayList.find(
      (item: { brgyId: any }) => item.brgyId === brgyId
    );
  }

  AddHealthSanitary() {
    console.log('trap', this.addData);
    console.log('brgyid', this.addData.brgyId);
    this.dummy_addData = this.addData;
    console.log('trap_2', this.dummy_addData);
    this.toValidate.brgyId =
      this.addData.brgyId == '' || this.addData.brgyId == null ? true : false;

    if (this.toValidate.brgyId == true) {
      Swal.fire('', 'Please fill out the required fields', 'warning');
    } else {
      if (
        JSON.stringify(this.dummy_addData) != JSON.stringify(this.dummyData) &&
        this.addData.brgyId != undefined
      ) {
        this.addData.setYear = this.setYear;
        this.addData.munCityId = this.munCityId;
        console.log('brgylist', this.barangayList);

        const result = this.findBrgyId(this.addData.brgyId);
        this.longtitude = result.longitude;
        this.addData.longtitude = this.longtitude;
        console.log('long', this.longtitude);
        this.latitude = result.latitude;
        this.addData.latitude = this.latitude;
        console.log('lat', this.latitude);

        this.Service.AddHealthSanitary(this.addData).subscribe((request) => {
          if (!this.isCheck) {
            this.closebutton.nativeElement.click();
          }
          console.log('add', request);
          this.clearData();
          this.GetHealthSanitary();
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Your work has been saved',
            showConfirmButton: false,
            timer: 1500,
          });
        });
      } else {
        this.required = true;
        Swal.fire({
          icon: 'warning',
          title: 'Oops...',
          text: 'Missing data!',
        });
      }
    }
  }

  EditHealthSanitary() {
    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.addData.setYear = this.setYear;
        this.addData.munCityId = this.munCityId;
        this.addData.tag = 1;
        console.log('edit', this.addData);
        this.Service.EditHealthSanitary(this.addData).subscribe((request) => {
          console.log('edit', request);
          this.GetHealthSanitary();
        });
        Swal.fire('Saved!', '', 'success');
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  }
  DeleteHealthSanitary(dataItem: any) {
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
        this.Service.DeleteHealthSanitary(dataItem.transId).subscribe(
          (request) => {}
        );
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
        this.ngOnInit();
      }
    });
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
