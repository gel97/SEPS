import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HealthWorkersService } from 'src/app/shared/SocialProfile/Health/healthWorkers.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { isEmptyObject } from 'jquery';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';
import { SourceService } from 'src/app/shared/Source/Source.Service';
@Component({
  selector: 'app-public-health',
  templateUrl: './public-health.component.html',
  styleUrls: ['./public-health.component.css'],
})
export class PublicHealthComponent implements OnInit {
  munCityName: string = this.auth.munCityName;
  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private service: HealthWorkersService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService,
    private SourceService: SourceService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  toValidate: any = {};
  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };

  isCheck: boolean = false;

  @ViewChild(PdfComponent)
  private pdfComponent!: PdfComponent;

  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
  }

  ngOnInit(): void {
    this.Init();
    this.getSources();
  }
  getSources(): void {
    const setYear = this.auth.activeSetYear;
    const munCityId = this.auth.munCityId;
    const sourceFor = 'publicHealth';

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

    const sourceFor = 'publicHealth'; // 👈 assign your module name

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
  munCityId: string = this.auth.munCityId;
  setYear: string = this.auth.setYear;
  menuId = '1';
  data: any = {};

  isAdd: boolean = true;
  hasData: boolean = false;
  irrigation: any = {};
  vieIrrig: any = {};
  sources: any = [];
  newSource: any = {};
  selectedSourceId: number | null = null;
  showAddForm: boolean = true;

  Init() {
    this.GetHealthWorkers();
  }
  GeneratePDF() {
    let data: any = [];
    let grandTotal: any = {};

    let reports: any = [];
    let columnLenght: number = 0;

    const tableData: any = [];

    this.reportService
      .GetHealthWorkersReport(this.pdfComponent.data)
      .subscribe({
        next: (response: any = {}) => {
          reports = response.data;
          grandTotal = response.grandTotal;

          console.log('result: ', response);

          data.push({
            margin: [0, 40, 0, 0],
            columns: [
              {
                text: `Number of Health Service Workers by Municipality/City`,
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

          tableData.push([
            {
              text: '#',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Municipality/ City',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Physician',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Nurses',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Midwives',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Dentists',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Medical Technoligists',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Pharmacists',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Nutritionists and Dieticians',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Sanitation Inspectors',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Population Program Inspectors',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Health Education Promotion Officers',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Grand Total',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
          ]);

          reports.forEach((a: any) => {
            if (a.district === 1) {
              let columnWidth: number = 0;
              a.data.forEach((b: any, index: any) => {
                let dist: any = [];
                for (let key in b) {
                  if (index === 0) {
                    columnWidth++;
                  }
                  dist.push({
                    text: key === 'munCityId' ? (b[key] = index + 1) : b[key],
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
                  sub.push({
                    text: a.subTotal[key],
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
                  if (index === 0) {
                    columnWidth++;
                  }
                  dist.push({
                    text: key === 'munCityId' ? (b[key] = index + 1) : b[key],
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
                  sub.push({
                    text: a.subTotal[key],
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
              grand.push({
                text: grandTotal[key],
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
            widths.push('auto');
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
  GetHealthWorkers() {
    console.log(this.munCityId + ' | ' + this.setYear);

    this.service.GetHealthWorkers(this.setYear, this.munCityId).subscribe({
      next: (response) => {
        console.log(response);
        if (response.length > 0) {
          this.data = <any>response[0];
          console.log('data: ', this.data);

          this.hasData = true;
        } else {
          this.hasData = false;
        }
      },
      error: (error) => {
        Swal.fire('Oops!', 'Something went wrong.', 'error');
      },
      complete: () => {},
    });
  }

  AddHealthWorkers() {
    if (!isEmptyObject(this.data)) {
      this.data.setYear = this.setYear;
      this.data.munCityId = this.munCityId;
      this.service.AddHealthWorkers(this.data).subscribe({
        next: (request) => {
          this.GetHealthWorkers();
        },
        error: (error) => {
          Swal.fire('Oops!', 'Something went wrong.', 'error');
        },
        complete: () => {
          if (!this.isCheck) {
            this.closebutton.nativeElement.click();
          }
          this.data = {};
          Swal.fire('Good job!', 'Data Added Successfully!', 'success');
        },
      });
    } else {
      Swal.fire(
        'Missing Data!',
        'Please fill out the input fields.',
        'warning'
      );
    }
  }

  EditHealthWorkers() {
    this.data.setYear = this.setYear;
    this.data.munCityId = this.munCityId;
    this.service.EditHealthWorkers(this.data).subscribe({
      next: (request) => {
        this.GetHealthWorkers();
      },
      error: (error) => {
        Swal.fire('Oops!', 'Something went wrong.', 'error');
      },
      complete: () => {
        this.closebutton.nativeElement.click();
        Swal.fire('Good job!', 'Data Updated Successfully!', 'success');
        document.getElementById('mEducation')?.click();
      },
    });
  }

  DeleteHealthWorkers(transId: any) {
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
        this.service.DeleteHealthWorkers(transId).subscribe((request) => {
          this.Init();
          this.data = {};
        });
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  }
}
