import { Component, OnInit, ViewChild } from '@angular/core';
import { BarangaysComponent } from '../../Governance/barangays/barangays.component';
import { ReportsService } from 'src/app/shared/Tools/reports.service';
import { AuthService } from 'src/app/services/auth.service';
import { PdfService } from 'src/app/services/pdf.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-summary-report',
  templateUrl: './summary-report.component.html',
  styleUrls: ['./summary-report.component.css']
})
export class SummaryReportComponent implements OnInit {
  @ViewChild(BarangaysComponent)
  private brgy!: BarangaysComponent;

  constructor(private service: AuthService, private reportService:ReportsService, private pdfService: PdfService,) {
    this.params.year = this.service.setYear;
    this.params.allMunCity = 1;
   }
  params:any = {};

  ngOnInit(): void {
  }

  Error(){
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
      title: 'No data',
    });
  }

  CityOfficialGeneratePDF() {
    let reports:any = [];
    let data: any = [];

    this.reportService.GetCityOfficialsReport(this.params).subscribe({
      next: (response) => {
        reports = <any>response;
        
        data.push({text:'List of Local Government Officials by Municipality/ City', bold: true, alignment:'center'});

        const groupedData = reports.reduce((groups: any, item: any) => {
          const { munCityName, setYear } = item;
          const groupKey = `${munCityName}-${setYear}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        // Iterate over each group and add it to the PDF
        for (const groupKey in groupedData) {
          const group = groupedData[groupKey];
          const [cityName, year] = groupKey.split('-');
          data.push({
            margin: [0, 50, 0, 0],
            columns: [
              {
                text: cityName,
                fontSize: 14,
                bold: true,
              },
              {
                text: `Year: ${year}`,
                fontSize: 14,
                bold: true,
                alignment: 'right',
              },
            ],
          });

          // Create the table
          const tableData: any = [];
          tableData.push([
            {
              text: 'Position',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Name',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Term',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Contact #',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            }
          ]);
          group.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: item.position,
                fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
              },
              {
                text: item.name,
                fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
              },
              {
                text: item.term,
                fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
              },
              {
                text: item.contact,
                fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
              },
             
            ]);
          });
          const table = {
            margin: [0, 10, 0, 0],
            table: {
              widths: ['*', '*', '*', '*'],
              body: tableData,
            },
            layout: 'lightHorizontalLines',
          };

          data.push(table);
        }
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        if(reports.length > 0){
          let isPortrait = true;
          this.pdfService.GeneratePdf(data, isPortrait);
        }
        else{
          this.Error()
        }
      },
    });
  }
  BrgyGeneratePdf() {
    let reports: any = [];
    let data: any = [];

    this.reportService.GetBarangayReport(this.params).subscribe({
      next: (response) => {
        reports = <any>response;
        console.log(reports)
        data.push({text:'List of Barangay Officials by Municipality/ City', bold: true, alignment:'center'});

        const groupedData = reports.reduce((groups: any, item: any) => {
          const { munCityName, setYear } = item;
          const groupKey = `${munCityName}-${setYear}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        // Iterate over each group and add it to the PDF
        for (const groupKey in groupedData) {
          const group = groupedData[groupKey];
          const [cityName, year] = groupKey.split('-');
          data.push({
            margin: [0, 50, 0, 0],
            columns: [
              {
                text: cityName,
                fontSize: 14,
                bold: true,
              },
              {
                text: `Year: ${year}`,
                fontSize: 14,
                bold: true,
                alignment: 'right',
              },
            ],
          });

          // Create the table
          const tableData: any = [];
          tableData.push([
            {
              text: 'Barangay',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Punong Barangay',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Contact #',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Barangay Location',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Land Area',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'No. of Puroks',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
          ]);
          group.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: item.brgyName,
                fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
              },
              {
                text: item.punongBrgy,
                fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
              },
              {
                text: item.contactNo,
                fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
              },
              {
                text: item.address,
                fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
              },
              {
                text: item.landArea,
                fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
              },
              {
                text: item.purokNo,
                fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
              },
            ]);
          });
          const table = {
            margin: [0, 10, 0, 0],
            table: {
              widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
              body: tableData,
            },
            layout: 'lightHorizontalLines',
          };

          data.push(table);
        }
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        if(reports.length > 0){
          let isPortrait = true;
          this.pdfService.GeneratePdf(data, isPortrait);
        }
        else{
          this.Error()
        }
      },
    });
  }

}
