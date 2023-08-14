import { AuthService } from 'src/app/services/auth.service';
import { ServicesUtilitiesService } from './../../../../../shared/Infrastructure/Utilities/services-utilities.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';

@Component({
  selector: 'app-water-utility',
  templateUrl: './water-utility.component.html',
  styleUrls: ['./water-utility.component.css'],
})
export class WaterUtilityComponent implements OnInit {
  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;

  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private service: ServicesUtilitiesService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };

  @ViewChild(PdfComponent)
  private pdfComponent!: PdfComponent;

  message = 'Water System Facilities';

  add_service: boolean = true;

  menuId: string = '1';
  munCityName: string = this.auth.munCityName;
  setYear = this.auth.setYear;
  munCityId = this.auth.munCityId;
  toValidate: any = {};
  isCheck: boolean = false;
  visible: boolean = true;
  water: any = {};
  barangays: any = {};
  Services: any = [];

  ngOnInit(): void {
    this.List_services();
    this.list_of_barangay();
  }

  GeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.pdfComponent.data.menuId = this.menuId;

    this.reportService.GetServiceUtilReport(this.pdfComponent.data).subscribe({
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
          margin: [0, 20, 0, 0],
          columns: [
            {
              text: `List of Water Utility Service Providers by Municipality/ City`,
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
            text: 'Name of Operator/ Company',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Service Area	',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Population Served',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Ave. Monthly Consumption/ Remarks',
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
          }
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 8,
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
              colSpan: 8,
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
                alignment: 'center'
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.serviceArea,
                fillColor: '#FFFFFF',
                alignment: 'center'
              },
              {
                text: item.popServed,
                fillColor: '#FFFFFF',
                alignment: 'center'
              },
              {
                text: item.remarks,
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              }
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 8,
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
              colSpan: 8,
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
                alignment: 'center'
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.serviceArea,
                fillColor: '#FFFFFF',
                alignment: 'center'
              },
              {
                text: item.popServed,
                fillColor: '#FFFFFF',
                alignment: 'center'
              },
              {
                text: item.remarks,
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              }
            ]);
          });
        }

        const table = {
          margin: [0, 20, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*', '*', '*', '*'],
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

  public showOverlay = false;
  importMethod() {
    this.showOverlay = true;
    this.service.Import(this.menuId).subscribe({
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

  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
    console.log('isCheck:', this.isCheck);
  }
  list_of_barangay() {
    this.service.ListBarangay().subscribe((data) => {
      this.barangays = <any>data;
      console.log('fgxtxgcvcgcf', this.barangays);
    });
  }

  markerObj: any = {};
  SetMarker(data: any = {}) {
    console.log(data);
    this.markerObj = {
      lat: data.latitude,
      lng: data.longtitude,
      label: data.brgyName.charAt(0),
      brgyName: data.brgyName,
      munCityName: this.munCityName,
      draggable: true,
    };

    this.gmapComponent.setMarker(this.markerObj);
  }

  List_services() {
    this.service
      .List_Services(this.menuId, this.setYear, this.munCityId)
      .subscribe((data) => {
        console.log('Checked_Data', data);
        this.Services = <any>data;
      });
  }

  Add_services() {
    this.toValidate.name =
      this.water.name == '' || this.water.name == null ? true : false;
    this.toValidate.serviceArea =
      this.water.serviceArea == '' || this.water.serviceArea == undefined
        ? true
        : false;
    this.toValidate.brgyId =
      this.water.brgyId == '' || this.water.brgyId == undefined ? true : false;

    if (
      this.toValidate.name == true ||
      this.toValidate.serviceArea == true ||
      this.toValidate.brgyId == true
    ) {
      Swal.fire('', 'Please fill out the required fields', 'warning');
    } else {
      this.water.menuId = this.menuId;
      this.water.setYear = this.setYear;
      this.water.munCityId = this.munCityId;
      this.service.Add_Services(this.water).subscribe((data) => {
        console.log('checke_data', data);
        this.closebutton.nativeElement.click();
        Swal.fire('Good job!', 'Data Added Successfully!', 'success');
        this.List_services();
        this.water = {};
      });
    }
  }

  Update_services() {
    this.water.longtitude = this.gmapComponent.markers.lng;
    this.water.latitude = this.gmapComponent.markers.lat;
    this.service.Update_Services(this.water).subscribe({
      next: (_data) => {
        this.closebutton.nativeElement.click();
        this.List_services();
      },
    });

    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Your work has been updated',
      showConfirmButton: false,
      timer: 1000,
    });
    this.water = {};
  }

  delete(transId: any, index: any) {
    Swal.fire({
      text: 'Do you want to remove this file?',
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!',
    }).then((result) => {
      if (result.value) {
        for (let i = 0; i < this.Services.length; i++) {
          if (this.Services[i].transId == transId) {
            this.Services.splice(i, 1);
            Swal.fire('Deleted', 'Removed successfully', 'success');
          }
        }

        this.service.Delete_Services(transId).subscribe((_data) => {});
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }
}
