import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DemographyService } from 'src/app/shared/Governance/demography.service';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { ImportComponent } from 'src/app/components/import/import.component';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';

@Component({
  selector: 'app-demography',
  templateUrl: './demography.component.html',
  styleUrls: ['./demography.component.css'],
})
export class DemographyComponent implements OnInit {
  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;
  @ViewChild(PdfComponent)
  private pdfComponent!: PdfComponent;

  searchText: string = '';

  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private service: DemographyService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService
  ) {}
  demo: any = {};
  Demo: any = ([] = []);
  editmodal: any = {};
  ViewBarangayOfficial: any = {};
  barangays: any = {};
  toValidate: any = {};
  munCityName: string = this.auth.munCityName;

  isLoading: boolean = true;
  isCheck: boolean = false;
  visible: boolean = true;
  not_visible: boolean = true;

  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };

  @ViewChild(ImportComponent)
  private importComponent!: ImportComponent;

  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
    console.log('isCheck:', this.isCheck);
  }
  markerObj: any = {};

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }
  get totals() {
    return this.Demo.reduce(
      (
        acc: {
          male: any;
          female: any;
          householdPop: any;
          householdNo: any;
          avgHouseholdSz: any;
          popGrowthRate: any;
        },
        text: {
          male: any;
          female: any;
          householdPop: any;
          householdNo: any;
          avgHouseholdSz: any;
          popGrowthRate: any;
        }
      ) => {
        acc.male += text.male || 0;
        acc.female += text.female || 0;
        acc.householdPop += text.householdPop || 0;
        acc.householdNo += text.householdNo || 0;
        acc.avgHouseholdSz += text.avgHouseholdSz || 0;
        acc.popGrowthRate += text.popGrowthRate || 0;
        return acc;
      },
      {
        male: 0,
        female: 0,
        householdPop: 0,
        householdNo: 0,
        avgHouseholdSz: 0,
        popGrowthRate: 0,
      }
    );
  }

  SetMarker(data: any = {}) {
    console.log('lnglat: ', data.longtitude + ' , ' + data.latitude);

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

  date = new DatePipe('en-PH');
  ngOnInit(): void {
    this.Init();
    this.list_of_barangay();
  }

  message = 'Demography';

  Init() {
    this.demo.munCityId = this.auth.munCityId;
    this.demo.setYear = this.auth.activeSetYear;
    this.service.GetDemography().subscribe((data) => {
      this.Demo = <any>data;
      this.import();
      this.Demo.sort((n1: any, n2: any) => {
        //order by Descending
        if (n1.setYear < n2.setYear) return 1;
        if (n1.setYear > n2.setYear) return -1;
        else return 0;
      });
      console.log(this.Demo);
    });
  }
  ExportExcel() {
    this.reportService.GetExcelExport(
      this.auth.setYear,
      this.auth.munCityId,
      'Demography'
    );
  }

  GeneratePDF() {
    let data: any = [];
    let reports: any = [];
    const tableData: any = [];
    let grandTotal: any = [];
    let columns: any = [];

    // Function to add district data to the table
    const addDistrictData = (districtData: any[]) => {
      districtData.forEach((item: any) => {
        tableData.push([
          { text: item.brgyName, alignment: 'center' },
          { text: item.Population, alignment: 'center' },
          { text: item.Male, alignment: 'center' },
          { text: item.Female, alignment: 'center' },
          { text: item.HouseholdNo, alignment: 'center' },
        ]);
      });
    };
    console.log(this.pdfComponent.data);
    // Prepare the report data
    this.reportService
      .GetDemographyReportMun(this.pdfComponent.data) // Retrieves data for the user's municipality
      .subscribe({
        next: (response: any = {}) => {
          reports = response.data;
          grandTotal = response.grandTotal;
          columns = response.columns;
          var total = response.total;
          var munCityName = response.munDetail.munCityName;

          console.log('result: ', response);

          // Check if fromYear and year are defined
          const fromYear = this.pdfComponent.data.year - 2 || 'N/A'; // Adjusted calculation based on your logic
          const toYear = this.pdfComponent.data.year || 'N/A';

          data.push({
            margin: [0, 40, 0, 0],
            columns: [
              {
                text: `Total Population and Households by Municipality/City-${munCityName} `,
                fontSize: 14,
                bold: true,
              },

              {
                text: `Year: ${fromYear} - ${toYear}`, // Use the correctly derived years
                fontSize: 14,
                bold: true,
                alignment: 'right',
              },
            ],
          });

          // Header Row for Municipality
          const headerRow = [
            {
              text: '#',
              rowSpan: 2,
              fillColor: 'black',
              fontSize: 9,
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Barangay',
              rowSpan: 2,
              fontSize: 9,
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            // {
            //   text: `2021`,
            //   fontSize: 9,
            //   colSpan: 3,
            //   fillColor: 'black',
            //   color: 'white',
            //   bold: true,
            //   alignment: 'center',
            // },
            // {},
            // {},

            ...columns.flatMap((col: any) => [
              {
                text: `${col.setYear}`,
                fontSize: 9,
                colSpan: 6,
                fillColor: 'black',
                color: 'white',
                bold: true,
                alignment: 'center',
              },
              {},
              {},
              {},
              {},
              {},
            ]),
          ];

          const header1 = [
            '',
            '',
            ...columns.flatMap((col: any) => [
              {
                text: `${col.description}`,
                fontSize: 9,
                fillColor: 'black',
                color: 'white',
                bold: true,
                alignment: 'center',
              },
              {
                text: `${col.male}`,
                fontSize: 9,
                fillColor: 'black',
                color: 'white',
                bold: true,
                alignment: 'center',
              },
              {
                text: `${col.female}`,
                fontSize: 9,
                fillColor: 'black',
                color: 'white',
                bold: true,
                alignment: 'center',
              },
              {
                text: `${col.household}`,
                fontSize: 9,
                fillColor: 'black',
                color: 'white',
                bold: true,
                alignment: 'center',
              },
              {
                text: `Ave. HH Size`,
                fontSize: 9,
                fillColor: 'black',
                color: 'white',
                bold: true,
                alignment: 'center',
              },
              {
                text: `Growth Rate`,
                fontSize: 9,
                fillColor: 'black',
                color: 'white',
                bold: true,
                alignment: 'center',
              },
            ]),
          ];

          tableData.push(headerRow);
          tableData.push(header1);

          console.log('iduno');

          reports.forEach((b: any, index2: any) => {
            console.log('heree');
            let d1: any = [];
            let d2: any = [];

            d1.push({ text: index2 + 1, alignment: 'center' });
            d1.push({ text: b.brgyName });
            //prev1
            d1.push(
              {
                text: b.previous1 == null ? '' : b.previous1.population,
                alignment: 'center',
              },
              {
                text: b.previous1 == null ? '' : b.previous1.male,
                alignment: 'center',
              },
              {
                text: b.previous1 == null ? '' : b.previous1.female,
                alignment: 'center',
              },
              {
                text: b.previous1 == null ? '' : b.previous1.householdNo,
                alignment: 'center',
              },

              { text: b.previous1 == null ? '' : b.previous1.avgHouseholdSz },
              { text: b.previous1 == null ? '' : b.previous1.popGrowthRate }
            );
            //prev
            d1.push(
              {
                text: b.previous == null ? '' : b.previous.population,
                alignment: 'center',
              },
              {
                text: b.previous == null ? '' : b.previous.male,
                alignment: 'center',
              },
              {
                text: b.previous == null ? '' : b.previous.female,
                alignment: 'center',
              },
              {
                text: b.previous == null ? '' : b.previous.householdNo,
                alignment: 'center',
              },
              { text: b.previous == null ? '' : b.previous.avgHouseholdSz },
              { text: b.previous == null ? '' : b.previous.popGrowthRate }
            );
            //current
            d1.push(
              {
                text: b.current == null ? '' : b.current.population,
                alignment: 'center',
              },
              {
                text: b.current == null ? '' : b.current.male,
                alignment: 'center',
              },
              {
                text: b.current == null ? '' : b.current.female,
                alignment: 'center',
              },
              {
                text: b.current == null ? '' : b.current.householdNo,
                alignment: 'center',
              },
              { text: b.current == null ? '' : b.current.avgHouseholdSz },
              { text: b.current == null ? '' : b.current.popGrowthRate }
            );
            tableData.push(d1); // Add the row to tableData

            if (index2 + 1 == reports.length) {
              d2.push({ text: '', alignment: 'center' });
              d2.push({ text: 'Total', alignment: 'center' });
              //prev1
              d2.push(
                {
                  text:
                    total.previous1 == null ? '' : total.previous1.population,
                  alignment: 'center',
                },
                {
                  text: total.previous1 == null ? '' : total.previous1.male,
                  alignment: 'center',
                },
                {
                  text: total.previous1 == null ? '' : total.previous1.female,
                  alignment: 'center',
                },
                {
                  text:
                    total.previous1 == null ? '' : total.previous1.householdNo,
                  alignment: 'center',
                },

                { text: '' },
                { text: '' }
              );
              //prev
              d2.push(
                {
                  text: total.previous == null ? '' : total.previous.population,
                  alignment: 'center',
                },
                {
                  text: total.previous == null ? '' : total.previous.male,
                  alignment: 'center',
                },
                {
                  text: total.previous == null ? '' : total.previous.female,
                  alignment: 'center',
                },
                {
                  text:
                    total.previous == null ? '' : total.previous.householdNo,
                  alignment: 'center',
                },
                { text: '' },
                { text: '' }
              );
              //current
              d2.push(
                {
                  text: total.current == null ? '' : total.current.population,
                  alignment: 'center',
                },
                {
                  text: total.current == null ? '' : total.current.male,
                  alignment: 'center',
                },
                {
                  text: total.current == null ? '' : total.current.female,
                  alignment: 'center',
                },
                {
                  text: total.current == null ? '' : total.current.householdNo,
                  alignment: 'center',
                },
                { text: '' },
                { text: '' }
              );
              tableData.push(d2); // Add the row to tableData
            }
          });

          // var tota

          // Add the row to tableData

          //last row end

          // Create the table with a defined layout
          const table = {
            margin: [0, 20, 0, 0],

            table: {
              // widths: [25, 'auto', ...Array(columns.length * 4).fill('auto')], // Ensure widths match the number of columns
              widths: [
                15,
                'auto',
                ...Array(columns.length * 4).fill('auto'),
                'auto',
                'auto',
                'auto',
                'auto',
                'auto',
                'auto',
              ], // Ensure widths match the number of columns
              body: tableData, // Make sure tableData has rows and columns
            },
            layout: {
              hLineWidth: (i: number) => (i === 0 ? 2 : 1), // Header line width
              vLineWidth: () => 1,
              hLineColor: () => '#CCCCCC',
              vLineColor: () => '#CCCCCC',
              paddingLeft: () => 5,
              paddingRight: () => 5,
              paddingTop: () => 3,
              paddingBottom: () => 3,
            },
          };

          data.push(table);
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

  import() {
    let importData = 'Demography';
    this.importComponent.import(importData);
  }

  list_of_barangay() {
    this.service.ListBarangay().subscribe((data) => {
      this.barangays = <any>data;
      console.log('fgxtxgcvcgcf', this.barangays);
    });
  }

  AddDemo() {
    this.toValidate.brgyId =
      this.demo.brgyId == '' || this.demo.brgyId == null ? true : false;
    this.toValidate.householdPop =
      this.demo.householdPop == '' || this.demo.householdPop == undefined
        ? true
        : false;
    this.toValidate.male =
      this.demo.male == '' || this.demo.male == undefined ? true : false;
    this.toValidate.female =
      this.demo.female == '' || this.demo.female == undefined ? true : false;

    if (
      this.toValidate.brgyId == true ||
      this.toValidate.householdPop == true ||
      this.toValidate.male == true ||
      this.toValidate.female == true
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.demo.munCityId = this.auth.munCityId;
      this.demo.setYear = this.auth.activeSetYear;
      this.service.AddDemography(this.demo).subscribe(
        (_data) => {
          Swal.fire('Good job!', 'Data Added Successfully!', 'success');
          if (this.isCheck) {
            document.getElementById('ModalAdd')?.click();
          }
          console.log(_data);
          this.clearData();
          this.Init();
        },
        (err) => {
          Swal.fire('ERROR!', 'Error', 'error');

          this.Init();
          this.demo = {};
        }
      );
    }
  }
  clearData() {
    this.demo = {};
    this.not_visible = false;
    this.visible = true;
    // this.required = false;
  }

  editdemo(editdemo: any = {}) {
    this.editmodal = editdemo;
    //passing the data from table (modal)
    this.Init();
  }

  //for modal
  update() {
    this.toValidate.brgyId =
      this.editmodal.brgyId == '' || this.editmodal.brgyId == null
        ? true
        : false;
    this.toValidate.householdPop =
      this.editmodal.householdPop == '' ||
      this.editmodal.householdPop == undefined
        ? true
        : false;
    this.toValidate.male =
      this.editmodal.male == '' || this.editmodal.male == undefined
        ? true
        : false;
    this.toValidate.female =
      this.editmodal.female == '' || this.editmodal.female == undefined
        ? true
        : false;

    if (
      this.toValidate.brgyId == true ||
      this.toValidate.householdPop == true ||
      this.toValidate.male == true ||
      this.toValidate.female == true
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.service.UpdateDemography(this.editmodal).subscribe((_data) => {
        // if (this.isCheck) {

        // }
        this.clearData();
        this.Init();

        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your work has been updated',
          showConfirmButton: false,
          timer: 1000,
        });
        document.getElementById('ModalEdit')?.click();
        this.Init();
      });
    }
  }

  delete(transId: any, index: any) {
    Swal.fire({
      text: 'Do you want to remove this file?',
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!',
    }).then((result) => {
      if (result.value) {
        for (let i = 0; i < this.Demo.length; i++) {
          if (this.Demo[i].transId == transId) {
            this.Demo.splice(i, 1);
            this.Init();
            Swal.fire('Deleted!', 'Your file has been removed.', 'success');
          }
        }

        this.service.DeleteDemography(transId).subscribe((_data) => {});
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }
}
