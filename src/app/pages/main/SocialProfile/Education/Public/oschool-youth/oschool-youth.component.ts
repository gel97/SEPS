import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { AuthService } from 'src/app/services/auth.service';
import { EducationOsyService } from 'src/app/shared/SocialProfile/Education/educationOsy.service';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';

@Component({
  selector: 'app-oschool-youth',
  templateUrl: './oschool-youth.component.html',
  styleUrls: ['./oschool-youth.component.css'],
})
export class OSchoolYouthComponent implements OnInit {
  munCityName: string = this.auth.munCityName;
  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private service: EducationOsyService,
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
  }

  markerObj: any = {};

  SetMarker(data: any = {}) {
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
  munCityId: string = this.auth.munCityId;
  setYear: string = this.auth.setYear;

  isAdd: boolean = true;
  listOsy: any = [];
  osy: any = {};
  listBarangay: any = [];

  Init() {
    this.GetListBarangay();
    this.GetListOsy();
  }

  GeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const dist1: any = [];
    const dist2: any = [];
    const contentData: any = [];

    let grandTotal:any = [];

    const tableData: any = [];
    this.reportService
      .GetEducationOsyReport(this.pdfComponent.data)
      .subscribe({
        next: (response: any = {}) => {
          reports = response.data;
          grandTotal = response.grandTotal;

          console.log('result: ', response);

          data.push({
            margin: [0, 40, 0, 0],
            columns: [
              {
                text: `Out of School Youth by Municipality/City`,
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
              text: 'Age 3-5',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Age 6-11',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Age 12-15',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Age 16-20',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Age 21-35 ',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Total ',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
          ]);
          reports.forEach((a: any, index: any) => {
            if(a.district == "1"){
             // contentData.push([{ text: b.munCityName, bold: true }]);
              tableData.push([
                  {
                    text: `1st Congressional District `,
                      colSpan: 8,
                      alignment: 'left',
                      fillColor: '#526D82',
                      marginLeft: 5,
                  }]);
              a.data.forEach((b: any, index2: any) => {
                tableData.push([
                  {
                    text: index2 + 1,
                    alignment: 'center',
                  },
                  {
                    text: b.munCityName,
                    alignment: 'left',
                  },
                  {
                    text: b.age3_5,
                    alignment: 'center',
                  },
                  {
                    text: b.age6_11,
                    alignment: 'center',
                  },
                  {
                    text: b.age12_15,
                    alignment: 'center',
                  },
                  {
                    text: b.age16_20,
                    alignment: 'center',
                  },
                  {
                    text: b.age21_35,
                    alignment: 'center',
                  },
                  {
                    text: b.total,
                    alignment: 'center',
                  },
                ]);
              });

              tableData.push([
                {
                  text: 'SUBTOTAL',
                  alignment: 'center',
                  colSpan:2,
                  fillColor: '#9DB2BF',
                },
                {},
                {
                  text: a.subTotal.age3_5,
                  alignment: 'center',
                  fillColor: '#9DB2BF',
                },
                {
                  text: a.subTotal.age6_11,
                  alignment: 'center',
                  fillColor: '#9DB2BF',
                },
                {
                  text: a.subTotal.age12_15,
                  alignment: 'center',
                  fillColor: '#9DB2BF',
                },
                {
                  text: a.subTotal.age16_20,
                  alignment: 'center',
                  fillColor: '#9DB2BF',
                },
                {
                  text: a.subTotal.age21_35,
                  alignment: 'center',
                  fillColor: '#9DB2BF',
                },
                {
                  text: a.subTotal.total,
                  alignment: 'center',
                  fillColor: '#9DB2BF',
                },
              ]);

            }
            if(a.district == "2"){
              // contentData.push([{ text: b.munCityName, bold: true }]);
               tableData.push([
                   {
                     text: `2nd Congressional District `,
                       colSpan: 8,
                       alignment: 'left',
                       fillColor: '#526D82',
                       marginLeft: 5,
                   }]);
               a.data.forEach((b: any, index2: any) => {
                 tableData.push([
                   {
                     text: index2 + 1,
                     alignment: 'center',
                   },
                   {
                     text: b.munCityName,
                     alignment: 'left',
                   },
                   {
                     text: b.age3_5,
                     alignment: 'center',
                   },
                   {
                     text: b.age6_11,
                     alignment: 'center',
                   },
                   {
                     text: b.age12_15,
                     alignment: 'center',
                   },
                   {
                     text: b.age16_20,
                     alignment: 'center',
                   },
                   {
                     text: b.age21_35,
                     alignment: 'center',
                   },
                   {
                    text: b.total,
                    alignment: 'center',
                  },
                 ]);
               });
 
               tableData.push([
                 {
                   text: 'SUBTOTAL',
                   alignment: 'center',
                   colSpan:2,
                   fillColor: '#9DB2BF',
                 },
                 {},
                 {
                   text: a.subTotal.age3_5,
                   alignment: 'center',
                   fillColor: '#9DB2BF',
                 },
                 {
                   text: a.subTotal.age6_11,
                   alignment: 'center',
                   fillColor: '#9DB2BF',
                 },
                 {
                   text: a.subTotal.age12_15,
                   alignment: 'center',
                   fillColor: '#9DB2BF',
                 },
                 {
                   text: a.subTotal.age16_20,
                   alignment: 'center',
                   fillColor: '#9DB2BF',
                 },
                 {
                   text: a.subTotal.age21_35,
                   alignment: 'center',
                   fillColor: '#9DB2BF',
                 },
                 {
                  text: a.subTotal.total,
                  alignment: 'center',
                  fillColor: '#9DB2BF',
                },
               ]);
 
             }
           
          });
          tableData.push([
            {
              text: 'GRANDTOTAL',
              alignment: 'center',
              colSpan:2,
              fillColor: '#F1C93B',
            },
            {},
            {
              text: grandTotal.age3_5,
              alignment: 'center',
              fillColor: '#F1C93B',
            },
            {
              text: grandTotal.age6_11,
              alignment: 'center',
              fillColor: '#F1C93B',
            },
            {
              text: grandTotal.age12_15,
              alignment: 'center',
              fillColor: '#F1C93B',
            },
            {
              text: grandTotal.age16_20,
              alignment: 'center',
              fillColor: '#F1C93B',
            },
            {
              text: grandTotal.age21_35,
              alignment: 'center',
              fillColor: '#F1C93B',
            },
            {
              text: grandTotal.total,
              alignment: 'center',
              fillColor: '#F1C93B',
            },
          ]);
         
          contentData.push([
            {
              margin: [0, 10, 0, 10],
              table: {
                widths: [25, '*', '*', '*', '*', '*', '*', '*'],
                body: tableData,
              },
              layout: 'lightHorizontalLines',
            },
          ]);

          data.push(contentData);
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

  GetListBarangay() {
    this.service.ListOfBarangay(this.auth.munCityId).subscribe((data) => {
      this.listBarangay = <any>data;
    });
  }

  GetListOsy() {
    this.service.GetListEducationOsy(this.munCityId, this.setYear).subscribe({
      next: (response) => {
        this.listOsy = <any>response;
        console.log(this.listOsy);
      },
      error: (error) => {
        Swal.fire('Oops!', 'Something went wrong.', 'error');
      },
      complete: () => {},
    });
  }

  AddOsy() {
    this.toValidate.brgyId =
      this.osy.brgyId == '' || this.osy.brgyId == null ? true : false;

    this.osy.setYear = this.setYear;
    this.osy.munCityId = this.munCityId;

    if (!this.toValidate.name && !this.toValidate.brgyId) {
      this.service.AddEducationOsy(this.osy).subscribe({
        next: (request) => {
          this.GetListOsy();
        },
        error: (error) => {
          Swal.fire('Oops!', 'Something went wrong.', 'error');
        },
        complete: () => {
          if (!this.isCheck) {
            this.closebutton.nativeElement.click();
          }
          this.osy = {};
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

  EditOsy() {
    this.toValidate.brgyId =
      this.osy.brgyId == '' || this.osy.brgyId == null ? true : false;

    this.osy.longtitude = this.gmapComponent.markers.lng;
    this.osy.latitude = this.gmapComponent.markers.lat;

    this.osy.setYear = this.setYear;
    this.osy.munCityId = this.munCityId;
    if (!this.toValidate.brgyId) {
      this.service.EditEducationOsy(this.osy).subscribe({
        next: (request) => {
          this.GetListOsy();
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
    } else {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields.',
        'warning'
      );
    }
  }

  DeleteOsy(transId: any) {
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
        this.service.DeleteEducationOsy(transId).subscribe((request) => {
          this.GetListOsy();
        });
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  }
}
