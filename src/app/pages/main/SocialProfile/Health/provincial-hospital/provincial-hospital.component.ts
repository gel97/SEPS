import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HealthHospitalService } from 'src/app/shared/SocialProfile/Health/healthHospital.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { response } from 'express';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';

@Component({
  selector: 'app-provincial-hospital',
  templateUrl: './provincial-hospital.component.html',
  styleUrls: ['./provincial-hospital.component.css'],
})
export class ProvincialHospitalComponent implements OnInit {
  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private Auth: AuthService,
    private Service: HealthHospitalService,
    private modifyService: ModifyCityMunService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;

  @ViewChild(PdfComponent)
  private pdfComponent!: PdfComponent;

  isCheck: boolean = false;

  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
    console.log('isCheck:', this.isCheck);
  }

  munCityName: string = this.Auth.munCityName;
  menuId = '1';
  dataList: any = [];
  setYear = this.Auth.setYear;
  munCityId = this.Auth.munCityId;
  barangayList: any = [];
  addData: any = {};
  dummy_addData: any = {};
  dummyData: any = {};
  visible: boolean = true;
  not_visible: boolean = true;
  //required == not_visible
  required: boolean = true;
  latitude: any;
  longtitude: any;
  checker_brgylist: any = {};
  toValidate: any = {};
  isAdd:boolean = true;

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
      brgyName: data.name,
      label: data.name.charAt(0),
      munCityName: null,
      draggable: true,
    };
    this.gmapComponent.setMarker(this.markerObj);
    console.log('marker', this.markerObj);
  }

  ngOnInit(): void {
    this.GetHealthHospital();
    this.ListOfBarangay();
  }
  public showOverlay = false;
  message = 'Hospital';
  importMethod() {
    this.showOverlay = true;
    this.Service.Import().subscribe({
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
  GeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];

    this.reportService
      .GetHealthHospitalReport(this.pdfComponent.data)
      .subscribe({
        next: (response: any = {}) => {
          reports = response;
          console.log('result: ', response);

          data.push({
            margin: [0, 40, 0, 0],
            columns: [
              {
                text: `List of Provincial Hospitals`,
                fontSize: 14,
                bold: true,
              },
              {
                text: `Year: ${response[0].setYear}`,
                fontSize: 14,
                bold: true,
                alignment: 'right',
              },
            ],
          });

          tableData.push([
            {
              text: '#',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Name',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Bed Capacity',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Occupancy Rate',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Contact Person/Designation',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Contact Numbers',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Location',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            }
          ]);

          reports.forEach((item:any , index:any) => {
                 tableData.push([
                {
                  text: index + 1,
                  fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
                  marginLeft: 5,
                },
                {
                  text: item.name,
                  fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
                },
                {
                  text: item.capacity,
                  fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
                  alignment: 'center',
                },
                {
                  text: item.rate,
                  fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
                  alignment: 'center',
                },
                {
                  text: item.contactPerson,
                  fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
                },
                {
                  text: item.contactNo,
                  fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
                  alignment: 'center',
                },
                {
                  text: item.location,
                  fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
                }
              ]);
          });

          // for (const groupKey1 in dist1Group) {
          //   // Iterate district I data
          //   const group1 = dist1Group[groupKey1];
          //   const [cityName1] = groupKey1.split('-');
          //   tableData.push([
          //     {
          //       text: cityName1,
          //       colSpan: 10,
          //       alignment: 'left',
          //       fillColor: '#9DB2BF',
          //       marginLeft: 5,
          //     },
          //   ]);

          //   group1.forEach((item: any, index: any) => {
          //     let typeName:any;
          //     let catName:any;
          //     this.list_of_type.forEach((m:any) => {
          //       if(m.id == item.type){
          //         typeName = m.type_hosp;
          //       }
          //     });
          //     this.hospital_category.forEach((n:any) => {
          //       if(n.id == item.category){
          //         catName = n.name_category;
          //       }
          //     });
          //     tableData.push([
          //       {
          //         text: index + 1,
          //         fillColor: '#FFFFFF',
          //         marginLeft: 5,
          //       },
          //       {
          //         text: item.name,
          //         fillColor: '#FFFFFF',
          //       },
          //       {
          //         text: catName,
          //         fillColor: '#FFFFFF',
          //       },
          //       {
          //         text: typeName,
          //         fillColor: '#FFFFFF',
          //       },
          //       {
          //         text: item.capacity,
          //         fillColor: '#FFFFFF',
          //       },
          //       {
          //         text: item.location,
          //         fillColor: '#FFFFFF',
          //       },
          //       {
          //         text: item.brgyName,
          //         fillColor: '#FFFFFF',
          //       },
          //       {
          //         text: item.description,
          //         fillColor: '#FFFFFF',
          //       },
          //       {
          //         text: item.contactPerson,
          //         fillColor: '#FFFFFF',
          //       },
          //       {
          //         text: item.contactNo,
          //         fillColor: '#FFFFFF',
          //       },
          //     ]);
          //   });
          // }
          
          const table = {
            margin: [0, 20, 0, 0],
            table: {
              widths: [25, '*', '*', '*', '*', '*', '*'],
              body: tableData,
            },
            layout: 'lightHorizontalLines',
          };

          data.push(table);
        },
        error: (error: any) => {
          console.log(error);
        },
        complete: () => {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait);
          console.log(data);
        },
      });
  }

  GetHealthHospital() {
    this.Service.GetHealtHospital(this.setYear).subscribe((response) => {
      this.dataList = <any>response;
      console.log('check', response);
    });
  }

  ListOfBarangay() {
    this.Service.ListOfBarangay(this.munCityId).subscribe((response) => {
      this.barangayList = <any>response;
      console.log('barangay', response);
    });
  }

  AddHealthHospital() {
    this.toValidate.name =
      this.addData.name == '' || this.addData.name == undefined ? true : false;
    this.toValidate.remarks =
      this.addData.remarks == '' || this.addData.remarks == undefined
        ? true
        : false;
    console.log('trap', this.addData);

    this.dummy_addData = this.addData;
    console.log('trap_2', this.dummy_addData);
    if (!this.toValidate.name || !this.toValidate.remarks) {
      this.addData.setYear = this.setYear;
      this.addData.munCityId = this.munCityId;
      this.addData.menuId = this.menuId;
      console.log('brgylist', this.barangayList);
      this.longtitude;
      this.addData.longtitude = this.longtitude;
      console.log('long', this.longtitude);
      this.latitude;
      this.addData.latitude = this.latitude;
      console.log('lat', this.latitude);

      this.Service.AddHealthHospital(this.addData).subscribe((request) => {
        if (!this.isCheck) {
          this.closebutton.nativeElement.click();
        }
        console.log('add', request);
        this.clearData();
        this.GetHealthHospital();
        Swal.fire('Good job!', 'Data Added Successfully!', 'success');
      });
    } else {
      this.required = true;
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    }
  }

  EditHealthHospital() {
    this.toValidate.remarks =
      this.addData.remarks == '' || this.addData.remarks == null ? true : false;
    this.toValidate.name =
      this.addData.name == '' || this.addData.name == undefined ? true : false;

    if (this.toValidate.remarks == true || this.toValidate.name == true) {
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
          this.addData.munCityId = this.munCityId;
          this.addData.menuId = this.menuId;
          this.addData.tag = 1;
          console.log('edit', this.addData);
          this.Service.EditHealthHospital(this.addData).subscribe((request) => {
            console.log('edit', request);
            this.GetHealthHospital();
          });
          Swal.fire('Saved!', '', 'success');
          document.getElementById('exampleModal')?.click();
        } else if (result.isDenied) {
          Swal.fire('Changes are not saved', '', 'info');
        }
      });
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
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.Service.DeleteHealtHospital(dataItem.transId).subscribe(
          (request) => {
            this.GetHealthHospital();
          }
        );
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
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
