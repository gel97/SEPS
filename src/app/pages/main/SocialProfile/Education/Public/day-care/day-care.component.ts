import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { EducationSchoolsService } from 'src/app/shared/SocialProfile/Education/educationSchools.service';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';
@Component({
  selector: 'app-day-care',
  templateUrl: './day-care.component.html',
  styleUrls: ['./day-care.component.css'],
})
export class DayCareComponent implements OnInit {
  menuId: string = '3';
  munCityName: string = this.auth.munCityName;
  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private service: EducationSchoolsService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

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

  ngOnInit(): void {
    this.Init();
  }

  public showOverlay = false;
  message = 'Day Care Center';
  importMethod() {
    this.showOverlay = true;
    this.service.Import(this.menuId).subscribe({
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

  GeneratePDF() {
    let data: any = [];
    let grandTotal: any = {};

    let reports: any = [];
    let columnLenght: number = 0;

    const tableData: any = [];

    this.pdfComponent.data.menuId = this.menuId;

    this.reportService
      .GetEducationSchoolReport(this.pdfComponent.data)
      .subscribe({
        next: (response: any = {}) => {
          reports = response.data;
          grandTotal = response.grandTotal;

          console.log('result: ', response);

          data.push({
            margin: [0, 40, 0, 0],
            columns: [
              {
                text: `DayCare by Municipality/City`,
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
              text: 'School',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
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
                    text: a.subTotal[key],
                    fillColor: '#9DB2BF',
                    alignment: 'left',
                    colSpan:2,
                    marginLeft:5
                  },{});
                }else{
                  sub.push({
                    text: a.subTotal[key],
                    fillColor: '#9DB2BF',
                    alignment:'center',
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
                  sub.push({
                    text: a.subTotal[key],
                    fillColor: '#9DB2BF',
                    alignment: 'left',
                    colSpan:2,
                    marginLeft:5
                  },{});
                }else{
                  sub.push({
                    text: a.subTotal[key],
                    fillColor: '#9DB2BF',
                    alignment:'center',
                  });
                }     
              }
              tableData.push(sub);
            }
          });

          let grand: any = []; // GRAND TOTAL
          for (let key in grandTotal) {
            if (key == 'grandTotal') {
              grand.push({
                text: grandTotal[key],
                fillColor: '#F1C93B',
                alignment: 'left',
                colSpan: 2,
                marginLeft:5
              },{});
            }
            else{
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
  munCityId: string = this.auth.munCityId;
  setYear: string = this.auth.setYear;

  isAdd: boolean = true;
  listDaycare: any = [];
  daycare: any = {};
  listBarangay: any = [];

  Init() {
    this.GetListBarangay();
    this.GetListDcarechool();
  }

  GetListBarangay() {
    this.service.ListOfBarangay(this.auth.munCityId).subscribe((data) => {
      this.listBarangay = <any>data;
    });
  }

  GetListDcarechool() {
    this.service
      .GetListEducationSchools(this.menuId, this.setYear, this.munCityId)
      .subscribe({
        next: (response) => {
          this.listDaycare = <any>response;
        },
        error: (error) => {
          Swal.fire('Oops!', 'Something went wrong.', 'error');
        },
        complete: () => {},
      });
  }

  AddDcareSchool() {
    this.toValidate.name =
      this.daycare.name == '' || this.daycare.name == null ? true : false;
   
    this.toValidate.brgyId =
      this.daycare.brgyId == '' || this.daycare.brgyId == null ? true : false;

    this.daycare.menuId = this.menuId;
    this.daycare.setYear = this.setYear;
    this.daycare.munCityId = this.munCityId;

    if (
      !this.toValidate.name &&
      !this.toValidate.brgyId 
    ) {
      this.service.AddEducationSchool(this.daycare).subscribe({
        next: (request) => {
          this.GetListDcarechool();
        },
        error: (error) => {
          Swal.fire('Oops!', 'Something went wrong.', 'error');
        },
        complete: () => {
          if (!this.isCheck) {
            this.closebutton.nativeElement.click();
          }
          this.daycare = {};
          Swal.fire('Good job!', 'Data Added Successfully!', 'success');
        },
      });
    } else {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields.',
        'warning'
      );
    }
  }

  EditDcareSchool() {
    this.toValidate.name =
      this.daycare.name == '' || this.daycare.name == null ? true : false;
  
    this.toValidate.brgyId =
      this.daycare.brgyId == '' || this.daycare.brgyId == null ? true : false;

    this.daycare.longtitude = this.gmapComponent.markers.lng;
    this.daycare.latitude = this.gmapComponent.markers.lat;

    this.daycare.menuId = this.menuId;
    this.daycare.setYear = this.setYear;
    this.daycare.munCityId = this.munCityId;

    if (
      !this.toValidate.name &&
      !this.toValidate.brgyId 
    ) {
      this.service.EditEducationSchool(this.daycare).subscribe({
        next: (request) => {
          this.GetListDcarechool();
          this.daycare = {};
        },
        error: (error) => {
          Swal.fire('Oops!', 'Something went wrong.', 'error');
        },
        complete: () => {
          // this.closebutton.nativeElement.click();
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Your work has been updated',
            showConfirmButton: false,
            timer: 1000,
          });
          document.getElementById('mEducation')?.click();
        },
      });
    } else {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields.',
        'warning'
      );
    }
  }

  DeleteDcareSchool(transId: any) {
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
        this.service.DeleteEducationSchool(transId).subscribe((request) => {
          this.GetListDcarechool();
        });
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  }
}
