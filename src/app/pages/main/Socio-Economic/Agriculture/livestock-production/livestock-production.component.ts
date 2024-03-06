import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HealthHandicapService } from 'src/app/shared/SocialProfile/Health/healthHandicap.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { isEmptyObject } from 'jquery';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { AgricultureLivestockService } from 'src/app/shared/Socio-Economic/Agriculture/agricultureLivestock.service';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';

@Component({
  selector: 'app-livestock-production',
  templateUrl: './livestock-production.component.html',
  styleUrls: ['./livestock-production.component.css'],
})
export class LivestockProductionComponent implements OnInit {
  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };

  @ViewChild(PdfComponent)
  private pdfComponent!: PdfComponent;

  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private auth: AuthService,
    private service: AgricultureLivestockService,
    private modifyService: ModifyCityMunService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  munCityName: string = this.auth.munCityName;
  listLivestock: any = [];
  listBarangay: any = [];
  isAdd: boolean = false;
  listData: any = [];
  data: any = {};
  ngOnInit(): void {
    this.Init();
  }

  Init() {
    this.GetData();
    this.GetListBarangay();
  }

  GeneratePDF() {
    let data: any = [];
    let grandTotal: any = {};

    let reports: any = [];
    let columnLenght: number = 0;

    const tableData: any = [];

    this.reportService
      .GetAgricultureLivestockReport(this.pdfComponent.data)
      .subscribe({
        next: (response: any = {}) => {
          reports = response.data;
          grandTotal = response.grandTotal;

          console.log('result: ', response);

          data.push({
            margin: [0, 40, 0, 0],
            columns: [
              {
                text: `List of Poultry/ Livestock Production by Municipality/City`,
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
              text: 'Carabao',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Cattle',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Goat',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Swine',
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
                  sub.push({
                    text: '',
                    fillColor: '#9DB2BF',
                    alignment: 'left',
                  });
                }

                sub.push({
                  text: a.subTotal[key],
                  fillColor: '#9DB2BF',
                  alignment: key === 'subTotal' ? 'left' : 'center',
                });
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
                  sub.push({
                    text: '',
                    fillColor: '#9DB2BF',
                    alignment: 'left',
                  });
                }

                sub.push({
                  text: a.subTotal[key],
                  fillColor: '#9DB2BF',
                  alignment: key === 'subTotal' ? 'left' : 'center',
                });
              }
              tableData.push(sub);
            }
          });

          let grand: any = []; // GRAND TOTAL
          for (let key in grandTotal) {
            if (key === 'grandTotal') {
              grand.push({
                text: '',
                fillColor: '#F1C93B',
                alignment: 'left',
              });
            }

            grand.push({
              text: grandTotal[key],
              fillColor: '#F1C93B',
              alignment: key === 'grandTotal' ? 'left' : 'center',
            });
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
          this.pdfService.GeneratePdf(data, isPortrait, "");
          console.log(data);
        },
      });
  }

  message = 'Livestock/ Poultry Production';
  viewData: boolean = false;
  parentMethod() {
    this.viewData = true;
  }
  public showOverlay = false;
  importMethod() {
    // this.showOverlay = true;
    // this.service.Import().subscribe({
    //   next: (data) => {
    //     this.Init();
    //     if(data.length === 0){
    //       this.showOverlay = false;
    //       const Toast = Swal.mixin({
    //         toast: true,
    //         position: 'top-end',
    //         showConfirmButton: false,
    //         timer: 3000,
    //         timerProgressBar: true,
    //         didOpen: (toast) => {
    //           toast.addEventListener('mouseenter', Swal.stopTimer);
    //           toast.addEventListener('mouseleave', Swal.resumeTimer);
    //         },
    //       });
    //       Toast.fire({
    //         icon: 'info',
    //         title: 'No data from previous year',
    //       });
    //     }
    //     else
    //     {
    //       this.showOverlay = false;
    //       const Toast = Swal.mixin({
    //         toast: true,
    //         position: 'top-end',
    //         showConfirmButton: false,
    //         timer: 3000,
    //         timerProgressBar: true,
    //         didOpen: (toast) => {
    //           toast.addEventListener('mouseenter', Swal.stopTimer);
    //           toast.addEventListener('mouseleave', Swal.resumeTimer);
    //         },
    //       });
    //       Toast.fire({
    //         icon: 'success',
    //         title: 'Imported Successfully',
    //       });
    //     }
    //   },
    //   error: (error) => {
    //     const Toast = Swal.mixin({
    //       toast: true,
    //       position: 'top-end',
    //       showConfirmButton: false,
    //       timer: 3000,
    //       timerProgressBar: true,
    //       didOpen: (toast) => {
    //         toast.addEventListener('mouseenter', Swal.stopTimer);
    //         toast.addEventListener('mouseleave', Swal.resumeTimer);
    //       },
    //     });
    //     Toast.fire({
    //       icon: 'warning',
    //       title: 'Something went wrong',
    //     });
    //   },
    //   complete: () => {},
    // });
  }
  GetData() {
    this.service
      .GetListAgricultureLivestock(this.auth.setYear, this.auth.munCityId)
      .subscribe({
        next: (response) => {
          this.listLivestock = <any>response;
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

  FilterList() {
    let isExist;
    this.listData = [];

    this.listBarangay.forEach((a: any) => {
      this.listLivestock.forEach((b: any) => {
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
      this.data.munCityId = this.auth.munCityId;
      this.data.setYear = this.auth.activeSetYear;
      this.service.AddAgricultureLivestock(this.data).subscribe({
        next: (request) => {
          let index = this.listData.findIndex(
            (obj: any) => obj.brgyId === this.data.brgyId
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
    this.service.EditAgricultureLivestock(this.data).subscribe({
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
        this.service.DeleteAgricultureLivestock(transId).subscribe({
          next: (_data) => {},
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
