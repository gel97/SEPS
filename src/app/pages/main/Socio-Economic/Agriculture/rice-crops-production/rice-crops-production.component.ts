import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AgricultureService } from 'src/app/shared/Socio-Economic/Agriculture/agriculture.service';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';
@Component({
  selector: 'app-rice-crops-production',
  templateUrl: './rice-crops-production.component.html',
  styleUrls: ['./rice-crops-production.component.css'],
})
export class RiceCropsProductionComponent implements OnInit {
  constructor(
    private Auth          : AuthService,
    private Service       : AgricultureService,
    private modifyService : ModifyCityMunService,
    private reportService : ReportsService,
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;

  isCheck: boolean = false;

  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
    console.log('isCheck:', this.isCheck);
  }

  munCityName: string = this.Auth.munCityName;

  message = 'Rice/ Crops Production';

  menuId = '2';
  toValidate: any = {};
  dataList: any = [];
  addData: any = {};
  barangayList: any = [];
  listofCrop: any = [
    { id: `1`, type: `Rice - Irrigated` },
    { id: `2`, type: `Rice - Rainfed` },
    { id: `3`, type: `Corn - White` },
    { id: `4`, type: `Corn - Yellow` },
    { id: `5`, type: `Banana - Bungulan` },
    { id: `6`, type: `Banana - Cavendish` },
    { id: `7`, type: `Banana - Lakatan` },
    { id: `8`, type: `Banana - Latundan` },
    { id: `9`, type: `Banana - Saba/Cardaba` },
    { id: `10`, type: `Coconut` },
    { id: `11`, type: `Mango` },
    { id: `12`, type: `Durian` },
    { id: `13`, type: `Papaya` },
    { id: `14`, type: `Coffee` },
    { id: `15`, type: `Cacao` },
    { id: `16`, type: `Mongo` },
    { id: `17`, type: `Eggplant` },
    { id: `18`, type: `Tomato` },
    { id: `19`, type: `Pechay` },
    { id: `20`, type: `String beans` },
    { id: `21`, type: `Gabi` },
    { id: `22`, type: `Ampalaya` },
    { id: `23`, type: `Onion leeks` },
    { id: `24`, type: `Ube` },
    { id: `25`, type: `Chayote` },
    { id: `26`, type: `Patola` },
    { id: `27`, type: `Pomelo` },
    { id: `28`, type: `Gourd` },
    { id: `29`, type: `Raddish` },
    { id: `30`, type: `Rubber` },
    { id: `31`, type: `Okra` },
    { id: `32`, type: `Cucumber` },
    { id: `33`, type: `Abaca` },
    { id: `34`, type: `Squash fruit` },
    { id: `35`, type: `Camote` },
    { id: `36`, type: `Falcata` },
    { id: `37`, type: `Ginger` },
    { id: `38`, type: `Cassava` },
    { id: `39`, type: `Lanzones` },
    { id: `40`, type: `Pepper` },
    { id: `41`, type: `Other Vegetables` },
  ];

  listofWater: any = [
    { id: `1`, type: `Irrigated` },
    { id: `2`, type: `Rain-fed` },
  ];
  listofLand: any = [
    { id: `1`, type: `Owned` },
    { id: `2`, type: `Rented` },
    { id: `3`, type: `Sharecropping Tenant` },
    { id: `4`, type: `Informal Tenant` },
  ];
  visible: boolean = true;
  not_visible: boolean = true;
  dummy_addData: any = {};
  dummyData: any = {};

  required: boolean = true;
  latitude: any;
  longtitude: any;

  setYear = this.Auth.activeSetYear;
  munCityId = this.Auth.munCityId;

  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };

  markerObj: any = {};

  SetMarker(data: any = {}) {
    console.log('lnglat: ', data.longtitude + ' , ' + data.latitude);

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
      draggable: true,
    };
    this.gmapComponent.setMarker(this.markerObj);
    console.log('marker', this.markerObj);
  }

  ImportExcel(e: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, submit it!'
    }).then((result) => {
      console.log(result)
      if (result.isConfirmed) {
        this.reportService
        .PostImportWithMenuId(
          e.target.files[0],
          this.Auth.setYear,
          this.Auth.munCityId,
          'Agriculture',
          "2"
        )
        .subscribe((success) => {
          Swal.fire({
            title: 'Importing Data',
            html: 'Please wait for a moment.',
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
              setTimeout(() => {
                if (success) {
                  this.GetListAgriculture();
                  Swal.close();
                  Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'File imported successfully',
                    showConfirmButton: true,
                  });
                } else {
                  Swal.close();
                  Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Something went wrong. possible invalid file',
                    showConfirmButton: true,
                  });
                }
              }, 5000);
            },
          });
        });
      }
      else{
      }
    })

  }

  public showOverlay = false;
  importMethod() {
    this.showOverlay = true;
    this.Service.Import(this.menuId).subscribe({
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

  ngOnInit(): void {
    this.GetListAgriculture();
    this.GetBarangayList();
  }

  GetListAgriculture() {
    this.Service.GetListAgriculture(
      this.menuId,
      this.setYear,
      this.munCityId
    ).subscribe((response) => {
      this.dataList = <any>response;
      console.log('check', response);
    });
  }

  GetBarangayList() {
    this.Service.GetBarangayList(this.munCityId).subscribe((response) => {
      this.barangayList = <any>response;
      console.log('barangay', response);
    });
  }

  findBrgyId(brgyId: any) {
    return this.barangayList.find(
      (item: { brgyId: any }) => item.brgyId === brgyId
    );
  }

  AddAgriculture() {
    this.toValidate.brgyId =
      this.addData.brgyId == '' || this.addData.brgyId == null ? true : false;
    this.toValidate.type =
      this.addData.type == '' || this.addData.type == undefined ? true : false;
    this.toValidate.source =
      this.addData.source == '' || this.addData.source == undefined
        ? true
        : false;
    this.toValidate.ownershipType =
      this.addData.ownershipType == '' || this.addData.ownershipType == null
        ? true
        : false;
    this.toValidate.totalProd =
      this.addData.totalProd == '' || this.addData.totalProd == undefined
        ? true
        : false;
    this.toValidate.area =
      this.addData.area == '' || this.addData.area == undefined ? true : false;
    this.toValidate.name =
      this.addData.name == '' || this.addData.name == undefined ? true : false;

    if (
      this.toValidate.brgyId == true ||
      this.toValidate.type == true ||
      this.toValidate.source == true ||
      this.toValidate.ownershipType == true ||
      this.toValidate.totalProd == true ||
      this.toValidate.area == true ||
      this.toValidate.area == true
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.dummy_addData = this.addData;
      if (
        JSON.stringify(this.dummy_addData) != JSON.stringify(this.dummyData) &&
        this.addData.brgyId != undefined
      ) {
        this.addData.setYear = this.setYear;
        this.addData.munCityId = this.munCityId;
        this.addData.menuId = this.menuId;

        const result = this.findBrgyId(this.addData.brgyId);
        this.longtitude = result.longitude;
        this.addData.longtitude = this.longtitude;
        console.log('long', this.longtitude);
        this.latitude = result.latitude;
        this.addData.latitude = this.latitude;
        console.log('lat', this.latitude);

        this.Service.AddAgriculture(this.addData).subscribe((request) => {
          if (!this.isCheck) {
            this.closebutton.nativeElement.click();
          }

          console.log('add', request);
          this.GetListAgriculture();
          Swal.fire('Good job!', 'Data Added Successfully!', 'success');
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

  clearData() {
    this.addData = {};
    this.not_visible = false;
    this.visible = true;
    this.required = false;
  }

  parentMethod() {
    // alert('parent Method');
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
    this.toValidate.brgyId =
      this.addData.brgyId == '' || this.addData.brgyId == null ? true : false;
    this.toValidate.type =
      this.addData.type == '' || this.addData.type == undefined ? true : false;
    this.toValidate.source =
      this.addData.source == '' || this.addData.source == undefined
        ? true
        : false;
    this.toValidate.ownershipType =
      this.addData.ownershipType == '' || this.addData.ownershipType == null
        ? true
        : false;
    this.toValidate.totalProd =
      this.addData.totalProd == '' || this.addData.totalProd == undefined
        ? true
        : false;
    this.toValidate.area =
      this.addData.area == '' || this.addData.area == undefined ? true : false;
    this.toValidate.name =
      this.addData.name == '' || this.addData.name == undefined ? true : false;

    if (
      this.toValidate.brgyId == true ||
      this.toValidate.type == true ||
      this.toValidate.source == true ||
      this.toValidate.ownershipType == true ||
      this.toValidate.totalProd == true ||
      this.toValidate.area == true ||
      this.toValidate.area == true
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
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
          this.closebutton.nativeElement.click();
          this.addData.munCityId = this.munCityId;
          this.addData.menuId = this.menuId;
          this.addData.tag = 1;
          console.log('edit', this.addData);
          this.Service.EditAgriculture(this.addData).subscribe((request) => {
            console.log('edit', request);
            this.GetListAgriculture();
            this.clearData();
          });
          Swal.fire('Saved!', '', 'success');
          document.getElementById('exampleModal')?.click();
        } else if (result.isDenied) {
          Swal.fire('Changes are not saved', '', 'info');
        }
      });
    }
  }

  DeleteAgriculture(dataItem: any) {
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
        this.Service.DeleteAgriculture(dataItem.transId).subscribe(
          (request) => {
            this.GetListAgriculture();
          }
        );
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  }
}
