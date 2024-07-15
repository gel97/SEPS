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
  selector: 'app-transport-terminals',
  templateUrl: './transport-terminals.component.html',
  styleUrls: ['./transport-terminals.component.css'],
})
export class TransportTerminalsComponent implements OnInit {
  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;

  @ViewChild(PdfComponent)
  private pdfComponent!: PdfComponent;
  changeDetectorRef: any;

  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private service: TrasportationService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };

  message = 'Transport Terminals';

  public showOverlay = false;
  importMethod() {
    this.showOverlay = true;
    this.service.post_import_transpo_terminal().subscribe({
      next: (data) => {
        this.ngOnInit();
        if (data.length === 0) {
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
        } else {
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
  TranspoTerminalList: any = [];
  TerminalList: any = {};
  BarangayList: any = [];
  isNew: boolean = true;
  toValidate: any = {};
  visible: boolean = true;
  not_visible: boolean = true;
  required: boolean = true;

  TransportType: any = [
    { id: 1, transpotypename: 'Bus' },
    { id: 2, transpotypename: 'Jeepney' },
    { id: 3, transpotypename: 'Van/FX-UV/GT Express' },
    { id: 4, transpotypename: 'Tricycle' },
    { id: 5, transpotypename: 'Pedicab' },
    { id: 6, transpotypename: 'Single Motorcycle' },
    { id: 7, transpotypename: 'Others' },
  ];

  ngOnInit(): void {
    this.getListTranspoTerminal();
  }
  parentMethod() {
    // alert('parent Method');
    this.isNew = true;
  }
  GeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.reportService
      .GetTranspoTerminalsReport(this.pdfComponent.data)
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
            margin: [0, 20, 0, 0],
            columns: [
              {
                text: `List of Transport Terminals by Municipality/City`,
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
              text: 'Company/ Organization',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Type',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'No. of Units',
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
              text: 'Routes',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
          ]);

          tableData.push([
            {
              text: `1st Congressional District `,
              colSpan: 6,
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
                colSpan: 6,
                alignment: 'left',
                fillColor: '#9DB2BF',
                marginLeft: 5,
              },
            ]);

            group1.forEach((item: any, index: any) => {
              let transpo: string = '';
              this.TransportType.forEach((a: any) => {
                if (a.id === item.transportType) {
                  transpo = a.transpotypename;
                }
              });
              tableData.push([
                {
                  text: index + 1,
                  fillColor: '#FFFFFF',
                  marginLeft: 5,
                },
                {
                  text: item.company,
                  fillColor: '#FFFFFF',
                },
                {
                  text: transpo,
                  fillColor: '#FFFFFF',
                },
                {
                  text: item.unitsNo,
                  fillColor: '#FFFFFF',
                  alignment: 'center',
                },
                {
                  text: item.location,
                  fillColor: '#FFFFFF',
                },
                {
                  text: item.routes,
                  fillColor: '#FFFFFF',
                },
              ]);
            });
          }

          tableData.push([
            {
              text: `2nd Congressional District `,
              colSpan: 6,
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
                colSpan: 6,
                alignment: 'left',
                fillColor: '#9DB2BF',
                marginLeft: 5,
              },
            ]);

            group2.forEach((item: any, index: any) => {
              let transpo: string = '';
              this.TransportType.forEach((a: any) => {
                if (a.id === item.transportType) {
                  transpo = a.transpotypename;
                }
              });
              tableData.push([
                {
                  text: index + 1,
                  fillColor: '#FFFFFF',
                  marginLeft: 5,
                },
                {
                  text: item.company,
                  fillColor: '#FFFFFF',
                },
                {
                  text: transpo,
                  fillColor: '#FFFFFF',
                },
                {
                  text: item.unitsNo,
                  fillColor: '#FFFFFF',
                  alignment: 'center',
                },
                {
                  text: item.location,
                  fillColor: '#FFFFFF',
                },
                {
                  text: item.routes,
                  fillColor: '#FFFFFF',
                },
              ]);
            });
          }

          const table = {
            margin: [0, 20, 0, 0],
            table: {
              widths: [25, '*', '*', '*', '*', '*'],
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
          this.pdfService.GeneratePdf(data, isPortrait, '');
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

  getListTranspoTerminal() {
    this.service.get_list_barangay().subscribe((data) => {
      this.BarangayList = <any>data;
    });

    this.service.get_list_transpo_terminal().subscribe((data) => {
      this.TranspoTerminalList = <any>data;
      // if(this.TranspoTerminalList.length>0){

      // }

      for (let i of this.TranspoTerminalList) {
        for (let t of this.TransportType) {
          if (i.transportType == t.id) {
            i.transpotypename = t.transpotypename;
            break;
          }
        }
      }
    });
  }
  GetListType() {
    this.service.ListOfTranspoType().subscribe((response) => {
      this.TransportType = <any>response;
    });
  }

  saveTerminalList() {
    console.log('saveTerminalList called');

    // Validate input fields
    this.toValidate.company = !this.TerminalList.company;
    this.toValidate.unitsNo = !this.TerminalList.unitsNo;

    this.TerminalList.setYear = Number(this.auth.activeSetYear);
    this.TerminalList.tag = 1;
    this.TerminalList.transportType = Number(this.TerminalList.transportType);

    // Convert all fields to string (if necessary)
    const formattedTerminalList = {
      ...this.TerminalList,
      company: String(this.TerminalList.company),
      unitsNo: String(this.TerminalList.unitsNo),
    };

    console.log('Validation:', this.toValidate);
    console.log('Formatted TerminalList:', formattedTerminalList);

    // Check if all required fields are valid
    const isValid = !this.toValidate.company && !this.toValidate.unitsNo;

    if (isValid) {
      // Call the API to save the data
      this.service.post_save_transpo_terminal(formattedTerminalList).subscribe(
        (data) => {
          console.log('Save success:', data);

          // Display success message
          Swal.fire('Saved!', 'Data successfully saved.', 'success');

          // Close modal or perform any other necessary UI actions
          this.closebutton.nativeElement.click();

          // Assuming data returned from API includes transportType as an ID
          const transportType = this.TransportType.find(
            (t: { id: any }) => t.id === Number((<any>data).transportType)
          );

          if (transportType) {
            (<any>data).transportTypeName = transportType.transpotypename; // Adjust as per your data structure
          }

          // Add the new data to the list and trigger change detection
          this.TranspoTerminalList.push(data);
          console.log('Updated TranspoTerminalList:', this.TranspoTerminalList);

          // Ensure change detection runs
          this.changeDetectorRef.detectChanges();
        },
        (error) => {
          console.error('Save error:', error);
          if (error.error) {
            console.error('Error message:', error.error);
          }
          // Display error message
          Swal.fire('ERROR', 'There was an error saving the data.', 'error');
        }
      );
    } else {
      // Display warning for missing data
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields.',
        'warning'
      );
    }
  }

  updateTerminalList() {
    this.toValidate.company =
      this.TerminalList.company == '' || this.TerminalList.company == undefined
        ? true
        : false;

    this.toValidate.unitsNo =
      this.TerminalList.unitsNo == '' || this.TerminalList.unitsNo == undefined
        ? true
        : false;

    this.TerminalList.longtitude = this.gmapComponent.markers.lng;
    this.TerminalList.latitude = this.gmapComponent.markers.lat;
    if (!this.toValidate.company && !this.toValidate.unitsNo) {
      this.service.put_update_transpo_terminal(this.TerminalList).subscribe(
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
  clearData() {
    this.TerminalList = {};
    this.not_visible = false;
    this.visible = true;
    this.required = false;
  }
  // parentMethod() {
  //   // alert('parent Method');
  //   this.TerminalList = {};
  //   this.not_visible = false;
  //   this.visible = true;
  //   this.required = false;
  // }

  editToggle() {
    this.not_visible = true;
    this.visible = false;
  }

  deleteTerminalList(i: any) {
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
        this.service.delete_transpo_terminal(i.transId).subscribe((request) => {
          this.getListTranspoTerminal();
        });
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  }
}
