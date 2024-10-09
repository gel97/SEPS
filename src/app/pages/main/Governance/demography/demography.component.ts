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

    // Prepare the report data
    this.reportService
      .GetDemographyReportMun(this.pdfComponent.data) // Retrieves data for the user's municipality
      .subscribe({
        next: (response: any = {}) => {
          reports = response.data;
          grandTotal = response.grandTotal;
          columns = response.columns;

          console.log('result: ', response);

          // Check if fromYear and year are defined
          const fromYear = response.fromYear || 'N/A'; // Default to 'N/A' if undefined
          const toYear = response.year || 'N/A'; // Default to 'N/A' if undefined

          data.push({
            margin: [0, 40, 0, 0],
            columns: [
              {
                text: `Total Population and Households by Municipality/City`, // Updated to reflect specific municipality
                fontSize: 14,
                bold: true,
              },
              {
                text: `Year: ${fromYear} - ${toYear}`, // Ensure years are defined
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
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Barangay',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            ...columns.flatMap((col: any) => [
              {
                text: `${col.setYear} Population`,
                fillColor: 'black',
                color: 'white',
                bold: true,
                alignment: 'center',
              },
              {
                text: `${col.setYear} Male`,
                fillColor: 'black',
                color: 'white',
                bold: true,
                alignment: 'center',
              },
              {
                text: `${col.setYear} Female`,
                fillColor: 'black',
                color: 'white',
                bold: true,
                alignment: 'center',
              },
              {
                text: `${col.setYear} No. of Households`,
                fillColor: 'black',
                color: 'white',
                bold: true,
                alignment: 'center',
              },
            ]),
          ];
          tableData.push(headerRow);

          reports.forEach((a: any) => {
            if (a.data) {
              // Adding data for each municipality
              a.data.forEach((b: any, index2: any) => {
                let d1: any = [];
                d1.push({ text: index2 + 1, alignment: 'center' });
                d1.push({ text: b.brgyName });

                columns.forEach((c: any) => {
                  let _population: any = 'N/A'; // Default to N/A if no data
                  let _male: any = 'N/A';
                  let _female: any = 'N/A';
                  let _householdNo: any = 'N/A';

                  // Find the matching data
                  b.munData.forEach((e: any) => {
                    if (c.setYear === e.setYear) {
                      _population = e.population || 'N/A';
                      _male = e.male || 'N/A';
                      _female = e.female || 'N/A';
                      _householdNo = e.householdNo || 'N/A';
                    }
                  });

                  d1.push(
                    { text: _population, alignment: 'center' },
                    { text: _male, alignment: 'center' },
                    { text: _female, alignment: 'center' },
                    { text: _householdNo, alignment: 'center' }
                  );
                });
                tableData.push(d1);

                // Adding barangay data under the municipality
                if (b.barangays) {
                  b.barangays.forEach((barangay: any) => {
                    let barangayData: any = [];
                    barangayData.push({ text: '', alignment: 'center' }); // Empty cell for numbering
                    barangayData.push({
                      text: `${barangay.brgyName} (Barangay)`,
                      bold: true,
                    }); // Barangay name

                    columns.forEach((c: any) => {
                      let _Population: any = 'N/A';
                      let _Male: any = 'N/A';
                      let _Female: any = 'N/A';
                      let _HouseholdNo: any = 'N/A';

                      // Find matching barangay data
                      barangay.data.forEach((e: any) => {
                        if (c.setYear === e.setYear) {
                          _Population = e.population || 'N/A';
                          _Male = e.male || 'N/A';
                          _Female = e.female || 'N/A';
                          _HouseholdNo = e.householdNo || 'N/A';
                        }
                      });

                      barangayData.push(
                        { text: _Population, alignment: 'center' },
                        { text: _Male, alignment: 'center' },
                        { text: _Female, alignment: 'center' },
                        { text: _HouseholdNo, alignment: 'center' }
                      );
                    });
                    tableData.push(barangayData); // Add barangay data to table
                  });
                }
              });
            }

            // Adding district data if available
            if (a.districtData) {
              addDistrictData(a.districtData); // Call the function to add district data
            }
          });

          // Create the table with a defined layout
          const table = {
            margin: [0, 20, 0, 0],
            table: {
              widths: [
                25,
                'auto',
                ...Array(columns.length * 4).fill('auto'), // 4 entries per year
              ],
              body: tableData,
            },
            layout: {
              hLineWidth: (i: any) => (i === 0 ? 2 : 1), // Bold line for header
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
