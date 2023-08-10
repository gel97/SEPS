import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HealthSanitaryService } from 'src/app/shared/SocialProfile/Health/healthSanitary.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';
@Component({
  selector: 'app-sanitary-facilities',
  templateUrl: './sanitary-facilities.component.html',
  styleUrls: ['./sanitary-facilities.component.css'],
})
export class SanitaryFacilitiesComponent implements OnInit {
  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private Auth: AuthService,
    private Service: HealthSanitaryService,
    private modifyService: ModifyCityMunService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  isCheck: boolean = false;

  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
    console.log('isCheck:', this.isCheck);
  }

  munCityName: string = this.Auth.munCityName;
  dataList: any = [];
  setYear = this.Auth.setYear;
  munCityId = this.Auth.munCityId;
  barangayList: any = [];
  addData: any = {};
  dummy_addData = 'string';
  dummyData: any = {};
  visible: boolean = true;
  not_visible: boolean = true;
  //required == not_visible
  required: boolean = true;
  latitude: any;
  longtitude: any;
  checker_brgylist: any = {};
  toValidate: any = {};
  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };

  @ViewChild(PdfComponent)
  private pdfComponent!: PdfComponent;

  ngOnInit(): void {
    this.GetHealthSanitary();
    this.GetBarangayList();
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

    this.reportService
      .GetHealthSanitaryReport(this.pdfComponent.data)
      .subscribe({
        next: (response: any = {}) => {
          reports = response.data;
          grandTotal = response.grandTotal;

          console.log('result: ', response);

          data.push({
            margin: [0, 40, 0, 0],
            columns: [
              {
                text: `Households with Access to Safe Water Supply and Sanitary Facilities by Municipality/City`,
                fontSize: 11,
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
              text: 'Total No. of Households',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'With Access to Safe Water Supply',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Percentage',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'With Access to Sanitary Facilities',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Percentage',
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
                  let textValue: any;
                  if (index === 0) {
                    columnWidth++;
                  }
                  if (
                    key === 'safeWaterPercent' ||
                    key === 'toiletsNoPercent'
                  ) {
                    textValue = b[key].toFixed(2);
                  } else if (
                    key === 'householdNo' ||
                    key === 'safeWaterNo' ||
                    key === 'toiletsNo'
                  ) {
                    textValue = this.formatNumber(b[key]);
                  } else {
                    textValue = b[key];
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
                  let textValue: any;
                  if (
                    key === 'safeWaterPercent' ||
                    key === 'toiletsNoPercent'
                  ) {
                    textValue = a.subTotal[key].toFixed(2);
                  } else if (
                    key === 'householdNo' ||
                    key === 'safeWaterNo' ||
                    key === 'toiletsNo'
                  ) {
                    textValue = this.formatNumber(a.subTotal[key]);
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
                  if (
                    key === 'safeWaterPercent' ||
                    key === 'toiletsNoPercent'
                  ) {
                    textValue = b[key].toFixed(2);
                  } else if (
                    key === 'householdNo' ||
                    key === 'safeWaterNo' ||
                    key === 'toiletsNo'
                  ) {
                    textValue = this.formatNumber(b[key]);
                  } else {
                    textValue = b[key];
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
                  let textValue: any;
                  if (
                    key === 'safeWaterPercent' ||
                    key === 'toiletsNoPercent'
                  ) {
                    textValue = a.subTotal[key].toFixed(2);
                  } else if (
                    key === 'householdNo' ||
                    key === 'safeWaterNo' ||
                    key === 'toiletsNo'
                  ) {
                    textValue = this.formatNumber(a.subTotal[key]);
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
              if (
                key === 'safeWaterPercent' ||
                key === 'toiletsNoPercent'
              ) {
                textValue = grandTotal[key].toFixed(2);
              } else if (
                key === 'householdNo' ||
                key === 'safeWaterNo' ||
                key === 'toiletsNo'
              ) {
                textValue = this.formatNumber(grandTotal[key]);
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
          this.pdfService.GeneratePdf(data, isPortrait);
          console.log(data);
        },
      });
  }

  GetHealthSanitary() {
    this.Service.GetHealthSanitary(this.setYear, this.munCityId).subscribe(
      (response) => {
        this.dataList = <any>response;
        console.log('check', response);
      }
    );
  }

  GetBarangayList() {
    this.Service.ListOfBarangay(this.munCityId).subscribe((response) => {
      this.barangayList = <any>response;
      console.log('barangay', response);
    });
  }

  findBrgyId(brgyId: any) {
    return this.barangayList.find(
      (item: { brgyId: any }) => item.brgyId === brgyId
    );
  }

  AddHealthSanitary() {
    console.log('trap', this.addData);
    console.log('brgyid', this.addData.brgyId);
    this.dummy_addData = this.addData;
    console.log('trap_2', this.dummy_addData);
    this.toValidate.brgyId =
      this.addData.brgyId == '' || this.addData.brgyId == null ? true : false;
    this.toValidate.householdNo =
      this.addData.householdNo == '' || this.addData.householdNo == null
        ? true
        : false;

    if (this.toValidate.brgyId == true || this.toValidate.householdNo == true) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      if (
        JSON.stringify(this.dummy_addData) != JSON.stringify(this.dummyData) &&
        this.addData.brgyId != undefined
      ) {
        this.addData.setYear = this.setYear;
        this.addData.munCityId = this.munCityId;
        console.log('brgylist', this.barangayList);

        const result = this.findBrgyId(this.addData.brgyId);
        this.longtitude = result.longitude;
        this.addData.longtitude = this.longtitude;
        console.log('long', this.longtitude);
        this.latitude = result.latitude;
        this.addData.latitude = this.latitude;
        console.log('lat', this.latitude);

        this.Service.AddHealthSanitary(this.addData).subscribe((request) => {
          if (!this.isCheck) {
            this.closebutton.nativeElement.click();
          }
          console.log('add', request);
          this.clearData();
          this.GetHealthSanitary();
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Your work has been saved',
            showConfirmButton: false,
            timer: 1500,
          });
        });
      } else {
        this.required = true;
        Swal.fire({
          icon: 'warning',
          title: 'Oops...',
          text: 'Missing data!',
        });
      }
    }
  }

  EditHealthSanitary() {
    this.toValidate.brgyId =
      this.addData.brgyId == '' || this.addData.brgyId == null ? true : false;
    this.toValidate.householdNo =
      this.addData.householdNo == '' || this.addData.householdNo == null
        ? true
        : false;

    if (this.toValidate.brgyId == true || this.toValidate.householdNo == true) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.addData.setYear = this.setYear;
          this.addData.munCityId = this.munCityId;
          this.addData.tag = 1;
          console.log('edit', this.addData);
          this.Service.EditHealthSanitary(this.addData).subscribe((request) => {
            console.log('edit', request);
            this.GetHealthSanitary();
          });
          Swal.fire('Saved!', '', 'success');
          document.getElementById('exampleModal')?.click();
        } else if (result.isDenied) {
          Swal.fire('Changes are not saved', '', 'info');
        }
      });
    }
  }
  DeleteHealthSanitary(dataItem: any) {
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
        this.Service.DeleteHealthSanitary(dataItem.transId).subscribe(
          (request) => {}
        );
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
        this.ngOnInit();
      }
    });
  }

  clearData() {
    this.addData = {};
    this.not_visible = false;
    this.visible = true;
    this.required = false;
  }

  editToggle() {
    this.not_visible = true;
    this.visible = false;
  }
}
