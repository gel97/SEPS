import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { isEmptyObject } from 'jquery';
import { PostalServicesService } from 'src/app/shared/Infrastructure/Utilities/Communication/postal-services.service';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';

@Component({
  selector: 'app-postal-services',
  templateUrl: './postal-services.component.html',
  styleUrls: ['./postal-services.component.css'],
})
export class PostalServicesComponent implements OnInit {
  munCityName: string = this.auth.munCityName;
  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private service: PostalServicesService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  toValidate: any = {};
  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };

  @ViewChild(PdfComponent)
  private pdfComponent!: PdfComponent;

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

    this.reportService.GetComPostalReport(this.pdfComponent.data).subscribe({
      next: (response: any = {}) => {
        reports = response.data;
        grandTotal = response.grandTotal;

        console.log('result: ', response);

        data.push({
          margin: [0, 40, 0, 0],
          columns: [
            {
              text: `Number of Postal Services by Municipality/City`,
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
            fontSize: 9
          },
          {
            text: 'Municipality/ City',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9
          },
          {
            text: 'Post Office/ Location',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9
          },
          {
            text: 'No. of Post Masters',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9
          },
          {
            text: 'Mail Sorters',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9
          },
          {
            text: 'Postal Clerks',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9
          },
          {
            text: 'Mail Carriers',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9
          },
          {
            text: 'Mail Truck/ Van',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9
          },
          {
            text: 'Motorcycle',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9
          },
          {
            text: 'Bicycle',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9
          },
          {
            text: 'Postal Stations',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9
          },
        ]);

        reports.forEach((a: any) => {
          let _district:string = "1st";
          if(a.district === 2){
            _district = "2nd"
          }
          tableData.push([
            {
              text: `${_district} Congressional District `,
              colSpan: 11,
              alignment: 'left',
              fillColor: '#526D82',
              marginLeft: 5,
              fontSize: 9
            },
          ]);
          a.data.forEach((b: any, index2: any) => {
            tableData.push([
              {
                text: index2 + 1,
                fillColor: '#FFFFFF',
                alignment: 'center',
                fontSize: 9
              },
              {
                text: b.munCityName,
                fillColor: '#FFFFFF',
                fontSize: 9
              },
              {
                text: b.munData.location,
                fillColor: '#FFFFFF',
                fontSize: 9
              },
              {
                text: b.munData.postMastersNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
                fontSize: 9
              },
              {
                text: b.munData.mailSortersNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
                fontSize: 9
              },
              {
                text: b.munData.postalClerkNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
                fontSize: 9
              },
              {
                text: b.munData.postalCarriersNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
                fontSize: 9
              },
              {
                text: b.munData.mailTruck,
                fillColor: '#FFFFFF',
                alignment: 'center',
                fontSize: 9
              },
              {
                text: b.munData.motorcycle,
                fillColor: '#FFFFFF',
                alignment: 'center',
                fontSize: 9
              },
              {
                text: b.munData.bicycle,
                fillColor: '#FFFFFF',
                alignment: 'center',
                fontSize: 9
              },
              {
                text: b.munData.postalStations,
                fillColor: '#FFFFFF',
                fontSize: 9
              },
            ]);
          });

          tableData.push([
            {
              text: 'SUBTOTAL',
              fillColor: '#9DB2BF',
              colSpan: 3,
              marginLeft: 5,
              fontSize: 9
            },
            {},
            {},
            {
              text: a.subtotal.postMastersNo,
              fillColor: '#9DB2BF',
              alignment: 'center',
              fontSize: 9
            },
            {
              text: a.subtotal.mailSortersNo,
              fillColor: '#9DB2BF',
              alignment: 'center',
              fontSize: 9
            },
            {
              text: a.subtotal.postalClerkNo,
              fillColor: '#9DB2BF',
              alignment: 'center',
              fontSize: 9
            },
            {
              text: a.subtotal.postalCarriersNo,
              fillColor: '#9DB2BF',
              alignment: 'center',
              fontSize: 9
            },
            {
              text: a.subtotal.mailTruck,
              fillColor: '#9DB2BF',
              alignment: 'center',
              fontSize: 9
            },
            {
              text: a.subtotal.motorcycle,
              fillColor: '#9DB2BF',
              alignment: 'center',
              fontSize: 9
            },
            {
              text: a.subtotal.bicycle,
              fillColor: '#9DB2BF',
              alignment: 'center',
              fontSize: 9
            },
            {text: '',
              fillColor: '#9DB2BF'},
          ]);
        });

        tableData.push([
          {
            text: 'GRANDTOTAL',
            fillColor:'#F1C93B',
            colSpan: 3,
            marginLeft: 5,
            fontSize: 9
          },{},{},
         {
            text: grandTotal.postMastersNo,
            fillColor:'#F1C93B',
            alignment: 'center',
          }, {
            text: grandTotal.mailSortersNo,
            fillColor:'#F1C93B',
            alignment: 'center',
            fontSize: 9
          }, {
            text: grandTotal.postalClerkNo,
            fillColor:'#F1C93B',
            alignment: 'center',
            fontSize: 9
          }, {
            text: grandTotal.postalCarriersNo,
            fillColor:'#F1C93B',
            alignment: 'center',
            fontSize: 9
          }, {
            text: grandTotal.mailTruck,
            fillColor:'#F1C93B',
            alignment: 'center',
            fontSize: 9
          }, {
            text: grandTotal.motorcycle,
            fillColor:'#F1C93B',
            alignment: 'center',
            fontSize: 9
          }, {
            text: grandTotal.bicycle,
            fillColor:'#F1C93B',
            alignment: 'center',
            fontSize: 9
          },{text: '',
            fillColor:'#F1C93B',}
        ]);

        const table = {
          margin: [0, 10, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*', '*', '*', '*', '*', '*', '*'],
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
        if (data === null) {
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
  munCityId: string = this.auth.munCityId;
  setYear: string = this.auth.setYear;

  isAdd: boolean = true;
  hasData: boolean = false;
  data: any = {};

  Init() {
    this.GetData();
  }

  message = 'Postal Service Facilities';

  viewData: boolean = false;
  parentMethod() {
    // alert('parent Method');
    this.viewData = true;
  }

  GetData() {
    this.service.GetPostal(this.setYear, this.munCityId).subscribe({
      next: (response) => {
        console.log(response);
        if (response !== null) {
          this.data = <any>response;
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

  AddData() {
    if (!isEmptyObject(this.data)) {
      this.data.setYear = this.setYear;
      this.data.munCityId = this.munCityId;

      this.service.AddPostal(this.data).subscribe({
        next: (request) => {
          this.GetData();
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
      Swal.fire('Empty Fields.', 'Please fill out the input fields', 'warning');
    }
  }

  EditData() {
    this.data.setYear = this.setYear;
    this.data.munCityId = this.munCityId;

    this.service.EditPostal(this.data).subscribe({
      next: (request) => {
        this.GetData();
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

  DeleteData(transId: any) {
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
        this.service.DeletePostal(transId).subscribe((request) => {
          this.Init();
          this.data = {};
        });
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  }
}
