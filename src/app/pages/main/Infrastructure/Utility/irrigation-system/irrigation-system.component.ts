import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { AuthService } from 'src/app/services/auth.service';
import { ServiceIrrigationService } from 'src/app/shared/Infrastructure/Utilities/service-irrigation.service';
import { isEmptyObject } from 'jquery';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';

@Component({
  selector: 'app-irrigation-system',
  templateUrl: './irrigation-system.component.html',
  styleUrls: ['./irrigation-system.component.css'],
})
export class IrrigationSystemComponent implements OnInit {
  munCityName: string = this.auth.munCityName;
  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private service: ServiceIrrigationService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService
  ) {}

  @ViewChild(PdfComponent)
  private pdfComponent!: PdfComponent;

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  message = 'Irrigation Systems';

  viewData: boolean = true;
  parentMethod() {
    // alert('parent Method');
    this.viewData = true;
  }

  toValidate: any = {};
  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };
  isCheck: boolean = false;

  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
  }

  ngOnInit(): void {
    this.Init();
  }

  GeneratePDF() {
    let data: any = [];
    let grandTotal: any = {};

    let reports: any = [];
    let columnLenght: number = 0;

    const tableData: any = [];

    this.reportService
      .GetServiceIrrigationReport(this.pdfComponent.data)
      .subscribe({
        next: (response: any = {}) => {
          reports = response.data;
          grandTotal = response.grandTotal;

          console.log('result: ', response);

          data.push({
            margin: [0, 40, 0, 0],
            columns: [
              {
                text: `Irrigation Systems by Municipality/City`,
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
              text: 'Irrigable Area (Has) -NIA',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Irrigate Area (Has) -NIA',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'No. of Farmer Beneficiaries - NIA',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Irrigable Area (Has) -Communal',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Irrigate Area (Has) -Communal',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'No. of Farmer Beneficiaries - Communal',
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
            }
            
          ]);

          reports.forEach((a: any) => {
            if (a.district === 1) {
              let columnWidth: number = 0;
              a.data.forEach((b: any, index: any) => {
        
                if (index === 0) {
                  tableData.push([
                    {
                      text: `1st Congressional District `,
                      colSpan: 9,
                      alignment: 'left',
                      fillColor: '#526D82',
                      marginLeft: 5,
                    },
                  ]);

                  columnLenght = columnWidth - 1;
                }
                tableData.push([
                  {
                    text:index + 1,
                    fillColor: '#ffffff',
                    alignment: 'center',
                  },
                  {
                    text:b.munCityName,
                    fillColor: '#ffffff',
                    alignment: 'center',
                  },
                  {
                    text:b.munData.irrigableNtl,
                    fillColor: '#ffffff',
                    alignment: 'center',
                  },
                  {
                    text:b.munData.irrigatedNtl,
                    fillColor: '#ffffff',
                    alignment: 'center',
                  },
                  {
                    text:b.munData.farmerNtl,
                    fillColor: '#ffffff',
                    alignment: 'center',
                  },
                  {
                    text:b.munData.irrigableCom,
                    fillColor: '#ffffff',
                    alignment: 'center',
                  },
                  {
                    text:b.munData.irrigatedCom,
                    fillColor: '#ffffff',
                    alignment: 'center',
                  },
                  {
                    text:b.munData.farmerCom,
                    fillColor: '#ffffff',
                    alignment: 'center',
                  },
                  {
                    text:b.munData.remarks,
                    fillColor: '#ffffff',
                    alignment: 'center',
                  },
                ]);
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
                  let textValue: any = a.subTotal[key];
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
               
                if (index === 0) {
                  tableData.push([
                    {
                      text: `2nd Congressional District `,
                      colSpan: 9,
                      alignment: 'left',
                      fillColor: '#526D82',
                      marginLeft: 5,
                    },
                  ]);
                }
                tableData.push([
                  {
                    text:index + 1,
                    fillColor: '#ffffff',
                    alignment: 'center',
                  },
                  {
                    text:b.munCityName,
                    fillColor: '#ffffff',
                    alignment: 'center',
                  },
                  {
                    text:b.munData.irrigableNtl,
                    fillColor: '#ffffff',
                    alignment: 'center',
                  },
                  {
                    text:b.munData.irrigatedNtl,
                    fillColor: '#ffffff',
                    alignment: 'center',
                  },
                  {
                    text:b.munData.farmerNtl,
                    fillColor: '#ffffff',
                    alignment: 'center',
                  },
                  {
                    text:b.munData.irrigableCom,
                    fillColor: '#ffffff',
                    alignment: 'center',
                  },
                  {
                    text:b.munData.irrigatedCom,
                    fillColor: '#ffffff',
                    alignment: 'center',
                  },
                  {
                    text:b.munData.farmerCom,
                    fillColor: '#ffffff',
                    alignment: 'center',
                  },
                  {
                    text:b.munData.remarks,
                    fillColor: '#ffffff',
                    alignment: 'center',
                  },
                ]);

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
                  let textValue: any= a.subTotal[key];
                
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
              let textValue: any = grandTotal[key];         
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
              widths: [25,'*','*','*','*','*','*','*','*'],
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
        if(data === null){
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

  isAdd: boolean = true;
  hasData: boolean = false;
  irrigation: any = {};
  vieIrrig: any = {};

  Init() {
    this.GetIrrigation();
  }

  GetIrrigation() {
    console.log(this.munCityId + ' | ' + this.setYear);

    this.service.GetServiceIrrigation(this.munCityId, this.setYear).subscribe({
      next: (response) => {
        console.log(response);
        if (response !== null) {
          this.irrigation = <any>response;
          this.hasData = true;
          this.viewData = true;
        } else {
          this.hasData = false;
          this.viewData = false;
        }
      },
      error: (error) => {
        Swal.fire('Oops!', 'Something went wrong.', 'error');
      },
      complete: () => {},
    });
  }

  AddIrrigation() {
    if (!isEmptyObject(this.irrigation)) {
      this.irrigation.setYear = this.setYear;
      this.irrigation.munCityId = this.munCityId;
      this.service.AddServiceIrrigation(this.irrigation).subscribe({
        next: (request) => {
          this.GetIrrigation();
        },
        error: (error) => {
          Swal.fire('Oops!', 'Something went wrong.', 'error');
        },
        complete: () => {
          // if (!this.isCheck) {
          this.closebutton.nativeElement.click();
          // }
          this.irrigation = {};
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

  EditIrrigation() {
    this.irrigation.setYear = this.setYear;
    this.irrigation.munCityId = this.munCityId;

    this.service.EditServiceIrrigation(this.irrigation).subscribe({
      next: (request) => {
        this.GetIrrigation();
      },
      error: (error) => {
        Swal.fire('Oops!', 'Something went wrong.', 'error');
      },
      complete: () => {
        this.closebutton.nativeElement.click();
        Swal.fire('Good job!', 'Data Updated Successfully!', 'success');
      },
    });
  }

  DeleteIrrigation(transId: any) {
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
        this.service.DeleteServiceIrrigation(transId).subscribe((request) => {
          this.Init();
          this.irrigation = {};
        });
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  }
}
