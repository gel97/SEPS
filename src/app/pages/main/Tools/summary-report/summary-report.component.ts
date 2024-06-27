import { Component, OnInit, ViewChild } from '@angular/core';
import { BarangaysComponent } from '../../Governance/barangays/barangays.component';
import { ReportsService } from 'src/app/shared/Tools/reports.service';
import { AuthService } from 'src/app/services/auth.service';
import { PdfService } from 'src/app/services/pdf.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-summary-report',
  templateUrl: './summary-report.component.html',
  styleUrls: ['./summary-report.component.css'],
})
export class SummaryReportComponent implements OnInit {
  @ViewChild(BarangaysComponent)
  private brgy!: BarangaysComponent;

  constructor(
    private service: AuthService,
    private reportService: ReportsService,
    private pdfService: PdfService
  ) {
    this.params.year = this.service.setYear;
    this.params.allMunCity = 1;
  }

  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };

  params: any = {};
  fields: any = {};
  data: any = [];
  toValidate: any = {};
  isAdd: boolean = true;

  ngOnInit(): void {
    this.getReportSummarized();
  }

  AddReportValidation() {
    this.toValidate.remarks =
      this.fields.year == '' || this.fields.remarks == null ? true : false;

    if (!this.toValidate.remarks) {
      this.fields.year = this.service.setYear;
      this.fields.userId = this.service.userId;

      this.reportService.AddReportValidation(this.fields).subscribe({
        next: (response) => {
          this.closebutton.nativeElement.click();
          Swal.fire('Good job!', 'Data Added Successfully!', 'success');
          this.getReportSummarized();
        },
        error: (err) => {
          Swal.fire('Error!', 'error');
        },
        complete: () => {},
      });
    }
  }

  EditReportValidation() {
    console.log(this.fields);
    this.toValidate.remarks =
      this.fields.year == '' || this.fields.remarks == null ? true : false;

    if (!this.toValidate.remarks) {
      this.fields.year = this.service.setYear;

      this.reportService.EditReportValidation(this.fields).subscribe({
        next: (response) => {
          this.closebutton.nativeElement.click();
          Swal.fire('Good job!', 'Data Updated Successfully!', 'success');
          this.getReportSummarized();
        },
        error: (err) => {
          Swal.fire('Error!', 'error');
        },
        complete: () => {},
      });
    }
  }

  DeleteReportValidation(transId: any): void {
    Swal.fire({
      title: 'Are you sure you want to delete this remarks?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.reportService.DeleteReportValidation(transId).subscribe({
          next: (response) => {
            console.log(response);
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Data has been deleted',
              showConfirmButton: false,
              timer: 1000,
            });
            this.getReportSummarized();
          },
          error: (err) => {
            console.log(err);
          },
          complete: () => {},
        });
      }
    });
  }

  setData(data: any = {}) {
    this.fields.year = this.service.activeSetYear;
    this.fields.remarks = data.remarks;
    this.fields.transId = data.transId;
    this.fields.tag = data.tag;
    this.fields.validatedAt = data.validatedAt;
    this.fields.userId = data.userId;
  }

  getReportSummarized() {
    this.reportService.GetReportSummarized(this.params.year).subscribe({
      next: (response) => {
        this.data = response;
      },
      error: (err) => {},
      complete: () => {},
    });
  }

  remarks: string = '';

  showReport(reportName: string, remarks: string) {
    console.log(reportName);
    this.remarks = remarks;

    switch (reportName) {
      case 'Provincial Officials':
        this.ProvOfficialGeneratePDF();
        break;
      case 'List of Barangay Officials':
        this.BrgyGeneratePdf();
        break;
      case 'Municipality/ City Officials':
        this.CityOfficialGeneratePDF();
        break;
      case 'Physical / Geographic Profile':
        this.PhyGeoGeneratePDF();
        break;
      case 'Physical / Geographic Profile Barangay':
        this.PhyGeoBarangayGeneratePDF();
        break;
      case 'Fiscal Matters':
        this.FiscalMattersGeneratePDF();
        break;
      case 'Organization/ Staffing Patterns by Municipality/City':
        this.OrgStafGeneratePDF();
        break;
      case 'Demography':
        this.DemographyGeneratePDF();
        break;
      case 'Number of Precincts and Registered Voters by Municipality/City':
        this.VotersGeneratePDF();
        break;
      case 'Number of Precincts and Registered SK Voters by Municipality/City':
        this.SkGeneratePDF();
        break;
      case 'Major Economic Activities by Municipality/City':
        this.MjrEcoGeneratePDF();
        break;
      case 'Number of Manufacturing Industry by Municipality/City':
        this.ManEstabGeneratePDF();
        break;
      case 'Number of Business/ Commercial Establishments by Municipality/City':
        this.ComEstabGeneratePDF();
        break;
      case 'List of Industrial Estates by Municipality/City':
        this.IndustrialGeneratePDF();
        break;
      case 'List of Banking Institutions by Municipality/City':
        this.BankingGeneratePdf();
        break;
      case 'List of Cooperatives by Municipality/City':
        this.CoopGeneratePdf();
        break;
      case 'List of Insurance Institutions by Municipality/City':
        this.InsuranceGeneratePdf();
        break;
      case 'List of Financial Institutions by Municipality/City':
        this.FinancialGeneratePdf();
        break;
      case 'Number of Recreational Facilities by Municipality/City':
        this.RecreationalGeneratePDF();
        break;
      case 'List of Resorts/Recreation Center by Municipality/City':
        this.ResortGeneratePDF();
        break;
      case 'List of Hotels/ Lodging Houses by Municipality/City':
        this.LodgingGeneratePDF();
        break;
      case 'List of Industrial Estate by Municipality/City':
        this.IndustrialGeneratePDF();
        break;
      case 'List of Cinema/ Movie Houses by Municipality/City':
        this.CinemaGeneratePDF();
        break;
      case 'List of Natural and Man-made Attractions by Municipality/City':
        this.NaturalGeneratePDF();
        break;
      case 'List of Historical/ Cultural and Religious Attractions by Municipality/City':
        this.CulturalGeneratePDF();
        break;
      case 'List of Fiestas and Festivals by Municipality/City':
        this.FestivalGeneratePDF();
        break;
      case 'Agricultural Profle of Davao del Norte':
        this.AgriProfGeneratePDF();
        break;
      case 'List of Fisheries/ Aquaculture Production by Municipality/City':
        this.FisheriesGeneratePDF();
        break;
      case 'List of Poultry/ Livestock Production by Municipality/City':
        this.LivestockGeneratePDF();
        break;
      case 'List of Ricemills by Municipality/City':
        this.RicemillsGeneratePDF();
        break;
      case 'List of Warehouses by Municipality/City':
        this.WarehouseGeneratePDF();
        break;
      case 'List of Slaughterhouses by Municipality/City':
        this.SlaughterGeneratePDF();
        break;
      case 'Number of Public and Private by Municipality/City':
        this.PubPrivGeneratePDF();
        break;
      case 'List of Technical/Vocational by Municipality/City':
        this.TechvocFacGeneratePDF();
        break;
      case 'List of Tertiary Facilities by Municipality/City':
        this.TertiaryGeneratePDF();
        break;
      case 'Number of Private Elementary Schools by Municipality/City':
        this.PrivElemGeneratePDF();
        break;
      case 'Number of Private Secondary Schools by Municipality/City':
        this.PrivSecGeneratePDF();
        break;
      case 'Number of Public Elementary Shools by Municipality/City':
        this.PubElemGeneratePDF();
        break;
      case 'Number of Public Secondary Schools by Municipality/City':
        this.PubSecGeneratePDF();
        break;
      case 'Number of DayCare by Municipality/City':
        this.DaycareGeneratePDF();
        break;
      case 'Tertiary Enrolment by Municipality/City':
        this.TertiraryEnrolGeneratePDF();
        break;
      case 'Tertiary Graduates by Municipality/City':
        this.TertiaryGradGeneratePDF();
        break;
      case 'Number of DayCare by Municipality/City':
        this.DaycareGeneratePDF();
        break;
      case 'List of Technical/ Vocational programs by Municipality/City':
        this.TechvoProgramsGeneratePDF();
        break;
      case 'Number of Enrolment and Graduates for Technical/ Vocational by Municipality/City':
        this.TechvocGradGeneratePDF();
        break;
      case 'List of Training Centers by Municipality/City':
        this.TrainingCenterGeneratePDF();
        break;
      case 'Number of SPED Enrolment by Municipality/City':
        this.SPEDGeneratePDF();
        break;
      case 'Number of Out of School Youth by Municipality/City':
        this.OSYGeneratePDF();
        break;
      case 'Number of Health Service Workers by Municipality/City':
        this.HealthServiceGeneratePDF();
        break;
      case 'List of RHUs/ Community Hospitals by Municipality/City':
        this.ComHospGeneratePDF();
        break;
      case 'List of Barangay Health Stations by Municipality/City':
        this.BrgyHealthGeneratePDF();
        break;
      case 'List of Private Hospitals by Municipality/City':
        this.PrivateHospGeneratePDF();
        break;
      case 'Households with Access to Safe Water Supply and Sanitary Facilities by Municipality/City':
        this.SanitaryGeneratePDF();
        break;
      case 'Persons with Disability':
        this.PWDGeneratePDF();
        break;
      case 'List of Provincial Hospitals':
        this.ProvHospGeneratePDF();
        break;
      case 'Police Services by Municipality/City':
        this.PoliceGeneratePDF();
        break;
      case 'Fire Protection Services by Municipality/City':
        this.FireGeneratePDF();
        break;
      case 'List of Barangay Health Station by Municipality/City':
        this.BrgyHealthGeneratePDF();
        break;
      case 'Barangay Peacekeeping/ Tanod Services by Municipality/City':
        this.TanodGeneratePDF();
        break;
      case 'Index Crime by Municipality/City':
        this.IndexCrimeGeneratePDF();
        break;
      case 'List of Informal Settlements by Municipality/City':
        this.SettlersGeneratePDF();
        break;
      case 'List of Government Housing Projects by Municipality/City':
        this.GovHousingGeneratePDF();
        break;
      case 'List of Subdivisions by Municipality/City':
        this.SubdvGeneratePDF();
        break;
      case 'List of Civic Organizations by Municipality/ City':
        this.CivicOrgGeneratePDF();
        break;
      case 'List of Religious Organizations by Municipality/ City':
        this.ReligiousGeneratePDF();
        break;
      case 'List of Professional Organizations by Municipality/ City':
        this.ProfGeneratePDF();
        break;
      case 'List of Commercial/ Industrial/ Labor Organizations by Municipality/ City':
        this.CommercialGeneratePDF();
        break;
      case 'List of Cooperatives by Municipality/ City':
        this.CooperativesGeneratePDF();
        break;
      case 'List of Sectoral by Municipality/ City':
        this.SectoralGeneratePDF();
        break;
      case 'List of Foundations by Municipality/ City':
        this.FoundationGeneratePDF();
        break;
      case 'List of Communication Towers/ Cell-sites by Municipality/ City':
        this.TelSysGeneratePDF();
        break;
      case 'List of Express Mail/ Mailing Services by Municipality/ City':
        this.MailGeneratePDF();
        break;
      case 'List of Internet Service Providers by Municipality/ City':
        this.ISPGeneratePDF();
        break;
      case 'Number of Postal Services by Municipality/City':
        this.PostalGeneratePDF();
        break;
      case 'List of Telecommunication Systems by Municipality/ City':
        this.TelcomGeneratePDF();
        break;
      case 'List of Telegraph Facilities by Municipality/ City':
        this.TelgraphGeneratePDF();
        break;
      case 'Summary of Road Length by Type and Pavement Classification':
        this.RoadGeneratePDF();
        break;
      case 'List of Bridges by Municipality/City':
        this.BridgesGeneratePDF();
        break;
      case 'List of Transport Terminals by Municipality/City':
        this.TerminalsGeneratePDF();
        break;
      case 'List of Ports by Municipality/City':
        this.PortGeneratePDF();
        break;
      case 'List of Water Utility Service Providers by Municipality/ City':
        this.WaterUtilGeneratePDF();
        break;
      case 'List of Water Pump Stations by Municipality/ City':
        this.WaterPumpGeneratePDF();
        break;
      case 'Irrigation Systems by Municipality/City':
        this.IrrigsysGeneratePDF();
        break;
      case 'List of Power System Service Providers by Municipality/ City':
        this.PowerSysGeneratePDF();
        break;
      case 'List of Power Sub-Stations by Municipality/ City':
        this.PowersubGeneratePDF();
        break;
      case 'List of Waste Management Facilities by Municipality/ City':
        this.WasteGeneratePDF();
        break;
      case 'List of Ice Plant / Cold Storage Facilities by Municipality/ City':
        this.IceGeneratePDF();
        break;
      case 'List of Market / Supermarkets by Municipality/ City':
        this.MarketGeneratePDF();
        break;
      case 'List of Department Stores by Municipality/ City':
        this.DepGeneratePDF();
        break;
      case 'List of Cemeteries/ Memorial Parks by Municipality/ City':
        this.CemeteryGeneratePDF();
        break;
      case 'List of Churches/ Worship Houses by Municipality/ City':
        this.ChurchGeneratePDF();
        break;
      case 'List of Other Structures by Municipality/ City':
        this.OtherStructGeneratePDF();
        break;
      default:
        break;
    }
  }

  formatNumber(value: number): string {
    return value.toLocaleString(undefined, {
      maximumFractionDigits: 0,
    });
  }

  Error() {
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
  //INFRA
  OtherStructGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.params.menuId = '12';

    this.reportService.GetServiceFacilityReport(this.params).subscribe({
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
          margin: [0, 20, 0, 0],
          columns: [
            {
              text: `List of Other Structures by Municipality/ City`,
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

        console.log('dist1Group ', dist1Group);

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        console.log('dist2Group ', dist2);

        tableData.push([
          {
            text: '#',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Type of Structure',
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
            text: 'Remarks',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Contact Details',
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
          {
            text: 'Barangay',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 7,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 7,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
                alignment: 'center',
              },
              {
                text: item.area,
                fillColor: '#FFFFFF',
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.remarks,
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 7,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 7,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
                alignment: 'center',
              },
              {
                text: item.area,
                fillColor: '#FFFFFF',
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.remarks,
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 20, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*', '*', '*'],
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  ChurchGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.params.menuId = '11';

    this.reportService.GetServiceFacilityReport(this.params).subscribe({
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
          margin: [0, 20, 0, 0],
          columns: [
            {
              text: `List of Churches/ Worship Houses by Municipality/ City`,
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

        console.log('dist1Group ', dist1Group);

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        console.log('dist2Group ', dist2);

        tableData.push([
          {
            text: '#',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Name of Church',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Religious Domination/ Sect',
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
          },
          {
            text: 'Contact Details',
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
          {
            text: 'Barangay',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 7,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 7,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
                alignment: 'center',
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.area,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.remarks,
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 7,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 7,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
                alignment: 'center',
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.area,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.remarks,
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 20, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*', '*', '*'],
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  CemeteryGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.params.menuId = '10';

    this.reportService.GetServiceFacilityReport(this.params).subscribe({
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
          margin: [0, 20, 0, 0],
          columns: [
            {
              text: `List of Cemeteries/ Memorial Parks by Municipality/ City`,
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

        console.log('dist1Group ', dist1Group);

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        console.log('dist2Group ', dist2);

        tableData.push([
          {
            text: '#',
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
            text: 'No. of Lots/ Floor Area',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Lots Sold/ Remarks',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Contact Details',
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
          {
            text: 'Barangay',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 7,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 7,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
                alignment: 'center',
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.area,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.remarks,
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 7,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 7,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
                alignment: 'center',
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.area,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.remarks,
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 20, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*', '*', '*'],
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  DepGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.params.menuId = '9';

    this.reportService.GetServiceFacilityReport(this.params).subscribe({
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
          margin: [0, 20, 0, 0],
          columns: [
            {
              text: `List of Department Stores by Municipality/ City`,
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

        console.log('dist1Group ', dist1Group);

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        console.log('dist2Group ', dist2);

        tableData.push([
          {
            text: '#',
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
            text: 'No. of Stalls/ Floor Area',
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
          },
          {
            text: 'Contact Details',
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
          {
            text: 'Barangay',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 7,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 7,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
                alignment: 'center',
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.area,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.remarks,
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 7,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 7,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
                alignment: 'center',
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.area,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.remarks,
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 20, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*', '*', '*'],
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  MarketGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.params.menuId = '8';

    this.reportService.GetServiceFacilityReport(this.params).subscribe({
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
          margin: [0, 20, 0, 0],
          columns: [
            {
              text: `List of Market / Supermarkets by Municipality/ City`,
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

        console.log('dist1Group ', dist1Group);

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        console.log('dist2Group ', dist2);

        tableData.push([
          {
            text: '#',
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
            text: 'No. of Stalls/ Floor Area',
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
          },
          {
            text: 'Contact Details',
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
          {
            text: 'Barangay',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 7,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 7,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
                alignment: 'center',
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.area,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.remarks,
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 7,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 7,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
                alignment: 'center',
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.area,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.remarks,
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 20, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*', '*', '*'],
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  IceGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.params.menuId = '7';

    this.reportService.GetServiceFacilityReport(this.params).subscribe({
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
          margin: [0, 20, 0, 0],
          columns: [
            {
              text: `List of Ice Plant / Cold Storage Facilities by Municipality/ City`,
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

        console.log('dist1Group ', dist1Group);

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        console.log('dist2Group ', dist2);

        tableData.push([
          {
            text: '#',
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
            text: 'Capacity/ Floor Area',
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
          },
          {
            text: 'Contact Details',
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
          {
            text: 'Barangay',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 7,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 7,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
                alignment: 'center',
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.area,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.remarks,
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 7,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 7,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
                alignment: 'center',
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.area,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.remarks,
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 20, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*', '*', '*'],
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }

  WasteGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.params.menuId = '6';

    this.reportService.GetServiceFacilityReport(this.params).subscribe({
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
          margin: [0, 20, 0, 0],
          columns: [
            {
              text: `List of Waste Management Facilities by Municipality/ City`,
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

        console.log('dist1Group ', dist1Group);

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        console.log('dist2Group ', dist2);

        tableData.push([
          {
            text: '#',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Name/ Type of Facility',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Garbage Truck/ Area',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Ave. Daily Volume',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Other Details/ Remarks',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Contact Details',
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
          {
            text: 'Barangay',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 8,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 8,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
                alignment: 'center',
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.area,
                fillColor: '#FFFFFF',
              },
              {
                text: item.volume,
                fillColor: '#FFFFFF',
              },
              {
                text: item.remarks,
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 8,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 8,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
                alignment: 'center',
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.area,
                fillColor: '#FFFFFF',
              },
              {
                text: item.volume,
                fillColor: '#FFFFFF',
              },
              {
                text: item.remarks,
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 20, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*', '*', '*', '*'],
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  PowersubGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.params.menuId = '5';

    this.reportService.GetStationReport(this.params).subscribe({
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
          margin: [0, 20, 0, 0],
          columns: [
            {
              text: `List of Power Sub-Stations by Municipality/ City`,
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

        console.log('dist1Group ', dist1Group);

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        console.log('dist2Group ', dist2);

        tableData.push([
          {
            text: '#',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Water Utility Service Provider',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Pump Station Name/ ID',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Service Area/ Remarks',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Contact Person/ Designation',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Contact Details',
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
          {
            text: 'Barangay',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 8,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 8,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
                alignment: 'center',
              },
              {
                text: item.company,
                fillColor: '#FFFFFF',
              },
              {
                text: item.stationName,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactPerson,
                fillColor: '#FFFFFF',
              },
              {
                text: item.remarks,
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 8,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 8,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
                alignment: 'center',
              },
              {
                text: item.company,
                fillColor: '#FFFFFF',
              },
              {
                text: item.stationName,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactPerson,
                fillColor: '#FFFFFF',
              },
              {
                text: item.remarks,
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 20, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*', '*', '*', '*'],
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  PowerSysGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.params.menuId = '4';

    this.reportService.GetServiceUtilReport(this.params).subscribe({
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
          margin: [0, 20, 0, 0],
          columns: [
            {
              text: `List of Power System Service Providers by Municipality/ City`,
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

        console.log('dist1Group ', dist1Group);

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        console.log('dist2Group ', dist2);

        tableData.push([
          {
            text: '#',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Name of Operator/ Company',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Service Area	',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Population Served',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Ave. Monthly Consumption/ Remarks',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Contact Details',
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
          {
            text: 'Barangay',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 8,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 8,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
                alignment: 'center',
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.serviceArea,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.popServed,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.remarks,
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 8,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 8,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
                alignment: 'center',
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.serviceArea,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.popServed,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.remarks,
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 20, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*', '*', '*', '*'],
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  IrrigsysGeneratePDF() {
    let data: any = [];
    let grandTotal: any = {};

    let reports: any = [];
    let columnLenght: number = 0;

    const tableData: any = [];

    this.reportService.GetServiceIrrigationReport(this.params).subscribe({
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
          },
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
                  text: index + 1,
                  fillColor: '#ffffff',
                  alignment: 'center',
                },
                {
                  text: b.munCityName,
                  fillColor: '#ffffff',
                  alignment: 'center',
                },
                {
                  text: b.munData.irrigableNtl,
                  fillColor: '#ffffff',
                  alignment: 'center',
                },
                {
                  text: b.munData.irrigatedNtl,
                  fillColor: '#ffffff',
                  alignment: 'center',
                },
                {
                  text: b.munData.farmerNtl,
                  fillColor: '#ffffff',
                  alignment: 'center',
                },
                {
                  text: b.munData.irrigableCom,
                  fillColor: '#ffffff',
                  alignment: 'center',
                },
                {
                  text: b.munData.irrigatedCom,
                  fillColor: '#ffffff',
                  alignment: 'center',
                },
                {
                  text: b.munData.farmerCom,
                  fillColor: '#ffffff',
                  alignment: 'center',
                },
                {
                  text: b.munData.remarks,
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
                  text: index + 1,
                  fillColor: '#ffffff',
                  alignment: 'center',
                },
                {
                  text: b.munCityName,
                  fillColor: '#ffffff',
                  alignment: 'center',
                },
                {
                  text: b.munData.irrigableNtl,
                  fillColor: '#ffffff',
                  alignment: 'center',
                },
                {
                  text: b.munData.irrigatedNtl,
                  fillColor: '#ffffff',
                  alignment: 'center',
                },
                {
                  text: b.munData.farmerNtl,
                  fillColor: '#ffffff',
                  alignment: 'center',
                },
                {
                  text: b.munData.irrigableCom,
                  fillColor: '#ffffff',
                  alignment: 'center',
                },
                {
                  text: b.munData.irrigatedCom,
                  fillColor: '#ffffff',
                  alignment: 'center',
                },
                {
                  text: b.munData.farmerCom,
                  fillColor: '#ffffff',
                  alignment: 'center',
                },
                {
                  text: b.munData.remarks,
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
                let textValue: any = a.subTotal[key];

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
            widths: [25, '*', '*', '*', '*', '*', '*', '*', '*'],
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  WaterPumpGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.params.menuId = '2';

    this.reportService.GetStationReport(this.params).subscribe({
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
          margin: [0, 20, 0, 0],
          columns: [
            {
              text: `List of Water Pump Stations by Municipality/ City`,
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

        console.log('dist1Group ', dist1Group);

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        console.log('dist2Group ', dist2);

        tableData.push([
          {
            text: '#',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Water Utility Service Provider',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Pump Station Name/ ID',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Service Area/ Remarks',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Contact Person/ Designation',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Contact Details',
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
          {
            text: 'Barangay',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 8,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 8,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
                alignment: 'center',
              },
              {
                text: item.company,
                fillColor: '#FFFFFF',
              },
              {
                text: item.stationName,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactPerson,
                fillColor: '#FFFFFF',
              },
              {
                text: item.remarks,
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 8,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 8,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
                alignment: 'center',
              },
              {
                text: item.company,
                fillColor: '#FFFFFF',
              },
              {
                text: item.stationName,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactPerson,
                fillColor: '#FFFFFF',
              },
              {
                text: item.remarks,
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 20, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*', '*', '*', '*'],
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  WaterUtilGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.params.menuId = '1';

    this.reportService.GetServiceUtilReport(this.params).subscribe({
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
          margin: [0, 20, 0, 0],
          columns: [
            {
              text: `List of Water Utility Service Providers by Municipality/ City`,
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

        console.log('dist1Group ', dist1Group);

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        console.log('dist2Group ', dist2);

        tableData.push([
          {
            text: '#',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Name of Operator/ Company',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Service Area	',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Population Served',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Ave. Monthly Consumption/ Remarks',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Contact Details',
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
          {
            text: 'Barangay',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 8,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 8,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
                alignment: 'center',
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.serviceArea,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.popServed,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.remarks,
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 8,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 8,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
                alignment: 'center',
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.serviceArea,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.popServed,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.remarks,
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 20, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*', '*', '*', '*'],
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  PortGeneratePDF() {
    let listofOwnership: any = [
      { id: 1, type: `Government` },
      { id: 2, type: `Private` },
    ];
    let listofPort: any = [
      { id: 1, type: `Airport` },
      { id: 2, type: `Seaport` },
      { id: 3, type: `Inland Riverport` },
    ];

    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.reportService.GetTranspoPortsReport(this.params).subscribe({
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
          margin: [0, 20, 0, 0],
          columns: [
            {
              text: `List of Ports by Municipality/City`,
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

        console.log('dist1Group ', dist1Group);

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        console.log('dist2Group ', dist2);

        tableData.push([
          {
            text: '#',
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
            text: 'Ownership',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Port Type',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Description',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Contact Person',
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
            text: 'Location',
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
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 9,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 9,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group1.forEach((item: any, index: any) => {
            let _ownership: string = '';
            let _port: string = '';
            listofOwnership.forEach((a: any) => {
              if (a.id === item.ownership) {
                _ownership = a.type;
              }
            });
            listofPort.forEach((a: any) => {
              if (a.id === item.portType) {
                _port = a.type;
              }
            });
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: _ownership,
                fillColor: '#FFFFFF',
              },
              {
                text: _port,
                fillColor: '#FFFFFF',
              },
              {
                text: item.description,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactPerson,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 9,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 9,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group2.forEach((item: any, index: any) => {
            let _ownership: string = '';
            let _port: string = '';
            listofOwnership.forEach((a: any) => {
              if (a.id === item.ownership) {
                _ownership = a.type;
              }
            });
            listofPort.forEach((a: any) => {
              if (a.id === item.portType) {
                _port = a.type;
              }
            });
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: _ownership,
                fillColor: '#FFFFFF',
              },
              {
                text: _port,
                fillColor: '#FFFFFF',
              },
              {
                text: item.description,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactPerson,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 20, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*', '*', '*', '*', '*'],
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  TerminalsGeneratePDF() {
    let TransportType: any = [
      { id: 1, transpotypename: 'Bus' },
      { id: 2, transpotypename: 'Jeepney' },
      { id: 3, transpotypename: 'Van/FX-UV/GT Express' },
      { id: 4, transpotypename: 'Tricycle' },
      { id: 5, transpotypename: 'Pedicab' },
      { id: 6, transpotypename: 'Single Motorcycle' },
      { id: 7, transpotypename: 'Others' },
    ];
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.reportService.GetTranspoTerminalsReport(this.params).subscribe({
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
          margin: [0, 20, 0, 0],
          columns: [
            {
              text: `List of Transport Terminals by Municipality/City`,
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

        console.log('dist1Group ', dist1Group);

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        console.log('dist2Group ', dist2);

        tableData.push([
          {
            text: '#',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Company/ Organization',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Type',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'No. of Units',
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
          {
            text: 'Routes',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 6,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 6,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group1.forEach((item: any, index: any) => {
            let transpo: string = '';
            TransportType.forEach((a: any) => {
              if (a.id === item.transportType) {
                transpo = a.transpotypename;
              }
            });
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.company,
                fillColor: '#FFFFFF',
              },
              {
                text: transpo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.unitsNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.routes,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 6,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 6,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group2.forEach((item: any, index: any) => {
            let transpo: string = '';
            TransportType.forEach((a: any) => {
              if (a.id === item.transportType) {
                transpo = a.transpotypename;
              }
            });
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.company,
                fillColor: '#FFFFFF',
              },
              {
                text: transpo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.unitsNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.routes,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 20, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*', '*'],
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  BridgesGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.reportService.GetTranspoBridgesReport(this.params).subscribe({
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
          margin: [0, 20, 0, 0],
          columns: [
            {
              text: `List of Bridges by Municipality/City`,
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

        console.log('dist1Group ', dist1Group);

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        console.log('dist2Group ', dist2);

        tableData.push([
          {
            text: '#',
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
            text: 'Length/ Pavement',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Condition/ Remarks',
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
            colSpan: 5,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 5,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.pavement,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.condition,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 5,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 5,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.pavement,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.condition,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 20, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*'],
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  RoadGeneratePDF() {
    let RoadType: any = [
      { id: 'rt01', roadtypename: 'National Roads' },
      { id: 'rt02', roadtypename: 'Provincial Roads' },
      { id: 'rt03', roadtypename: 'Municipal/City Roads' },
      { id: 'rt04', roadtypename: 'Barangay Roads' },
      { id: 'rt05', roadtypename: 'NIA Roads' },
      { id: 'rt06', roadtypename: 'Expressways/Toll Roads' },
      { id: 'rt07', roadtypename: 'Private Industrial Roads' },
      { id: 'rt08', roadtypename: 'Private Subdivision Roads' },
      { id: 'rt09', roadtypename: 'Other/Unspecified' },
    ];
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.reportService.GetTranspoRoadReport(this.params).subscribe({
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
          margin: [0, 20, 0, 0],
          columns: [
            {
              text: `Summary of Road Length by Type and Pavement Classification`,
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

        console.log('dist1Group ', dist1Group);

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        console.log('dist2Group ', dist2);

        tableData.push([
          {
            text: '#',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Road Type',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Concrete (Km)',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Asphalt (Km)',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Gravel (Km)',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Earth (Km)',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Total (Kms)',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 7,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 7,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group1.forEach((item: any, index: any) => {
            let roadName: string = '';
            RoadType.forEach((m: any) => {
              if (m.id === item.roadType) roadName = m.roadtypename;
            });
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: roadName,
                fillColor: '#FFFFFF',
              },
              {
                text: item.concrete,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.asphalt,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.gravel,
                fillColor: '#FFFFFF',
              },
              {
                text: item.earth,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.totalLength,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 7,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 7,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group2.forEach((item: any, index: any) => {
            let roadName: string = '';
            RoadType.forEach((m: any) => {
              if (m.id === item.roadType) roadName = m.roadtypename;
            });
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: roadName,
                fillColor: '#FFFFFF',
              },
              {
                text: item.concrete,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.asphalt,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.gravel,
                fillColor: '#FFFFFF',
              },
              {
                text: item.earth,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.totalLength,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 20, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*', '*', '*'],
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  TelgraphGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.reportService.GetTelFacilityReport(this.params).subscribe({
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
          margin: [0, 20, 0, 0],
          columns: [
            {
              text: `List of Telegraph Facilities by Municipality/ City`,
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

        console.log('dist1Group ', dist1Group);

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        console.log('dist2Group ', dist2);

        tableData.push([
          {
            text: '#',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Telegraph Station',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Facilities Maintained',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Services Rendered',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Type of Radio Equipment',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Transmit/Recieve Freq.',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Contact Details',
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
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 8,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 8,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.station,
                fillColor: '#FFFFFF',
              },
              {
                text: item.facilities,
                fillColor: '#FFFFFF',
              },
              {
                text: item.services,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.equipment,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.frequency,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 8,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 8,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.station,
                fillColor: '#FFFFFF',
              },
              {
                text: item.facilities,
                fillColor: '#FFFFFF',
              },
              {
                text: item.services,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.equipment,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.frequency,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 20, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*', '*', '*', '*'],
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  TelcomGeneratePDF() {
    let list_of_type: any = [
      { id: 1, name: 'Globe' },
      { id: 2, name: 'Smart' },
    ];
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.reportService.GetTelcomReport(this.params).subscribe({
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
          margin: [0, 20, 0, 0],
          columns: [
            {
              text: `List of Telecommunication Systems by Municipality/ City`,
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

        console.log('dist1Group ', dist1Group);

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        console.log('dist2Group ', dist2);

        tableData.push([
          {
            text: '#',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Company',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Type of Exchange/ Facilities',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Installed Lines',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Total Subscribed Line',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Contact Person',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Contact Details',
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
          {
            text: 'Barangay',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 9,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 9,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group1.forEach((item: any, index: any) => {
            let _type: string = '';
            list_of_type.forEach((m: any) => {
              if (m.id === item.type) _type = m.name;
            });
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.telco,
                fillColor: '#FFFFFF',
              },
              {
                text: _type,
                fillColor: '#FFFFFF',
              },
              {
                text: item.installed,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.subscribed,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.contactPerson,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 9,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 9,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group2.forEach((item: any, index: any) => {
            let _type: string = '';
            list_of_type.forEach((m: any) => {
              if (m.id === item.type) _type = m.name;
            });
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.telco,
                fillColor: '#FFFFFF',
              },
              {
                text: _type,
                fillColor: '#FFFFFF',
              },
              {
                text: item.installed,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.subscribed,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.contactPerson,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 20, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*', '*', '*', '*', '*'],
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  PostalGeneratePDF() {
    let data: any = [];
    let grandTotal: any = {};

    let reports: any = [];
    let columnLenght: number = 0;

    const tableData: any = [];

    this.reportService.GetComPostalReport(this.params).subscribe({
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
            fontSize: 9,
          },
          {
            text: 'Municipality/ City',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: 'Post Office/ Location',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: 'No. of Post Masters',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: 'Mail Sorters',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: 'Postal Clerks',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: 'Mail Carriers',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: 'Mail Truck/ Van',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: 'Motorcycle',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: 'Bicycle',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: 'Postal Stations',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9,
          },
        ]);

        reports.forEach((a: any) => {
          let _district: string = '1st';
          if (a.district === 2) {
            _district = '2nd';
          }
          tableData.push([
            {
              text: `${_district} Congressional District `,
              colSpan: 11,
              alignment: 'left',
              fillColor: '#526D82',
              marginLeft: 5,
              fontSize: 9,
            },
          ]);
          a.data.forEach((b: any, index2: any) => {
            tableData.push([
              {
                text: index2 + 1,
                fillColor: '#FFFFFF',
                alignment: 'center',
                fontSize: 9,
              },
              {
                text: b.munCityName,
                fillColor: '#FFFFFF',
                fontSize: 9,
              },
              {
                text: b.munData.location,
                fillColor: '#FFFFFF',
                fontSize: 9,
              },
              {
                text: b.munData.postMastersNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
                fontSize: 9,
              },
              {
                text: b.munData.mailSortersNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
                fontSize: 9,
              },
              {
                text: b.munData.postalClerkNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
                fontSize: 9,
              },
              {
                text: b.munData.postalCarriersNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
                fontSize: 9,
              },
              {
                text: b.munData.mailTruck,
                fillColor: '#FFFFFF',
                alignment: 'center',
                fontSize: 9,
              },
              {
                text: b.munData.motorcycle,
                fillColor: '#FFFFFF',
                alignment: 'center',
                fontSize: 9,
              },
              {
                text: b.munData.bicycle,
                fillColor: '#FFFFFF',
                alignment: 'center',
                fontSize: 9,
              },
              {
                text: b.munData.postalStations,
                fillColor: '#FFFFFF',
                fontSize: 9,
              },
            ]);
          });

          tableData.push([
            {
              text: 'SUBTOTAL',
              fillColor: '#9DB2BF',
              colSpan: 3,
              marginLeft: 5,
              fontSize: 9,
            },
            {},
            {},
            {
              text: a.subtotal.postMastersNo,
              fillColor: '#9DB2BF',
              alignment: 'center',
              fontSize: 9,
            },
            {
              text: a.subtotal.mailSortersNo,
              fillColor: '#9DB2BF',
              alignment: 'center',
              fontSize: 9,
            },
            {
              text: a.subtotal.postalClerkNo,
              fillColor: '#9DB2BF',
              alignment: 'center',
              fontSize: 9,
            },
            {
              text: a.subtotal.postalCarriersNo,
              fillColor: '#9DB2BF',
              alignment: 'center',
              fontSize: 9,
            },
            {
              text: a.subtotal.mailTruck,
              fillColor: '#9DB2BF',
              alignment: 'center',
              fontSize: 9,
            },
            {
              text: a.subtotal.motorcycle,
              fillColor: '#9DB2BF',
              alignment: 'center',
              fontSize: 9,
            },
            {
              text: a.subtotal.bicycle,
              fillColor: '#9DB2BF',
              alignment: 'center',
              fontSize: 9,
            },
            { text: '', fillColor: '#9DB2BF' },
          ]);
        });

        tableData.push([
          {
            text: 'GRANDTOTAL',
            fillColor: '#F1C93B',
            colSpan: 3,
            marginLeft: 5,
            fontSize: 9,
          },
          {},
          {},
          {
            text: grandTotal.postMastersNo,
            fillColor: '#F1C93B',
            alignment: 'center',
          },
          {
            text: grandTotal.mailSortersNo,
            fillColor: '#F1C93B',
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: grandTotal.postalClerkNo,
            fillColor: '#F1C93B',
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: grandTotal.postalCarriersNo,
            fillColor: '#F1C93B',
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: grandTotal.mailTruck,
            fillColor: '#F1C93B',
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: grandTotal.motorcycle,
            fillColor: '#F1C93B',
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: grandTotal.bicycle,
            fillColor: '#F1C93B',
            alignment: 'center',
            fontSize: 9,
          },
          { text: '', fillColor: '#F1C93B' },
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  ISPGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.reportService.GetComISPReport(this.params).subscribe({
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
          margin: [0, 20, 0, 0],
          columns: [
            {
              text: `List of Internet Service Providers by Municipality/ City`,
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

        console.log('dist1Group ', dist1Group);

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        console.log('dist2Group ', dist2);

        tableData.push([
          {
            text: '#',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Name of ISP',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Services/ Remarks	',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Capacity/ Bandwidth',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'No. of Subscribers',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Contact Details',
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
          {
            text: 'Barangay',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 8,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 8,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.remarks,
                fillColor: '#FFFFFF',
              },
              {
                text: item.bandwidth,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.subscribersNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 8,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 8,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.remarks,
                fillColor: '#FFFFFF',
              },
              {
                text: item.bandwidth,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.subscribersNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 20, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*', '*', '*', '*'],
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  MailGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.reportService.GetComExpressReport(this.params).subscribe({
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
          margin: [0, 20, 0, 0],
          columns: [
            {
              text: `List of Express Mail/ Mailing Services by Municipality/ City`,
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

        console.log('dist1Group ', dist1Group);

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        console.log('dist2Group ', dist2);

        tableData.push([
          {
            text: '#',
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
            text: 'Location',
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
          {
            text: 'Services/ Remarks',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 5,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 5,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
              {
                text: item.remarks,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 5,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 5,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
              {
                text: item.remarks,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 20, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*'],
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  TelSysGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.reportService.GetCellSitesReport(this.params).subscribe({
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
          margin: [0, 20, 0, 0],
          columns: [
            {
              text: `List of Communication Towers/ Cell-sites by Municipality/ City`,
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

        console.log('dist1Group ', dist1Group);

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        console.log('dist2Group ', dist2);

        tableData.push([
          {
            text: '#',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Company',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Tower Name/ Identification',
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
          },
          {
            text: 'Contact Person',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Contact Details',
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
          {
            text: 'Barangay',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 8,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 8,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.telcom,
                fillColor: '#FFFFFF',
              },
              {
                text: item.tower,
                fillColor: '#FFFFFF',
              },
              {
                text: item.remarks,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.contactPerson,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 8,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 8,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.telcom,
                fillColor: '#FFFFFF',
              },
              {
                text: item.tower,
                fillColor: '#FFFFFF',
              },
              {
                text: item.remarks,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.contactPerson,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 20, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*', '*', '*', '*'],
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  //ASSOCIATION
  FoundationGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.params.menuId = '6';

    this.reportService.GetAssociationReport(this.params).subscribe({
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
          margin: [0, 20, 0, 0],
          columns: [
            {
              text: `List of Foundations by Municipality/ City`,
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

        console.log('dist1Group ', dist1Group);

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        console.log('dist2Group ', dist2);

        tableData.push([
          {
            text: '#',
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
            text: 'No. of Members',
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
          },
          {
            text: 'Contact Details',
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
          {
            text: 'Barangay',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 7,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 7,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.membersNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.remarks,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 7,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 7,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.membersNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.remarks,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 20, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*', '*', '*'],
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  SectoralGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.params.menuId = '7';

    this.reportService.GetAssociationReport(this.params).subscribe({
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
          margin: [0, 20, 0, 0],
          columns: [
            {
              text: `List of Sectoral by Municipality/ City`,
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

        console.log('dist1Group ', dist1Group);

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        console.log('dist2Group ', dist2);

        tableData.push([
          {
            text: '#',
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
            text: 'No. of Members',
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
          },
          {
            text: 'Contact Details',
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
          {
            text: 'Barangay',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 7,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 7,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.membersNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.remarks,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 7,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 7,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.membersNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.remarks,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 20, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*', '*', '*'],
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  CooperativesGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.params.menuId = '4';

    this.reportService.GetAssociationReport(this.params).subscribe({
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
          margin: [0, 20, 0, 0],
          columns: [
            {
              text: `List of Cooperatives by Municipality/ City`,
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

        console.log('dist1Group ', dist1Group);

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        console.log('dist2Group ', dist2);

        tableData.push([
          {
            text: '#',
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
            text: 'No. of Members',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Total Assets',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Contact Details',
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
          {
            text: 'Barangay',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 7,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 7,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.membersNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.totalAssets,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 7,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 7,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.membersNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.totalAssets,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 20, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*', '*', '*'],
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  CommercialGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.params.menuId = '4';

    this.reportService.GetAssociationReport(this.params).subscribe({
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
          margin: [0, 20, 0, 0],
          columns: [
            {
              text: `List of Commercial/ Industrial/ Labor Organizations by Municipality/ City`,
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

        console.log('dist1Group ', dist1Group);

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        console.log('dist2Group ', dist2);

        tableData.push([
          {
            text: '#',
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
            text: 'No. of Members',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Total Assets',
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
          },
          {
            text: 'Contact Details',
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
          {
            text: 'Barangay',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 8,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 8,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.membersNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.totalAssets,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.remarks,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 8,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 8,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.membersNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.totalAssets,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.remarks,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 20, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*', '*', '*', '*'],
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  ProfGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.params.menuId = '3';

    this.reportService.GetAssociationReport(this.params).subscribe({
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
          margin: [0, 20, 0, 0],
          columns: [
            {
              text: `List of Professional Organizations by Municipality/ City`,
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

        console.log('dist1Group ', dist1Group);

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        console.log('dist2Group ', dist2);

        tableData.push([
          {
            text: '#',
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
            text: 'No. of Members',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Total Assets',
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
          },
          {
            text: 'Contact Details',
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
          {
            text: 'Barangay',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 8,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 8,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.membersNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.totalAssets,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.remarks,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 8,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 8,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.membersNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.totalAssets,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.remarks,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 20, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*', '*', '*', '*'],
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }

  ReligiousGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.params.menuId = '2';

    this.reportService.GetAssociationReport(this.params).subscribe({
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
          margin: [0, 20, 0, 0],
          columns: [
            {
              text: `List of Religious Organizations by Municipality/ City`,
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

        console.log('dist1Group ', dist1Group);

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        console.log('dist2Group ', dist2);

        tableData.push([
          {
            text: '#',
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
            text: 'No. of Members',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Total Assets',
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
          },
          {
            text: 'Contact Details',
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
          {
            text: 'Barangay',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 8,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 8,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.membersNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.totalAssets,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.remarks,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 8,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 8,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.membersNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.totalAssets,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.remarks,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 20, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*', '*', '*', '*'],
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  CivicOrgGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.params.menuId = '1';

    this.reportService.GetAssociationReport(this.params).subscribe({
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
          margin: [0, 20, 0, 0],
          columns: [
            {
              text: `List of Civic Organizations by Municipality/ City`,
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

        console.log('dist1Group ', dist1Group);

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        console.log('dist2Group ', dist2);

        tableData.push([
          {
            text: '#',
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
            text: 'No. of Members',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Total Assets',
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
          },
          {
            text: 'Contact Details',
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
          {
            text: 'Barangay',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 8,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 8,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.membersNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.totalAssets,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.remarks,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 8,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 8,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.membersNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.totalAssets,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.remarks,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 20, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*', '*', '*', '*'],
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  //HOUSING
  SubdvGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];
    this.params.menuId = '3';

    this.reportService.GetHousingSubdvReport(this.params).subscribe({
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
          margin: [0, 20, 0, 0],
          columns: [
            {
              text: `List of Subdivisions by Municipality/City`,
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

        console.log('dist1Group ', dist1Group);

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        console.log('dist2Group ', dist2);

        tableData.push([
          {
            text: '#',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Name of Subdivision',
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
          {
            text: 'Barangay',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Owner/ Developer',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Area (Has)',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'No. of Housing Units/ Lots',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'No. of Housing Units/ Lots Sold',
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
          },
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 9,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 9,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
              {
                text: item.owner,
                fillColor: '#FFFFFF',
              },
              {
                text: item.area,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.housingNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.lotSoldNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.remarks,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 9,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 9,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
              {
                text: item.owner,
                fillColor: '#FFFFFF',
              },
              {
                text: item.area,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.housingNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.lotSoldNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.remarks,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 20, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*', '*', '*', '*', '*'],
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  GovHousingGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];
    this.params.menuId = '2';

    this.reportService.GetHousingProjReport(this.params).subscribe({
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
          margin: [0, 20, 0, 0],
          columns: [
            {
              text: `List of Government Housing Projects by Municipality/City`,
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

        console.log('dist1Group ', dist1Group);

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        console.log('dist2Group ', dist2);

        tableData.push([
          {
            text: '#',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Name of Housing Project',
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
          {
            text: 'Barangay',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Area (Has)',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'No. of Housing Units',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'No. of Families',
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
          },
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 8,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 8,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
              {
                text: item.area,
                fillColor: '#FFFFFF',
              },
              {
                text: item.housingNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.familiesNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.remarks,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 8,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 8,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
              {
                text: item.area,
                fillColor: '#FFFFFF',
              },
              {
                text: item.housingNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.familiesNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.remarks,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 20, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*', '*', '*', '*'],
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  SettlersGeneratePDF() {
    let data: any = [];
    let grandTotal: any = {};

    let reports: any = [];
    let columnLength: number = 0;

    const tableData: any = [];

    this.reportService.GetHousingSettlersReport(this.params).subscribe({
      next: (response: any = {}) => {
        reports = response.data;
        grandTotal = response.grandTotal;

        console.log('result: ', response);

        data.push({
          margin: [0, 40, 0, 0],
          columns: [
            {
              text: `List of Informal Settlements by Municipality/City`,
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
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Location',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Barangay',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'No. of Dwelling Units',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'No. of Families',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Remarks',
            bold: true,
            alignment: 'center',
          },
        ]);

        reports.forEach((a: any) => {
          tableData.push([
            {
              text: a.munCityName,
              bold: true,
              alignment: 'left',
              colSpan: 6,
              marginLeft: 5,
            },
            {},
            {},
            {},
            {},
            {},
          ]);

          a.data.forEach((b: any, index2: any) => {
            tableData.push([
              {
                text: index2 + 1,
                alignment: 'center',
              },
              {
                text: b.location,
              },
              {
                text: b.brgyName,
              },
              {
                text: b.unitsNo,
                alignment: 'center',
              },
              {
                text: b.familiesNo,
                alignment: 'center',
              },
              {
                text: b.remarks,
              },
            ]);
          });

          tableData.push([
            {
              text: 'SUBTOTAL',
              colSpan: 2,
              marginLeft: 5,
            },
            {},
            {
              text: a.subtotal.brgyCount,
            },
            {
              text: a.subtotal.unitsNo,
              alignment: 'center',
            },
            {
              text: a.subtotal.familiesNo,
              alignment: 'center',
            },
            {
              text: '',
            },
          ]);
        });

        tableData.push([
          {
            text: 'GRANDTOTAL',
            bold: true,
            colSpan: 2,
            marginLeft: 5,
          },
          {},
          {
            text: grandTotal.brgyCount,
          },
          {
            text: grandTotal.unitsNo,
            alignment: 'center',
          },
          {
            text: grandTotal.familiesNo,
            alignment: 'center',
          },
          {
            text: '',
          },
        ]);

        const table = {
          margin: [0, 10, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*', '*'],
            body: tableData,
          },
          layout: {
            hLineWidth: function (i: any, node: any) {
              return 0.5;
            },
            vLineWidth: function (i: any, node: any) {
              return 0.5;
            },
            hLineColor: function (i: any, node: any) {
              return '#000';
            },
            vLineColor: function (i: any, node: any) {
              return '#000';
            },
            paddingLeft: function (_i: any, node: any) {
              return 4;
            },
            paddingRight: function (_i: any, node: any) {
              return 4;
            },
            paddingTop: function (_i: any, node: any) {
              return 2;
            },
            paddingBottom: function (_i: any, node: any) {
              return 2;
            },
          },
        };

        data.push(table);
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }

  //PUBLIC ORDER AND SAFETY
  IndexCrimeGeneratePDF() {
    let data: any = [];
    let grandTotal: any = {};

    let reports: any = [];
    let columnLenght: number = 0;

    const tableData: any = [];

    this.reportService.GetSafetyIndexReport(this.params).subscribe({
      next: (response: any = {}) => {
        reports = response.data;
        grandTotal = response.grandTotal;

        console.log('result: ', response);

        data.push({
          margin: [0, 40, 0, 0],
          columns: [
            {
              text: `Index Crime by Municipality/City`,
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
            text: 'Murder',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Homicide',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Physical Injury',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Rape',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Robbery',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Theft',
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
                let textValue: any = b[key];
                if (index === 0) {
                  columnWidth++;
                }

                dist.push({
                  text: key === 'munCityId' ? (b[key] = index + 1) : textValue,
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
                  text: key === 'munCityId' ? (b[key] = index + 1) : textValue,
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
                let textValue: any = a.subTotal[key];

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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  TanodGeneratePDF() {
    let data: any = [];
    let grandTotal: any = {};

    let reports: any = [];
    let columnLenght: number = 0;

    const tableData: any = [];

    this.reportService.GetSafetyTanodReport(this.params).subscribe({
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
          },
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
                  text: key === 'munCityId' ? (b[key] = index + 1) : textValue,
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
                  text: key === 'munCityId' ? (b[key] = index + 1) : textValue,
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
                let textValue: any = a.subTotal[key];

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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  FireGeneratePDF() {
    let data: any = [];
    let grandTotal: any = {};

    let reports: any = [];
    let columnLenght: number = 0;

    const tableData: any = [];

    this.reportService.GetSafetyFireReport(this.params).subscribe({
      next: (response: any = {}) => {
        reports = response.data;
        grandTotal = response.grandTotal;

        console.log('result: ', response);

        data.push({
          margin: [0, 40, 0, 0],
          columns: [
            {
              text: `Fire Protection Services by Municipality/City`,
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

        tableData.push(
          [
            {
              text: '#',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              rowSpan: 2,
            },
            {
              text: 'Municipality/ City',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              rowSpan: 2,
            },
            {
              text: 'Fire Station	',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              rowSpan: 2,
            },
            {
              text: 'Current Force',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              colSpan: 3,
            },
            {},
            {},
            {
              text: 'No. of Firetrucks',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              rowSpan: 2,
            },
          ],
          [
            {},
            {},
            {},
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
            {},
          ]
        );

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
                if (key === 'ratio') {
                  textValue = b[key].toFixed(2);
                } else {
                  textValue = b[key];
                }
                dist.push({
                  text: key === 'munCityId' ? (b[key] = index + 1) : textValue,
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
                if (key === 'ratio') {
                  textValue = a.subTotal[key].toFixed(2);
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
                if (key === 'ratio') {
                  textValue = b[key].toFixed(2);
                } else {
                  textValue = b[key];
                }
                dist.push({
                  text: key === 'munCityId' ? (b[key] = index + 1) : textValue,
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
                if (key === 'ratio') {
                  textValue = a.subTotal[key].toFixed(2);
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
            if (key === 'ratio') {
              textValue = grandTotal[key].toFixed(2);
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  PoliceGeneratePDF() {
    let data: any = [];
    let grandTotal: any = {};

    let reports: any = [];
    let columnLenght: number = 0;

    const tableData: any = [];

    this.reportService.GetSafetyPoliceReport(this.params).subscribe({
      next: (response: any = {}) => {
        reports = response.data;
        grandTotal = response.grandTotal;

        console.log('result: ', response);

        data.push({
          margin: [0, 40, 0, 0],
          columns: [
            {
              text: `Police Services by Municipality/City`,
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

        tableData.push(
          [
            {
              text: '#',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              rowSpan: 2,
            },
            {
              text: 'Municipality/ City',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              rowSpan: 2,
            },
            {
              text: 'Population',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              rowSpan: 2,
            },
            {
              text: 'Current Force',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              colSpan: 3,
            },
            {},
            {},
            {
              text: 'Ratio to Population	',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              rowSpan: 2,
            },
            {
              text: 'No. of Stations',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              rowSpan: 2,
            },
          ],
          [
            {},
            {},
            {},
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
            {},
            {},
          ]
        );

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
                if (key === 'ratio') {
                  textValue = b[key].toFixed(2);
                } else {
                  textValue = b[key];
                }
                dist.push({
                  text: key === 'munCityId' ? (b[key] = index + 1) : textValue,
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
                if (key === 'ratio') {
                  textValue = a.subTotal[key].toFixed(2);
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
                if (key === 'ratio') {
                  textValue = b[key].toFixed(2);
                } else {
                  textValue = b[key];
                }
                dist.push({
                  text: key === 'munCityId' ? (b[key] = index + 1) : textValue,
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
                if (key === 'ratio') {
                  textValue = a.subTotal[key].toFixed(2);
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
            if (key === 'ratio') {
              textValue = grandTotal[key].toFixed(2);
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  //HEALTH
  ProvHospGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];

    this.reportService.GetHealthHospitalReport(this.params).subscribe({
      next: (response: any = {}) => {
        reports = response;
        console.log('result: ', response);

        data.push({
          margin: [0, 40, 0, 0],
          columns: [
            {
              text: `List of Provincial Hospitals`,
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

        tableData.push([
          {
            text: '#',
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
            text: 'Bed Capacity',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Occupancy Rate',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Contact Person/Designation',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Contact Numbers',
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

        reports.forEach((item: any, index: any) => {
          tableData.push([
            {
              text: index + 1,
              fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
              marginLeft: 5,
            },
            {
              text: item.name,
              fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
            },
            {
              text: item.capacity,
              fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
              alignment: 'center',
            },
            {
              text: item.rate,
              fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
              alignment: 'center',
            },
            {
              text: item.contactPerson,
              fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
            },
            {
              text: item.contactNo,
              fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
              alignment: 'center',
            },
            {
              text: item.location,
              fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
            },
          ]);
        });

        const table = {
          margin: [0, 20, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*', '*', '*'],
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  PWDGeneratePDF() {
    let reports: any = [];
    let data: any = [];
    let dist1: any = [];
    let dist2: any = [];
    let contentData: any = [];
    let columns: any = [];
    let columnWidth: any = [];
    let columnsData: any = [];
    let grandTotal: any = [];
    let _grandTotal: any = [];

    this.reportService.GetHealthHandiReport(this.params).subscribe({
      next: (response: any = {}) => {
        reports = response.data;
        dist1 = response.districtOne;
        dist2 = response.districtTwo;
        columns = response.columns;
        grandTotal = response.grandTotal;

        console.log(response);
        const tableData: any = [];

        data.push({
          text: `Persons with Disability for the year ${response.year}`, // Add the title text
          fontSize: 14,
          bold: true,
          alignment: 'center',
          margin: [0, 20], // Adjust the margin around the title as needed
        });

        columns.forEach((b: any, index: any) => {
          // GET COLUMN
          if (index == 0) {
            columnWidth.push('auto');
            columnsData.push({
              text: 'Muncipality/ City',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              fontSize: 8,
            });
          }
          columnWidth.push('auto');
          columnsData.push({
            text: b.typeName,
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 6.8,
          });
        });

        tableData.push(columnsData); // PUSH COLUMN

        reports.forEach((a: any, index: any) => {
          if (a.district === 1) {
            tableData.push([
              {
                text: `1st Congressional District `,
                fontSize: 8,
                colSpan: columnWidth.length,
                alignment: 'left',
                fillColor: '#526D82',
              },
            ]);
            dist1.forEach((b: any) => {
              let _data = [];
              _data.push({ text: b.munCityName, fontSize: 8 });

              columns.forEach((c: any) => {
                let count = '-';
                a.data.forEach((d: any) => {
                  d.munData.forEach((e: any) => {
                    if (e.type === c.recNo && d.munCityId === b.munCityId) {
                      count = e.total;
                    }
                  });
                });
                _data.push({ text: count, fontSize: 8 });
              });

              tableData.push(_data);
            });

            let subTotal: any = [];
            columns.forEach((c: any, y: any) => {
              let count = '-';
              if (y == 0) {
                subTotal.push({
                  text: 'SUBTOTAL',
                  fontSize: 8,
                  fillColor: '#9DB2BF',
                });
              }
              a.subTotal.forEach((d: any) => {
                if (d.type === c.recNo) {
                  count = d.total;
                }
              });
              subTotal.push({ text: count, fontSize: 8, fillColor: '#9DB2BF' });
            });

            tableData.push(subTotal);
          } else {
            tableData.push([
              {
                text: `2nd Congressional District `,
                fontSize: 8,
                colSpan: columnWidth.length,
                alignment: 'left',
                fillColor: '#526D82',
              },
            ]);
            dist2.forEach((b: any) => {
              let _data = [];
              _data.push({ text: b.munCityName, fontSize: 8 });

              columns.forEach((c: any) => {
                let count = '-';
                a.data.forEach((d: any) => {
                  d.munData.forEach((e: any) => {
                    if (e.type === c.recNo && d.munCityId === b.munCityId) {
                      count = e.total;
                    }
                  });
                });
                _data.push({ text: count, fontSize: 8 });
              });

              tableData.push(_data);
            });

            let subTotal: any = [];
            columns.forEach((c: any, y: any) => {
              let count = '-';
              if (y == 0) {
                subTotal.push({
                  text: 'SUBTOTAL',
                  fontSize: 8,
                  fillColor: '#9DB2BF',
                });
              }
              a.subTotal.forEach((d: any) => {
                if (d.type === c.recNo) {
                  count = d.total;
                }
              });
              subTotal.push({ text: count, fontSize: 8, fillColor: '#9DB2BF' });
            });

            tableData.push(subTotal);
          }
        });

        columns.forEach((c: any, v: any) => {
          let count = '-';
          if (v === 0) {
            _grandTotal.push({
              text: 'GRANDTOTAL',
              fontSize: 8,
              fillColor: '#F1C93B',
            });
          }
          grandTotal.forEach((d: any) => {
            if (d.type === c.recNo) {
              count = d.total;
            }
          });
          _grandTotal.push({ text: count, fontSize: 8, fillColor: '#F1C93B' });
        });

        tableData.push(_grandTotal);

        contentData.push([
          {
            margin: [0, 10, 0, 0],
            table: {
              // widths: columnWidth,
              body: tableData,
            },
          },
        ]);
        data.push(contentData);
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  SanitaryGeneratePDF() {
    let data: any = [];
    let grandTotal: any = {};

    let reports: any = [];
    let columnLenght: number = 0;

    const tableData: any = [];

    this.reportService.GetHealthSanitaryReport(this.params).subscribe({
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
                if (key === 'safeWaterPercent' || key === 'toiletsNoPercent') {
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
                  text: key === 'munCityId' ? (b[key] = index + 1) : textValue,
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
                if (key === 'safeWaterPercent' || key === 'toiletsNoPercent') {
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
                if (key === 'safeWaterPercent' || key === 'toiletsNoPercent') {
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
                  text: key === 'munCityId' ? (b[key] = index + 1) : textValue,
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
                if (key === 'safeWaterPercent' || key === 'toiletsNoPercent') {
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
            if (key === 'safeWaterPercent' || key === 'toiletsNoPercent') {
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  PrivateHospGeneratePDF() {
    let list_of_type: any = [
      { id: 1, type_hosp: 'Diagnostic Clinic' },
      { id: 2, type_hosp: 'Dental Clinic' },
      { id: 3, type_hosp: 'Medical Clinic' },
      { id: 4, type_hosp: 'Medical Laboratory' },
      { id: 5, type_hosp: 'Nursing homes' },
      { id: 6, type_hosp: 'Optical clinic' },
      { id: 7, type_hosp: 'Veterinary Clinic/ products and services' },
      { id: 8, type_hosp: 'Private Hospital' },
      { id: 9, type_hosp: 'Veterinary Supplies retailers' },
    ];

    let hospital_category: any = [
      { id: 1, name_category: 'Not Specified' },
      { id: 2, name_category: 'Primary' },
      { id: 3, name_category: 'Secondary' },
      { id: 4, name_category: 'Tertiary' },
    ];
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];
    this.params.menuId = '4';

    this.reportService.GetHealthFacilityReport(this.params).subscribe({
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
              text: `List of Private Hospitals by Municipality/City`,
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

        console.log('dist1Group ', dist1Group);

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        console.log('dist2Group ', dist2);

        tableData.push([
          {
            text: '#',
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
            text: 'Category',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Type',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Bed Capacity',
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
          {
            text: 'Barangay',
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
          },
          {
            text: 'Contact Person/ Designation',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Contact Details',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 10,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 10,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group1.forEach((item: any, index: any) => {
            let typeName: any;
            let catName: any;
            list_of_type.forEach((m: any) => {
              if (m.id == item.type) {
                typeName = m.type_hosp;
              }
            });
            hospital_category.forEach((n: any) => {
              if (n.id == item.category) {
                catName = n.name_category;
              }
            });
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: catName,
                fillColor: '#FFFFFF',
              },
              {
                text: typeName,
                fillColor: '#FFFFFF',
              },
              {
                text: item.capacity,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
              {
                text: item.description,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactPerson,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 10,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 10,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group2.forEach((item: any, index: any) => {
            let typeName: any;
            let catName: any;
            list_of_type.forEach((m: any) => {
              if (m.id == item.type) {
                typeName = m.type_hosp;
              }
            });
            hospital_category.forEach((n: any) => {
              if (n.id == item.category) {
                catName = n.name_category;
              }
            });
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: catName,
                fillColor: '#FFFFFF',
              },
              {
                text: typeName,
                fillColor: '#FFFFFF',
              },
              {
                text: item.capacity,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
              {
                text: item.description,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactPerson,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 20, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*', '*', '*', '*', '*', '*'],
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  BrgyHealthGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];
    this.params.menuId = '3';

    this.reportService.GetHealthFacilityReport(this.params).subscribe({
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
              text: `List of Barangay Health Stations by Municipality/City`,
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

        console.log('dist1Group ', dist1Group);

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        console.log('dist2Group ', dist2);

        tableData.push([
          {
            text: '#',
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
            text: 'Location',
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
          {
            text: 'Remarks',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Contact Person/ Designation',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Contact Details',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 7,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 7,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
              {
                text: item.description,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactPerson,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 7,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 7,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
              {
                text: item.description,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactPerson,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 20, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*', '*', '*'],
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  ComHospGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];
    this.params.menuId = '2';

    this.reportService.GetHealthFacilityReport(this.params).subscribe({
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
              text: `List of RHUs/ Community Hospitals by Municipality/City`,
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

        console.log('dist1Group ', dist1Group);

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        console.log('dist2Group ', dist2);

        tableData.push([
          {
            text: '#',
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
            text: 'Bed Capacity',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Occupancy Rate',
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
          {
            text: 'Barangay',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Existing Facilities/ Remarks',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Contact Person/ Designation',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Contact Details',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 9,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 9,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.capacity,
                fillColor: '#FFFFFF',
              },
              {
                text: item.rate,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
              {
                text: item.description,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactPerson,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 9,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 9,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.capacity,
                fillColor: '#FFFFFF',
              },
              {
                text: item.rate,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
              {
                text: item.description,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactPerson,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 20, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*', '*', '*', '*', '*'],
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  HealthServiceGeneratePDF() {
    let data: any = [];
    let grandTotal: any = {};

    let reports: any = [];
    let columnLenght: number = 0;

    const tableData: any = [];

    this.reportService.GetHealthWorkersReport(this.params).subscribe({
      next: (response: any = {}) => {
        reports = response.data;
        grandTotal = response.grandTotal;

        console.log('result: ', response);

        data.push({
          margin: [0, 40, 0, 0],
          columns: [
            {
              text: `Number of Health Service Workers by Municipality/City`,
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
            text: 'Physician',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Nurses',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Midwives',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Dentists',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Medical Technoligists',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Pharmacists',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Nutritionists and Dieticians',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Sanitation Inspectors',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Population Program Inspectors',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Health Education Promotion Officers',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Grand Total',
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
                sub.push({
                  text: a.subTotal[key],
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
                sub.push({
                  text: a.subTotal[key],
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
          widths.push('auto');
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  //EDUCATION
  OSYGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const dist1: any = [];
    const dist2: any = [];
    const contentData: any = [];

    let grandTotal: any = [];

    const tableData: any = [];
    this.reportService.GetEducationOsyReport(this.params).subscribe({
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
          if (a.district == '1') {
            // contentData.push([{ text: b.munCityName, bold: true }]);
            tableData.push([
              {
                text: `1st Congressional District `,
                colSpan: 8,
                alignment: 'left',
                fillColor: '#526D82',
                marginLeft: 5,
              },
            ]);
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
                colSpan: 2,
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
          if (a.district == '2') {
            // contentData.push([{ text: b.munCityName, bold: true }]);
            tableData.push([
              {
                text: `2nd Congressional District `,
                colSpan: 8,
                alignment: 'left',
                fillColor: '#526D82',
                marginLeft: 5,
              },
            ]);
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
                colSpan: 2,
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
            colSpan: 2,
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  SPEDGeneratePDF() {
    let data: any = [];
    let grandTotal: any = {};

    let reports: any = [];
    let columnLenght: number = 0;

    const tableData: any = [];

    this.params.menuId = '9';

    this.reportService.GetEducationReport(this.params).subscribe({
      next: (response: any = {}) => {
        reports = response.data;
        grandTotal = response.grandTotal;

        console.log('result: ', response);

        data.push({
          margin: [0, 40, 0, 0],
          columns: [
            {
              text: `Number of SPED Enrolment by Municipality/City`,
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
            text: 'Gr. 1-6 (M)',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Gr. 1-6 (F)',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Gr. 1-6 Total',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Non-Graded (M)',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Non-Graded (F)',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Non-Graded Total',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Natl. Spcl Sch. (M)',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Natl. Spcl Sch. (F)',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Natl. Spcl Sch. Total',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Integrated SPED Sch (M)',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Integrated SPED Sch (F)',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Integrated SPED Sch Total',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Grand Total',
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
                sub.push({
                  text: a.subTotal[key],
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
                sub.push({
                  text: a.subTotal[key],
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
          widths.push('auto');
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  TrainingCenterGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];
    this.params.menuId = '8';

    this.reportService.GetEducationReport(this.params).subscribe({
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
              text: `List of Training Centers by Municipality/City`,
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

        console.log('dist1Group ', dist1Group);

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        console.log('dist2Group ', dist2);

        tableData.push([
          {
            text: '#',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Name of School',
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
          {
            text: 'Contact Person',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Contact Details',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },

          {
            text: 'Courses Offered/ Remarks',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 6,
            alignment: 'left',
            fillColor: '#526D82',
          },
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 6,
              alignment: 'left',
              fillColor: '#9DB2BF',
            },
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactPerson,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.remarks,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 6,
            alignment: 'left',
            fillColor: '#526D82',
          },
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 6,
              alignment: 'left',
              fillColor: '#9DB2BF',
            },
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactPerson,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.remarks,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 20, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*', '*'],
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  TechvocGradGeneratePDF() {
    let data: any = [];
    let reports: any = [];
    let summary: any = [];

    const dist1: any = [];
    const dist2: any = [];
    const contentData: any = [];

    this.params.menuId = 'graduates';
    const tableDataNew: any = [];
    this.reportService.GetEducationTechVocStatReport(this.params).subscribe({
      next: (response: any = {}) => {
        reports = response.data;
        summary = response.summary;
        console.log('result: ', response);

        contentData.push([{ text: 'Summary', bold: true }]);
        tableDataNew.push(
          [
            {
              text: '#',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              rowSpan: 2,
            },
            {
              text: 'Program',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              rowSpan: 2,
            },
            {
              text: 'School',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              rowSpan: 2,
            },
            {
              text: 'Enrolment',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              colSpan: 3,
            },
            {},
            {},
            {
              text: 'Graduates',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              colSpan: 3,
            },
            {},
            {},
          ],
          [
            {},
            {},
            {},
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
          ]
        );

        summary.forEach((a: any, index: any) => {
          tableDataNew.push([
            {
              text: index + 1,
              fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
              bold: true,
              alignment: 'center',
              marginLeft: 5,
            },
            {
              text: a.program,
              fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
              alignment: 'left',
            },
            {
              text: a.count,
              fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
              alignment: 'center',
            },
            {
              text: a.maleEnrolly,
              fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
              alignment: 'center',
            },
            {
              text: a.femaleEnrolly,
              fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
              alignment: 'center',
            },
            {
              text: a.totalEnrolly,
              fillColor: '#F1C93B',
              alignment: 'center',
            },
            {
              text: a.maleGrad,
              fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
              alignment: 'center',
            },
            {
              text: a.femaleGrad,
              fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
              alignment: 'center',
            },
            {
              text: a.totalGrad,
              fillColor: '#F1C93B',
              alignment: 'center',
            },
          ]);
        });

        contentData.push([
          {
            margin: [0, 10, 0, 10],
            table: {
              widths: [25, 250, '*', '*', '*', '*', '*', '*', '*'],
              body: tableDataNew,
            },
            layout: 'lightHorizontalLines',
          },
        ]);

        reports.forEach((a: any, index: any) => {
          a.data.forEach((b: any, index2: any) => {
            const tableData: any = [];

            contentData.push([{ text: b.munCityName, bold: true }]);
            tableData.push(
              [
                {
                  text: '#',
                  fillColor: 'black',
                  color: 'white',
                  bold: true,
                  alignment: 'center',
                  rowSpan: 2,
                },
                {
                  text: 'Program',
                  fillColor: 'black',
                  color: 'white',
                  bold: true,
                  alignment: 'center',
                  rowSpan: 2,
                },
                {
                  text: 'School',
                  fillColor: 'black',
                  color: 'white',
                  bold: true,
                  alignment: 'center',
                  rowSpan: 2,
                },
                {
                  text: 'Enrolment',
                  fillColor: 'black',
                  color: 'white',
                  bold: true,
                  alignment: 'center',
                  colSpan: 3,
                },
                {},
                {},
                {
                  text: 'Graduates',
                  fillColor: 'black',
                  color: 'white',
                  bold: true,
                  alignment: 'center',
                  colSpan: 3,
                },
                {},
                {},
              ],
              [
                {},
                {},
                {},
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
              ]
            );

            b.munData.forEach((c: any, index3: any) => {
              tableData.push([
                {
                  text: index3 + 1,
                  fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
                  bold: true,
                  alignment: 'center',
                  marginLeft: 5,
                },
                {
                  text: c.program,
                  fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
                  alignment: 'left',
                },
                {
                  text: c.count,
                  fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
                  alignment: 'center',
                },
                {
                  text: c.maleEnrolly,
                  fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
                  alignment: 'center',
                },
                {
                  text: c.femaleEnrolly,
                  fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
                  alignment: 'center',
                },
                {
                  text: c.totalEnrolly,
                  fillColor: '#F1C93B',
                  alignment: 'center',
                },
                {
                  text: c.maleGrad,
                  fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
                  alignment: 'center',
                },
                {
                  text: c.femaleGrad,
                  fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
                  alignment: 'center',
                },
                {
                  text: c.totalGrad,
                  fillColor: '#F1C93B',
                  alignment: 'center',
                },
              ]);
            });

            contentData.push([
              {
                margin: [0, 10, 0, 10],
                table: {
                  widths: [25, 250, '*', '*', '*', '*', '*', '*', '*'],
                  body: tableData,
                },
                layout: 'lightHorizontalLines',
              },
            ]);
          });
        });

        data.push(contentData);
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  TechvoProgramsGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const dist1: any = [];
    const dist2: any = [];
    const contentData: any = [];

    this.params.menuId = 'program';

    this.reportService.GetEducationTechVocStatReport(this.params).subscribe({
      next: (response: any = {}) => {
        reports = response.data;
        console.log('result: ', response);

        reports.forEach((a: any, index: any) => {
          a.data.forEach((b: any, index2: any) => {
            const tableData: any = [];

            contentData.push([{ text: b.munCityName, bold: true }]);
            tableData.push([
              {
                text: '#',
                fillColor: 'black',
                color: 'white',
                bold: true,
                alignment: 'center',
              },
              {
                text: 'Program',
                fillColor: 'black',
                color: 'white',
                bold: true,
                alignment: 'center',
              },
            ]);

            b.munData.forEach((c: any, index3: any) => {
              tableData.push([
                {
                  text: c.name,
                  fillColor: '#526D82',
                  //color: 'white',
                  bold: true,
                  alignment: 'center',
                  colSpan: 2,
                },
                {},
              ]);

              c.schoolData.forEach((d: any, index4: any) => {
                tableData.push([
                  {
                    text: index4 + 1,
                    fillColor: '#ffffff',
                    bold: true,
                    alignment: 'left',
                    marginLeft: 5,
                  },
                  {
                    text: d.program,
                    fillColor: '#ffffff',
                    alignment: 'left',
                  },
                ]);
              });
            });

            contentData.push([
              {
                margin: [0, 10, 0, 10],
                table: {
                  widths: [25, '*'],
                  body: tableData,
                },
                layout: 'lightHorizontalLines',
              },
            ]);
          });
        });

        data.push(contentData);
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  TertiaryGradGeneratePDF() {
    let data: any = [];
    let grandTotal: any = {};

    let reports: any = [];
    let columnLenght: number = 0;

    const tableData: any = [];

    let summary: any = [];
    let contentData: any = [];

    this.reportService.GetEducationTertiaryGradReport(this.params).subscribe({
      next: (response: any = {}) => {
        reports = response.data;
        summary = response.summary;
        grandTotal = response.grandTotal;

        console.log('result: ', response);

        data.push({
          margin: [0, 40, 0, 0],
          columns: [
            {
              text: `Tertiary Graduates by Municipality/City`,
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

        data.push({
          margin: [0, 10, 0, 0],
          columns: [
            {
              text: `Summary`,
              fontSize: 12,
              bold: true,
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
            text: 'Course',
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

        summary.forEach((a: any, index: any) => {
          tableData.push([
            {
              text: index + 1,
              marginLeft: 2,
              fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
            },
            {
              text: a.program,
              fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
            },
            {
              text: a.male,
              alignment: 'center',
              fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
            },
            {
              text: a.female,
              alignment: 'center',
              fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
            },
            {
              text: a.total,
              alignment: 'center',
              fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
            },
          ]);
        });

        contentData.push([
          {
            margin: [0, 10, 0, 0],
            table: {
              widths: [25, '*', '*', '*', '*'],
              body: tableData,
            },
            layout: 'lightHorizontalLines',
            pageBreak: 'after',
          },
        ]);

        reports.forEach((a: any, index: any) => {
          let newTableData: any = [];
          contentData.push([{ text: a.munCityName, bold: true }]);
          newTableData.push([
            {
              text: '#',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Course',
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

          a.data.forEach((b: any, i: any) => {
            newTableData.push([
              {
                text: i + 1,
                marginLeft: 2,
                fillColor: i % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
              },
              {
                text: b.program,
                fillColor: i % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
              },
              {
                text: b.male,
                alignment: 'center',
                fillColor: i % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
              },
              {
                text: b.female,
                alignment: 'center',
                fillColor: i % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
              },
              {
                text: b.total,
                alignment: 'center',
                fillColor: i % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
              },
            ]);
          });

          contentData.push([
            {
              margin: [0, 10, 0, 0],
              table: {
                widths: [25, '*', '*', '*', '*'],
                body: newTableData,
              },
              layout: 'lightHorizontalLines',
              pageBreak: 'after',
            },
          ]);
        });

        data.push(contentData);
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  TertiraryEnrolGeneratePDF() {
    let data: any = [];
    let grandTotal: any = {};

    let reports: any = [];
    let columnLenght: number = 0;

    const tableData: any = [];

    this.params.menuId = 'stat';

    this.reportService.GetEducationTertiaryReport(this.params).subscribe({
      next: (response: any = {}) => {
        reports = response.data;
        grandTotal = response.grandTotal;

        console.log('result: ', response);

        data.push({
          margin: [0, 40, 0, 0],
          columns: [
            {
              text: `Tertiary Enrolment by Municipality/City`,
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
                sub.push({
                  text: a.subTotal[key],
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
                sub.push({
                  text: a.subTotal[key],
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  DaycareGeneratePDF() {
    let data: any = [];
    let grandTotal: any = {};

    let reports: any = [];
    let columnLenght: number = 0;

    const tableData: any = [];

    this.params.menuId = '3';

    this.reportService.GetEducationSchoolReport(this.params).subscribe({
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
                sub.push({
                  text: a.subTotal[key],
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
                sub.push({
                  text: a.subTotal[key],
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  PubSecGeneratePDF() {
    let data: any = [];
    let grandTotal: any = {};

    let reports: any = [];
    let columnLenght: number = 0;

    const tableData: any = [];

    this.params.menuId = '5';

    this.reportService.GetEducationSchoolReport(this.params).subscribe({
      next: (response: any = {}) => {
        reports = response.data;
        grandTotal = response.grandTotal;

        console.log('result: ', response);

        data.push({
          margin: [0, 40, 0, 0],
          columns: [
            {
              text: `Number of Public Secondary Schools by Municipality/City`,
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
                sub.push({
                  text: a.subTotal[key],
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
                sub.push({
                  text: a.subTotal[key],
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  PubElemGeneratePDF() {
    let data: any = [];
    let grandTotal: any = {};

    let reports: any = [];
    let columnLenght: number = 0;

    const tableData: any = [];

    this.params.menuId = '4';

    this.reportService.GetEducationSchoolReport(this.params).subscribe({
      next: (response: any = {}) => {
        reports = response.data;
        grandTotal = response.grandTotal;

        console.log('result: ', response);

        data.push({
          margin: [0, 40, 0, 0],
          columns: [
            {
              text: `Number of Public Elementary Shools by Municipality/City`,
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
                sub.push({
                  text: a.subTotal[key],
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
                sub.push({
                  text: a.subTotal[key],
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  PrivSecGeneratePDF() {
    let data: any = [];
    let grandTotal: any = {};

    let reports: any = [];
    let columnLenght: number = 0;

    const tableData: any = [];

    this.params.menuId = '2';

    this.reportService.GetEducationSchoolReport(this.params).subscribe({
      next: (response: any = {}) => {
        reports = response.data;
        grandTotal = response.grandTotal;

        console.log('result: ', response);

        data.push({
          margin: [0, 40, 0, 0],
          columns: [
            {
              text: `Number of Private Secondary Schools by Municipality/City`,
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
                sub.push({
                  text: a.subTotal[key],
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
                sub.push({
                  text: a.subTotal[key],
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  PrivElemGeneratePDF() {
    let data: any = [];
    let grandTotal: any = {};

    let reports: any = [];
    let columnLenght: number = 0;

    const tableData: any = [];

    this.params.menuId = '1';

    this.reportService.GetEducationSchoolReport(this.params).subscribe({
      next: (response: any = {}) => {
        reports = response.data;
        grandTotal = response.grandTotal;

        console.log('result: ', response);

        data.push({
          margin: [0, 40, 0, 0],
          columns: [
            {
              text: `Number of Private Elementary Schools by Municipality/City`,
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
                sub.push({
                  text: a.subTotal[key],
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
                sub.push({
                  text: a.subTotal[key],
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  TertiaryGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.reportService.GetEducationTertiaryReport(this.params).subscribe({
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
            marginLeft: 4,
          },
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 3,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 4,
            },
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 4,
              },
              {
                text: item.school,
                fillColor: '#FFFFFF',
              },
              {
                text: item.location + ' ' + item.brgyName,
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
            marginLeft: 4,
          },
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 3,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 4,
            },
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 4,
              },
              {
                text: item.school,
                fillColor: '#FFFFFF',
              },

              {
                text: item.location + ' ' + item.brgyName,
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  TechvocFacGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.reportService.GetEducationTechVocReport(this.params).subscribe({
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
              text: `List of Technical/Vocational Facilities by Municipality/City`,
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
            marginLeft: 4,
          },
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 3,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 4,
            },
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 4,
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },

              {
                text: item.location + ' ' + item.brgyName,
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
            marginLeft: 4,
          },
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 3,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 4,
            },
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 4,
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },

              {
                text: item.location + ' ' + item.brgyName,
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  PubPrivGeneratePDF() {
    let data: any = [];
    let grandTotal: any = {};

    let reports: any = [];
    let columnLenght: number = 0;

    const tableData: any = [];

    this.reportService.GetEducationStatReport(this.params).subscribe({
      next: (response: any = {}) => {
        reports = response.data;
        grandTotal = response.grandTotal;

        console.log('result: ', response);

        data.push({
          margin: [0, 40, 0, 0],
          columns: [
            {
              text: `Number of Public and Private by Municipality/City`,
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
            text: 'Purely ES',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Purely JHS',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'JHS and SHS',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Purely SHS',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Integrated ES and JHS',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Integrated ES, JHS, SHS',
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
                  text: '',
                  fillColor: '#9DB2BF',
                  alignment: 'left',
                });
              }

              sub.push({
                text: a.subTotal[key],
                fillColor: '#9DB2BF',
                alignment: key === 'subTotal' ? 'left' : 'center',
              });
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
                  text: '',
                  fillColor: '#9DB2BF',
                  alignment: 'left',
                });
              }

              sub.push({
                text: a.subTotal[key],
                fillColor: '#9DB2BF',
                alignment: key === 'subTotal' ? 'left' : 'center',
              });
            }
            tableData.push(sub);
          }
        });

        let grand: any = []; // GRAND TOTAL
        for (let key in grandTotal) {
          if (key === 'grandTotal') {
            grand.push({
              text: '',
              fillColor: '#F1C93B',
              alignment: 'left',
            });
          }

          grand.push({
            text: grandTotal[key],
            fillColor: '#F1C93B',
            alignment: key === 'grandTotal' ? 'left' : 'center',
          });
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  //AGRICULTURE
  SlaughterGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];
    this.params.menuId = '7';

    this.reportService.GetAgricultureReport(this.params).subscribe({
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
              text: `List of Slaughterhouses by Municipality/City`,
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

        console.log('dist1Group ', dist1Group);

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        console.log('dist2Group ', dist2);

        tableData.push([
          {
            text: '#',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Name of Slaughterhouse',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Ownership',
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
          {
            text: 'Capacity',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Area (Sq.m)',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 6,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 6,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.ownershipType == 1 ? 'Government' : 'Private',
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.capacity,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.area,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 6,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 6,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.ownershipType == 1 ? 'Government' : 'Private',
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
              {
                text: item.capacity,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.area,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 10, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*', '*'],
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  WarehouseGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];
    this.params.menuId = '6';

    this.reportService.GetAgricultureReport(this.params).subscribe({
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
              text: `List of Warehouses by Municipality/City`,
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

        console.log('dist1Group ', dist1Group);

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        console.log('dist2Group ', dist2);

        tableData.push([
          {
            text: '#',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Name of Warehouse',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Content',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Capacity (M.T)',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Area (Sq.m)',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 5,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 5,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.classification,
                fillColor: '#FFFFFF',
              },
              {
                text: item.capacity,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.area,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 5,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 5,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.classification,
                fillColor: '#FFFFFF',
              },
              {
                text: item.capacity,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.area,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 10, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*'],
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  RicemillsGeneratePDF() {
    let listofRicemill: any = [
      { id: `1`, type: `Cono` },
      { id: `2`, type: `Kiskisan` },
      { id: `3`, type: `Rubber Roll` },
      { id: `4`, type: `Centrifugal` },
      { id: `5`, type: `MOBILE` },
      { id: `6`, type: `Others` },
    ];
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];
    this.params.menuId = '5';

    this.reportService.GetAgricultureReport(this.params).subscribe({
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
              text: `List of Ricemills by Municipality/City`,
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

        console.log('dist1Group ', dist1Group);

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        console.log('dist2Group ', dist2);

        tableData.push([
          {
            text: '#',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Name of Ricemill',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Category',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Capacity (M.T)',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Area (Sq.m)',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 5,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 5,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group1.forEach((item: any, index: any) => {
            let type = '';
            listofRicemill.forEach((a: any) => {
              if (item.type === parseInt(a.id)) {
                type = a.type;
              }
            });

            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: type,
                fillColor: '#FFFFFF',
              },
              {
                text: item.capacity,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.area,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 5,
            alignment: 'left',
            fillColor: '#526D82',
            marginLeft: 5,
          },
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 5,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group2.forEach((item: any, index: any) => {
            let type = '';
            listofRicemill.forEach((a: any) => {
              if (item.type === parseInt(a.id)) {
                type = a.type;
              }
            });

            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: type,
                fillColor: '#FFFFFF',
              },
              {
                text: item.capacity,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.area,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 10, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*'],
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  LivestockGeneratePDF() {
    let data: any = [];
    let grandTotal: any = {};

    let reports: any = [];
    let columnLenght: number = 0;

    const tableData: any = [];

    this.reportService.GetAgricultureLivestockReport(this.params).subscribe({
      next: (response: any = {}) => {
        reports = response.data;
        grandTotal = response.grandTotal;

        console.log('result: ', response);

        data.push({
          margin: [0, 40, 0, 0],
          columns: [
            {
              text: `List of Poultry/ Livestock Production by Municipality/City`,
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
            text: 'Carabao',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Cattle',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Goat',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Swine',
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
                  text: '',
                  fillColor: '#9DB2BF',
                  alignment: 'left',
                });
              }

              sub.push({
                text: a.subTotal[key],
                fillColor: '#9DB2BF',
                alignment: key === 'subTotal' ? 'left' : 'center',
              });
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
                  text: '',
                  fillColor: '#9DB2BF',
                  alignment: 'left',
                });
              }

              sub.push({
                text: a.subTotal[key],
                fillColor: '#9DB2BF',
                alignment: key === 'subTotal' ? 'left' : 'center',
              });
            }
            tableData.push(sub);
          }
        });

        let grand: any = []; // GRAND TOTAL
        for (let key in grandTotal) {
          if (key === 'grandTotal') {
            grand.push({
              text: '',
              fillColor: '#F1C93B',
              alignment: 'left',
            });
          }

          grand.push({
            text: grandTotal[key],
            fillColor: '#F1C93B',
            alignment: key === 'grandTotal' ? 'left' : 'center',
          });
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
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  FisheriesGeneratePDF() {
    let data: any = [];
    let grandTotal: any = {};
    let district1: any = [];
    let district2: any = [];
    let columnTypes: any = [];

    let reports: any = [];
    let columnLenght: number = 0;

    const tableData: any = [];
    this.params.menuId = '3';

    this.reportService.GetAgricultureReport(this.params).subscribe({
      next: (response: any = {}) => {
        reports = response.data;
        grandTotal = response.grandTotal;
        district1 = response.districtOne;
        district2 = response.districtTwo;
        columnTypes = response.columnTypes;

        console.log('result: ', response);

        data.push({
          margin: [0, 40, 0, 0],
          columns: [
            {
              text: `List of Fisheries/ Aquaculture Production by Municipality/City`,
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

        tableData.push(
          [
            {
              text: '#',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              rowSpan: 2,
            },
            {
              text: 'Municipality/ City',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              rowSpan: 2,
            },
            {
              text: 'Bangus',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              colSpan: 2,
            },
            {},
            {
              text: 'Tilapia',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              colSpan: 2,
            },
            {},
            {
              text: 'Shrimp',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              colSpan: 2,
            },
            {},
            {
              text: 'Crabs',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              colSpan: 2,
            },
            {},
            {
              text: 'Cream Dory',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              colSpan: 2,
            },
            {},
            {
              text: 'Hito',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              colSpan: 2,
            },
            {},
            {
              text: 'Others',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              colSpan: 2,
            },
            {},
          ],
          [
            {},
            {},
            {
              text: 'Total Production',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              fontSize: 8,
            },
            {
              text: 'Area Harvested',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              fontSize: 8,
            },
            {
              text: 'Total Production',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              fontSize: 8,
            },
            {
              text: 'Area Harvested',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              fontSize: 8,
            },
            {
              text: 'Total Production',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              fontSize: 8,
            },
            {
              text: 'Area Harvested',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              fontSize: 8,
            },
            {
              text: 'Total Production',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              fontSize: 8,
            },
            {
              text: 'Area Harvested',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              fontSize: 8,
            },
            {
              text: 'Total Production',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              fontSize: 8,
            },
            {
              text: 'Area Harvested',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              fontSize: 8,
            },
            {
              text: 'Total Production',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              fontSize: 8,
            },
            {
              text: 'Area Harvested',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              fontSize: 8,
            },
            {
              text: 'Total Production',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              fontSize: 8,
            },
            {
              text: 'Area Harvested',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              fontSize: 8,
            },
          ]
        );

        reports.forEach((a: any) => {
          if (a.district == 1) {
            tableData.push([
              {
                text: `1st Congressional District `,
                colSpan: 16,
                alignment: 'left',
                fillColor: '#526D82',
              },
            ]);

            let sub: any = [];
            sub = [
              {
                text: 'SUBTOTAL',
                fillColor: '#9DB2BF',
                colSpan: 2,
                marginLeft: 2,
              },
              {},
            ];
            district1.forEach((b: any, i: any) => {
              let d1: any = [];
              d1 = [{ text: i + 1, marginLeft: 2 }, { text: b.munCityName }];

              columnTypes.forEach((c: any) => {
                let prod: any = '-';
                let area: any = '-';
                let subprod: any = '-';
                let subarea: any = '-';

                a.data.forEach((d: any) => {
                  if (c.recNo == d.type) {
                    d.typeData.forEach((e: any) => {
                      if (b.munCityId == e.munCityId) {
                        prod = e.totalProd;
                        area = e.area;
                      }
                    });
                    subprod = d.subtotalProd;
                    subarea = d.subtotalArea;
                  }
                });
                d1.push(
                  { text: prod, alignment: 'center' },
                  { text: area, alignment: 'center' }
                );
                if (i == 0) {
                  sub.push(
                    {
                      text: subprod,
                      fillColor: '#9DB2BF',
                      alignment: 'center',
                    },
                    { text: subarea, fillColor: '#9DB2BF', alignment: 'center' }
                  );
                }
              });
              tableData.push(d1);
            });
            tableData.push(sub);
          }
          if (a.district == 2) {
            tableData.push([
              {
                text: `2nd Congressional District `,
                colSpan: 16,
                alignment: 'left',
                fillColor: '#526D82',
              },
            ]);

            let sub: any = [];
            sub = [
              {
                text: 'SUBTOTAL',
                fillColor: '#9DB2BF',
                colSpan: 2,
                marginLeft: 2,
              },
              {},
            ];
            district2.forEach((b: any, i: any) => {
              let d1: any = [];
              d1 = [{ text: i + 1, marginLeft: 2 }, { text: b.munCityName }];

              columnTypes.forEach((c: any) => {
                let prod: any = '-';
                let area: any = '-';
                let subprod: any = '-';
                let subarea: any = '-';

                a.data.forEach((d: any) => {
                  if (c.recNo == d.type) {
                    d.typeData.forEach((e: any) => {
                      if (b.munCityId == e.munCityId) {
                        prod = e.totalProd;
                        area = e.area;
                      }
                    });
                    subprod = d.subtotalProd;
                    subarea = d.subtotalArea;
                  }
                });
                d1.push(
                  { text: prod, alignment: 'center' },
                  { text: area, alignment: 'center' }
                );
                if (i == 0) {
                  sub.push(
                    {
                      text: subprod,
                      fillColor: '#9DB2BF',
                      alignment: 'center',
                    },
                    { text: subarea, fillColor: '#9DB2BF', alignment: 'center' }
                  );
                }
              });
              tableData.push(d1);
            });
            tableData.push(sub);
          }
        });

        let grand: any = [];
        grand = [
          {
            text: 'GRANDTOTAL',
            fillColor: '#F1C93B',
            colSpan: 2,
            marginLeft: 2,
          },
          {},
        ];
        columnTypes.forEach((a: any) => {
          let prod: any = '-';
          let area: any = '-';
          grandTotal.forEach((b: any) => {
            if (a.recNo == b.type) {
              prod = b.totalProd;
              area = b.area;
            }
          });

          grand.push(
            {
              text: prod,
              fillColor: '#F1C93B',
              alignment: 'center',
            },
            {
              text: area,
              fillColor: '#F1C93B',
              alignment: 'center',
            }
          );
        });

        tableData.push(grand);

        const table = {
          margin: [0, 10, 0, 0],
          table: {
            widths: [
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
            ],
            body: tableData,
            headerRows: 2, // assuming you have two header rows
            layout: {
              fillColor: function (rowIndex: number, node: any) {
                return rowIndex === 0 ? '#CCCCCC' : null; // header row color
              },
              hLineWidth: function (
                i: number,
                node: { table: { body: string | any[] } }
              ) {
                return i === 0 || i === node.table.body.length ? 2 : 1; // top & bottom border of the table
              },
              vLineWidth: function (
                i: number,
                node: { table: { widths: string | any[] } }
              ) {
                return i === 0 || i === node.table.widths.length ? 2 : 1; // left & right border of the table
              },
              hLineColor: function (_i: any, node: any) {
                return '#999999'; // horizontal line color
              },
              vLineColor: function (_i: any, node: any) {
                return '#999999'; // vertical line color
              },
            },
          },
        };

        data.push(table);
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  AgriProfGeneratePDF() {
    let data: any = [];
    let summary: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];
    let contentData: any = [];

    const columnNames: any = [
      'Commodities',
      'No. of Hectare',
      'No. of Farmers',
    ];
    let columns: any = [];
    let columnsWidth: any = [];
    this.reportService.GetAgriProfReport(this.params).subscribe({
      next: (response: any = {}) => {
        reports = response.data;
        summary = response.summary;
        console.log('result: ', response);

        reports.forEach((a: any) => {
          if (a.district === 1) {
            dist1.push(a);
          } else {
            dist2.push(a);
          }
        });
        console.log('dist1: ', dist1);
        console.log('dist2: ', dist2);

        data.push({
          margin: [0, 40, 0, 0],
          columns: [
            {
              text: `Agricultural Profile of Davao del Norte`,
              fontSize: 14,
              bold: true,
            },
            {
              text: `Year: ${reports[0].setYear}`,
              fontSize: 14,
              bold: true,
              alignment: 'right',
            },
          ],
        });

        data.push({
          margin: [0, 10, 0, 0],
          columns: [
            {
              text: `Provincial Summary`,
              fontSize: 12,
              bold: true,
            },
          ],
        });

        columnNames.forEach((name: any) => {
          columnsWidth.push('*');
          columns.push({
            text: name,
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          });
        });
        tableData.push(columns);
        tableData.push(
          [
            {
              text: 'Paddy Rice - Irrigated',
              fillColor: '#FFFFFF',
            },
            {
              text: summary.riceIrrigArea,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
            {
              text: summary.riceIrrigFarmersNo,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Paddy Rice - Rain Fed',
              fillColor: '#9DB2BF',
            },
            {
              text: summary.riceRainArea,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
            {
              text: summary.riceRainFarmersNo,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Corn - White',
              fillColor: '#FFFFFF',
            },
            {
              text: summary.cornWhiteArea,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
            {
              text: summary.cornWhiteFarmersNo,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Corn - Yellow',
              fillColor: '#9DB2BF',
            },
            {
              text: summary.cornYellowArea,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
            {
              text: summary.cornYellowFarmersNo,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Banana - Cavendish',
              fillColor: '#FFFFFF',
            },
            {
              text: summary.bananaCavArea,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
            {
              text: summary.bananaCavFarmersNo,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Banana -Saba Banana',
              fillColor: '#9DB2BF',
            },
            {
              text: summary.bananaSabaArea,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
            {
              text: summary.bananaSabaFarmersNo,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Banana -Other Banana',
              fillColor: '#FFFFFF',
            },
            {
              text: summary.bananaOtherArea,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
            {
              text: summary.bananaFarmersNo,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Mango',
              fillColor: '#9DB2BF',
            },
            {
              text: summary.mangoArea,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
            {
              text: summary.mangoFarmersNo,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Durian',
              fillColor: '#FFFFFF',
            },
            {
              text: summary.durianArea,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
            {
              text: summary.durianFarmersNo,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Coffee',
              fillColor: '#9DB2BF',
            },
            {
              text: summary.coffeeArea,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
            {
              text: summary.coffeeFarmersNo,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Cacao',
              fillColor: '#FFFFFF',
            },
            {
              text: summary.cacaoArea,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
            {
              text: summary.cacaoFarmersNo,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Abaca',
              fillColor: '#9DB2BF',
            },
            {
              text: summary.abacaArea,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
            {
              text: summary.abacaFarmersNo,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Rubber',
              fillColor: '#FFFFFF',
            },
            {
              text: summary.rubberArea,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
            {
              text: summary.rubberFarmerNo,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Oil Palm',
              fillColor: '#9DB2BF',
            },
            {
              text: summary.oilpalmArea,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
            {
              text: summary.oilpalmArea,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Coconut',
              fillColor: '#FFFFFF',
            },
            {
              text: summary.coconutArea,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
            {
              text: summary.coconutNo,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Vegetables and Spices',
              fillColor: '#9DB2BF',
            },
            {
              text: summary.veggieArea,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
            {
              text: summary.veggieArea,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Other Crops',
              fillColor: '#FFFFFF',
            },
            {
              text: summary.otherCropsArea,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
            {
              text: summary.otherCropsNo,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
          ]
        );

        // tableData.push([{
        //   margin: [0, 10, 0, 0],
        //   columns: [
        //     {
        //       text: `1st Congressional District`,
        //       fontSize: 12,
        //       bold: true,
        //     },
        //   ],
        // }]);
        contentData.push([
          {
            margin: [0, 10, 0, 0],
            table: {
              widths: columnsWidth,
              body: tableData,
            },
            layout: 'lightHorizontalLines',
            pageBreak: 'after',
          },
        ]);

        dist1.forEach((a: any) => {
          let newColumn: any = [];
          const newtableData: any = [];

          columnNames.forEach((name: any) => {
            newColumn.push({
              text: name,
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            });
          });

          contentData.push({
            margin: [0, 20, 0, 0],
            columns: [
              {
                text: a.munCityName,
                fontSize: 12,
                bold: true,
              },
            ],
          });
          newtableData.push(newColumn);
          newtableData.push(
            [
              {
                text: 'Paddy Rice - Irrigated',
                fillColor: '#FFFFFF',
              },
              {
                text: a.riceIrrigArea,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: a.riceIrrigFarmersNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Paddy Rice - Rain Fed',
                fillColor: '#9DB2BF',
              },
              {
                text: a.riceRainArea,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
              {
                text: a.riceRainFarmersNo,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Corn - White',
                fillColor: '#FFFFFF',
              },
              {
                text: a.cornWhiteArea,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: a.cornWhiteFarmersNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Corn - Yellow',
                fillColor: '#9DB2BF',
              },
              {
                text: a.cornYellowArea,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
              {
                text: a.cornYellowFarmersNo,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Banana - Cavendish',
                fillColor: '#FFFFFF',
              },
              {
                text: a.bananaCavArea,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: a.bananaCavFarmersNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Banana -Saba Banana',
                fillColor: '#9DB2BF',
              },
              {
                text: a.bananaSabaArea,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
              {
                text: a.bananaSabaFarmersNo,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Banana -Other Banana',
                fillColor: '#FFFFFF',
              },
              {
                text: a.bananaOtherArea,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: a.bananaFarmersNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Mango',
                fillColor: '#9DB2BF',
              },
              {
                text: a.mangoArea,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
              {
                text: a.mangoFarmersNo,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Durian',
                fillColor: '#FFFFFF',
              },
              {
                text: a.durianArea,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: a.durianFarmersNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Coffee',
                fillColor: '#9DB2BF',
              },
              {
                text: a.coffeeArea,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
              {
                text: a.coffeeFarmersNo,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Cacao',
                fillColor: '#FFFFFF',
              },
              {
                text: a.cacaoArea,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: a.cacaoFarmersNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Abaca',
                fillColor: '#9DB2BF',
              },
              {
                text: a.abacaArea,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
              {
                text: a.abacaFarmersNo,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Rubber',
                fillColor: '#FFFFFF',
              },
              {
                text: a.rubberArea,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: a.rubberFarmerNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Oil Palm',
                fillColor: '#9DB2BF',
              },
              {
                text: a.oilpalmArea,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
              {
                text: a.oilpalmArea,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Coconut',
                fillColor: '#FFFFFF',
              },
              {
                text: a.coconutArea,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: a.coconutNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Vegetables and Spices',
                fillColor: '#9DB2BF',
              },
              {
                text: a.veggieArea,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
              {
                text: a.veggieArea,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Other Crops',
                fillColor: '#FFFFFF',
              },
              {
                text: a.otherCropsArea,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: a.otherCropsNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ]
          );

          contentData.push([
            {
              margin: [0, 10, 0, 0],
              table: {
                widths: columnsWidth,
                body: newtableData,
              },
              layout: 'lightHorizontalLines',
            },
          ]);
        });

        dist2.forEach((a: any) => {
          let newColumn: any = [];
          const newtableData: any = [];

          columnNames.forEach((name: any) => {
            newColumn.push({
              text: name,
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            });
          });

          contentData.push({
            margin: [0, 20, 0, 0],
            columns: [
              {
                text: a.munCityName,
                fontSize: 12,
                bold: true,
              },
            ],
          });
          newtableData.push(newColumn);
          newtableData.push(
            [
              {
                text: 'Paddy Rice - Irrigated',
                fillColor: '#FFFFFF',
              },
              {
                text: a.riceIrrigArea,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: a.riceIrrigFarmersNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Paddy Rice - Rain Fed',
                fillColor: '#9DB2BF',
              },
              {
                text: a.riceRainArea,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
              {
                text: a.riceRainFarmersNo,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Corn - White',
                fillColor: '#FFFFFF',
              },
              {
                text: a.cornWhiteArea,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: a.cornWhiteFarmersNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Corn - Yellow',
                fillColor: '#9DB2BF',
              },
              {
                text: a.cornYellowArea,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
              {
                text: a.cornYellowFarmersNo,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Banana - Cavendish',
                fillColor: '#FFFFFF',
              },
              {
                text: a.bananaCavArea,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: a.bananaCavFarmersNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Banana -Saba Banana',
                fillColor: '#9DB2BF',
              },
              {
                text: a.bananaSabaArea,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
              {
                text: a.bananaSabaFarmersNo,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Banana -Other Banana',
                fillColor: '#FFFFFF',
              },
              {
                text: a.bananaOtherArea,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: a.bananaFarmersNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Mango',
                fillColor: '#9DB2BF',
              },
              {
                text: a.mangoArea,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
              {
                text: a.mangoFarmersNo,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Durian',
                fillColor: '#FFFFFF',
              },
              {
                text: a.durianArea,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: a.durianFarmersNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Coffee',
                fillColor: '#9DB2BF',
              },
              {
                text: a.coffeeArea,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
              {
                text: a.coffeeFarmersNo,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Cacao',
                fillColor: '#FFFFFF',
              },
              {
                text: a.cacaoArea,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: a.cacaoFarmersNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Abaca',
                fillColor: '#9DB2BF',
              },
              {
                text: a.abacaArea,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
              {
                text: a.abacaFarmersNo,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Rubber',
                fillColor: '#FFFFFF',
              },
              {
                text: a.rubberArea,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: a.rubberFarmerNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Oil Palm',
                fillColor: '#9DB2BF',
              },
              {
                text: a.oilpalmArea,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
              {
                text: a.oilpalmArea,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Coconut',
                fillColor: '#FFFFFF',
              },
              {
                text: a.coconutArea,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: a.coconutNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Vegetables and Spices',
                fillColor: '#9DB2BF',
              },
              {
                text: a.veggieArea,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
              {
                text: a.veggieArea,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Other Crops',
                fillColor: '#FFFFFF',
              },
              {
                text: a.otherCropsArea,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: a.otherCropsNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ]
          );

          contentData.push([
            {
              margin: [0, 10, 0, 0],
              table: {
                widths: columnsWidth,
                body: newtableData,
              },
              layout: 'lightHorizontalLines',
              pageBreak: 'after',
            },
          ]);
        });

        data.push(contentData);
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }

  //TOURISM
  FestivalGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];
    this.params.menuId = '6';

    this.reportService.GetTourismReport(this.params).subscribe({
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
              text: `List of Fiestas and Festivals by Municipality/City`,
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

        console.log('dist1Group ', dist1Group);

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        console.log('dist2Group ', dist2Group);

        tableData.push([
          {
            text: '#',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Name of Fiesta/ Festival',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Contact Person/ Designation',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Contact Details',
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
          {
            text: 'Brief Description',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 6,
            alignment: 'left',
            fillColor: '#526D82',
          },
          {},
          {},
          {},
          {},
          {},
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 6,
              alignment: 'left',
              fillColor: '#9DB2BF',
            },
            {},
            {},
            {},
            {},
            {},
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactPerson,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
              {
                text: item.description,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 6,
            alignment: 'left',
            fillColor: '#526D82',
          },
          {},
          {},
          {},
          {},
          {},
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 6,
              alignment: 'left',
              fillColor: '#9DB2BF',
            },
            {},
            {},
            {},
            {},
            {},
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactPerson,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
              {
                text: item.description,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 10, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*', '*'],
            body: tableData,
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#000',
            vLineColor: () => '#000',
          },
        };

        data.push(table);
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }

  CulturalGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];
    this.params.menuId = '6';

    this.reportService.GetTourismReport(this.params).subscribe({
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
              text: `List of Historical/ Cultural and Religious Attractions by Municipality/City`,
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

        console.log('dist1Group ', dist1Group);

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        console.log('dist2Group ', dist2);

        tableData.push([
          {
            text: '#',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Name of Historical/ Cultural/ Religious',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Contact Person/ Designation',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Contact Details',
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
          {
            text: 'Brief Description',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 6,
            alignment: 'left',
            fillColor: '#526D82',
          },
          {},
          {},
          {},
          {},
          {},
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 6,
              alignment: 'left',
              fillColor: '#9DB2BF',
            },
            {},
            {},
            {},
            {},
            {},
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactPerson,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
              {
                text: item.description,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 6,
            alignment: 'left',
            fillColor: '#526D82',
          },
          {},
          {},
          {},
          {},
          {},
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 6,
              alignment: 'left',
              fillColor: '#9DB2BF',
            },
            {},
            {},
            {},
            {},
            {},
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactPerson,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
              {
                text: item.description,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 10, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*', '*'],
            body: tableData,
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#000',
            vLineColor: () => '#000',
          },
        };

        data.push(table);
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }

  NaturalGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];
    this.params.menuId = '5';

    this.reportService.GetTourismReport(this.params).subscribe({
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
              text: `List of Natural and Man-made Attractions by Municipality/City`,
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

        console.log('dist1Group ', dist1Group);

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        console.log('dist2Group ', dist2);

        tableData.push([
          {
            text: '#',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Name of Attraction',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Contact Person/ Designation',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Contact Details',
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
          {
            text: 'Brief Description',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 6,
            alignment: 'left',
            fillColor: '#526D82',
          },
          {},
          {},
          {},
          {},
          {},
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 6,
              alignment: 'left',
              fillColor: '#9DB2BF',
            },
            {},
            {},
            {},
            {},
            {},
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactPerson,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
              {
                text: item.description,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 6,
            alignment: 'left',
            fillColor: '#526D82',
          },
          {},
          {},
          {},
          {},
          {},
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 6,
              alignment: 'left',
              fillColor: '#9DB2BF',
            },
            {},
            {},
            {},
            {},
            {},
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactPerson,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
              {
                text: item.description,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 40, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*', '*'],
            body: tableData,
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#000',
            vLineColor: () => '#000',
          },
        };

        data.push(table);
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }

  CinemaGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];
    this.params.menuId = '4';

    this.reportService.GetTourismReport(this.params).subscribe({
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
              text: `List of Cinema/ Movie Houses by Municipality/City`,
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

        console.log('dist1Group ', dist1Group);

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        console.log('dist2Group ', dist2);

        tableData.push([
          {
            text: '#',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Name of Hotel',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Contact Details',
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
          {
            text: 'Brief Description/ Rates',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 5,
            alignment: 'left',
            fillColor: '#526D82',
          },
          {},
          {},
          {},
          {},
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 5,
              alignment: 'left',
              fillColor: '#9DB2BF',
            },
            {},
            {},
            {},
            {},
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
              {
                text: item.description,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 5,
            alignment: 'left',
            fillColor: '#526D82',
          },
          {},
          {},
          {},
          {},
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 5,
              alignment: 'left',
              fillColor: '#9DB2BF',
            },
            {},
            {},
            {},
            {},
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
              {
                text: item.description,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 40, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*'],
            body: tableData,
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#000',
            vLineColor: () => '#000',
          },
        };

        data.push(table);
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }

  ResortGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];
    this.params.menuId = '1';

    this.reportService.GetTourismReport(this.params).subscribe({
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
          margin: [0, 20, 0, 0],
          columns: [
            {
              text: `List of Resorts/Recreation Center by Municipality/City`,
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
            margin: [5, 5, 5, 5],
          },
          {
            text: 'Name of Resort',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            margin: [5, 5, 5, 5],
          },
          {
            text: 'Contact Details',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            margin: [5, 5, 5, 5],
          },
          {
            text: 'Barangay',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            margin: [5, 5, 5, 5],
          },
          {
            text: 'Amenities/Remarks',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            margin: [5, 5, 5, 5],
          },
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 5,
            alignment: 'left',
            fillColor: '#526D82',
            margin: [5, 5, 5, 5],
          },
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 5,
              alignment: 'left',
              fillColor: '#9DB2BF',
              margin: [5, 5, 5, 5],
            },
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                margin: [5, 5, 5, 5],
              },
              {
                text: item.name,
                margin: [5, 5, 5, 5],
              },
              {
                text: item.contactNo,
                margin: [5, 5, 5, 5],
              },
              {
                text: item.brgyName,
                margin: [5, 5, 5, 5],
              },
              {
                text: item.description,
                margin: [5, 5, 5, 5],
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 5,
            alignment: 'left',
            fillColor: '#526D82',
            margin: [5, 5, 5, 5],
          },
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 5,
              alignment: 'left',
              fillColor: '#9DB2BF',
              margin: [5, 5, 5, 5],
            },
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                margin: [5, 5, 5, 5],
              },
              {
                text: item.name,
                margin: [5, 5, 5, 5],
              },
              {
                text: item.contactNo,
                margin: [5, 5, 5, 5],
              },
              {
                text: item.brgyName,
                margin: [5, 5, 5, 5],
              },
              {
                text: item.description,
                margin: [5, 5, 5, 5],
              },
            ]);
          });
        }

        const table = {
          margin: [0, 20, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*'],
            body: tableData,
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#000',
            vLineColor: () => '#000',
          },
        };

        data.push(table);
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }

  LodgingGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];
    this.params.menuId = '3';
    this.reportService.GetTourismReport(this.params).subscribe({
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
              text: `List of Hotels/ Lodging Houses by Municipality/City`,
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

        console.log('dist1Group ', dist1Group);

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        console.log('dist2Group ', dist2Group);

        tableData.push([
          {
            text: '#',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Name of Hotel',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Contact Details',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'No. of Rooms ',
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
          {
            text: 'Brief Description/ Rates',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 6,
            alignment: 'left',
            fillColor: '#526D82',
          },
          {},
          {},
          {},
          {},
          {},
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 6,
              alignment: 'left',
              fillColor: '#9DB2BF',
            },
            {},
            {},
            {},
            {},
            {},
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.roomsNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
              {
                text: item.description,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 6,
            alignment: 'left',
            fillColor: '#526D82',
          },
          {},
          {},
          {},
          {},
          {},
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 6,
              alignment: 'left',
              fillColor: '#9DB2BF',
            },
            {},
            {},
            {},
            {},
            {},
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.roomsNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
              {
                text: item.description,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 10, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*', '*'],
            body: tableData,
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#000',
            vLineColor: () => '#000',
          },
        };

        data.push(table);
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        let isPortrait = false;
        this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
        console.log(data);
      },
    });
  }
  RecreationalGeneratePDF() {
    let reports: any = [];
    let data: any = [];
    let dist1: any = [];
    let dist2: any = [];
    let columnTypes: any = [];
    let contentData: any = [];

    this.params.menuId = '2';

    this.reportService.GetTourismReport(this.params).subscribe({
      next: (response: any = {}) => {
        reports = response.data;
        dist1 = response.districtOne;
        dist2 = response.districtTwo;
        columnTypes = response.columnTypes;
        console.log(response);

        data.push({
          text: `Number of Recreational Facilities by Municipality/City for the year ${response.year}`, // Add the title text
          fontSize: 14,
          bold: true,
          alignment: 'center',
          margin: [0, 20], // Adjust the margin around the title as needed
        });
        let columns: any = [];
        let columnWidth: any = [];
        const tableData: any = [];
        let grandTotal: any = [];

        let subtotal1: any = [];
        subtotal1.push({
          text: 'SUB TOTAL',
          alignment: 'center',
          border: [true, true, true, true],
        });

        let subtotal2: any = [];
        subtotal2.push({
          text: 'SUB TOTAL',
          alignment: 'center',
          border: [true, true, true, true],
        });

        columnTypes.forEach((b: any, index: any) => {
          // GET COLUMN
          if (index == 0) {
            columnWidth.push('auto');
            columns.push({
              text: 'Municipality/ City',
              bold: true,
              alignment: 'center',
              border: [true, true, true, true],
            });
          }
          columnWidth.push('auto');
          columns.push({
            text: b.typeName,
            bold: true,
            alignment: 'center',
            border: [true, true, true, true],
          });
        });

        tableData.push(columns); // PUSH COLUMN
        reports.forEach((a: any, index: any) => {
          if (a.district == 1) {
            // GET DISTRICT I DATA
            tableData.push([
              {
                text: `1st Congressional District `,
                colSpan: columnWidth.length,
                alignment: 'left',
                bold: true,
                border: [true, true, true, true],
              },
            ]);

            for (let d1 of dist1) {
              let data1 = [];
              data1.push({
                text: d1.munCityName,
                alignment: 'left',
                border: [true, true, true, true],
              });

              for (let header of columnTypes) {
                let count = '-';
                for (let t of a.type) {
                  if (header.recNo == t.type) {
                    //true
                    for (let f of t.data) {
                      if (
                        d1.munCityId == f.munCityId &&
                        header.recNo == f.type
                      ) {
                        count = f.countType;
                        break;
                      }
                    }
                  }
                }
                data1.push({
                  text: count,
                  alignment: 'center',
                  border: [true, true, true, true],
                });
              }
              tableData.push(data1); // PUSH DISTRICT 1 DATA
            }

            for (let header of columnTypes) {
              // GET DISTRICT 1 SUBTOTAL
              let countSubtotal1 = '-';
              for (let t of a.type) {
                if (header.recNo == t.type) {
                  countSubtotal1 = t.subtotalType;
                  break;
                }
              }
              subtotal1.push({
                text: countSubtotal1,
                alignment: 'center',
                border: [true, true, true, true],
              });
            }
            tableData.push(subtotal1); // PUSH DISTRICT 1 SUBTOTAL
          }

          if (a.district == 2) {
            // GET DISTRICT II DATA
            tableData.push([
              {
                text: `2nd Congressional District `,
                colSpan: columnWidth.length,
                alignment: 'left',
                bold: true,
                border: [true, true, true, true],
              },
            ]);

            for (let d2 of dist2) {
              let data2 = [];
              data2.push({
                text: d2.munCityName,
                alignment: 'left',
                border: [true, true, true, true],
              });

              for (let header of columnTypes) {
                let count = '-';
                for (let t of a.type) {
                  if (header.recNo == t.type) {
                    //true
                    for (let f of t.data) {
                      if (
                        d2.munCityId == f.munCityId &&
                        header.recNo == f.type
                      ) {
                        count = f.countType;
                        break;
                      }
                    }
                  }
                }
                data2.push({
                  text: count,
                  alignment: 'center',
                  border: [true, true, true, true],
                });
              }
              tableData.push(data2); // PUSH DISTRICT II DATA
            }

            for (let header of columnTypes) {
              // GET DISTRICT II SUBTOTAL
              let countSubtotal2 = '-';
              for (let t of a.type) {
                if (header.recNo == t.type) {
                  countSubtotal2 = t.subtotalType;
                  break;
                }
              }
              subtotal2.push({
                text: countSubtotal2,
                alignment: 'center',
                border: [true, true, true, true],
              });
            }
            tableData.push(subtotal2); // PUSH DISTRICT II SUBTOTAL
          }
        });

        columnWidth.forEach((b: any, index: any) => {
          // GET GRANDTOTAL
          let grandTotalcount;
          if (index == 0) {
            grandTotalcount = 'GRAND TOTAL';
          } else {
            if (subtotal1.length > 1 && subtotal2.length == 1 && index > 0) {
              grandTotalcount = subtotal1[index].text;
            }
            if (subtotal2.length > 1 && subtotal1.length == 1 && index > 0) {
              grandTotalcount = subtotal2[index].text;
            }
            if (subtotal1.length > 1 && subtotal2.length > 1 && index > 0) {
              let sub1 =
                subtotal1[index].text == '-'
                  ? 0
                  : parseInt(subtotal1[index].text || '0');
              let sub2 =
                subtotal2[index].text == '-'
                  ? 0
                  : parseInt(subtotal2[index].text || '0');

              if (
                subtotal2[index].text == '-' &&
                subtotal1[index].text == '-'
              ) {
                grandTotalcount = '-';
              } else {
                grandTotalcount = sub1 + sub2;
              }
            }
          }
          grandTotal.push({
            // PUSH GRANDTOTAL
            text: grandTotalcount,
            alignment: 'center',
            border: [true, true, true, true],
          });
        });

        tableData.push(grandTotal);

        contentData.push({
          margin: [0, 10, 0, 0],
          table: {
            widths: columnWidth,
            body: tableData,
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#000',
            vLineColor: () => '#000',
          },
        });
        data.push(contentData);
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }

  //TRADE AND INDUSTRY
  FinancialGeneratePdf() {
    this.params.category = 4;
    let data: any = [];
    const columnsData: any = [];
    const columnsWidth: any = [];
    let countWidth: number = 0;
    let reports: any = [];
    let pdf_title: string = '';
    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    pdf_title = 'Financial Institutions';
    countWidth = 4;
    columnsData.push(
      {
        text: '#',
        bold: true,
        alignment: 'center',
      },
      {
        text: 'Name of Institution',
        bold: true,
        alignment: 'center',
      },
      {
        text: 'Category',
        bold: true,
        alignment: 'center',
      },
      {
        text: 'Barangay',
        bold: true,
        alignment: 'center',
      }
    );

    for (let index = 0; index < countWidth; index++) {
      if (index === 0) {
        columnsWidth.push(25);
      }
      if (index > 0) {
        columnsWidth.push('*');
      }
    }

    this.reportService.GetFinancialInsReport(this.params).subscribe({
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
              text: `List of ${pdf_title} by Municipality/City`,
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

        tableData.push(columnsData);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: countWidth,
            alignment: 'left',
          },
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: countWidth,
              alignment: 'left',
            },
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
              },
              {
                text: item.name,
              },
              {
                text: item.catName,
              },
              {
                text: item.brgyName,
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: countWidth,
            alignment: 'left',
          },
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: countWidth,
              alignment: 'left',
            },
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
              },
              {
                text: item.name,
              },
              {
                text: item.catName,
              },
              {
                text: item.brgyName,
              },
            ]);
          });
        }

        const table = {
          margin: [0, 10, 0, 0],
          table: {
            widths: columnsWidth,
            body: tableData,
          },
          layout: {
            hLineWidth: (i: number, node: any) => {
              return i === 0 || i === node.table.body.length ? 1 : 1; // thicker lines for first and last row
            },
            vLineWidth: () => 1,
            hLineColor: () => '#000000',
            vLineColor: () => '#000000',
          },
        };

        data.push(table);
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }

  InsuranceGeneratePdf() {
    this.params.category = 3;
    let data: any = [];
    const columnsData: any = [];
    const columnsWidth: any = [];
    let countWidth: number = 0;

    let reports: any = [];
    let pdf_title: string = '';

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    pdf_title = 'Insurance Company';
    countWidth = 4;
    columnsData.push(
      {
        text: '#',
        fillColor: 'black',
        color: 'white',
        bold: true,
        alignment: 'center',
      },
      {
        text: 'Name of Bank',
        fillColor: 'black',
        color: 'white',
        bold: true,
        alignment: 'center',
      },
      {
        text: 'Category',
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
      }
    );

    for (let index = 0; index < countWidth; index++) {
      if (index === 0) {
        columnsWidth.push(25);
      }
      if (index > 0) {
        columnsWidth.push('*');
      }
    }

    this.reportService.GetFinancialInsReport(this.params).subscribe({
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
              text: `List of ${pdf_title} by Municipality/City`,
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

        tableData.push(columnsData);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: countWidth,
            alignment: 'left',
            fillColor: '#526D82',
          },
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: countWidth,
              alignment: 'left',
              fillColor: '#9DB2BF',
            },
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.catName,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: countWidth,
            alignment: 'left',
            fillColor: '#526D82',
          },
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: countWidth,
              alignment: 'left',
              fillColor: '#9DB2BF',
            },
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.catName,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 10, 0, 0],
          table: {
            widths: columnsWidth,
            body: tableData,
          },
          layout: {
            hLineWidth: (i: number, node: any) => {
              return i === 0 || i === node.table.body.length ? 2 : 1; // thicker lines for first and last row
            },
            vLineWidth: () => 1,
            hLineColor: () => '#bfbfbf',
            vLineColor: () => '#bfbfbf',
          },
        };

        data.push(table);
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  CoopGeneratePdf() {
    this.params.category = 2;
    let data: any = [];
    const columnsData: any = [];
    const columnsWidth: any = [];
    let countWidth: number = 0;
    let reports: any = [];
    let pdf_title: string = '';
    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    pdf_title = 'Cooperatives';
    countWidth = 7;
    columnsData.push(
      { text: '#', bold: true, alignment: 'center' },
      { text: 'Name of Cooperative', bold: true, alignment: 'center' },
      { text: 'Contact Person/ Designation', bold: true, alignment: 'center' },
      { text: 'Contact Details', bold: true, alignment: 'center' },
      { text: 'Barangay', bold: true, alignment: 'center' },
      { text: 'No. of Members', bold: true, alignment: 'center' },
      { text: 'Total Assets', bold: true, alignment: 'center' }
    );

    for (let index = 0; index < countWidth; index++) {
      if (index === 0) {
        columnsWidth.push(25);
      } else {
        columnsWidth.push('auto'); // Let the library auto-calculate width based on content
      }
    }

    this.reportService.GetFinancialInsReport(this.params).subscribe({
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
              text: `List of ${pdf_title} by Municipality/City`,
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

        tableData.push(columnsData);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: countWidth,
            alignment: 'left',
          },
          ...Array(countWidth - 1).fill({}),
        ]);

        for (const groupKey1 in dist1Group) {
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            { text: cityName1, colSpan: countWidth, alignment: 'left' },
            ...Array(countWidth - 1).fill({}),
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              { text: index + 1 },
              { text: item.name },
              { text: item.contactPerson },
              { text: item.contactNo },
              { text: item.brgyName },
              { text: item.members },
              { text: item.totAssets },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: countWidth,
            alignment: 'left',
          },
          ...Array(countWidth - 1).fill({}),
        ]);

        for (const groupKey2 in dist2Group) {
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            { text: cityName2, colSpan: countWidth, alignment: 'left' },
            ...Array(countWidth - 1).fill({}),
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              { text: index + 1 },
              { text: item.name },
              { text: item.contactPerson },
              { text: item.contactNo },
              { text: item.brgyName },
              { text: item.members },
              { text: item.totAssets },
            ]);
          });
        }

        const table = {
          margin: [0, 10, 0, 0],
          table: {
            widths: columnsWidth,
            body: tableData,
          },
          layout: {
            hLineWidth: (i: number, node: any) => {
              return i === 0 || i === node.table.body.length ? 1 : 1; // thicker lines for first and last row
            },
            vLineWidth: () => 1,
            hLineColor: () => '#000000',
            vLineColor: () => '#000000',
          },
        };

        data.push(table);
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }

  BankingGeneratePdf() {
    this.params.category = 1;
    let data: any = [];
    const columnsData: any = [];
    const columnsWidth: any = [];
    let countWidth: number = 0;

    let reports: any = [];
    let pdf_title: string = '';

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];
    pdf_title = 'Banking Institutions';
    countWidth = 4;
    columnsData.push(
      {
        text: '#',
        fillColor: 'black',
        color: 'white',
        bold: true,
        alignment: 'center',
      },
      {
        text: 'Name of Bank',
        fillColor: 'black',
        color: 'white',
        bold: true,
        alignment: 'center',
      },
      {
        text: 'Category',
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
      }
    );

    for (let index = 0; index < countWidth; index++) {
      if (index === 0) {
        columnsWidth.push(25);
      }
      if (index > 0) {
        columnsWidth.push('*');
      }
    }

    this.reportService.GetFinancialInsReport(this.params).subscribe({
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
              text: `List of ${pdf_title} by Municipality/City`,
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

        console.log('dist1Group ', dist1Group);

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        tableData.push(columnsData);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: countWidth,
            alignment: 'left',
            fillColor: '#526D82',
          },
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: countWidth,
              alignment: 'left',
              fillColor: '#9DB2BF',
            },
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.catName,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: countWidth,
            alignment: 'left',
            fillColor: '#526D82',
          },
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: countWidth,
              alignment: 'left',
              fillColor: '#9DB2BF',
            },
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
              },
              {
                text: item.catName,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 10, 0, 0],
          table: {
            widths: columnsWidth,
            body: tableData,
          },
          layout: {
            hLineWidth: (i: number, node: any) => {
              return i === 0 || i === node.table.body.length ? 2 : 1; // thicker lines for first and last row
            },
            vLineWidth: () => 1,
            hLineColor: () => '#bfbfbf',
            vLineColor: () => '#bfbfbf',
          },
        };

        data.push(table);
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  IndustrialGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.reportService.GetIndustrialReport(this.params).subscribe({
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
              text: `List of Industrial Estates by Municipality/City`,
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

        console.log('dist1Group ', dist1Group);

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        console.log('dist2Group ', dist2);

        tableData.push([
          {
            text: '#',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Name of Industrial Estate',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Area (Has)',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'No. of Locators',
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
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 5,
            alignment: 'left',
            fillColor: '#526D82',
          },
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 5,
              alignment: 'left',
              fillColor: '#9DB2BF',
            },
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.area,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.locatorsNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 5,
            alignment: 'left',
            fillColor: '#526D82',
          },
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 5,
              alignment: 'left',
              fillColor: '#9DB2BF',
            },
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.area,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.locatorsNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 10, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*'],
            body: tableData,
          },
          layout: {
            hLineWidth: (i: number, node: any) => {
              return i === 0 || i === node.table.body.length ? 1 : 1; // thicker lines for first and last row
            },
            vLineWidth: () => 1,
            hLineColor: () => '#000000',
            vLineColor: () => '#000000',
          },
        };

        data.push(table);
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  ComEstabGeneratePDF() {
    let reports: any = [];
    let data: any = [];
    let dist1: any = [];
    let dist2: any = [];
    let contentData: any = [];

    this.reportService.GetComEstabReport(this.params).subscribe({
      next: (response: any = {}) => {
        console.log('API Response:', response); // Log the entire response for inspection

        reports = response.data;
        dist1 = response.districtOne;
        dist2 = response.districtTwo;

        data.push({
          text: `Number of Business/ Commercial Establishments by Municipality/City and related business Category for the year ${response.year}`,
          fontSize: 14,
          bold: true,
          alignment: 'center',
          margin: [0, 10],
        });

        reports.forEach((a: any) => {
          let columns: any = [];
          const tableData: any = [];
          let grandTotal: any = [];
          let subtotal1: any = [];
          let subtotal2: any = [];

          a.columnTypes.forEach((b: any, index: any) => {
            // Add column headers
            columns.push({
              text: b.lineBusinessName,
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              fontSize: 10,
              margin: [0, 5],
              border: [true, true, true, true], // Specify border for each cell
            });
          });

          tableData.push(columns); // Push column headers

          a.district.forEach((dataDistrict: any) => {
            if (dataDistrict.district == 1) {
              // District 1 data
              tableData.push([
                {
                  text: `1st Congressional District`,
                  colSpan: a.columnTypes.length,
                  fillColor: '#526D82',
                  bold: true,
                  fontSize: 12,
                  margin: [0, 5],
                  border: [true, true, true, true], // Specify border for each cell
                },
              ]);

              dist1.forEach((d1: any) => {
                let rowData: any = [];
                rowData.push({
                  text: d1.munCityName,
                  fontSize: 10,
                  margin: [0, 5],
                  border: [true, true, true, true], // Specify border for each cell
                });

                a.columnTypes.forEach((header: any) => {
                  let count = '-';
                  dataDistrict.lineBusiness.forEach((t: any) => {
                    if (header.recNo == t.lineBusiness) {
                      for (let f of t.data) {
                        if (
                          d1.munCityId == f.munCityId &&
                          header.recNo == f.lineBusiness
                        ) {
                          count = f.countType;
                          break;
                        }
                      }
                    }
                  });

                  rowData.push({
                    text: count.toString(),
                    fontSize: 10,
                    margin: [0, 5],
                    border: [true, true, true, true], // Specify border for each cell
                  });
                });

                tableData.push(rowData);
              });

              // District 1 subtotal
              a.columnTypes.forEach((header: any) => {
                let countSubtotal1 = '-';
                dataDistrict.lineBusiness.forEach((t: any) => {
                  if (header.recNo == t.lineBusiness) {
                    countSubtotal1 = t.subtotalType;
                    return;
                  }
                });

                subtotal1.push({
                  text: countSubtotal1.toString(),
                  fillColor: '#9DB2BF',
                  fontSize: 10,
                  margin: [0, 5],
                  border: [true, true, true, true], // Specify border for each cell
                });
              });

              tableData.push(subtotal1); // Push District 1 subtotal
            }

            if (dataDistrict.district == 2) {
              // District 2 data
              tableData.push([
                {
                  text: `2nd Congressional District`,
                  colSpan: a.columnTypes.length,
                  fillColor: '#526D82',
                  bold: true,
                  fontSize: 12,
                  margin: [0, 5],
                  border: [true, true, true, true], // Specify border for each cell
                },
              ]);

              dist2.forEach((d2: any) => {
                let rowData: any = [];
                rowData.push({
                  text: d2.munCityName,
                  fontSize: 10,
                  margin: [0, 5],
                  border: [true, true, true, true], // Specify border for each cell
                });

                a.columnTypes.forEach((header: any) => {
                  let count = '-';
                  dataDistrict.lineBusiness.forEach((t: any) => {
                    if (header.recNo == t.lineBusiness) {
                      for (let f of t.data) {
                        if (
                          d2.munCityId == f.munCityId &&
                          header.recNo == f.lineBusiness
                        ) {
                          count = f.countType;
                          break;
                        }
                      }
                    }
                  });

                  rowData.push({
                    text: count.toString(),
                    fontSize: 10,
                    margin: [0, 5],
                    border: [true, true, true, true], // Specify border for each cell
                  });
                });

                tableData.push(rowData);
              });

              // District 2 subtotal
              a.columnTypes.forEach((header: any) => {
                let countSubtotal2 = '-';
                dataDistrict.lineBusiness.forEach((t: any) => {
                  if (header.recNo == t.lineBusiness) {
                    countSubtotal2 = t.subtotalType;
                    return;
                  }
                });

                subtotal2.push({
                  text: countSubtotal2.toString(),
                  fillColor: '#9DB2BF',
                  fontSize: 10,
                  margin: [0, 5],
                  border: [true, true, true, true], // Specify border for each cell
                });
              });

              tableData.push(subtotal2); // Push District 2 subtotal
            }
          });

          // Grand total row
          let grandTotalRow: any = [];
          grandTotalRow.push({
            text: 'GRAND TOTAL',
            fillColor: '#F1C93B',
            fontSize: 12,
            bold: true,
            colSpan: a.columnTypes.length > 0 ? a.columnTypes.length : 1,
            margin: [0, 5],
            border: [true, true, true, true], // Specify border for each cell
          });

          tableData.push(grandTotalRow); // Push grand total row

          contentData.push({
            margin: [0, 10],
            table: {
              widths: a.columnTypes.map(() => 'auto'), // Set column widths
              body: tableData,
            },
          });
        });

        data.push(contentData); // Push contentData to data array for PDF generation

        // Generate PDF if reports are found
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log('PDF generation completed successfully.');
        } else {
          console.error('No reports to generate PDF.');
          this.Error(); // Handle error condition
        }
      },
      error: (error: any) => {
        console.error('Error fetching ComEstabReport:', error);
        // Handle error condition here, e.g., display error message to user
      },
      complete: () => {
        // Optional: Log completion of the observable sequence
        console.log('ComEstabReport API subscription completed.');
      },
    });
  }

  ManEstabGeneratePDF() {
    let reports: any = [];
    let data: any = [];
    let dist1: any = [];
    let dist2: any = [];
    let contentData: any = [];

    this.reportService.GetManEstabReport(this.params).subscribe({
      next: (response: any = {}) => {
        reports = response.data;
        dist1 = response.districtOne;
        dist2 = response.districtTwo;

        console.log(response);

        if (reports.length > 0) {
          // Add main title to the beginning of the document
          data.push({
            text: `Number of Manufacturing Industry by Municipality/City and related business Category for the year ${response.year}`,
            fontSize: 14,
            bold: true,
            alignment: 'center',
            margin: [0, 20],
          });

          // Process each report entry
          reports.forEach((a: any, index: any) => {
            let columns: any = [];
            let columnWidth: any = [];
            const tableData: any = [];
            let grandTotal: any = [];

            // Initialize subtotal rows for each district
            let subtotal1: any = [];
            subtotal1.push({
              text: 'SUB TOTAL',
              fillColor: '#9DB2BF',
            });

            let subtotal2: any = [];
            subtotal2.push({
              text: 'SUB TOTAL',
              fillColor: '#9DB2BF',
            });

            // Build column headers based on column types
            a.columnTypes.forEach((b: any, index: any) => {
              if (index == 0) {
                columnWidth.push('auto');
                columns.push({
                  text: 'Municipality/ City',
                  fillColor: 'black',
                  color: 'white',
                  bold: true,
                  alignment: 'center',
                });
              }
              columnWidth.push('auto');
              columns.push({
                text: b.typeName,
                fillColor: 'black',
                color: 'white',
                bold: true,
                alignment: 'center',
              });
            });

            // Add category title to the content data
            contentData.push({
              text: a.catName + ' category',
              margin: [0, 20, 0, 8],
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'left',
            });

            // Push column headers to table data
            tableData.push(columns);

            // Iterate through each district's data
            for (let dataDistrict of a.district) {
              // Process District 1 data
              if (dataDistrict.district == 1) {
                tableData.push([
                  {
                    text: `1st Congressional District`,
                    colSpan: columnWidth.length,
                    alignment: 'left',
                    fillColor: '#526D82',
                  },
                ]);

                for (let d1 of dist1) {
                  let data1 = [];
                  data1.push(d1.munCityName);

                  // Fill in counts for each header type
                  for (let header of a.columnTypes) {
                    let count = '-';
                    for (let t of dataDistrict.type) {
                      if (header.recNo == t.type) {
                        for (let f of t.data) {
                          if (
                            d1.munCityId == f.munCityId &&
                            header.recNo == f.type
                          ) {
                            count = f.countType;
                            break;
                          }
                        }
                      }
                    }
                    data1.push(count);
                  }
                  tableData.push(data1); // Push District 1 data row
                }

                // Calculate and push District 1 subtotal row
                for (let header of a.columnTypes) {
                  let countSubtotal1 = '-';
                  for (let t of dataDistrict.type) {
                    if (header.recNo == t.type) {
                      countSubtotal1 = t.subtotalType;
                      break;
                    }
                  }
                  subtotal1.push({
                    text: countSubtotal1,
                    fillColor: '#9DB2BF',
                  });
                }
                tableData.push(subtotal1); // Push District 1 subtotal row
              }

              // Process District 2 data
              if (dataDistrict.district == 2) {
                tableData.push([
                  {
                    text: `2nd Congressional District`,
                    colSpan: columnWidth.length,
                    alignment: 'left',
                    fillColor: '#526D82',
                  },
                ]);

                for (let d2 of dist2) {
                  let data2 = [];
                  data2.push(d2.munCityName);

                  // Fill in counts for each header type
                  for (let header of a.columnTypes) {
                    let count = '-';
                    for (let t of dataDistrict.type) {
                      if (header.recNo == t.type) {
                        for (let f of t.data) {
                          if (
                            d2.munCityId == f.munCityId &&
                            header.recNo == f.type
                          ) {
                            count = f.countType;
                            break;
                          }
                        }
                      }
                    }
                    data2.push(count);
                  }
                  tableData.push(data2); // Push District 2 data row
                }

                // Calculate and push District 2 subtotal row
                for (let header of a.columnTypes) {
                  let countSubtotal2 = '-';
                  for (let t of dataDistrict.type) {
                    if (header.recNo == t.type) {
                      countSubtotal2 = t.subtotalType;
                      break;
                    }
                  }
                  subtotal2.push({
                    text: countSubtotal2,
                    fillColor: '#9DB2BF',
                  });
                }
                tableData.push(subtotal2); // Push District 2 subtotal row
              }
            }

            // Calculate and push grand total row
            let grandTotalRow: any = [];
            grandTotalRow.push({
              text: 'GRAND TOTAL',
              colSpan: 1,
              fillColor: '#F1C93B',
              alignment: 'center',
              bold: true,
            });

            for (let i = 1; i < columnWidth.length; i++) {
              let total = 0;

              if (
                subtotal1.length > 1 &&
                subtotal2.length == 1 &&
                i < subtotal1.length &&
                !isNaN(parseInt(subtotal1[i].text))
              ) {
                total += parseInt(subtotal1[i].text);
              } else if (
                subtotal2.length > 1 &&
                subtotal1.length == 1 &&
                i < subtotal2.length &&
                !isNaN(parseInt(subtotal2[i].text))
              ) {
                total += parseInt(subtotal2[i].text);
              } else if (
                subtotal1.length > 1 &&
                subtotal2.length > 1 &&
                i < subtotal1.length &&
                i < subtotal2.length &&
                !isNaN(parseInt(subtotal1[i].text)) &&
                !isNaN(parseInt(subtotal2[i].text))
              ) {
                let sub1 =
                  subtotal1[i].text == '-' ? 0 : parseInt(subtotal1[i].text);
                let sub2 =
                  subtotal2[i].text == '-' ? 0 : parseInt(subtotal2[i].text);
                total = sub1 + sub2;
              }

              grandTotalRow.push({
                text: total.toString(),
                fillColor: '#F1C93B',
                alignment: 'center',
              });
            }
            tableData.push(grandTotalRow); // Push grand total row

            // Push table into content data with page break before each table
            contentData.push({
              margin: [0, 10, 0, 0],
              table: {
                widths: columnWidth,
                body: tableData,
                pageBreak: 'before', // Ensure each table starts on a new page
              },
            });
          });

          data.push(...contentData); // Push all content data into main data array

          // Generate PDF with the assembled data
          let landscape = false; // Adjust as needed (true for portrait, false for landscape)
          this.pdfService.GeneratePdf(data, landscape, this.remarks);
          console.log(data); // Optional: Log the generated data
        } else {
          this.Error(); // Handle case where no reports are returned
        }
      },
      error: (error: any) => {
        console.log(error); // Log any errors that occur during data retrieval
      },
    });
  }

  MjrEcoGeneratePDF() {
    let reports: any = [];
    let data: any = [];
    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.reportService.GetMajorEcoReport(this.params).subscribe({
      next: (response: any = {}) => {
        reports = response;

        if (!Array.isArray(reports)) {
          console.error('Reports is not an array:', reports);
          return;
        }

        // Split data into districts
        reports.forEach((a: any) => {
          if (a.district === 1) {
            dist1.push(a);
          } else {
            dist2.push(a);
          }
        });

        if (reports.length > 0) {
          data.push({
            margin: [0, 40, 0, 0],
            columns: [
              {
                text: `Major Economic Activities by Municipality/City`,
                fontSize: 14,
                bold: true,
              },
              {
                text: `Year: ${reports[0].setYear}`,
                fontSize: 14,
                bold: true,
                alignment: 'right',
              },
            ],
          });
        } else {
          console.error('No reports found.');
          return;
        }

        // Grouping by municipality/city for district 1
        const dist1Group = dist1.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        // Grouping by municipality/city for district 2
        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        // Header row for the table
        tableData.push([
          {
            text: '#',
            fillColor: '#black',
            bold: true,
            color: 'white',
            alignment: 'center',
            border: [true, true, true, true],
            margin: [0, 10, 0, 0],
          },
          {
            text: 'Major Economic Activity',
            fillColor: '#black',
            bold: true,
            color: 'white',
            alignment: 'center',
            border: [true, true, true, true],
          },
          {
            text: 'Description',
            fillColor: '#black',
            bold: true,
            color: 'white',
            alignment: 'center',
            border: [true, true, true, true],
          },
        ]);

        // District 1 title row
        tableData.push([
          {
            text: `1st Congressional District`,
            colSpan: 3,
            alignment: 'left',
            fillColor: '#DDDDDD',
            bold: true,
            border: [true, true, true, true],
            margin: [0, 5, 0, 0],
          },
        ]);

        // Populate table with data for district 1
        for (const groupKey1 in dist1Group) {
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 3,
              alignment: 'left',
              fillColor: '#EEEEEE',
              bold: true,
              border: [true, true, true, true],
            },
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: (index + 1).toString(),
                border: [true, true, true, true],
                alignment: 'center',
              },
              {
                text: item.mjrActivity,
                border: [true, true, true, true],
                alignment: 'left',
                margin: [0, 5, 0, 0],
              },
              {
                text: item.description,
                border: [true, true, true, true],
                alignment: 'left',
                margin: [0, 5, 0, 0],
              },
            ]);
          });
        }

        // District 2 title row
        tableData.push([
          {
            text: `2nd Congressional District`,
            colSpan: 3,
            alignment: 'left',
            fillColor: '#DDDDDD',
            bold: true,
            border: [true, true, true, true],
            margin: [0, 10, 0, 0],
          },
        ]);

        // Populate table with data for district 2
        for (const groupKey2 in dist2Group) {
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 3,
              alignment: 'left',
              fillColor: '#EEEEEE',
              bold: true,
              border: [true, true, true, true],
            },
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: (index + 1).toString(),
                border: [true, true, true, true],
                alignment: 'center',
              },
              {
                text: item.mjrActivity,
                border: [true, true, true, true],
                alignment: 'left',
                margin: [0, 5, 0, 0],
              },
              {
                text: item.description,
                border: [true, true, true, true],
                alignment: 'left',
                margin: [0, 5, 0, 0],
              },
            ]);
          });
        }

        // Table configuration
        const table = {
          margin: [0, 10, 0, 0],
          table: {
            widths: [25, '*', '*'],
            body: tableData,
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#CCCCCC',
            vLineColor: () => '#CCCCCC',
          },
        };

        data.push(table);
      },
      error: (error: any) => {
        console.error('Error fetching MajorEcoReport:', error);
      },
      complete: () => {
        if (reports.length > 0) {
          let isPortrait = false; // Adjust orientation as needed
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log('PDF generation completed successfully.');
        } else {
          console.error('No reports to generate PDF.');
          this.Error(); // Handle error condition
        }
      },
    });
  }

  //GOVERNANCE
  ProvOfficialGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    this.reportService.GetProvOfficialReport(this.params).subscribe({
      next: (response) => {
        reports = <any>response;
        data.push({
          text: 'List of Provincial Government Officials of Davao del Norte',
          bold: true,
          alignment: 'center',
        });

        const groupedData = reports.reduce((groups: any, item: any) => {
          const { setYear } = item;
          const groupKey = `${setYear}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        // Iterate over each group and add it to the PDF
        for (const groupKey in groupedData) {
          const group = groupedData[groupKey];
          const [year] = groupKey.split('-');

          // Add page break before each table (except the first one)
          if (data.length > 1) {
            data.push({ text: '', pageBreak: 'before' });
          }

          data.push({
            margin: [0, 50, 0, 0],
            columns: [
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
            },
          ]);

          group.forEach((item: any) => {
            tableData.push([
              {
                text: item.position,
                fillColor: '#FFFFFF',
                border: [true, true, true, true],
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
                border: [true, true, true, true],
              },
              {
                text: item.term,
                fillColor: '#FFFFFF',
                border: [true, true, true, true],
              },
              {
                text: item.contact,
                fillColor: '#FFFFFF',
                border: [true, true, true, true],
              },
            ]);
          });

          const table = {
            margin: [0, 10, 0, 0],
            table: {
              widths: ['*', '*', '*', '*'],
              body: tableData,
            },
            layout: {
              hLineWidth: function (i: any, node: any) {
                return 1;
              },
              vLineWidth: function (i: any, node: any) {
                return 1;
              },
              hLineColor: function (i: any, node: any) {
                return '#000000';
              },
              vLineColor: function (i: any, node: any) {
                return '#000000';
              },
              paddingLeft: function (i: any, node: any) {
                return 4;
              },
              paddingRight: function (i: any, node: any) {
                return 4;
              },
              paddingTop: function (i: any, node: any) {
                return 2;
              },
              paddingBottom: function (i: any, node: any) {
                return 2;
              },
            },
          };

          data.push(table);

          // Add "End of Report" after each table
          data.push({
            text: '***End of Report***',
            alignment: 'left',
            margin: [0, 10, 0, 0],
            bold: true,
          });
        }
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        if (reports.length > 0) {
          let isPortrait = true;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }

  SkGeneratePDF() {
    let reports: any = [];
    let data: any = [];
    let subtotal1: any = {};
    let subtotal2: any = {};
    let grandtotal: any = {};
    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.reportService.GetRegSkvoterReport(this.params).subscribe({
      next: (response: any = {}) => {
        reports = response.data;
        subtotal1 = response.subtotalData[0];
        subtotal2 = response.subtotalData[1];
        grandtotal = response.grandTotal;
        console.log('result: ', response);

        data.push({
          text: 'Number of Precincts and Registered SK Voters by Municipality/City',
          bold: true,
          alignment: 'center',
        });

        reports.forEach((a: any) => {
          console.log(a);
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
              text: `Year: ${response.data[0].setYear}`,
              fontSize: 14,
              bold: true,
            },
          ],
        });

        tableData.push([
          {
            text: 'Municipality/ City',
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
          {
            text: 'No. of Established Precincts',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'No. of Clustered Precincts',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'No. of Voting Centers',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'No. of Registered SK Voters',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 6,
            alignment: 'left',
            fillColor: '#526D82',
          },
          {},
          {},
          {},
          {},
          {},
        ]);

        dist1.forEach((item: any) => {
          tableData.push([
            { text: item.munCityName, fillColor: '#FFFFFF' },
            { text: item.totalPurokNo, fillColor: '#FFFFFF' },
            { text: item.totalEstabNo, fillColor: '#FFFFFF' },
            { text: item.totalClusterNo, fillColor: '#FFFFFF' },
            { text: item.totalVotingCntrNo, fillColor: '#FFFFFF' },
            { text: item.totalRegSkVoterNo, fillColor: '#FFFFFF' },
          ]);
        });

        tableData.push([
          { text: 'SUBTOTAL', fillColor: '#9DB2BF' },
          { text: subtotal1.purokNo, fillColor: '#9DB2BF' },
          { text: subtotal1.estabNo, fillColor: '#9DB2BF' },
          { text: subtotal1.clusterNo, fillColor: '#9DB2BF' },
          { text: subtotal1.votingCntrNo, fillColor: '#9DB2BF' },
          { text: subtotal1.regSkVoterNo, fillColor: '#9DB2BF' },
        ]);

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 6,
            alignment: 'left',
            fillColor: '#526D82',
          },
          {},
          {},
          {},
          {},
          {},
        ]);

        dist2.forEach((item: any) => {
          tableData.push([
            { text: item.munCityName, fillColor: '#FFFFFF' },
            { text: item.totalPurokNo, fillColor: '#FFFFFF' },
            { text: item.totalEstabNo, fillColor: '#FFFFFF' },
            { text: item.totalClusterNo, fillColor: '#FFFFFF' },
            { text: item.totalVotingCntrNo, fillColor: '#FFFFFF' },
            { text: item.totalRegSkVoterNo, fillColor: '#FFFFFF' },
          ]);
        });

        tableData.push([
          { text: 'SUBTOTAL', fillColor: '#9DB2BF' },
          { text: subtotal2?.purokNo ?? '', fillColor: '#9DB2BF' },
          { text: subtotal2?.estabNo ?? '', fillColor: '#9DB2BF' },
          { text: subtotal2?.clusterNo ?? '', fillColor: '#9DB2BF' },
          { text: subtotal2?.votingCntrNo ?? '', fillColor: '#9DB2BF' },
          { text: subtotal2?.regSkVoterNo ?? '', fillColor: '#9DB2BF' },
        ]);

        tableData.push([
          { text: 'GRANDTOTAL', fillColor: '#F1C93B' },
          { text: grandtotal.purokNo, fillColor: '#F1C93B' },
          { text: grandtotal.estabNo, fillColor: '#F1C93B' },
          { text: grandtotal.clusterNo, fillColor: '#F1C93B' },
          { text: grandtotal.votingCntrNo, fillColor: '#F1C93B' },
          { text: grandtotal.regSkVoterNo, fillColor: '#F1C93B' },
        ]);

        const table = {
          margin: [0, 10, 0, 0],
          table: {
            widths: ['*', '*', '*', '*', '*', '*'],
            body: tableData,
          },
          layout: {
            hLineWidth: function (i: number, node: any) {
              return 0.5;
            },
            vLineWidth: function (i: number, node: any) {
              return 0.5;
            },
            hLineColor: function (i: number, node: any) {
              return '#000000';
            },
            vLineColor: function (i: number, node: any) {
              return '#000000';
            },
          },
        };

        data.push(table);
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }

  VotersGeneratePDF() {
    let reports: any = [];

    let data: any = [];
    let subtotal1: any = {};
    let subtotal2: any = {};
    let grandtotal: any = {};
    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.reportService.GetRegvoterReport(this.params).subscribe({
      next: (response: any = {}) => {
        reports = response.data;
        subtotal1 = response.subtotalData[0];
        subtotal2 = response.subtotalData[1];
        grandtotal = response.grandTotal;
        console.log(response);

        data.push({
          text: 'Number of Precincts and Registered Voters by Municipality/City',
          bold: true,
          alignment: 'center',
        });

        reports.forEach((a: any) => {
          console.log(a);
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
              text: `Year: ${response.data[0].setYear}`,
              fontSize: 14,
              bold: true,
            },
          ],
        });

        tableData.push([
          {
            text: 'Municipality/ City',
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
          {
            text: 'No. of Established Precincts',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'No. of Clustered Precincts',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'No. of Voting Centers',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'No. of Registered Voters',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 6,
            alignment: 'left',
            fillColor: '#526D82',
          },
          {},
          {},
          {},
          {},
          {},
        ]);

        dist1.forEach((item: any, index: any) => {
          tableData.push([
            {
              text: item.munCityName,
              fillColor: '#FFFFFF',
            },
            {
              text: item.totalPurokNo,
              fillColor: '#FFFFFF',
            },
            {
              text: item.totalEstabNo,
              fillColor: '#FFFFFF',
            },
            {
              text: item.totalClusterNo,
              fillColor: '#FFFFFF',
            },
            {
              text: item.totalVotingCntrNo,
              fillColor: '#FFFFFF',
            },
            {
              text: item.totalRegVoterNo,
              fillColor: '#FFFFFF',
            },
          ]);
        });

        tableData.push([
          {
            text: 'SUBTOTAL',
            fillColor: '#9DB2BF',
          },
          {
            text: subtotal1.purokNo,
            fillColor: '#9DB2BF',
          },
          {
            text: subtotal1.estabNo,
            fillColor: '#9DB2BF',
          },
          {
            text: subtotal1.clusterNo,
            fillColor: '#9DB2BF',
          },
          {
            text: subtotal1.votingCntrNo,
            fillColor: '#9DB2BF',
          },
          {
            text: subtotal1.regVoterNo,
            fillColor: '#9DB2BF',
          },
        ]);

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 6,
            alignment: 'left',
            fillColor: '#526D82',
          },
          {},
          {},
          {},
          {},
          {},
        ]);

        dist2.forEach((item: any, index: any) => {
          tableData.push([
            {
              text: item.munCityName,
              fillColor: '#FFFFFF',
            },
            {
              text: item.totalPurokNo,
              fillColor: '#FFFFFF',
            },
            {
              text: item.totalEstabNo,
              fillColor: '#FFFFFF',
            },
            {
              text: item.totalClusterNo,
              fillColor: '#FFFFFF',
            },
            {
              text: item.totalVotingCntrNo,
              fillColor: '#FFFFFF',
            },
            {
              text: item.totalRegVoterNo,
              fillColor: '#FFFFFF',
            },
          ]);
        });

        tableData.push([
          {
            text: 'SUBTOTAL',
            fillColor: '#9DB2BF',
          },
          {
            text: subtotal2.purokNo,
            fillColor: '#9DB2BF',
          },
          {
            text: subtotal2.estabNo,
            fillColor: '#9DB2BF',
          },
          {
            text: subtotal2.clusterNo,
            fillColor: '#9DB2BF',
          },
          {
            text: subtotal2.votingCntrNo,
            fillColor: '#9DB2BF',
          },
          {
            text: subtotal2.regVoterNo,
            fillColor: '#9DB2BF',
          },
        ]);

        tableData.push([
          {
            text: 'GRANDTOTAL',
            fillColor: '#F1C93B',
          },
          {
            text: grandtotal.purokNo,
            fillColor: '#F1C93B',
          },
          {
            text: grandtotal.estabNo,
            fillColor: '#F1C93B',
          },
          {
            text: grandtotal.clusterNo,
            fillColor: '#F1C93B',
          },
          {
            text: grandtotal.votingCntrNo,
            fillColor: '#F1C93B',
          },
          {
            text: grandtotal.regVoterNo,
            fillColor: '#F1C93B',
          },
        ]);

        const table = {
          margin: [0, 10, 0, 0],
          table: {
            widths: ['*', '*', '*', '*', '*', '*'],
            body: tableData,
          },
          layout: {
            hLineWidth: function (i: any, node: any) {
              return 1;
            },
            vLineWidth: function (i: any, node: any) {
              return 1;
            },
            hLineColor: function (i: any, node: any) {
              return 'black';
            },
            vLineColor: function (i: any, node: any) {
              return 'black';
            },
            paddingLeft: function (i: any, node: any) {
              return 4;
            },
            paddingRight: function (i: any, node: any) {
              return 4;
            },
            paddingTop: function (i: any, node: any) {
              return 2;
            },
            paddingBottom: function (i: any, node: any) {
              return 2;
            },
          },
        };

        data.push(table);
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }

  DemographyGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    let dist1: any = [];
    let dist2: any = [];

    let grandTotal: any = [];
    let columns: any = [];

    this.reportService.GetDemographyReport(this.params).subscribe({
      next: (response: any = {}) => {
        reports = response.data;
        grandTotal = response.grandTotal;
        dist1 = response.districtOne;
        dist2 = response.districtTwo;
        columns = response.columns;

        console.log('result: ', response);

        data.push({
          margin: [0, 40, 0, 0],
          columns: [
            {
              text: `Total Population and Households by Municipality/City`,
              fontSize: 14,
              bold: true,
            },
            {
              text: `Year: ${response.fromYear} - ${response.year}`,
              fontSize: 14,
              bold: true,
              alignment: 'right',
            },
          ],
        });

        let columnData: any = [];
        columns.forEach((a: any, index: any) => {
          if (index == 0) {
            columnData.push(
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
              }
            );
          }
          columnData.push(
            {
              text: a.description,
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: a.male,
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: a.female,
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: a.household,
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            }
          );
        });
        tableData.push(columnData);

        reports.forEach((a: any, index: any) => {
          if (a.district === 1) {
            tableData.push([
              {
                text: `1st Congressional District `,
                colSpan: 14,
                alignment: 'left',
                fillColor: '#526D82',
                marginLeft: 5,
              },
            ]);
            dist1.forEach((b: any, index2: any) => {
              let d1: any = [];
              d1.push(
                {
                  text: index2 + 1,
                  alignment: 'center',
                },
                {
                  text: b.munCityName,
                }
              );

              columns.forEach((c: any, index3: any) => {
                let _population: any = '-';
                let _male: any = '-';
                let _female: any = '-';
                let _householdNo: any = '-';

                a.data.forEach((d: any, index4: any) => {
                  if (b.munCityId === d.munCityId) {
                    d.munData.forEach((e: any, index5: any) => {
                      if (c.setYear === e.setYear) {
                        _population = e.population;
                        _male = e.male;
                        _female = e.female;
                        _householdNo = e.householdNo;
                      }
                    });
                  }
                });
                d1.push(
                  {
                    text: _population,
                    alignment: 'center',
                  },
                  {
                    text: _male,
                    alignment: 'center',
                  },
                  {
                    text: _female,
                    alignment: 'center',
                  },
                  {
                    text: _householdNo,
                    alignment: 'center',
                  }
                );
              });
              tableData.push(d1);
            });

            let _subTotal: any = [];
            _subTotal.push(
              {
                text: 'SUBTOTAL',
                colSpan: 2,
                marginLeft: 5,
                fillColor: '#9DB2BF',
              },
              {}
            );
            columns.forEach((c: any, index3: any) => {
              let _population: any = '-';
              let _male: any = '-';
              let _female: any = '-';
              let _householdNo: any = '-';

              a.subTotal.forEach((e: any, index5: any) => {
                if (c.setYear === e.setYear) {
                  _population = e.population;
                  _male = e.male;
                  _female = e.female;
                  _householdNo = e.householdNo;
                }
              });
              _subTotal.push(
                {
                  text: _population,
                  alignment: 'center',
                  fillColor: '#9DB2BF',
                },
                {
                  text: _male,
                  alignment: 'center',
                  fillColor: '#9DB2BF',
                },
                {
                  text: _female,
                  alignment: 'center',
                  fillColor: '#9DB2BF',
                },
                {
                  text: _householdNo,
                  alignment: 'center',
                  fillColor: '#9DB2BF',
                }
              );
            });
            tableData.push(_subTotal);
          }
          if (a.district === 2) {
            tableData.push([
              {
                text: `2nd Congressional District `,
                colSpan: 14,
                alignment: 'left',
                fillColor: '#526D82',
                marginLeft: 5,
              },
            ]);
            dist2.forEach((b: any, index2: any) => {
              let d2: any = [];
              d2.push(
                {
                  text: index2 + 1,
                  alignment: 'center',
                },
                {
                  text: b.munCityName,
                }
              );

              columns.forEach((c: any, index3: any) => {
                let _population: any = '-';
                let _male: any = '-';
                let _female: any = '-';
                let _householdNo: any = '-';

                a.data.forEach((d: any, index4: any) => {
                  if (b.munCityId === d.munCityId) {
                    d.munData.forEach((e: any, index5: any) => {
                      if (c.setYear === e.setYear) {
                        _population = e.population;
                        _male = e.male;
                        _female = e.female;
                        _householdNo = e.householdNo;
                      }
                    });
                  }
                });
                d2.push(
                  {
                    text: _population,
                    alignment: 'center',
                  },
                  {
                    text: _male,
                    alignment: 'center',
                  },
                  {
                    text: _female,
                    alignment: 'center',
                  },
                  {
                    text: _householdNo,
                    alignment: 'center',
                  }
                );
              });
              tableData.push(d2);
            });

            let _subTotal: any = [];
            _subTotal.push(
              {
                text: 'SUBTOTAL',
                colSpan: 2,
                marginLeft: 5,
                fillColor: '#9DB2BF',
              },
              {}
            );
            columns.forEach((c: any, index3: any) => {
              let _population: any = '-';
              let _male: any = '-';
              let _female: any = '-';
              let _householdNo: any = '-';

              a.subTotal.forEach((e: any, index5: any) => {
                if (c.setYear === e.setYear) {
                  _population = e.population;
                  _male = e.male;
                  _female = e.female;
                  _householdNo = e.householdNo;
                }
              });
              _subTotal.push(
                {
                  text: _population,
                  alignment: 'center',
                  fillColor: '#9DB2BF',
                },
                {
                  text: _male,
                  alignment: 'center',
                  fillColor: '#9DB2BF',
                },
                {
                  text: _female,
                  alignment: 'center',
                  fillColor: '#9DB2BF',
                },
                {
                  text: _householdNo,
                  alignment: 'center',
                  fillColor: '#9DB2BF',
                }
              );
            });
            tableData.push(_subTotal);
          }
        });

        let _grandTotal: any = [];
        _grandTotal.push(
          {
            text: 'GRANDTOTAL',
            colSpan: 2,
            marginLeft: 5,
            fillColor: '#F1C93B',
          },
          {}
        );
        columns.forEach((c: any, index3: any) => {
          let _population: any = '-';
          let _male: any = '-';
          let _female: any = '-';
          let _householdNo: any = '-';

          grandTotal.forEach((e: any, index5: any) => {
            if (c.setYear === e.setYear) {
              _population = e.population;
              _male = e.male;
              _female = e.female;
              _householdNo = e.householdNo;
            }
          });
          _grandTotal.push(
            {
              text: _population,
              alignment: 'center',
              fillColor: '#F1C93B',
            },
            {
              text: _male,
              alignment: 'center',
              fillColor: '#F1C93B',
            },
            {
              text: _female,
              alignment: 'center',
              fillColor: '#F1C93B',
            },
            {
              text: _householdNo,
              alignment: 'center',
              fillColor: '#F1C93B',
            }
          );
        });
        tableData.push(_grandTotal);

        const table = {
          margin: [0, 20, 0, 0],
          table: {
            widths: [
              25,
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              '*',
            ],
            body: tableData,
          },
          layout: {
            hLineWidth: function (i: any, node: any) {
              return i === 0 || i === node.table.body.length ? 1 : 1;
            },
            vLineWidth: function (i: any, node: any) {
              return i === 0 || i === node.table.widths.length ? 1 : 1;
            },
            hLineColor: function (i: any, node: any) {
              return 'black';
            },
            vLineColor: function (i: any, node: any) {
              return 'black';
            },
            paddingLeft: function (i: any, node: any) {
              return 4;
            },
            paddingRight: function (i: any, node: any) {
              return 4;
            },
            paddingTop: function (i: any, node: any) {
              return 2;
            },
            paddingBottom: function (i: any, node: any) {
              return 2;
            },
          },
        };

        data.push(table);
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }

  OrgStafGeneratePDF() {
    let data: any = [];
    let grandTotal: any = {};

    let reports: any = [];
    let columnLenght: number = 0;

    const tableData: any = [];

    this.reportService.GetOrgStaffReport(this.params).subscribe({
      next: (response: any = {}) => {
        reports = response.data;
        grandTotal = response.grandTotal;

        console.log('result: ', response);

        data.push({
          margin: [0, 40, 0, 0],
          columns: [
            {
              text: `Organization/ Staffing Patterns by Municipality/City`,
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
            fontSize: 9,
          },
          {
            text: 'Municipality/ City',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: 'Permanent Employees',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: 'Temporary',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: 'Co-Terminus',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: 'Elected',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: 'Casual',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: 'Job Order',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: 'Contractual',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: 'Casual SEF',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: 'School Board',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: 'Contract of Services',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: 'Others',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            fontSize: 9,
          },
        ]);

        reports.forEach((a: any) => {
          let _district: string = '1st';
          if (a.district === 2) {
            _district = '2nd';
          }
          tableData.push([
            {
              text: `${_district} Congressional District `,
              colSpan: 13,
              alignment: 'left',
              fillColor: '#526D82',
              marginLeft: 5,
              fontSize: 9,
            },
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
          ]);
          a.data.forEach((b: any, index2: any) => {
            tableData.push([
              {
                text: index2 + 1,
                fillColor: '#FFFFFF',
                alignment: 'center',
                fontSize: 9,
              },
              {
                text: b.munCityName,
                fillColor: '#FFFFFF',
                fontSize: 9,
              },
              {
                text: b.munData.permanentNo,
                fillColor: '#FFFFFF',
                fontSize: 9,
                alignment: 'center',
              },
              {
                text: b.munData.temporary,
                fillColor: '#FFFFFF',
                alignment: 'center',
                fontSize: 9,
              },
              {
                text: b.munData.coTerminus,
                fillColor: '#FFFFFF',
                alignment: 'center',
                fontSize: 9,
              },
              {
                text: b.munData.elected,
                fillColor: '#FFFFFF',
                alignment: 'center',
                fontSize: 9,
              },
              {
                text: b.munData.casual,
                fillColor: '#FFFFFF',
                alignment: 'center',
                fontSize: 9,
              },
              {
                text: b.munData.jobOrder,
                fillColor: '#FFFFFF',
                alignment: 'center',
                fontSize: 9,
              },
              {
                text: b.munData.contractual,
                fillColor: '#FFFFFF',
                alignment: 'center',
                fontSize: 9,
              },
              {
                text: b.munData.casualSef,
                fillColor: '#FFFFFF',
                alignment: 'center',
                fontSize: 9,
              },
              {
                text: b.munData.schoolBoard,
                fillColor: '#FFFFFF',
                fontSize: 9,
                alignment: 'center',
              },
              {
                text: b.munData.contractService,
                fillColor: '#FFFFFF',
                fontSize: 9,
                alignment: 'center',
              },
              {
                text: b.munData.others,
                fillColor: '#FFFFFF',
                fontSize: 9,
              },
            ]);
          });

          tableData.push([
            {
              text: 'SUBTOTAL',
              fillColor: '#9DB2BF',
              colSpan: 2,
              marginLeft: 5,
              fontSize: 9,
            },
            {},
            {
              text: a.subTotal.permanentNo,
              fillColor: '#9DB2BF',
              alignment: 'center',
              fontSize: 9,
            },
            {
              text: a.subTotal.temporary,
              fillColor: '#9DB2BF',
              alignment: 'center',
              fontSize: 9,
            },
            {
              text: a.subTotal.coTerminus,
              fillColor: '#9DB2BF',
              alignment: 'center',
              fontSize: 9,
            },
            {
              text: a.subTotal.elected,
              fillColor: '#9DB2BF',
              alignment: 'center',
              fontSize: 9,
            },
            {
              text: a.subTotal.casual,
              fillColor: '#9DB2BF',
              alignment: 'center',
              fontSize: 9,
            },
            {
              text: a.subTotal.jobOrder,
              fillColor: '#9DB2BF',
              alignment: 'center',
              fontSize: 9,
            },
            {
              text: a.subTotal.contractual,
              fillColor: '#9DB2BF',
              alignment: 'center',
              fontSize: 9,
            },
            {
              text: a.subTotal.casualSef,
              fillColor: '#9DB2BF',
              alignment: 'center',
              fontSize: 9,
            },
            {
              text: a.subTotal.schoolBoard,
              fillColor: '#9DB2BF',
              alignment: 'center',
              fontSize: 9,
            },
            {
              text: a.subTotal.contractService,
              fillColor: '#9DB2BF',
              alignment: 'center',
              fontSize: 9,
            },
            {
              text: a.subTotal.others,
              fillColor: '#9DB2BF',
              alignment: 'center',
              fontSize: 9,
            },
          ]);
        });

        tableData.push([
          {
            text: 'GRANDTOTAL',
            fillColor: '#F1C93B',
            colSpan: 2,
            marginLeft: 5,
            fontSize: 9,
          },
          {},
          {
            text: grandTotal.permanentNo,
            fillColor: '#F1C93B',
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: grandTotal.temporary,
            fillColor: '#F1C93B',
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: grandTotal.coTerminus,
            fillColor: '#F1C93B',
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: grandTotal.elected,
            fillColor: '#F1C93B',
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: grandTotal.casual,
            fillColor: '#F1C93B',
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: grandTotal.jobOrder,
            fillColor: '#F1C93B',
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: grandTotal.contractual,
            fillColor: '#F1C93B',
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: grandTotal.casualSef,
            fillColor: '#F1C93B',
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: grandTotal.schoolBoard,
            fillColor: '#F1C93B',
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: grandTotal.contractService,
            fillColor: '#F1C93B',
            alignment: 'center',
            fontSize: 9,
          },
          {
            text: grandTotal.others,
            fillColor: '#F1C93B',
            alignment: 'center',
            fontSize: 9,
          },
        ]);

        const table = {
          margin: [0, 10, 0, 0],
          table: {
            widths: [
              25,
              '*',
              '*',
              '*',
              '*',
              '*',
              '*',
              '*',
              '*',
              '*',
              '*',
              '*',
              '*',
            ],
            body: tableData,
          },
          layout: {
            hLineWidth: function (i: number, node: any) {
              return 0.5;
            },
            vLineWidth: function (i: number, node: any) {
              return 0.5;
            },
            hLineColor: function (i: number, node: any) {
              return '#000000';
            },
            vLineColor: function (i: number, node: any) {
              return '#000000';
            },
          },
        };

        data.push(table);
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }

  PhyGeoGeneratePDF() {
    let reports: any = [];
    let data: any = [];

    this.reportService.GetGeoProfReport(this.params).subscribe({
      next: (response) => {
        reports = <any>response;
        const groupedData = reports.reduce((groups: any, item: any) => {
          const { district } = item;
          const groupKey = `${district}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        // Initialize table data
        const tableData: any[] = [];

        // Add page break before each table (except the first one)
        if (data.length > 1) {
          data.push({ text: '', pageBreak: 'before' });
        }

        // Table header
        const headerRow = [
          {
            text: 'Municipality/ City',
            style: 'tableHeader',
            fillColor: 'black',
            color: 'white',
          },
          {
            text: 'Total Land Area (Has)',
            style: 'tableHeader',
            fillColor: 'black',
            color: 'white',
          },
          {
            text: 'As of Year',
            style: 'tableHeader',
            fillColor: 'black',
            color: 'white',
          },
          {
            text: 'Residential Area (Has)',
            style: 'tableHeader',
            fillColor: 'black',
            color: 'white',
          },
          {
            text: 'Commercial (Has)',
            style: 'tableHeader',
            fillColor: 'black',
            color: 'white',
          },
          {
            text: 'Industrial (Has)',
            style: 'tableHeader',
            fillColor: 'black',
            color: 'white',
          },
          {
            text: 'Agricultural (Has)',
            style: 'tableHeader',
            fillColor: 'black',
            color: 'white',
          },
          {
            text: 'Institutional (Has)',
            style: 'tableHeader',
            fillColor: 'black',
            color: 'white',
          },
          {
            text: 'Forest Lands (Has)',
            style: 'tableHeader',
            fillColor: 'black',
            color: 'white',
          },
          {
            text: 'Open Spaces (Has)',
            style: 'tableHeader',
            fillColor: 'black',
            color: 'white',
          },
          {
            text: 'Quarry (Has)',
            style: 'tableHeader',
            fillColor: 'black',
            color: 'white',
          },
          {
            text: 'Fish Ponds (Has)',
            style: 'tableHeader',
            fillColor: 'black',
            color: 'white',
          },
          {
            text: 'Other Land Uses (Has)',
            style: 'tableHeader',
            fillColor: 'black',
            color: 'white',
          },
        ];
        tableData.push(headerRow);

        // Iterate over each group and add rows to tableData
        for (const groupKey in groupedData) {
          const group = groupedData[groupKey];
          const [district] = groupKey.split('-');

          // Add district header row
          const districtHeaderRow = [
            {
              text: `${district} Congressional District`,
              colSpan: 13,
              fillColor: '#526D82',
              bold: true,
              alignment: 'left',
              margin: [5, 5],
            },
          ];
          tableData.push(districtHeaderRow);

          // Add data rows for each municipality/city in the district
          group.forEach((item: any) => {
            const rowData = [
              { text: item.munCityName, style: 'tableCell' },
              { text: item.totalLandArea, style: 'tableCell' },
              { text: item.setYear, style: 'tableCell' },
              { text: item.residential, style: 'tableCell' },
              { text: item.commercial, style: 'tableCell' },
              { text: item.industrial, style: 'tableCell' },
              { text: item.agricultural, style: 'tableCell' },
              { text: item.institutional, style: 'tableCell' },
              { text: item.forestLand, style: 'tableCell' },
              { text: item.openSpaces, style: 'tableCell' },
              { text: item.quarryAreas, style: 'tableCell' },
              { text: item.fishpond, style: 'tableCell' },
              { text: item.otherUses, style: 'tableCell' },
            ];
            tableData.push(rowData);
          });
        }

        // Define styles for the table
        const styles = {
          tableHeader: {
            fillColor: '#000',
            color: '#fff',
            bold: true,
            alignment: 'center',
            margin: [5, 5],
            border: [true, true, true, true],
          },
          tableCell: {
            alignment: 'center',
            margin: [5, 5],
            border: [true, true, true, true],
          },
        };

        // Define the table structure for PDF generation
        const table = {
          table: {
            headerRows: 1,
            widths: [
              '*',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
            ],
            body: tableData,
          },
          layout: {
            fillColor: function (rowIndex: number) {
              return rowIndex % 2 === 0 ? '#FFFFFF' : '#F0F0F0';
            }, // Alternate row color
            paddingTop: function (_i: any, _node: any) {
              return 3;
            },
            paddingBottom: function (_i: any, _node: any) {
              return 3;
            },
          },
          styles: styles,
        };

        data.push(table);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
        } else {
          this.Error();
        }
      },
    });
  }

  PhyGeoBarangayGeneratePDF() {
    let data: any = [];
    let grandTotal: any = {};

    let reports: any = [];
    let columnLength: number = 0;

    const tableData: any = [];

    this.reportService.GetGeoProfBrygReport(this.params).subscribe({
      next: (response: any = {}) => {
        reports = response.data;
        grandTotal = response.grandTotal;

        console.log('result: ', response);

        data.push({
          margin: [0, 40, 0, 0],
          columns: [
            {
              text: `List of Physical/ Geographic Profile of Barangay`,
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
            bold: true,
            alignment: 'center',
            fillColor: 'black',
            color: 'white',
          },
          {
            text: 'Barangay',
            bold: true,
            alignment: 'center',
            fillColor: 'black',
            color: 'white',
          },
          {
            text: 'No of Puroks',
            bold: true,
            alignment: 'center',
            fillColor: 'black',
            color: 'white',
          },
          {
            text: 'Total Land Area (Has)',
            bold: true,
            alignment: 'center',
            fillColor: 'black',
            color: 'white',
          },
          {
            text: 'As of Year',
            bold: true,
            alignment: 'center',
            fillColor: 'black',
            color: 'white',
          },
          {
            text: 'Residential Area (Has)',
            bold: true,
            alignment: 'center',
            fillColor: 'black',
            color: 'white',
          },
          {
            text: 'Commercial (Has)',
            bold: true,
            alignment: 'center',
            fillColor: 'black',
            color: 'white',
          },
          {
            text: 'Industrial (Has)',
            bold: true,
            alignment: 'center',
            fillColor: 'black',
            color: 'white',
          },
          {
            text: 'Agricultural (Has)',
            bold: true,
            alignment: 'center',
            fillColor: 'black',
            color: 'white',
          },
          {
            text: 'Institutional (Has)',
            bold: true,
            alignment: 'center',
            fillColor: 'black',
            color: 'white',
          },
          {
            text: 'Forest Lands (Has)',
            bold: true,
            alignment: 'center',
            fillColor: 'black',
            color: 'white',
          },
          {
            text: 'Open Spaces (Has)',
            bold: true,
            alignment: 'center',
            fillColor: 'black',
            color: 'white',
          },
          {
            text: 'Quarry (Has)',
            bold: true,
            alignment: 'center',
            fillColor: 'black',
            color: 'white',
          },
          {
            text: 'Fish Ponds (Has)',
            bold: true,
            alignment: 'center',
            fillColor: 'black',
            color: 'white',
          },
          {
            text: 'Other Land Uses (Has)',
            bold: true,
            alignment: 'center',
            fillColor: 'black',
            color: 'white',
          },
          {
            text: 'Reamarks',
            bold: true,
            alignment: 'center',
            fillColor: 'black',
            color: 'white',
          },
        ]);

        reports.forEach((a: any) => {
          tableData.push([
            {
              text: a.munCityName,
              bold: true,
              alignment: 'left',
              colSpan: 15,
              marginLeft: 5,
            },
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
          ]);

          a.data.forEach((b: any, index2: any) => {
            tableData.push([
              { text: index2 + 1, alignment: 'center' },
              { text: b.brgyName },
              { text: b.purokNo, alignment: 'center' },
              { text: b.totalLandArea, alignment: 'center' },
              { text: b.asOfYear, alignment: 'center' },
              { text: b.residential, alignment: 'center' },
              { text: b.commercial, alignment: 'center' },
              { text: b.industrial, alignment: 'center' },
              { text: b.agriculture, alignment: 'center' },
              { text: b.institutional, alignment: 'center' },
              { text: b.forestLand, alignment: 'center' },
              { text: b.openSpaces, alignment: 'center' },
              { text: b.quarryAreas, alignment: 'center' },
              { text: b.fishpond, alignment: 'center' },
              { text: b.otherUses, alignment: 'center' },
              { text: b.remarks, alignment: 'center' },
            ]);
          });

          tableData.push([
            {
              text: 'SUBTOTAL',
              colSpan: 2,
              marginLeft: 5,
              alignment: 'center',
            },
            {},
            { text: a.subtotal.purokNo, alignment: 'center' },
            { text: a.subtotal.totalLandArea, alignment: 'center' },
            { text: a.subtotal.asOfYear, alignment: 'center' },
            { text: a.subtotal.residential, alignment: 'center' },
            { text: a.subtotal.commercial, alignment: 'center' },
            { text: a.subtotal.industrial, alignment: 'center' },
            { text: a.subtotal.agriculture, alignment: 'center' },
            { text: a.subtotal.institutional, alignment: 'center' },
            { text: a.subtotal.forestLand, alignment: 'center' },
            { text: a.subtotal.openSpaces, alignment: 'center' },
            { text: a.subtotal.quarryAreas, alignment: 'center' },
            { text: a.subtotal.fishpond, alignment: 'center' },
            { text: a.subtotal.otherUses, alignment: 'center' },
            { text: a.subtotal.remarks, alignment: 'center' },
          ]);
        });

        tableData.push([
          {
            text: 'GRANDTOTAL',
            bold: true,
            colSpan: 2,
            marginLeft: 5,
            alignment: 'center',
          },
          {},
          { text: grandTotal.purokNo, alignment: 'center' },
          { text: grandTotal.totalLandArea, alignment: 'center' },
          { text: grandTotal.asOfYear, alignment: 'center' },
          { text: grandTotal.residential, alignment: 'center' },
          { text: grandTotal.commercial, alignment: 'center' },
          { text: grandTotal.industrial, alignment: 'center' },
          { text: grandTotal.agriculture, alignment: 'center' },
          { text: grandTotal.institutional, alignment: 'center' },
          { text: grandTotal.forestLand, alignment: 'center' },
          { text: grandTotal.openSpaces, alignment: 'center' },
          { text: grandTotal.quarryAreas, alignment: 'center' },
          { text: grandTotal.fishpond, alignment: 'center' },
          { text: grandTotal.otherUses, alignment: 'center' },
          { text: grandTotal.remarks, alignment: 'center' },
        ]);

        const table = {
          margin: [0, 10, 0, 0],
          table: {
            widths: [
              25,
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
            ],
            body: tableData,
          },
          layout: {
            hLineWidth: function (i: any, node: any) {
              return 0.5;
            },
            vLineWidth: function (i: any, node: any) {
              return 0.5;
            },
            hLineColor: function (i: any, node: any) {
              return '#000';
            },
            vLineColor: function (i: any, node: any) {
              return '#000';
            },
            paddingLeft: function (_i: any, _node: any) {
              return 4;
            },
            paddingRight: function (_i: any, _node: any) {
              return 4;
            },
            paddingTop: function (_i: any, _node: any) {
              return 2;
            },
            paddingBottom: function (_i: any, _node: any) {
              return 2;
            },
          },
        };

        data.push(table);
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log(data);
        } else {
          this.Error();
        }
      },
    });
  }
  FiscalMattersGeneratePDF() {
    let reports: any = [];
    let data: any = [];

    this.reportService.GetFiscalMatterReport(this.params).subscribe({
      next: (response) => {
        reports = <any>response;

        // Function to generate combined Revenue and Expenditure table per Municipality
        const generateTablesForMunicipality = () => {
          const municipalities: { [key: string]: any } = {};

          // Group reports by municipality
          reports.forEach((item: any) => {
            const { munCityName, fiscalYear, category } = item;
            const key = `${munCityName}`;

            if (!municipalities[key]) {
              municipalities[key] = {
                cityName: munCityName,
                combinedData: [], // Combined data array for both revenue and expenditure
              };
            }

            municipalities[key].combinedData.push({
              fiscalYear: fiscalYear,
              name: item.name,
              amount: item.amount,
              category: category === 1 ? 'Revenue' : 'Expenditure', // Marking category for combined table
            });
          });

          // Iterate over each municipality and add combined tables to data
          for (const key in municipalities) {
            const { cityName, combinedData } = municipalities[key];

            // Generate combined Revenue and Expenditure table
            generateCombinedTable(cityName, combinedData);
          }
        };

        // Function to generate combined Revenue and Expenditure table for a municipality
        const generateCombinedTable = (
          cityName: string,
          combinedData: any[]
        ) => {
          // Determine the section title
          const tableTitle = `${cityName} - Revenue and Expenditure`;

          // Prepare table headers
          const tableHeaders = [
            {
              text: 'Fiscal Year',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              border: [true, true, true, true],
            },
            {
              text: 'Category',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              border: [true, true, true, true],
            },
            {
              text: 'Name',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              border: [true, true, true, true],
            },
            {
              text: 'Amount (PhP)',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              border: [true, true, true, true],
            },
          ];

          // Prepare table data
          const tableData = combinedData.map((item: any) => [
            {
              text: item.fiscalYear,
              fillColor: '#FFFFFF',
              border: [true, true, true, true],
              alignment: 'center',
              fontSize: 10,
            },
            {
              text: item.category,
              fillColor: '#FFFFFF',
              border: [true, true, true, true],
              alignment: 'center',
              fontSize: 10,
            },
            {
              text: item.name,
              fillColor: '#FFFFFF',
              border: [true, true, true, true],
              alignment: 'center',
              fontSize: 10,
            },
            {
              text: item.amount,
              fillColor: '#FFFFFF',
              border: [true, true, true, true],
              alignment: 'center',
              fontSize: 10,
            },
          ]);

          // Add table to data with page break as needed
          if (tableData.length > 0) {
            if (data.length > 1) {
              data.push({ text: '', pageBreak: 'before' });
            }

            data.push({
              margin: [0, 10, 0, 0],
              text: tableTitle,
              fontSize: 14,
              bold: true,
              alignment: 'center',
            });

            const table = {
              margin: [0, 5, 0, 15],
              table: {
                headerRows: 1,
                widths: ['auto', 'auto', '*', 'auto'],
                body: [tableHeaders, ...tableData],
              },
              layout: {
                hLineWidth: function (i: any, node: any) {
                  return 1;
                },
                vLineWidth: function (i: any, node: any) {
                  return 1;
                },
                hLineColor: function (i: any, node: any) {
                  return '#CCCCCC';
                },
                vLineColor: function (i: any, node: any) {
                  return '#CCCCCC';
                },
                paddingLeft: function (i: any, node: any) {
                  return 5;
                },
                paddingRight: function (i: any, node: any) {
                  return 5;
                },
                paddingTop: function (i: any, node: any) {
                  return 3;
                },
                paddingBottom: function (i: any, node: any) {
                  return 3;
                },
              },
            };

            data.push(table);
          }
        };

        // Call function to generate combined tables for each municipality
        generateTablesForMunicipality();
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        if (reports.length > 0) {
          let isPortrait = true; // Assuming portrait mode
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
        } else {
          this.Error();
        }
      },
    });
  }

  CityOfficialGeneratePDF() {
    let reports: any = [];
    let data: any = [];

    this.reportService.GetCityOfficialsReport(this.params).subscribe({
      next: (response) => {
        reports = <any>response;

        data.push({
          text: 'List of Local Government Officials by Municipality/ City',
          bold: true,
          alignment: 'center',
          margin: [0, 20, 0, 10],
        });

        // Separate elective and appointed officials based on category
        const electiveOfficials = reports.filter(
          (report: any) => report.category === 1
        );
        const appointedOfficials = reports.filter(
          (report: any) => report.category === 2
        );

        // Function to generate tables for a given category
        const generateTablesForCategory = (
          categoryReports: any[],
          categoryTitle: string
        ) => {
          const groupedData = categoryReports.reduce(
            (groups: any, item: any) => {
              const { munCityName, setYear, category } = item;
              const groupKey = `${munCityName}-${category}-${setYear}`;
              if (!groups[groupKey]) {
                groups[groupKey] = [];
              }
              groups[groupKey].push(item);
              return groups;
            },
            {}
          );

          // Iterate over each group and add it to the PDF
          for (const groupKey in groupedData) {
            const group = groupedData[groupKey];
            const [cityName, category, year] = groupKey.split('-');

            // Determine the section title based on the category
            const sectionTitle =
              category === '1' ? 'Elective Officials' : 'Appointed Officials';

            // Add page break before each table (except the first one)
            if (data.length > 1) {
              data.push({ text: '', pageBreak: 'before' });
            }

            data.push({
              margin: [0, 10, 0, 0],
              columns: [
                {
                  text: `${cityName} - ${sectionTitle}`,
                  fontSize: 14,
                  bold: true,
                  width: 'auto',
                },
                {
                  text: `Year: ${year}`,
                  fontSize: 14,
                  bold: true,
                  alignment: 'right',
                  width: 'auto',
                },
              ],
            });

            // Create the table headers based on category
            const tableData: any = [];
            tableData.push([
              {
                text: 'Position',
                fillColor: 'black',
                color: 'white',
                bold: true,
                alignment: 'center',
                border: [true, true, true, true],
              },
              {
                text: 'Name',
                fillColor: 'black',
                color: 'white',
                bold: true,
                alignment: 'center',
                border: [true, true, true, true],
              },
              {
                text: category === '1' ? 'Term' : 'Employment Status',
                fillColor: 'black',
                color: 'white',
                bold: true,
                alignment: 'center',
                border: [true, true, true, true],
              },
              {
                text: 'Contact #',
                fillColor: 'black',
                color: 'white',
                bold: true,
                alignment: 'center',
                border: [true, true, true, true],
              },
            ]);

            // Populate table rows with data
            group.forEach((item: any) => {
              tableData.push([
                {
                  text: item.position,
                  fillColor: '#FFFFFF',
                  border: [true, true, true, true],
                  alignment: 'center',
                  fontSize: 10,
                },
                {
                  text: item.name,
                  fillColor: '#FFFFFF',
                  border: [true, true, true, true],
                  alignment: 'center',
                  fontSize: 10,
                },
                {
                  text: category === '1' ? item.term : item.term,
                  fillColor: '#FFFFFF',
                  border: [true, true, true, true],
                  alignment: 'center',
                  fontSize: 10,
                },
                {
                  text: item.contact,
                  fillColor: '#FFFFFF',
                  border: [true, true, true, true],
                  alignment: 'center',
                  fontSize: 10,
                },
              ]);
            });

            const table = {
              margin: [0, 5, 0, 15],
              table: {
                widths: ['*', '*', '*', 'auto'],
                body: tableData,
              },
              layout: {
                hLineWidth: function (i: any, node: any) {
                  return 1;
                },
                vLineWidth: function (i: any, node: any) {
                  return 1;
                },
                hLineColor: function (i: any, node: any) {
                  return '#CCCCCC';
                },
                vLineColor: function (i: any, node: any) {
                  return '#CCCCCC';
                },
                paddingLeft: function (i: any, node: any) {
                  return 5;
                },
                paddingRight: function (i: any, node: any) {
                  return 5;
                },
                paddingTop: function (i: any, node: any) {
                  return 3;
                },
                paddingBottom: function (i: any, node: any) {
                  return 3;
                },
              },
            };

            data.push(table);
          }
        };

        // Generate tables for Elective officials (category 1)
        generateTablesForCategory(electiveOfficials, 'Elective Officials');

        // Generate tables for Appointed officials (category 2)
        generateTablesForCategory(appointedOfficials, 'Appointed Officials');
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        if (reports.length > 0) {
          let isPortrait = true; // Assuming portrait mode
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
        } else {
          this.Error();
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
        console.log(reports);
        data.push({
          text: 'List of Barangay Officials by Municipality/ City',
          bold: true,
          alignment: 'center',
        });

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

          // Add page break before each table (except the first one)
          if (data.length > 1) {
            data.push({ text: '', pageBreak: 'before' });
          }

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
          group.forEach((item: any) => {
            tableData.push([
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              },
              {
                text: item.punongBrgy,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.address,
                fillColor: '#FFFFFF',
              },
              {
                text: item.landArea,
                fillColor: '#FFFFFF',
              },
              {
                text: item.purokNo,
                fillColor: '#FFFFFF',
              },
            ]);
          });
          const table = {
            margin: [0, 10, 0, 0],
            table: {
              widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
              body: tableData,
            },
            layout: {
              hLineWidth: function (i: any, node: any) {
                return 0.5;
              },
              vLineWidth: function (i: any, node: any) {
                return 0.5;
              },
              hLineColor: function (i: any, node: any) {
                return '#000000';
              },
              vLineColor: function (i: any, node: any) {
                return '#000000';
              },
              paddingLeft: function (i: any, node: any) {
                return 4;
              },
              paddingRight: function (i: any, node: any) {
                return 4;
              },
              paddingTop: function (i: any, node: any) {
                return 2;
              },
              paddingBottom: function (i: any, node: any) {
                return 2;
              },
            },
          };

          data.push(table);

          // Add "End of Report" after each table
          data.push({
            text: '***End of Report***',
            alignment: 'left',
            margin: [0, 10, 0, 0],
            bold: true,
          });
        }
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        if (reports.length > 0) {
          let isPortrait = true;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
        } else {
          this.Error();
        }
      },
    });
  }
}
