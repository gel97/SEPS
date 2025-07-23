import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HealthHandicapService } from 'src/app/shared/SocialProfile/Health/healthHandicap.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { isEmptyObject } from 'jquery';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';
import { SourceService } from 'src/app/shared/Source/Source.Service';
@Component({
  selector: 'app-person-disability',
  templateUrl: './person-disability.component.html',
  styleUrls: ['./person-disability.component.css'],
})
export class PersonDisabilityComponent implements OnInit {
  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };

  @ViewChild(PdfComponent)
  private pdfComponent!: PdfComponent;

  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private auth: AuthService,
    private service: HealthHandicapService,
    private modifyService: ModifyCityMunService,
    private SourceService: SourceService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  list_of_type: any = [];

  munCityName: string = this.auth.munCityName;
  listHandi: any = [];
  listBarangay: any = [];
  isAdd: boolean = false;
  listData: any = [];
  data: any = {};
  isCheck: boolean = false;
  toValidate: any = {};
  sources: any = [];
  newSource: any = {};
  selectedSourceId: number | null = null;
  showAddForm: boolean = true;

  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
    console.log('isCheck:', this.isCheck);
  }

  ngOnInit(): void {
    this.GetListType();
    this.Init();
    this.getSources();
  }
  getSources(): void {
    const setYear = this.auth.activeSetYear;
    const munCityId = this.auth.munCityId;
    const sourceFor = 'personDisability'; // 👈 assign your module name

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

    const sourceFor = 'personDisability'; // 👈 assign your module name

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
    this.GetHealthHandicap();
    this.GetListBarangay();
  }
  GeneratePDF() {
    let reports: any = [];
    let data: any = [];
    let dist1: any = [];
    let dist2: any = [];
    let contentData: any = [];
    let columns: any = [];
    let columnWidth: any = [];
    let columnsData: any = [];
    let grandTotal: any = [];
    let _grandTotal: any = [];

    this.reportService.GetHealthHandiReport(this.pdfComponent.data).subscribe({
      next: (response: any = {}) => {
        reports = response.data;
        dist1 = response.districtOne;
        dist2 = response.districtTwo;
        columns = response.columns;
        grandTotal = response.grandTotal;

        console.log(response);
        const tableData: any = [];

        data.push({
          text: `Persons with Disability for the year ${response.year}`, // Add the title text
          fontSize: 14,
          bold: true,
          alignment: 'center',
          margin: [0, 20], // Adjust the margin around the title as needed
        });

        columns.forEach((b: any, index: any) => {
          // GET COLUMN
          if (index == 0) {
            columnWidth.push('auto');
            columnsData.push({
              text: 'Muncipality/ City',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              fontSize: 8,
            });
          }
          columnWidth.push('auto');
          columnsData.push({
            text: b.typeName,
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 6.8,
          });
        });

        tableData.push(columnsData); // PUSH COLUMN

        reports.forEach((a: any, index: any) => {
          if (a.district === 1) {
            tableData.push([
              {
                text: `1st Congressional District `,
                fontSize: 8,
                colSpan: columnWidth.length,
                alignment: 'left',
                fillColor: '#526D82',
              },
            ]);
            dist1.forEach((b: any) => {
              let _data = [];
              _data.push({ text: b.munCityName, fontSize: 8 });

              columns.forEach((c: any) => {
                let count = '-';
                a.data.forEach((d: any) => {
                  d.munData.forEach((e: any) => {
                    if (e.type === c.recNo && d.munCityId === b.munCityId) {
                      count = e.total;
                    }
                  });
                });
                _data.push({ text: count, fontSize: 8 });
              });

              tableData.push(_data);
            });

            let subTotal: any = [];
            columns.forEach((c: any, y: any) => {
              let count = '-';
              if (y == 0) {
                subTotal.push({
                  text: 'SUBTOTAL',
                  fontSize: 8,
                  fillColor: '#9DB2BF',
                });
              }
              a.subTotal.forEach((d: any) => {
                if (d.type === c.recNo) {
                  count = d.total;
                }
              });
              subTotal.push({ text: count, fontSize: 8, fillColor: '#9DB2BF' });
            });

            tableData.push(subTotal);
          } else {
            tableData.push([
              {
                text: `2nd Congressional District `,
                fontSize: 8,
                colSpan: columnWidth.length,
                alignment: 'left',
                fillColor: '#526D82',
              },
            ]);
            dist2.forEach((b: any) => {
              let _data = [];
              _data.push({ text: b.munCityName, fontSize: 8 });

              columns.forEach((c: any) => {
                let count = '-';
                a.data.forEach((d: any) => {
                  d.munData.forEach((e: any) => {
                    if (e.type === c.recNo && d.munCityId === b.munCityId) {
                      count = e.total;
                    }
                  });
                });
                _data.push({ text: count, fontSize: 8 });
              });

              tableData.push(_data);
            });

            let subTotal: any = [];
            columns.forEach((c: any, y: any) => {
              let count = '-';
              if (y == 0) {
                subTotal.push({
                  text: 'SUBTOTAL',
                  fontSize: 8,
                  fillColor: '#9DB2BF',
                });
              }
              a.subTotal.forEach((d: any) => {
                if (d.type === c.recNo) {
                  count = d.total;
                }
              });
              subTotal.push({ text: count, fontSize: 8, fillColor: '#9DB2BF' });
            });

            tableData.push(subTotal);
          }
        });

        columns.forEach((c: any, v: any) => {
          let count = '-';
          if (v === 0) {
            _grandTotal.push({
              text: 'GRANDTOTAL',
              fontSize: 8,
              fillColor: '#F1C93B',
            });
          }
          grandTotal.forEach((d: any) => {
            if (d.type === c.recNo) {
              count = d.total;
            }
          });
          _grandTotal.push({ text: count, fontSize: 8, fillColor: '#F1C93B' });
        });

        tableData.push(_grandTotal);

        contentData.push([
          {
            margin: [0, 10, 0, 0],
            table: {
              // widths: columnWidth,
              body: tableData,
            },
          },
        ]);
        data.push(contentData);
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
  GetHealthHandicap() {
    this.service
      .GetHealthHandicap(this.auth.setYear, this.auth.munCityId)
      .subscribe({
        next: (response) => {
          this.listHandi = <any>response;
        },
        error: (error) => {},
        complete: () => {
          this.GetListBarangay();
        },
      });
  }

  GetListBarangay() {
    this.service.ListOfBarangay(this.auth.munCityId).subscribe({
      next: (response) => {
        this.listBarangay = <any>response;
      },
      error: (error) => {},
      complete: () => {
        this.FilterList();
      },
    });
  }

  GetListType() {
    this.service.ListOfHandiType().subscribe({
      next: (response) => {
        this.list_of_type = <any>response;
      },
      error: (error) => {},
      complete: () => {},
    });
  }

  FilterList() {
    let isExist;
    this.listData = [];

    this.listBarangay.forEach((a: any) => {
      this.listHandi.forEach((b: any) => {
        if (a.brgyId == b.brgyId) {
          isExist = this.listData.filter((x: any) => x.brgyId == a.brgyId);
          if (isExist.length == 0) {
            this.listData.push(b);
          }
        }
      });

      isExist = this.listData.filter((x: any) => x.brgyId == a.brgyId);
      if (isExist.length == 0) {
        this.listData.push({
          brgyId: a.brgyId,
          brgyName: a.brgyName,
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
      this.toValidate.brgyId =
        this.data.brgyId == '' || this.data.brgyId == null ? true : false;

      this.data.munCityId = this.auth.munCityId;
      this.data.setYear = this.auth.activeSetYear;

      if (!this.toValidate.brgyId) {
        this.service.AddHealthHandicap(this.data).subscribe({
          next: (request) => {
            let index = this.listData.findIndex(
              (obj: any) => obj.brgyId === this.data.brgyId
            );
            this.listData[index] = request;
            this.GetHealthHandicap();
          },
          error: (error) => {
            if (error.status == 400) {
              Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Data already exist',
                showConfirmButton: true,
              });
            } else {
              Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Something went wrong',
                showConfirmButton: true,
              });
            }
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
      } else {
        Swal.fire('', 'Please fill out the required fields.', 'warning');
      }
    }
  }

  EditData() {
    this.data.setYear = this.auth.activeSetYear;
    this.service.EditHealthHandicap(this.data).subscribe({
      next: (request) => {
        this.closebutton.nativeElement.click();
        this.data = {};
        this.GetHealthHandicap();
      },
      error: (error) => {
        if (error.status == 400) {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Type of Disability is already exist in this Barangay',
            showConfirmButton: true,
          });
        } else {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Something went wrong',
            showConfirmButton: true,
          });
        }
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
        this.service.DeleteHealthHandicap(transId).subscribe({
          next: (_data) => {
            this.GetHealthHandicap();
          },
          error: (err) => {
            Swal.fire('Oops!', 'Something went wrong.', 'error');
          },
          complete: () => {
            this.listData[index] = {};
            this.listData[index].brgyId = data.brgyId;
            this.listData[index].brgyName = data.brgyName;
            Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
          },
        });
      }
    });
  }
}
