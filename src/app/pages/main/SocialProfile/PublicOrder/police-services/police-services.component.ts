import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SafetyServicesService } from 'src/app/shared/SocialProfile/PublicOrder/safety-services.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { isEmptyObject } from 'jquery';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { SafetyPoliceService } from 'src/app/shared/SocialProfile/PublicOrder/safety-police.service';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';
import { SourceService } from 'src/app/shared/Source/Source.Service';

@Component({
  selector: 'app-police-services',
  templateUrl: './police-services.component.html',
  styleUrls: ['./police-services.component.css'],
})
export class PoliceServicesComponent implements OnInit {
  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };

  @ViewChild(PdfComponent)
  private pdfComponent!: PdfComponent;

  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private auth: AuthService,
    private service: SafetyPoliceService,
    private modifyService: ModifyCityMunService,
    private SourceService: SourceService
  ) {
    this.o_munCityId = this.auth.o_munCityId;
  }

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  munCityName: string = this.auth.munCityName;
  is_update: boolean = false;
  initialList: any = [];
  barangay: any = {};
  addmodal: any = {};
  editmodal: any = {};
  UpdateBarangay: any = {};
  listMunCity: any = {};
  sources: any = [];
  newSource: any = {};
  selectedSourceId: number | null = null;
  showAddForm: boolean = true;

  pageSize = 25;
  p: string | number | undefined;
  count: number = 0;
  tableSize: number = 5;
  tableSizes: any = [5, 10, 15, 25, 50, 100];

  isAdd: boolean = false;
  listData: any = [];
  data: any = {};
  o_munCityId: any = '';

  ngOnInit(): void {
    this.Init();
    this.getSources();
  }
  getSources(): void {
    const setYear = this.auth.activeSetYear;
    const munCityId = this.auth.munCityId;
    const sourceFor = 'police-services'; // 👈 assign your module name

    this.SourceService.getSources(setYear, munCityId, sourceFor).subscribe({
      next: (data) => {
        this.sources = data;
        this.showAddForm = data.length === 0;
      },
      error: (error) => {
        console.error('Failed to fetch sources:', error);
      },
    });
  }

  addSource(): void {
    if (!this.newSource?.name) {
      Swal.fire('Warning', 'Please enter a source name.', 'warning');
      return;
    }

    const sourceFor = 'police-services'; // 👈 assign your module name

    // ✅ Add metadata
    this.newSource.munCityId = this.auth.munCityId;
    this.newSource.setYear = this.auth.activeSetYear;
    this.newSource.sourceFor = sourceFor;

    this.SourceService.createSource(this.newSource).subscribe({
      next: () => {
        this.newSource = {};
        Swal.fire('Success', 'Source added successfully.', 'success');
        this.getSources(); // ✅ Re-fetch source list
      },
      error: (error) => {
        Swal.fire('Error', `Failed to create source.\n${error}`, 'error');
      },
    });
  }

  updateSource(): void {
    if (this.selectedSourceId === null || !this.newSource?.name) {
      Swal.fire('Warning', 'No source selected or missing name.', 'warning');
      return;
    }

    this.SourceService.updateSource(
      this.selectedSourceId,
      this.newSource
    ).subscribe({
      next: () => {
        this.getSources();
        this.selectedSourceId = null;
        this.newSource = {};
        Swal.fire('Success', 'Source updated successfully!', 'success');
      },
      error: (error) => {
        Swal.fire('Error', `Failed to update source.\n${error}`, 'error');
      },
    });
  }
  deleteSource(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action will delete the source.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // Show loading dialog
        Swal.fire({
          title: 'Deleting...',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        // Perform delete operation
        this.SourceService.deleteSource(id).subscribe({
          next: () => {
            this.getSources(); // Refresh list
            Swal.fire('Deleted!', 'Source has been deleted.', 'success');
          },
          error: (error) => {
            Swal.fire(
              'Error',
              `Failed to delete source.\n${error.message || error}`,
              'error'
            );
          },
        });
      }
    });
  }

  editSource(source: any): void {
    this.selectedSourceId = source.id;
    this.newSource = { ...source };
  }

  Init() {
    this.GetData();
    this.GetListMunicipality();
  }

  formatNumber(value: number): string {
    return value.toLocaleString(undefined, {
      maximumFractionDigits: 0,
    });
  }

  GeneratePDF() {
    let data: any = [];
    let grandTotal: any = {};

    let reports: any = [];
    let columnLenght: number = 0;

    const tableData: any = [];

    this.reportService.GetSafetyPoliceReport(this.pdfComponent.data).subscribe({
      next: (response: any = {}) => {
        reports = response.data;
        grandTotal = response.grandTotal;

        console.log('result: ', response);

        data.push({
          margin: [0, 40, 0, 0],
          columns: [
            {
              text: `Police Services by Municipality/City`,
              fontSize: 14,
              bold: true,
            },
            {
              text: `Year: ${response.year}`,
              fontSize: 14,
              bold: true,
              alignment: 'right',
            },
          ],
        });

        tableData.push(
          [
            {
              text: '#',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              rowSpan: 2,
            },
            {
              text: 'Municipality/ City',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              rowSpan: 2,
            },
            {
              text: 'Population',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              rowSpan: 2,
            },
            {
              text: 'Current Force',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              colSpan: 3,
            },
            {},
            {},
            {
              text: 'Ratio to Population	',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              rowSpan: 2,
            },
            {
              text: 'No. of Stations',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              rowSpan: 2,
            },
          ],
          [
            {},
            {},
            {},
            {
              text: 'Male',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Female',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Total',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {},
            {},
          ]
        );

        reports.forEach((a: any) => {
          if (a.district === 1) {
            let columnWidth: number = 0;
            a.data.forEach((b: any, index: any) => {
              let dist: any = [];
              for (let key in b) {
                let textValue: any;
                if (index === 0) {
                  columnWidth++;
                }
                if (key === 'ratio') {
                  textValue = b[key].toFixed(2);
                } else {
                  textValue = b[key];
                }
                dist.push({
                  text: key === 'munCityId' ? (b[key] = index + 1) : textValue,
                  fillColor: '#ffffff',
                  alignment: key === 'munCityName' ? 'left' : 'center',
                });
              }

              if (index === 0) {
                tableData.push([
                  {
                    text: `1st Congressional District `,
                    colSpan: columnWidth,
                    alignment: 'left',
                    fillColor: '#526D82',
                    marginLeft: 5,
                  },
                ]);

                columnLenght = columnWidth - 1;
              }

              tableData.push(dist);
            });

            let sub: any = []; // SUBTOTAL D1
            for (let key in a.subTotal) {
              if (key === 'subTotal') {
                sub.push(
                  {
                    text: a.subTotal[key],
                    fillColor: '#9DB2BF',
                    alignment: 'left',
                    colSpan: 2,
                    marginLeft: 5,
                  },
                  {}
                );
              } else {
                let textValue: any;
                if (key === 'ratio') {
                  textValue = a.subTotal[key].toFixed(2);
                } else {
                  textValue = a.subTotal[key];
                }
                sub.push({
                  text: textValue,
                  fillColor: '#9DB2BF',
                  alignment: 'center',
                });
              }
            }
            tableData.push(sub);
          } else {
            let columnWidth: number = 0;
            a.data.forEach((b: any, index: any) => {
              let dist: any = [];
              for (let key in b) {
                let textValue: any;
                if (index === 0) {
                  columnWidth++;
                }
                if (key === 'ratio') {
                  textValue = b[key].toFixed(2);
                } else {
                  textValue = b[key];
                }
                dist.push({
                  text: key === 'munCityId' ? (b[key] = index + 1) : textValue,
                  fillColor: '#ffffff',
                  alignment: key === 'munCityName' ? 'left' : 'center',
                });
              }

              if (index === 0) {
                tableData.push([
                  {
                    text: `2nd Congressional District `,
                    colSpan: columnWidth,
                    alignment: 'left',
                    fillColor: '#526D82',
                    marginLeft: 5,
                  },
                ]);
              }

              tableData.push(dist);
            });

            let sub: any = []; // SUBTOTAL D2
            for (let key in a.subTotal) {
              if (key === 'subTotal') {
                sub.push(
                  {
                    text: a.subTotal[key],
                    fillColor: '#9DB2BF',
                    alignment: 'left',
                    colSpan: 2,
                    marginLeft: 5,
                  },
                  {}
                );
              } else {
                let textValue: any;
                if (key === 'ratio') {
                  textValue = a.subTotal[key].toFixed(2);
                } else {
                  textValue = a.subTotal[key];
                }
                sub.push({
                  text: textValue,
                  fillColor: '#9DB2BF',
                  alignment: 'center',
                });
              }
            }
            tableData.push(sub);
          }
        });

        let grand: any = []; // GRAND TOTAL
        for (let key in grandTotal) {
          if (key == 'grandTotal') {
            grand.push(
              {
                text: grandTotal[key],
                fillColor: '#F1C93B',
                alignment: 'left',
                colSpan: 2,
                marginLeft: 5,
              },
              {}
            );
          } else {
            let textValue: any;
            if (key === 'ratio') {
              textValue = grandTotal[key].toFixed(2);
            } else {
              textValue = grandTotal[key];
            }
            grand.push({
              text: textValue,
              fillColor: '#F1C93B',
              alignment: 'center',
            });
          }
        }

        tableData.push(grand);

        let widths: any = []; // COLUMN WIDTH
        for (let index = 0; index < columnLenght; index++) {
          if (index === 0) {
            widths.push(20);
          }
          widths.push('*');
        }

        const table = {
          margin: [0, 10, 0, 0],
          table: {
            widths: widths,
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

  GetData() {
    this.service.GetListSafetyPolice(this.auth.setYear).subscribe({
      next: (response) => {
        this.initialList = <any>response;
      },
      error: (error) => {},
      complete: () => {
        this.GetListMunicipality();
      },
    });
  }

  GetListMunicipality() {
    this.service.ListOfMunicipality().subscribe({
      next: (response) => {
        this.listMunCity = <any>response;
      },
      error: (error) => {},
      complete: () => {
        this.FilterList();
      },
    });
  }

  FilterList() {
    let isExist;
    this.listData = [];

    this.listMunCity.forEach((a: any) => {
      this.initialList.forEach((b: any) => {
        if (a.munCityId == b.munCityId) {
          isExist = this.listData.filter(
            (x: any) => x.munCityId == a.munCityId
          );
          if (isExist.length == 0) {
            this.listData.push(b);
          }
        }
      });

      isExist = this.listData.filter((x: any) => x.munCityId == a.munCityId);
      if (isExist.length == 0) {
        this.listData.push({
          munCityId: a.munCityId,
          munCityName: a.munCityName,
        });
      }
    });
  }

  AddData() {
    if (isEmptyObject(this.data)) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.data.munCityId = this.auth.munCityId;
      this.data.setYear = this.auth.activeSetYear;
      this.service.AddSafetyPolice(this.data).subscribe({
        next: (request) => {
          let index = this.listData.findIndex(
            (obj: any) => obj.munCityId === this.data.munCityId
          );
          this.listData[index] = request;
        },
        complete: () => {
          this.data = {};
          this.closebutton.nativeElement.click();

          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Your work has been saved',
            showConfirmButton: false,
            timer: 1000,
          });
        },
      });
    }
  }

  EditData() {
    this.data.setYear = this.auth.activeSetYear;
    this.service.EditSafetyPolice(this.data).subscribe({
      next: (request) => {
        this.closebutton.nativeElement.click();
        this.data = {};
      },
      complete: () => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your work has been updated',
          showConfirmButton: false,
          timer: 1000,
        });
      },
    });
  }

  DeleteData(transId: any, index: any, data: any) {
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
        this.service.DeleteSafetyPolice(transId).subscribe({
          next: (_data) => {},
          error: (err) => {
            Swal.fire('Oops!', 'Something went wrong.', 'error');
          },
          complete: () => {
            this.listData[index] = {};
            this.listData[index].munCityId = data.munCityId;
            this.listData[index].munCityName = data.munCityName;
            Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
          },
        });
      }
    });
  }
}
