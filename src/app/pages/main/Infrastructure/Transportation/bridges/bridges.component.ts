import { Component, OnInit, ViewChild } from '@angular/core';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { AuthService } from 'src/app/services/auth.service';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { TrasportationService } from 'src/app/shared/Trasportation/trasportation.service';
import Swal from 'sweetalert2';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';

@Component({
  selector: 'app-bridges',
  templateUrl: './bridges.component.html',
  styleUrls: ['./bridges.component.css'],
})
export class BridgesComponent implements OnInit {
  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;

  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private service: TrasportationService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService
  ) {}

  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };

  @ViewChild(PdfComponent)
  private pdfComponent!: PdfComponent;

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  message = 'Bridges';

  parentMethod() {
    // alert('parent Method');
    this.isNew = true;
  }
  public showOverlay = false;
  importMethod() {
    this.showOverlay = true;
    this.service.post_import_transpo_bridge().subscribe({
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
  munCityName: string = this.auth.munCityName;
  toValidate: any = {};
  TranspoBridgeList: any = [];
  BridgeList: any = {};
  BarangayList: any = [];
  isNew: boolean = true;

  ngOnInit(): void {
    this.getListTranspoBridge();
  }
  munCityId: string = this.auth.munCityId;
  setYear: string = this.auth.setYear;

  GeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.reportService.GetTranspoBridgesReport(this.pdfComponent.data).subscribe({
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
              text: `List of Bridges by Municipality/City`,
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
            text: 'Length/ Pavement',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Condition/ Remarks',
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

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 5,
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
              colSpan: 5,
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
                text: item.pavement,
                fillColor: '#FFFFFF',
                alignment: 'center'
              },
              {
                text: item.condition,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              }
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 5,
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
              colSpan: 5,
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
                text: item.pavement,
                fillColor: '#FFFFFF',
                alignment: 'center'
              },
              {
                text: item.condition,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              }
            ]);
          });
        }

        const table = {
          margin: [0, 20, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*'],
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
  markerObj: any = {};

  SetMarker(data: any = {}) {
    console.log('lnglat: ', data.longtitude + ' , ' + data.latitude);

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

  getListTranspoBridge() {
    this.service.get_list_barangay().subscribe((data) => {
      this.BarangayList = <any>data;
    });

    this.service.get_list_transpo_bridge().subscribe((data) => {
      this.TranspoBridgeList = <any>data;
    });
  }

  saveBridgeList() {
    this.toValidate.name =
      this.BridgeList.name == '' || this.BridgeList.name == undefined
        ? true
        : false;
    this.toValidate.brgyId =
      this.BridgeList.brgyId == '' || this.BridgeList.brgyId == null
        ? true
        : false;
    this.toValidate.condition =
      this.BridgeList.condition == '' || this.BridgeList.condition == undefined
        ? true
        : false;
    this.toValidate.pavement =
      this.BridgeList.pavement == '' || this.BridgeList.pavement == null
        ? true
        : false;

    this.BridgeList.setYear = this.setYear;
    this.BridgeList.munCityId = this.munCityId;
    this.BridgeList.tag = 1;

    if (
      !this.toValidate.name &&
      !this.toValidate.brgyId &&
      !this.toValidate.condition &&
      !this.toValidate.pavement
    ) {
      this.service.post_save_transpo_bridge(this.BridgeList).subscribe(
        (data) => {
          Swal.fire('Saved!', 'Data successfully saved.', 'success');
          this.closebutton.nativeElement.click();
          this.TranspoBridgeList.push(<any>data);
        },
        (error) => {
          alert('ERROR');
        }
      );
    } else {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields.',
        'warning'
      );
    }
  }

  updateBridgeList() {
    this.toValidate.name =
      this.BridgeList.name == '' || this.BridgeList.name == undefined
        ? true
        : false;
    this.toValidate.brgyId =
      this.BridgeList.brgyId == '' || this.BridgeList.brgyId == null
        ? true
        : false;
    this.toValidate.condition =
      this.BridgeList.condition == '' || this.BridgeList.condition == undefined
        ? true
        : false;
    this.toValidate.pavement =
      this.BridgeList.pavement == '' || this.BridgeList.pavement == null
        ? true
        : false;

    this.BridgeList.longtitude = this.gmapComponent.markers.lng;
    this.BridgeList.latitude = this.gmapComponent.markers.lat;

    if (
      !this.toValidate.name &&
      !this.toValidate.brgyId &&
      !this.toValidate.condition &&
      !this.toValidate.pavement
    ) {
      this.service.put_update_transpo_bridge(this.BridgeList).subscribe(
        (data) => {
          this.closebutton.nativeElement.click();
          Swal.fire('Updated!', 'Data successfully updated.', 'success');
        },
        (err) => {
          alert('ERROR');
        }
      );
    } else {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields.',
        'warning'
      );
    }
  }

  deleteBridgeList(transId: any = '', index: any = '') {
    this.service.delete_transpo_bridge(transId).subscribe(
      (data) => {
        Swal.fire('Deleted!', 'Data successfully deleted.', 'success');
        this.TranspoBridgeList.splice(index, 1);
      },
      (err) => {
        alert('ERROR');
      }
    );
  }
}
