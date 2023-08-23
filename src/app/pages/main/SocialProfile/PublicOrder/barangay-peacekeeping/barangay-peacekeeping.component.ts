import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SafetyTanodService } from 'src/app/shared/SocialProfile/PublicOrder/safety-tanod.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';

@Component({
  selector: 'app-barangay-peacekeeping',
  templateUrl: './barangay-peacekeeping.component.html',
  styleUrls: ['./barangay-peacekeeping.component.css'],
})
export class BarangayPeacekeepingComponent implements OnInit {
  @ViewChild(PdfComponent)
  private pdfComponent!: PdfComponent;
  
  munCityName = this.Auth.munCityName;
  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private Auth: AuthService,
    private service: SafetyTanodService,
    private modifyService: ModifyCityMunService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  setYear = Number(this.Auth.setYear);
  munCityId = this.Auth.munCityId;
  listData: any = [];
  addData: any = {};
  editData: any = {};
  listBarangayData: any = [];
  idCounter: number = 1;
  updateForm: boolean = false;
  toValidate: any = {};

  ngOnInit(): void {
    this.resetForm();
    this.GetSafetyTanod();
    this.getListOfBarangay();
  }

  GeneratePDF() {
    let data: any = [];
    let grandTotal: any = {};

    let reports: any = [];
    let columnLenght: number = 0;

    const tableData: any = [];

    this.reportService
      .GetSafetyTanodReport(this.pdfComponent.data)
      .subscribe({
        next: (response: any = {}) => {
          reports = response.data;
          grandTotal = response.grandTotal;

          console.log('result: ', response);

          data.push({
            margin: [0, 40, 0, 0],
            columns: [
              {
                text: `Barangay Peacekeeping/ Tanod Services by Municipality/City`,
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
              text: 'No. of Barangay Tanod',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'No. of Tanod Vehicles',
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
                let dist: any = [];
                for (let key in b) {
                  let textValue: any = b[key];
                  if (index === 0) {
                    columnWidth++;
                  }
               
                  dist.push({
                    text:
                      key === 'munCityId' ? (b[key] = index + 1) : textValue,
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
                let dist: any = [];
                for (let key in b) {
                  let textValue: any = b[key];
                  if (index === 0) {
                    columnWidth++;
                  }
                
                  dist.push({
                    text:
                      key === 'munCityId' ? (b[key] = index + 1) : textValue,
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
          this.pdfService.GeneratePdf(data, isPortrait);
          console.log(data);
        },
      });
  }

  resetForm(): void {
    this.addData = {};
  }

  GetSafetyTanod(): void {
    this.service.GetSafetyTanod(this.setYear, this.munCityId).subscribe({
      next: (response) => {
        this.listData = response;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('GetSafetyTanod() completed.');
      },
    });
  }

  AddSafetyTanod(addData: any): void {
    this.toValidate.brgyId =
      this.addData.brgyId == '' || this.addData.brgyId == null ? true : false;

    if (this.toValidate.brgyId == true) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.addData.setYear = Number(this.setYear);
      this.addData.id = this.idCounter++;
      this.service.AddSafetyTanod(addData).subscribe({
        next: (response) => {
          this.listData.push(response);
          console.log(response);
          Swal.fire('Good job!', 'Data Added Successfully!', 'success');
          document.getElementById('mAdd')?.click();
          // this.resetForm();
        },
        error: (err) => {
          console.log(err);
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: '',
            text: 'This record is already existing!',
            showConfirmButton: false,
            timer: 3000,
          });
          this.resetForm();
        },
        complete: () => {
          // console.log('AddSafetyTanod() completed.');
        },
      });
    }
  }

  // AddSafetyTanod(addData: any): void {
  //   addData.setYear = Number(this.setYear);
  //   addData.id = this.idCounter++;
  //   // console.log(addData);
  //   this.service.AddSafetyTanod(addData).subscribe({
  //     next: (response) => {
  //       this.listData.push(response);
  //       console.log(response);
  //       Swal.fire({
  //         position: 'center',
  //         icon: 'success',
  //         title: 'Your work has been saved',
  //         showConfirmButton: false,
  //         timer: 1000,
  //       });
  //       this.resetForm();
  //     },
  //     error: (err) => {
  //       console.log(err);
  //       Swal.fire({
  //         position: 'center',
  //         icon: 'error',
  //         title: 'Something went wrong!',
  //         text: err.message,
  //         showConfirmButton: false,
  //         timer: 3000,
  //       });
  //       this.resetForm();
  //     },
  //     complete: () => {
  //       console.log('AddSafetyTanod() completed.');
  //     },
  //   });
  // }

  EditSafetyTanod(addData: any): void {
    this.service.EditSafetyTanod(addData).subscribe({
      next: (response) => {
        this.GetSafetyTanod();
        //this.listData.push(response);
        // console.log(response);
        console.log(response);

        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your work has been updated',
          showConfirmButton: false,
          timer: 1000,
        });
        document.getElementById('mAdd')?.click();
        // this.resetForm();
      },
      error: (err) => {
        console.log(err);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: '',
          text: 'Update unsuccessful!',
          showConfirmButton: false,
          timer: 3000,
        });
      },
      complete: () => {
        // console.log('UpdateSafetyTanod() completed.');
      },
    });
  }

  DeleteSafetyTanod(id: any): void {
    Swal.fire({
      title: '',
      text: 'Do you want to remove this data?.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.DeleteSafetyTanod(id).subscribe({
          next: (response) => {
            const index = this.listData.findIndex((d: any) => d.transId === id);
            //console.log(index);
            this.deleteData(id);
            this.listData.splice(index, 1);
            console.log(response);
            Swal.fire('Deleted!', 'Your file has been removed.', 'success');
            // Swal.fire({
            //   position: 'center',
            //   icon: 'success',
            //   title: '',
            //   text: 'The Peacekeeping Patrol (Tanod) Record has been deleted',
            //   showConfirmButton: false,
            //   timer: 1000,
            // });
          },
          error: (err) => {
            console.log(err);
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: '',
              text: 'Something went wrong!',
              showConfirmButton: false,
              timer: 3000,
            });
          },
          complete: () => {
            console.log('DeleteSafetyTanod() completed.');
          },
        });
      }
    });
  }

  deleteData(id: number) {
    this.listData = this.listData.filter(
      (data: { id: number }) => data.id !== id
    );
  }

  getListOfBarangay(): void {
    this.service.ListOfBarangay(this.munCityId).subscribe((response) => {
      console.log('Barangay: ', response);
      this.listBarangayData = response;
    });
  }
}
