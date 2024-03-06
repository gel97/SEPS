import { Component, OnInit, ViewChild } from '@angular/core';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { AuthService } from 'src/app/services/auth.service';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { TelecommunicationService } from 'src/app/shared/Infrastructure/Utilities/Communication/telecommunication.service';
import Swal from 'sweetalert2';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';

@Component({
  selector: 'app-telecommunication',
  templateUrl: './telecommunication.component.html',
  styleUrls: ['./telecommunication.component.css'],
})
export class TelecommunicationComponent implements OnInit {
  munCityName: string = this.auth.munCityName;
  not_visible: boolean = false;
  visible: boolean = true;
  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private service: TelecommunicationService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  message = 'Telecommunication Systems';

  toValidate: any = {};
  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;
  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };

  @ViewChild(PdfComponent)
  private pdfComponent!: PdfComponent;

  isCheck: boolean = false;
  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
    console.log('isCheck:', this.isCheck);
  }
  clearData() {
    this.telco = {};
    this.not_visible = false;
    this.visible = true;
    // this.required = false;
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

  list_of_type = [
    { id: 1, name: 'Globe' },
    { id: 2, name: 'Smart' },
  ];

  ngOnInit(): void {
    this.Init();
  }

  GeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.reportService.GetTelcomReport(this.pdfComponent.data).subscribe({
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
              text: `List of Telecommunication Systems by Municipality/ City`,
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
            text: 'Company',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Type of Exchange/ Facilities',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Installed Lines',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Total Subscribed Line',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Contact Person',
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
            colSpan: 9,
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
              colSpan: 9,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group1.forEach((item: any, index: any) => {
            let _type:string="";
            this.list_of_type.forEach((m:any) => {
              if(m.id === item.type)(
                _type = m.name
              )
            });
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.telco,
                fillColor: '#FFFFFF',
              },
              {
                text: _type,
                fillColor: '#FFFFFF',
              },
              {
                text: item.installed,
                fillColor: '#FFFFFF',
                alignment: 'center'
              },
              {
                text: item.subscribed,
                fillColor: '#FFFFFF',
                alignment: 'center'
              },
              {
                text: item.contactPerson,
                fillColor: '#FFFFFF',
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
            colSpan: 9,
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
              colSpan: 9,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group2.forEach((item: any, index: any) => {
            let _type:string="";
            this.list_of_type.forEach((m:any) => {
              if(m.id === item.type)(
                _type = m.name
              )
            });
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.telco,
                fillColor: '#FFFFFF',
              },
              {
                text: _type,
                fillColor: '#FFFFFF',
              },
              {
                text: item.installed,
                fillColor: '#FFFFFF',
                alignment: 'center'
              },
              {
                text: item.subscribed,
                fillColor: '#FFFFFF',
                alignment: 'center'
              },
              {
                text: item.contactPerson,
                fillColor: '#FFFFFF',
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
            widths: [25, '*', '*', '*', '*', '*', '*', '*', '*'],
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
  public showOverlay = false;
  importMethod() {
    this.showOverlay = true;
    this.service.Import().subscribe({
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
  munCityId: string = this.auth.munCityId;
  setYear: string = this.auth.setYear;

  Add_tel: boolean = true;
  Telco123: any = [];
  telco: any = {};
  barangays: any = [];

  Init() {
    this.GetListBarangay();
    this.GetList_Telco();
  }

  parentMethod() {
    this.telco = {};
    this.not_visible = false;
    this.visible = true;
  }

  GetListBarangay() {
    this.service.ListBarangay().subscribe((data) => {
      this.barangays = <any>data;
    });
  }

  GetList_Telco() {
    this.service.List_telcom(this.setYear, this.munCityId).subscribe({
      next: (response) => {
        this.Telco123 = <any>response;
        console.log('list', this.Telco123);
      },
      error: (error) => {
        Swal.fire('Oops!', 'Something went wrong.', 'error');
      },
      complete: () => {},
    });
  }

  Add_Tel() {
    this.toValidate.telco =
      this.telco.telco == '' || this.telco.telco == undefined ? true : false;
    this.toValidate.type =
      this.telco.type == '' || this.telco.type == null ? true : false;
    this.toValidate.brgyId =
      this.telco.brgyId == '' || this.telco.brgyId == null ? true : false;
    this.toValidate.installed =
      this.telco.installed == '' || this.telco.installed == undefined
        ? true
        : false;
    this.toValidate.subscribed =
      this.telco.subscribed == '' || this.telco.subscribed == undefined
        ? true
        : false;

    this.telco.setYear = this.setYear;
    this.telco.munCityId = this.munCityId;

    if (
      !this.toValidate.telco &&
      !this.toValidate.brgyId &&
      !this.toValidate.type &&
      !this.toValidate.installed &&
      !this.toValidate.subscribed
    ) {
      this.service.Add_telcom(this.telco).subscribe({
        next: (request) => {
          this.GetList_Telco();
        },
        error: (error) => {
          Swal.fire('Oops!', 'Something went wrong.', 'error');
        },
        complete: () => {
          if (!this.isCheck) {
            this.closebutton.nativeElement.click();
          }
          this.GetList_Telco();

          Swal.fire('Good job!', 'Data Added Successfully!', 'success');
          this.telco = {};
          this.GetList_Telco();
        },
      });
    } else {
      Swal.fire('', 'Please fill out the required fields.', 'warning');
    }
  }

  Update_Tel() {
    this.toValidate.telco =
      this.telco.telco == '' || this.telco.telco == undefined ? true : false;
    this.toValidate.type =
      this.telco.type == '' || this.telco.type == null ? true : false;
    this.toValidate.brgyId =
      this.telco.brgyId == '' || this.telco.brgyId == null ? true : false;
    this.toValidate.installed =
      this.telco.installed == '' || this.telco.installed == undefined
        ? true
        : false;
    this.toValidate.subscribed =
      this.telco.subscribed == '' || this.telco.subscribed == undefined
        ? true
        : false;

    this.telco.longtitude = this.gmapComponent.markers.lng;
    this.telco.latitude = this.gmapComponent.markers.lat;

    this.telco.setYear = this.setYear;
    this.telco.munCityId = this.munCityId;

    if (
      !this.toValidate.telco &&
      !this.toValidate.brgyId &&
      !this.toValidate.type &&
      !this.toValidate.installed &&
      !this.toValidate.subscribed
    ) {
      this.service.Update_telcom(this.telco).subscribe({
        next: (request) => {
          this.GetList_Telco();
        },
        error: (error) => {
          Swal.fire('Oops!', 'Something went wrong.', 'error');
        },
        complete: () => {
          if (!this.isCheck) {
            this.closebutton.nativeElement.click();
          }
          Swal.fire('Good job!', 'Data Updated Successfully!', 'success');
        },
      });
    } else {
      Swal.fire('', 'Please fill out the required fields.', 'warning');
    }
  }

  Delete_Tel(transId: any) {
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
        this.service.Delete_telcom(transId).subscribe((request) => {
          this.GetList_Telco();
        });
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  }
}
