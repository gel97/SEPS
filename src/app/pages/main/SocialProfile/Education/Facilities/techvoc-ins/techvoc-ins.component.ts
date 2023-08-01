import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { AuthService } from 'src/app/services/auth.service';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { EducationTechVocService } from 'src/app/shared/SocialProfile/Education/educationTechVoc.service';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';
@Component({
  selector: 'app-techvoc-ins',
  templateUrl: './techvoc-ins.component.html',
  styleUrls: ['./techvoc-ins.component.css']
})
export class TechvocInsComponent implements OnInit {
  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;

  @ViewChild(PdfComponent)
  private pdfComponent!: PdfComponent;
  
  munCityName: string = this.auth.munCityName;
  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private service: EducationTechVocService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
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
  munCityId: string = this.auth.munCityId;
  setYear: string = this.auth.setYear;

  isAdd: boolean = true;
  list: any = [];
  data: any = {};
  listBarangay: any = [];

  Init() {
    this.GetListBarangay();
    this.GetListData();
  }

  GeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.reportService.GetEducationTechVocReport(this.pdfComponent.data).subscribe({
      next: (response: any = {}) => {
        reports = response;
        console.log('result: ', response);

        reports.forEach((a: any) => {
          if (a.district === 1) {
            dist1.push(a);
          } else {
            dist2.push(a);
          }
        });

        data.push({
          margin: [0, 40, 0, 0],
          columns: [
            {
              text: `List of Tertiary Facilities by Municipality/City`,
              fontSize: 14,
              bold: true,
            },
            {
              text: `Year: ${response[0].setYear}`,
              fontSize: 14,
              bold: true,
              alignment: 'right',
            },
          ],
        });

        const dist1Group = dist1.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        tableData.push([
          {
            text: '#',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Name of Tertiary Institution',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Location',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
         
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 3,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 4
          },
        ]);

        for (const groupKey1 in dist1Group) { // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 3,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 4
            },
          ]);

          group1.forEach((item: any, index: any) => {
               tableData.push([
            {
              text: index+1,
              fillColor: '#FFFFFF',
              marginLeft: 4
            },
            {
              text: item.name,
              fillColor: '#FFFFFF',
            },
           
             {
              text: item.location +" "+ item.brgyName,
              fillColor: '#FFFFFF',
            },
      
          ]);

          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 3,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 4
          },
        ]);

        for (const groupKey2 in dist2Group) { // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 3,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 4
            },
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index+1,
                fillColor: '#FFFFFF',
                marginLeft: 4
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
             
               {
                text: item.location +" "+ item.brgyName,
                fillColor: '#FFFFFF',
              },
        
            ]);

          });
        }

        const table = {
          margin: [0, 20, 0, 0],
          table: {
            widths: [25, '*', '*'],
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

  markerObj: any = {};

  SetMarker(item: any = {}) {
    console.log(item);
    console.log(this.data);

    this.markerObj = {
      lat: item.latitude,
      lng: item.longtitude,
      label: item.brgyName.charAt(0),
      brgyName: item.brgyName,
      munCityName: this.munCityName,
      draggable: true,
    };

    this.gmapComponent.setMarker(this.markerObj);
  }

  GetListBarangay() {
    this.service.ListOfBarangay(this.auth.munCityId).subscribe((data) => {
      this.listBarangay = <any>data;
    });
  }

  GetListData() {
    this.service
      .GetListEducationTechVoc( this.setYear, this.munCityId)
      .subscribe({
        next: (response) => {
          this.list = <any>response;
          console.log(this.list );
        },
        error: (error) => {
          Swal.fire('Oops!', 'Something went wrong.', 'error');
        },
        complete: () => {},
      });
  }

  AddData() {
    this.toValidate.name =
      this.data.name == '' || this.data.name == null ? true : false;
    this.toValidate.brgyId =
      this.data.brgyId == '' || this.data.brgyId == null ? true : false;

    this.data.setYear = this.setYear;
    this.data.munCityId = this.munCityId;

    if (!this.toValidate.name && !this.toValidate.brgyId) {
      this.service.AddEducationTechVoc(this.data).subscribe({
        next: (request) => {
          this.GetListData();
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
        'Please fill out the required fields.',
        'warning'
      );
    }
  }

  EditData() {
    console.log(this.data);

    this.data.longtitude = this.gmapComponent.markers.lng;
    this.data.latitude = this.gmapComponent.markers.lat;

    this.data.setYear = this.setYear;
    this.data.munCityId = this.munCityId;

    this.service.EditEducationTechVoc(this.data).subscribe({
      next: (request) => {
        this.GetListData();
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
        this.service.DeleteEducationTechVoc(transId).subscribe((request) => {
          this.GetListData();
        });
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  }
}
