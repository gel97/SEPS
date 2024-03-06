import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HealthFacilitiesService } from 'src/app/shared/SocialProfile/Health/healthFacilities.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';

@Component({
  selector: 'app-barangay-health',
  templateUrl: './barangay-health.component.html',
  styleUrls: ['./barangay-health.component.css'],
})
export class BarangayHealthComponent implements OnInit {
  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private Auth: AuthService,
    private Service: HealthFacilitiesService,
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
  menuId = '3';
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
      label: data.brgyName.charAt(0),
      brgyName: data.brgyName,
      munCityName: this.munCityName,
      draggable: true,
    };
    this.gmapComponent.setMarker(this.markerObj);
    console.log('marker', this.markerObj);
  }

  ngOnInit(): void {
    this.GetHealthFacilities();
    this.GetBarangayList();
  }

  public showOverlay = false;
  message = 'Hospital';
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

  GeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];
    this.pdfComponent.data.menuId = this.menuId;

    this.reportService
      .GetHealthFacilityReport(this.pdfComponent.data)
      .subscribe({
        next: (response: any = {}) => {
          reports = response;
          console.log('result: ', response);

          reports.forEach((a: any) => {
            if (a.district === 1) {
              dist1.push(a);
            } else {
              dist2.push(a);
            }
          });

          data.push({
            margin: [0, 40, 0, 0],
            columns: [
              {
                text: `List of Barangay Health Stations by Municipality/City`,
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

          const dist1Group = dist1.reduce((groups: any, item: any) => {
            const { munCityName } = item;
            const groupKey = `${munCityName}`;
            if (!groups[groupKey]) {
              groups[groupKey] = [];
            }
            groups[groupKey].push(item);
            return groups;
          }, {});

          console.log('dist1Group ', dist1Group);

          const dist2Group = dist2.reduce((groups: any, item: any) => {
            const { munCityName } = item;
            const groupKey = `${munCityName}`;
            if (!groups[groupKey]) {
              groups[groupKey] = [];
            }
            groups[groupKey].push(item);
            return groups;
          }, {});

          console.log('dist2Group ', dist2);

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
              text: 'Location',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Barangay',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Remarks',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Contact Person/ Designation',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Contact Details',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
          ]);

          tableData.push([
            {
              text: `1st Congressional District `,
              colSpan: 7,
              alignment: 'left',
              fillColor: '#526D82',
              marginLeft: 5,
            },
          ]);

          for (const groupKey1 in dist1Group) {
            // Iterate district I data
            const group1 = dist1Group[groupKey1];
            const [cityName1] = groupKey1.split('-');
            tableData.push([
              {
                text: cityName1,
                colSpan: 7,
                alignment: 'left',
                fillColor: '#9DB2BF',
                marginLeft: 5,
              },
            ]);

            group1.forEach((item: any, index: any) => {
              tableData.push([
                {
                  text: index + 1,
                  fillColor: '#FFFFFF',
                  marginLeft: 5,
                },
                {
                  text: item.name,
                  fillColor: '#FFFFFF',
                },
                {
                  text: item.location,
                  fillColor: '#FFFFFF',
                },
                {
                  text: item.brgyName,
                  fillColor: '#FFFFFF',
                },
                {
                  text: item.description,
                  fillColor: '#FFFFFF',
                },
                {
                  text: item.contactPerson,
                  fillColor: '#FFFFFF',
                },
                {
                  text: item.contactNo,
                  fillColor: '#FFFFFF',
                },
              ]);
            });
          }

          tableData.push([
            {
              text: `2nd Congressional District `,
              colSpan: 7,
              alignment: 'left',
              fillColor: '#526D82',
              marginLeft: 5,
            },
          ]);

          for (const groupKey2 in dist2Group) {
            // Iterate district II data
            const group2 = dist2Group[groupKey2];
            const [cityName2] = groupKey2.split('-');
            tableData.push([
              {
                text: cityName2,
                colSpan: 7,
                alignment: 'left',
                fillColor: '#9DB2BF',
                marginLeft: 5,
              },
            ]);

            group2.forEach((item: any, index: any) => {
              tableData.push([
                {
                  text: index + 1,
                  fillColor: '#FFFFFF',
                  marginLeft: 5,
                },
                {
                  text: item.name,
                  fillColor: '#FFFFFF',
                },
                {
                  text: item.location,
                  fillColor: '#FFFFFF',
                },
                {
                  text: item.brgyName,
                  fillColor: '#FFFFFF',
                },
                {
                  text: item.description,
                  fillColor: '#FFFFFF',
                },
                {
                  text: item.contactPerson,
                  fillColor: '#FFFFFF',
                },
                {
                  text: item.contactNo,
                  fillColor: '#FFFFFF',
                },
              ]);
            });
          }

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
          this.pdfService.GeneratePdf(data, isPortrait, "");
          console.log(data);
        },
      });
  }

  GetHealthFacilities() {
    this.Service.GetHealthFacilities(
      this.menuId,
      this.setYear,
      this.munCityId
    ).subscribe((response) => {
      this.dataList = <any>response;
      console.log('check', response);
    });
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

  AddHealthFacilities() {
    console.log('trap', this.addData);
    console.log('brgyid', this.addData.brgyId);
    this.dummy_addData = this.addData;
    console.log('trap_2', this.dummy_addData);
    this.toValidate.brgyId =
      this.addData.brgyId == '' || this.addData.brgyId == null ? true : false;
    this.toValidate.name =
      this.addData.name == '' || this.addData.name == undefined ? true : false;
    if (this.toValidate.brgyId == true || this.toValidate.name == true) {
      Swal.fire('Missing Data!', 'Please fill out the required fields', 'warning');
    } else {
      if (
        JSON.stringify(this.dummy_addData) != JSON.stringify(this.dummyData) &&
        this.addData.brgyId != undefined
      ) {
        this.addData.setYear = this.setYear;
        this.addData.munCityId = this.munCityId;
        this.addData.menuId = this.menuId;
        console.log('brgylist', this.barangayList);

        const result = this.findBrgyId(this.addData.brgyId);
        this.longtitude = result.longitude;
        this.addData.longtitude = this.longtitude;
        console.log('long', this.longtitude);
        this.latitude = result.latitude;
        this.addData.latitude = this.latitude;
        console.log('lat', this.latitude);

        this.Service.AddHealthFacilities(this.addData).subscribe((request) => {
          if (!this.isCheck) {
            this.closebutton.nativeElement.click();
          }
          console.log('add', request);
          this.clearData();
          this.GetHealthFacilities();
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

  EditHealthFacilities() {
    this.toValidate.brgyId=this.addData.brgyId == '' || this.addData.brgyId == null ? true : false;
  this.toValidate.name = this.addData.name == '' || this.addData.name == undefined ? true : false;
  if (this.toValidate.brgyId == true || this.toValidate.name == true) {
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
        console.log('edit', this.addData);
        this.Service.EditHealthFacilities(this.addData).subscribe((request) => {
          console.log('edit', request);
          this.GetHealthFacilities();
        });
        Swal.fire('Saved!', '', 'success');
        document.getElementById("exampleModal")?.click();

      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  }
}
  DeleteHealthFacilities(dataItem: any) {
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
        this.Service.DeleteHealthFacilities(dataItem.transId).subscribe(
          (request) => {this.ngOnInit();}
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
