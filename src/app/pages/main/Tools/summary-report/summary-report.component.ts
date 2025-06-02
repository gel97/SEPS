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
      case 'Revenue and Expenditures Report by Municipality/ City':
        this.FiscalMattersGeneratePDF();
        break;
      case 'Organization/ Staffing Patterns by Municipality/City':
        this.OrgStafGeneratePDF();
        break;
      case 'Demography':
        this.DemographyGeneratePDF();
        break;
      case 'List of Barangay Demography':
        this.DemographyBarangayGeneratePDF();
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
      // case 'List of Cooperatives by Municipality/City':
      //   this.CoopGeneratePdf();
      //   break;
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
      case 'List of Physical Environment Profile by Municipality/ City':
        this.EnvProfileGeneratePDF();
        break;
      case 'List of Natural/ Biological Resources by Municipality/ City':
        this.EnvBioGeneratePDF();
        break;
      case 'List of Urban Environment Quality by Municipality/ City':
        this.EnvUrbanGeneratePDF();
        break;
      case 'List of Environmental Hazards by Municipality/ City':
        this.EnvHazardGeneratePDF();
        break;
      case 'List of Social Condition and Vulnerability by Municipality/ City':
        this.EnvSocialGeneratePDF();
        break;
      case 'List of Environmental Activities by Municipality/ City':
        this.EnvActGeneratePDF();
        break;
      case 'List of Historical Disasters by Municipality/ City':
        this.EnvHistoricalGeneratePDF();
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
            widths: [25, 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
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
            widths: [25, 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: tableData,
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#CCCCCC',
            vLineColor: () => '#CCCCCC',
            fillColor: (rowIndex: number) =>
              rowIndex % 2 === 0 ? '#F5F5F5' : null,
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
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#CCCCCC',
            vLineColor: () => '#CCCCCC',
            fillColor: (rowIndex: number) =>
              rowIndex % 2 === 0 ? '#F5F5F5' : null,
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
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#CCCCCC',
            vLineColor: () => '#CCCCCC',
            fillColor: (rowIndex: number) =>
              rowIndex % 2 === 0 ? '#F5F5F5' : null,
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
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#CCCCCC',
            vLineColor: () => '#CCCCCC',
            fillColor: (rowIndex: number) =>
              rowIndex % 2 === 0 ? '#F5F5F5' : null,
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
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#CCCCCC',
            vLineColor: () => '#CCCCCC',
            fillColor: (rowIndex: number) =>
              rowIndex % 2 === 0 ? '#F5F5F5' : null,
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
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#CCCCCC',
            vLineColor: () => '#CCCCCC',
            fillColor: (rowIndex: number) =>
              rowIndex % 2 === 0 ? '#F5F5F5' : null,
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
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#CCCCCC',
            vLineColor: () => '#CCCCCC',
            fillColor: (rowIndex: number) =>
              rowIndex % 2 === 0 ? '#F5F5F5' : null,
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
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#CCCCCC',
            vLineColor: () => '#CCCCCC',
            fillColor: (rowIndex: number) =>
              rowIndex % 2 === 0 ? '#F5F5F5' : null,
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
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#CCCCCC',
            vLineColor: () => '#CCCCCC',
            fillColor: (rowIndex: number) =>
              rowIndex % 2 === 0 ? '#F5F5F5' : null,
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
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#CCCCCC',
            vLineColor: () => '#CCCCCC',
            fillColor: (rowIndex: number) =>
              rowIndex % 2 === 0 ? '#F5F5F5' : null,
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
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#CCCCCC',
            vLineColor: () => '#CCCCCC',
            fillColor: (rowIndex: number) =>
              rowIndex % 2 === 0 ? '#F5F5F5' : null,
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
            ],
            body: tableData,
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#CCCCCC',
            vLineColor: () => '#CCCCCC',
            fillColor: (rowIndex: number) =>
              rowIndex % 2 === 0 ? '#F5F5F5' : null,
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
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#CCCCCC',
            vLineColor: () => '#CCCCCC',
            fillColor: (rowIndex: number) =>
              rowIndex % 2 === 0 ? '#F5F5F5' : null,
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
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#CCCCCC',
            vLineColor: () => '#CCCCCC',
            fillColor: (rowIndex: number) =>
              rowIndex % 2 === 0 ? '#F5F5F5' : null,
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
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#CCCCCC',
            vLineColor: () => '#CCCCCC',
            fillColor: (rowIndex: number) =>
              rowIndex % 2 === 0 ? '#F5F5F5' : null,
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
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#CCCCCC',
            vLineColor: () => '#CCCCCC',
            fillColor: (rowIndex: number) =>
              rowIndex % 2 === 0 ? '#F5F5F5' : null,
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
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#CCCCCC',
            vLineColor: () => '#CCCCCC',
            fillColor: (rowIndex: number) =>
              rowIndex % 2 === 0 ? '#F5F5F5' : null,
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
            widths: [25, 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: tableData,
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#CCCCCC',
            vLineColor: () => '#CCCCCC',
            fillColor: (rowIndex: number) =>
              rowIndex % 2 === 0 ? '#F5F5F5' : null,
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
  CooperativesGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.params.menuId = '5';

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
            widths: [25, 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: tableData,
          },
          layout: {
            hLineWidth: (i: number, node: any) => 0.5,
            vLineWidth: (i: number, node: any) => 0.5,
            hLineColor: (i: number, node: any) => '#000000',
            vLineColor: (i: number, node: any) => '#000000',
            paddingLeft: (i: number, node: any) => 4,
            paddingRight: (i: number, node: any) => 4,
            paddingTop: (i: number, node: any) => 2,
            paddingBottom: (i: number, node: any) => 2,
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
            widths: [
              25,
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
            hLineWidth: (i: number, node: any) => 0.5,
            vLineWidth: (i: number, node: any) => 0.5,
            hLineColor: (i: number, node: any) => '#000000',
            vLineColor: (i: number, node: any) => '#000000',
            paddingLeft: (i: number, node: any) => 4,
            paddingRight: (i: number, node: any) => 4,
            paddingTop: (i: number, node: any) => 2,
            paddingBottom: (i: number, node: any) => 2,
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
            widths: [
              25,
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
            hLineWidth: (i: number, node: any) => 0.5,
            vLineWidth: (i: number, node: any) => 0.5,
            hLineColor: (i: number, node: any) => '#000000',
            vLineColor: (i: number, node: any) => '#000000',
            paddingLeft: (i: number, node: any) => 4,
            paddingRight: (i: number, node: any) => 4,
            paddingTop: (i: number, node: any) => 2,
            paddingBottom: (i: number, node: any) => 2,
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
            widths: [
              25,
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
            hLineWidth: (i: number, node: any) => 0.5,
            vLineWidth: (i: number, node: any) => 0.5,
            hLineColor: (i: number, node: any) => '#000000',
            vLineColor: (i: number, node: any) => '#000000',
            paddingLeft: (i: number, node: any) => 4,
            paddingRight: (i: number, node: any) => 4,
            paddingTop: (i: number, node: any) => 2,
            paddingBottom: (i: number, node: any) => 2,
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
          layout: {
            hLineWidth: (i: number, node: any) => 0.5,
            vLineWidth: (i: number, node: any) => 0.5,
            hLineColor: (i: number, node: any) => '#000000',
            vLineColor: (i: number, node: any) => '#000000',
            paddingLeft: (i: number, node: any) => 4,
            paddingRight: (i: number, node: any) => 4,
            paddingTop: (i: number, node: any) => 2,
            paddingBottom: (i: number, node: any) => 2,
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
          layout: {
            hLineWidth: (i: number, node: any) => 0.5,
            vLineWidth: (i: number, node: any) => 0.5,
            hLineColor: (i: number, node: any) => '#000000',
            vLineColor: (i: number, node: any) => '#000000',
            paddingLeft: (i: number, node: any) => 4,
            paddingRight: (i: number, node: any) => 4,
            paddingTop: (i: number, node: any) => 2,
            paddingBottom: (i: number, node: any) => 2,
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
          layout: {
            hLineWidth: (i: number, node: any) => 0.5,
            vLineWidth: (i: number, node: any) => 0.5,
            hLineColor: (i: number, node: any) => '#000000',
            vLineColor: (i: number, node: any) => '#000000',
            paddingLeft: (i: number, node: any) => 4,
            paddingRight: (i: number, node: any) => 4,
            paddingTop: (i: number, node: any) => 2,
            paddingBottom: (i: number, node: any) => 2,
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
  SettlersGeneratePDF() {
    let data: any = [];
    let grandTotal: any = {};
    let reports: any = [];
    const tableData: any = [];

    this.reportService.GetHousingSettlersReport(this.params).subscribe({
      next: (response: any = {}) => {
        reports = response.data;
        grandTotal = response.grandTotal;

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
          { text: '#', bold: true, alignment: 'center', width: 20 },
          { text: 'Location', bold: true, alignment: 'center' },
          { text: 'Barangay', bold: true, alignment: 'center' },
          { text: 'No. of Dwelling Units', bold: true, alignment: 'center' },
          { text: 'No. of Families', bold: true, alignment: 'center' },
          { text: 'Remarks', bold: true, alignment: 'center' },
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
              { text: index2 + 1, alignment: 'center', width: 20 },
              { text: b.location },
              { text: b.brgyName },
              { text: b.unitsNo, alignment: 'center' },
              { text: b.familiesNo, alignment: 'center' },
              { text: b.remarks },
            ]);
          });

          tableData.push([
            { text: 'SUBTOTAL', colSpan: 2, marginLeft: 5 },
            {},
            { text: a.subtotal.brgyCount },
            { text: a.subtotal.unitsNo, alignment: 'center' },
            { text: a.subtotal.familiesNo, alignment: 'center' },
            { text: '' },
          ]);
        });

        tableData.push([
          { text: 'GRANDTOTAL', bold: true, colSpan: 2, marginLeft: 5 },
          {},
          { text: grandTotal.brgyCount },
          { text: grandTotal.unitsNo, alignment: 'center' },
          { text: grandTotal.familiesNo, alignment: 'center' },
          { text: '' },
        ]);

        const table = {
          margin: [0, 10, 0, 0],
          table: {
            // Adjust the widths to fit the page
            widths: [25, 'auto', 'auto', 'auto', 'auto', 'auto'],
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
              return 3;
            },
            paddingRight: function (_i: any, node: any) {
              return 3;
            },
            paddingTop: function (_i: any, node: any) {
              return 1;
            },
            paddingBottom: function (_i: any, node: any) {
              return 1;
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
          layout: {
            hLineWidth: (i: number, node: any) => 0.5,
            vLineWidth: (i: number, node: any) => 0.5,
            hLineColor: (i: number, node: any) => '#000000',
            vLineColor: (i: number, node: any) => '#000000',
            paddingLeft: (i: number, node: any) => 4,
            paddingRight: (i: number, node: any) => 4,
            paddingTop: (i: number, node: any) => 2,
            paddingBottom: (i: number, node: any) => 2,
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
  TanodGeneratePDF() {
    let data: any = [];
    let grandTotal: any = {};
    let reports: any = [];
    let columnLenght: number = 0;

    const tableData: any = [];

    this.reportService.GetSafetyTanodReport(this.params).subscribe({
      next: (response: any = {}) => {
        // Check if response contains data
        if (!response.data || !response.grandTotal) {
          console.error(
            'Error: No data or grand total in the response',
            response
          );
          return;
        }

        reports = response.data;
        grandTotal = response.grandTotal;

        console.log('Report data: ', reports);

        // Add title and year
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

        // Table header
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

        // Process each report
        reports.forEach((a: any) => {
          let columnWidth: number = 0;
          a.data.forEach((b: any, index: number) => {
            let row: any = [];
            for (let key in b) {
              let value: any = b[key];
              if (index === 0) {
                columnWidth++;
              }
              row.push({
                text: key === 'munCityId' ? (index + 1).toString() : value,
                fillColor: '#ffffff',
                alignment: key === 'munCityName' ? 'left' : 'center',
              });
            }

            // Add district header
            if (index === 0) {
              tableData.push([
                {
                  text: `${
                    a.district === 1 ? '1st' : '2nd'
                  } Congressional District`,
                  colSpan: columnWidth,
                  alignment: 'left',
                  fillColor: '#526D82',
                },
                ...new Array(columnWidth - 1).fill({}),
              ]);
              columnLenght = columnWidth;
            }

            tableData.push(row);
          });

          // Add subtotal
          let subTotalRow: any = [];
          for (let key in a.subTotal) {
            if (key === 'subTotal') {
              subTotalRow.push({
                text: `Subtotal`,
                fillColor: '#9DB2BF',
                alignment: 'left',
                colSpan: 2,
              });
              subTotalRow.push({}); // Empty column for colspan
            } else {
              subTotalRow.push({
                text: a.subTotal[key],
                fillColor: '#9DB2BF',
                alignment: 'center',
              });
            }
          }
          tableData.push(subTotalRow);
        });

        // Add grand total
        let grandTotalRow: any = [];
        for (let key in grandTotal) {
          if (key === 'grandTotal') {
            grandTotalRow.push({
              text: `Grand Total`,
              fillColor: '#F1C93B',
              alignment: 'left',
              colSpan: 2,
            });
            grandTotalRow.push({}); // Empty column for colspan
          } else {
            grandTotalRow.push({
              text: grandTotal[key],
              fillColor: '#F1C93B',
              alignment: 'center',
            });
          }
        }
        tableData.push(grandTotalRow);

        // Set column widths
        let widths: any = [20, '*', '*', '*'];

        // Define table layout
        const table = {
          margin: [0, 10, 0, 0],
          table: {
            widths: widths,
            body: tableData,
          },
          layout: {
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
            hLineColor: () => '#000000',
            vLineColor: () => '#000000',
            paddingLeft: () => 4,
            paddingRight: () => 4,
            paddingTop: () => 2,
            paddingBottom: () => 2,
          },
        };

        data.push(table);
      },
      error: (error: any) => {
        console.log('Error occurred: ', error);
      },
      complete: () => {
        if (reports.length > 0) {
          let isPortrait = false; // Generate in landscape mode
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log('PDF data:', data); // Debug the generated PDF content
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
          layout: {
            hLineWidth: (i: number, node: any) => 0.5,
            vLineWidth: (i: number, node: any) => 0.5,
            hLineColor: (i: number, node: any) => '#000000',
            vLineColor: (i: number, node: any) => '#000000',
            paddingLeft: (i: number, node: any) => 4,
            paddingRight: (i: number, node: any) => 4,
            paddingTop: (i: number, node: any) => 2,
            paddingBottom: (i: number, node: any) => 2,
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
          layout: {
            hLineWidth: (i: number, node: any) => 0.5,
            vLineWidth: (i: number, node: any) => 0.5,
            hLineColor: (i: number, node: any) => '#000000',
            vLineColor: (i: number, node: any) => '#000000',
            paddingLeft: (i: number, node: any) => 4,
            paddingRight: (i: number, node: any) => 4,
            paddingTop: (i: number, node: any) => 2,
            paddingBottom: (i: number, node: any) => 2,
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
          layout: {
            hLineWidth: (i: number, node: any) => 0.5,
            vLineWidth: (i: number, node: any) => 0.5,
            hLineColor: (i: number, node: any) => '#000000',
            vLineColor: (i: number, node: any) => '#000000',
            paddingLeft: (i: number, node: any) => 4,
            paddingRight: (i: number, node: any) => 4,
            paddingTop: (i: number, node: any) => 2,
            paddingBottom: (i: number, node: any) => 2,
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
  PWDGeneratePDF() {
    let reports: any = [];
    let data: any = [];
    let dist1: any = [];
    let dist2: any = [];
    let contentData: any = [];
    let columns: any = [];
    let grandTotal: any = [];
    let _grandTotal: any = [];

    const maxColumnsPerPage = 10;

    this.reportService.GetHealthHandiReport(this.params).subscribe({
      next: (response: any = {}) => {
        reports = response.data;
        dist1 = response.districtOne;
        dist2 = response.districtTwo;
        columns = response.columns;
        grandTotal = response.grandTotal;

        console.log(response);
        data.push({
          text: `Persons with Disability for the year ${response.year}`,
          fontSize: 14,
          bold: true,
          alignment: 'center',
          margin: [0, 20],
        });

        // Split columns into chunks of maxColumnsPerPage
        for (let i = 0; i < columns.length; i += maxColumnsPerPage) {
          const chunkColumns = columns.slice(i, i + maxColumnsPerPage);
          let columnWidth: any = ['auto'];
          let columnsData: any = [
            {
              text: 'Municipality/City',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              fontSize: 8,
            },
          ];

          chunkColumns.forEach((b: any) => {
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

          const tableData: any = [];
          tableData.push(columnsData); // Push column headers

          reports.forEach((a: any) => {
            if (a.district === 1) {
              tableData.push([
                {
                  text: `1st Congressional District`,
                  fontSize: 8,
                  colSpan: columnWidth.length,
                  alignment: 'left',
                  fillColor: '#526D82',
                },
              ]);

              dist1.forEach((b: any) => {
                let _data = [{ text: b.munCityName, fontSize: 8 }];

                chunkColumns.forEach((c: any) => {
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

              let subTotal: any = [
                { text: 'SUBTOTAL', fontSize: 8, fillColor: '#9DB2BF' },
              ];
              chunkColumns.forEach((c: any) => {
                let count = '-';
                a.subTotal.forEach((d: any) => {
                  if (d.type === c.recNo) {
                    count = d.total;
                  }
                });
                subTotal.push({
                  text: count,
                  fontSize: 8,
                  fillColor: '#9DB2BF',
                });
              });

              tableData.push(subTotal);
            } else {
              tableData.push([
                {
                  text: `2nd Congressional District`,
                  fontSize: 8,
                  colSpan: columnWidth.length,
                  alignment: 'left',
                  fillColor: '#526D82',
                },
              ]);

              dist2.forEach((b: any) => {
                let _data = [{ text: b.munCityName, fontSize: 8 }];

                chunkColumns.forEach((c: any) => {
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

              let subTotal: any = [
                { text: 'SUBTOTAL', fontSize: 8, fillColor: '#9DB2BF' },
              ];
              chunkColumns.forEach((c: any) => {
                let count = '-';
                a.subTotal.forEach((d: any) => {
                  if (d.type === c.recNo) {
                    count = d.total;
                  }
                });
                subTotal.push({
                  text: count,
                  fontSize: 8,
                  fillColor: '#9DB2BF',
                });
              });

              tableData.push(subTotal);
            }
          });

          // Add grand total
          let _grandTotal: any = [
            { text: 'GRANDTOTAL', fontSize: 8, fillColor: '#F1C93B' },
          ];
          chunkColumns.forEach((c: any) => {
            let count = '-';
            grandTotal.forEach((d: any) => {
              if (d.type === c.recNo) {
                count = d.total;
              }
            });
            _grandTotal.push({
              text: count,
              fontSize: 8,
              fillColor: '#F1C93B',
            });
          });

          tableData.push(_grandTotal);

          // Add each chunked table to contentData with page breaks
          contentData.push({
            margin: [0, 10, 0, 0],
            table: {
              widths: columnWidth,
              body: tableData,
            },
            pageBreak: i + maxColumnsPerPage < columns.length ? 'after' : '', // Add page break if more chunks are left
          });
        }

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
          layout: {
            hLineWidth: (i: number, node: any) => 0.5,
            vLineWidth: (i: number, node: any) => 0.5,
            hLineColor: (i: number, node: any) => '#000000',
            vLineColor: (i: number, node: any) => '#000000',
            paddingLeft: (i: number, node: any) => 4,
            paddingRight: (i: number, node: any) => 4,
            paddingTop: (i: number, node: any) => 2,
            paddingBottom: (i: number, node: any) => 2,
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
            ],
            body: tableData,
          },
          layout: {
            hLineWidth: (i: number, node: any) => 0.5,
            vLineWidth: (i: number, node: any) => 0.5,
            hLineColor: (i: number, node: any) => '#000000',
            vLineColor: (i: number, node: any) => '#000000',
            paddingLeft: (i: number, node: any) => 4,
            paddingRight: (i: number, node: any) => 4,
            paddingTop: (i: number, node: any) => 2,
            paddingBottom: (i: number, node: any) => 2,
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
            widths: [25, 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: tableData,
          },
          layout: {
            hLineWidth: (i: number, node: any) => 0.5,
            vLineWidth: (i: number, node: any) => 0.5,
            hLineColor: (i: number, node: any) => '#000000',
            vLineColor: (i: number, node: any) => '#000000',
            paddingLeft: (i: number, node: any) => 4,
            paddingRight: (i: number, node: any) => 4,
            paddingTop: (i: number, node: any) => 2,
            paddingBottom: (i: number, node: any) => 2,
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
          layout: {
            hLineWidth: (i: number, node: any) => 0.5,
            vLineWidth: (i: number, node: any) => 0.5,
            hLineColor: (i: number, node: any) => '#000000',
            vLineColor: (i: number, node: any) => '#000000',
            paddingLeft: (i: number, node: any) => 4,
            paddingRight: (i: number, node: any) => 4,
            paddingTop: (i: number, node: any) => 2,
            paddingBottom: (i: number, node: any) => 2,
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
          layout: {
            hLineWidth: (i: number, node: any) => 0.5,
            vLineWidth: (i: number, node: any) => 0.5,
            hLineColor: (i: number, node: any) => '#000000',
            vLineColor: (i: number, node: any) => '#000000',
            paddingLeft: (i: number, node: any) => 4,
            paddingRight: (i: number, node: any) => 4,
            paddingTop: (i: number, node: any) => 2,
            paddingBottom: (i: number, node: any) => 2,
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
          layout: {
            hLineWidth: (i: number, node: any) => 0.5,
            vLineWidth: (i: number, node: any) => 0.5,
            hLineColor: (i: number, node: any) => '#000000',
            vLineColor: (i: number, node: any) => '#000000',
            paddingLeft: (i: number, node: any) => 4,
            paddingRight: (i: number, node: any) => 4,
            paddingTop: (i: number, node: any) => 2,
            paddingBottom: (i: number, node: any) => 2,
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
          layout: {
            hLineWidth: (i: number, node: any) => 0.5,
            vLineWidth: (i: number, node: any) => 0.5,
            hLineColor: (i: number, node: any) => '#000000',
            vLineColor: (i: number, node: any) => '#000000',
            paddingLeft: (i: number, node: any) => 4,
            paddingRight: (i: number, node: any) => 4,
            paddingTop: (i: number, node: any) => 2,
            paddingBottom: (i: number, node: any) => 2,
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
    let columnLength: number = 0;

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
              text: 'Tertiary Graduates by Municipality/City',
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
              text: 'Summary',
              fontSize: 12,
              bold: true,
            },
          ],
        });

        // Define the table header with black background and white text
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

        // Populate the table rows without blue background
        summary.forEach((a: any, index: any) => {
          tableData.push([
            {
              text: index + 1,
              marginLeft: 2,
              fillColor: '#FFFFFF', // White background
            },
            {
              text: a.program,
              fillColor: '#FFFFFF', // White background
            },
            {
              text: a.male,
              alignment: 'center',
              fillColor: '#FFFFFF', // White background
            },
            {
              text: a.female,
              alignment: 'center',
              fillColor: '#FFFFFF', // White background
            },
            {
              text: a.total,
              alignment: 'center',
              fillColor: '#FFFFFF', // White background
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
            layout: {
              hLineWidth: function (i: number, node: any) {
                return 1; // Horizontal line width
              },
              vLineWidth: function (i: number, node: any) {
                return 1; // Vertical line width
              },
              hLineColor: function (i: number, node: any) {
                return 'black'; // Horizontal line color
              },
              vLineColor: function (i: number, node: any) {
                return 'black'; // Vertical line color
              },
            },
            pageBreak: 'after',
          },
        ]);

        reports.forEach((a: any, index: any) => {
          let newTableData: any = [];
          contentData.push([{ text: a.munCityName, bold: true }]);

          // Define the table header for each municipality/city
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

          // Populate the table rows without blue background
          a.data.forEach((b: any, i: any) => {
            newTableData.push([
              {
                text: i + 1,
                marginLeft: 2,
                fillColor: '#FFFFFF', // White background
              },
              {
                text: b.program,
                fillColor: '#FFFFFF', // White background
              },
              {
                text: b.male,
                alignment: 'center',
                fillColor: '#FFFFFF', // White background
              },
              {
                text: b.female,
                alignment: 'center',
                fillColor: '#FFFFFF', // White background
              },
              {
                text: b.total,
                alignment: 'center',
                fillColor: '#FFFFFF', // White background
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
              layout: {
                hLineWidth: function (i: number, node: any) {
                  return 1;
                },
                vLineWidth: function (i: number, node: any) {
                  return 1;
                },
                hLineColor: function (i: number, node: any) {
                  return 'black';
                },
                vLineColor: function (i: number, node: any) {
                  return 'black';
                },
              },
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
          layout: {
            hLineWidth: (i: number, node: any) => 0.5,
            vLineWidth: (i: number, node: any) => 0.5,
            hLineColor: (i: number, node: any) => '#000000',
            vLineColor: (i: number, node: any) => '#000000',
            paddingLeft: (i: number, node: any) => 4,
            paddingRight: (i: number, node: any) => 4,
            paddingTop: (i: number, node: any) => 2,
            paddingBottom: (i: number, node: any) => 2,
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
          layout: {
            hLineWidth: (i: number, node: any) => 0.5,
            vLineWidth: (i: number, node: any) => 0.5,
            hLineColor: (i: number, node: any) => '#000000',
            vLineColor: (i: number, node: any) => '#000000',
            paddingLeft: (i: number, node: any) => 4,
            paddingRight: (i: number, node: any) => 4,
            paddingTop: (i: number, node: any) => 2,
            paddingBottom: (i: number, node: any) => 2,
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
          layout: {
            hLineWidth: (i: number, node: any) => 0.5,
            vLineWidth: (i: number, node: any) => 0.5,
            hLineColor: (i: number, node: any) => '#000000',
            vLineColor: (i: number, node: any) => '#000000',
            paddingLeft: (i: number, node: any) => 4,
            paddingRight: (i: number, node: any) => 4,
            paddingTop: (i: number, node: any) => 2,
            paddingBottom: (i: number, node: any) => 2,
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
          layout: {
            hLineWidth: (i: number, node: any) => 0.5,
            vLineWidth: (i: number, node: any) => 0.5,
            hLineColor: (i: number, node: any) => '#000000',
            vLineColor: (i: number, node: any) => '#000000',
            paddingLeft: (i: number, node: any) => 4,
            paddingRight: (i: number, node: any) => 4,
            paddingTop: (i: number, node: any) => 2,
            paddingBottom: (i: number, node: any) => 2,
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
          layout: {
            hLineWidth: (i: number, node: any) => 0.5,
            vLineWidth: (i: number, node: any) => 0.5,
            hLineColor: (i: number, node: any) => '#000000',
            vLineColor: (i: number, node: any) => '#000000',
            paddingLeft: (i: number, node: any) => 4,
            paddingRight: (i: number, node: any) => 4,
            paddingTop: (i: number, node: any) => 2,
            paddingBottom: (i: number, node: any) => 2,
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
          layout: {
            hLineWidth: (i: number, node: any) => 0.5,
            vLineWidth: (i: number, node: any) => 0.5,
            hLineColor: (i: number, node: any) => '#000000',
            vLineColor: (i: number, node: any) => '#000000',
            paddingLeft: (i: number, node: any) => 4,
            paddingRight: (i: number, node: any) => 4,
            paddingTop: (i: number, node: any) => 2,
            paddingBottom: (i: number, node: any) => 2,
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
          layout: {
            fillcolor: (rowIndex: number, node: any, columnIndex: number) => {
              return rowIndex === 0 ? 'black' : null;
            },
            hLineWidth: (i: number, node: any) => 0.5,
            vLineWidth: (i: number, node: any) => 0.5,
            hLineColor: (i: number, node: any) => '#000000',
            vLineColor: (i: number, node: any) => '#000000',
            paddingLeft: (i: number, node: any) => 4,
            paddingRight: (i: number, node: any) => 4,
            paddingTop: (i: number, node: any) => 2,
            paddingBottom: (i: number, node: any) => 2,
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
          layout: {
            fillcolor: (rowIndex: number, node: any, columnIndex: number) => {
              return rowIndex === 0 ? 'black' : null;
            },
            hLineWidth: (i: number, node: any) => 0.5,
            vLineWidth: (i: number, node: any) => 0.5,
            hLineColor: (i: number, node: any) => '#000000',
            vLineColor: (i: number, node: any) => '#000000',
            paddingLeft: (i: number, node: any) => 4,
            paddingRight: (i: number, node: any) => 4,
            paddingTop: (i: number, node: any) => 2,
            paddingBottom: (i: number, node: any) => 2,
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
          layout: {
            hLineWidth: (i: number, node: any) => 0.5,
            vLineWidth: (i: number, node: any) => 0.5,
            hLineColor: (i: number, node: any) => '#000000',
            vLineColor: (i: number, node: any) => '#000000',
            paddingLeft: (i: number, node: any) => 4,
            paddingRight: (i: number, node: any) => 4,
            paddingTop: (i: number, node: any) => 2,
            paddingBottom: (i: number, node: any) => 2,
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
          layout: {
            hLineWidth: (i: number, node: any) => {
              return i === 0 || i === 1 || i === node.table.body.length ? 2 : 1;
            },
            vLineWidth: (i: number, node: any) => {
              return 1;
            },
            hLineColor: (i: number, node: any) => {
              return 'black';
            },
            vLineColor: (i: number, node: any) => {
              return 'black';
            },
            paddingLeft: (i: number, node: any) => {
              return i === 0 ? 0 : 8;
            },
            paddingRight: (i: number, node: any) => {
              return i === node.table.widths.length - 1 ? 0 : 8;
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
          layout: {
            hLineWidth: (i: number, node: any) => {
              return i === 0 || i === 1 || i === node.table.body.length ? 2 : 1;
            },
            vLineWidth: (i: number, node: any) => {
              return 1;
            },
            hLineColor: (i: number, node: any) => {
              return 'black';
            },
            vLineColor: (i: number, node: any) => {
              return 'black';
            },
            paddingLeft: (i: number, node: any) => {
              return i === 0 ? 0 : 8;
            },
            paddingRight: (i: number, node: any) => {
              return i === node.table.widths.length - 1 ? 0 : 8;
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

        console.log('dist2Group ', dist2Group);

        // Define the table header
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
            border: [true, true, true, true],
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
          layout: {
            hLineWidth: (i: number, node: any) => {
              return i === 0 || i === 1 || i === node.table.body.length ? 2 : 1;
            },
            vLineWidth: (i: number, node: any) => {
              return 1;
            },
            hLineColor: (i: number, node: any) => {
              return 'black';
            },
            vLineColor: (i: number, node: any) => {
              return 'black';
            },
            paddingLeft: (i: number, node: any) => {
              return i === 0 ? 0 : 8;
            },
            paddingRight: (i: number, node: any) => {
              return i === node.table.widths.length - 1 ? 0 : 8;
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

  LivestockGeneratePDF() {
    let data: any = [];
    let grandTotal: any = {};
    let reports: any = [];
    let columnLength: number = 0;
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

        // Header Row
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

                columnLength = columnWidth - 1;
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
        for (let index = 0; index < columnLength; index++) {
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
          layout: {
            fillColor: (rowIndex: number, node: any, columnIndex: number) => {
              return rowIndex % 2 === 0 ? '#f5f5f5' : null; // Alternating row color
            },
            hLineColor: (i: number, node: any, columnIndex: number) => {
              return '#000000'; // Horizontal line color
            },
            vLineColor: (i: number, node: any, columnIndex: number) => {
              return '#000000'; // Vertical line color
            },
            hLineWidth: (i: number, node: any, columnIndex: number) => {
              return 1; // Horizontal line width
            },
            vLineWidth: (i: number, node: any, columnIndex: number) => {
              return 1; // Vertical line width
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

  FisheriesGeneratePDF() {
    let grandTotal: any = {};
    let district1: any = [];
    let district2: any = [];
    let columnTypes: any = [];
    let reports: any = [];

    const chunkSize = 5; // Limit of columns per page
    const tableData: any = [];
    this.params.menuId = '3';

    this.reportService.GetAgricultureReport(this.params).subscribe({
      next: (response: any = {}) => {
        reports = response.data || [];
        grandTotal = response.grandTotal || [];
        district1 = response.districtOne || [];
        district2 = response.districtTwo || [];
        columnTypes = response.columnTypes || [];

        console.log('API Response:', response);

        // Safe access to setYear
        const year = reports.length > 0 ? reports[0]?.setYear ?? 'N/A' : 'N/A';

        // Define a type for table cells
        interface TableCell {
          text?: string;
          fillColor?: string;
          color?: string;
          bold?: boolean;
          alignment?: string;
          colSpan?: number;
          rowSpan?: number;
          marginLeft?: number;
          fontSize?: number;
        }

        // Add header section to tableData
        tableData.push({
          margin: [0, 20, 0, 0],
          columns: [
            {
              text: `List of Environmental Activities by Municipality/ City`,
              fontSize: 14,
              bold: true,
            },
          ],
        });

        // Divide columnTypes into chunks based on chunkSize
        const columnChunks = [];
        for (let i = 0; i < columnTypes.length; i += chunkSize) {
          columnChunks.push(columnTypes.slice(i, i + chunkSize));
        }

        // Generate table for each chunk
        columnChunks.forEach((limitedColumnTypes, chunkIndex) => {
          const tableDataChunk: TableCell[][] = [];

          // Define the headerRow with typeName
          const headerRow: TableCell[] = [
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
          ];

          // Define the subHeaderRow with Total Production and Area Harvested
          const subHeaderRow: TableCell[] = [
            { text: '', fillColor: 'black' }, // Empty for alignment
            { text: '', fillColor: 'black' },
          ];

          limitedColumnTypes.forEach((type: { typeName: string }) => {
            headerRow.push(
              {
                text: type.typeName,
                fillColor: 'black',
                color: 'white',
                bold: true,
                alignment: 'center',
                colSpan: 2, // Span across Total Production and Area Harvested
              },
              { text: '', fillColor: 'black' } // Placeholder for alignment
            );

            subHeaderRow.push(
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
              }
            );
          });

          // Push header and sub-header rows into tableDataChunk
          tableDataChunk.push(headerRow, subHeaderRow);

          // Function to add district data to tableDataChunk
          const addDistrictData = (district: any[], districtLabel: string) => {
            if (district.length > 0) {
              tableDataChunk.push([
                {
                  text: `${districtLabel}`,
                  colSpan: headerRow.length,
                  alignment: 'left',
                  fillColor: '#526D82',
                },
                {}, // Empty cell to match colspan
              ]);
            }

            let sub: any = [
              {
                text: 'SUBTOTAL',
                fillColor: '#9DB2BF',
                colSpan: 2,
                marginLeft: 2,
              },
              {},
            ];

            district.forEach((b: any, i: any) => {
              let d1: any = [
                { text: i + 1, marginLeft: 2 },
                { text: b.munCityName },
              ];

              limitedColumnTypes.forEach((c: any) => {
                let prod: any = '-';
                let area: any = '-';
                let subprod: any = '-';
                let subarea: any = '-';

                reports.forEach((a: any) => {
                  if (a.district === (districtLabel.includes('1st') ? 1 : 2)) {
                    a.data.forEach((d: any) => {
                      if (c.recNo == d.type) {
                        d.typeData.forEach((e: any) => {
                          if (b.munCityId == e.munCityId) {
                            prod = e.totalProd ? e.totalProd.toFixed(2) : '-';
                            area = e.area ? e.area.toFixed(2) : '-';
                          }
                        });
                        subprod = d.subtotalProd
                          ? d.subtotalProd.toFixed(2)
                          : '-';
                        subarea = d.subtotalArea
                          ? d.subtotalArea.toFixed(2)
                          : '-';
                      }
                    });
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
                    {
                      text: subarea,
                      fillColor: '#9DB2BF',
                      alignment: 'center',
                    }
                  );
                }
              });
              tableDataChunk.push(d1);
            });

            if (district.length > 0) {
              tableDataChunk.push(sub);
            }
          };

          // Add data for each district
          addDistrictData(district1, '1st Congressional District');
          addDistrictData(district2, '2nd Congressional District');

          // Add grand total
          let grand: any = [
            {
              text: 'GRANDTOTAL',
              fillColor: '#F1C93B',
              colSpan: 2,
              marginLeft: 2,
            },
            {},
          ];
          limitedColumnTypes.forEach((a: any) => {
            let prod: any = '-';
            let area: any = '-';
            grandTotal.forEach((b: any) => {
              if (a.recNo == b.type) {
                prod = b.totalProd ? b.totalProd.toFixed(2) : '-';
                area = b.area ? b.area.toFixed(2) : '-';
              }
            });

            grand.push(
              { text: prod, fillColor: '#F1C93B', alignment: 'center' },
              { text: area, fillColor: '#F1C93B', alignment: 'center' }
            );
          });

          tableDataChunk.push(grand);

          // Define the table for this chunk
          const table = {
            margin: [0, 10, 0, 0],
            table: {
              widths: Array(headerRow.length).fill('auto'), // Ensure this matches the number of columns
              body: tableDataChunk,
              headerRows: 2, // Changed to 2 to match header rows
              layout: {
                fillColor: function (rowIndex: number, node: any) {
                  return rowIndex === 0 ? '#CCCCCC' : null;
                },
                hLineWidth: function (
                  i: number,
                  node: { table: { body: string | any[] } }
                ) {
                  return i === 0 || i === node.table.body.length ? 2 : 1;
                },
                vLineWidth: function (
                  i: number,
                  node: { table: { widths: string | any[] } }
                ) {
                  return i === 0 || i === node.table.widths.length ? 2 : 1;
                },
                hLineColor: function (_i: any, node: any) {
                  return '#999999';
                },
                vLineColor: function (_i: any, node: any) {
                  return '#999999';
                },
              },
            },
            pageBreak: chunkIndex > 0 ? 'before' : undefined, // Add a page break before each chunk except the first
            // Custom page size and margins
            pageSize: 'A4',
            pageMargins: [40, 60, 40, 60], // Top, Right, Bottom, Left margins
          };

          tableData.push(table);
        });
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(tableData, isPortrait, this.remarks);
          console.log(tableData);
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
        const borderLayout = {
          hlineWidth: function (i: any, node: any) {
            return 1;
          },
          vlineWidth: function (i: any, node: any) {
            return 1;
          },
          hlineColor: function (i: any, node: any) {
            return '#000000';
          },
          vlineColor: function (i: any, node: any) {
            return '#000000';
          },
          paddingLeft: function (i: any, node: any) {
            return i === 0 ? 0 : 8;
          },
          paddingRight: function (i: any, node: any) {
            return i === 0 ? 0 : 8;
          },
          paddingTop: function (i: any, node: any) {
            return i === 0 ? 0 : 8;
          },
          paddingBottom: function (i: any, node: any) {
            return i === 0 ? 0 : 8;
          },
        };
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
            layout: 'borderLayout',
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
              layout: 'borderLayout',
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
              layout: 'borderLayout',
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

        console.log('dist2Group ', dist2);

        // Add table headers
        tableData.push([
          {
            text: '#',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            border: [true, true, true, true], // Add borders
          },
          {
            text: 'Name of Fiesta/ Festival',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            border: [true, true, true, true], // Add borders
          },
          {
            text: 'Contact Person/ Designation',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            border: [true, true, true, true], // Add borders
          },
          {
            text: 'Contact Details',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            border: [true, true, true, true], // Add borders
          },
          {
            text: 'Barangay',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            border: [true, true, true, true], // Add borders
          },
          {
            text: 'Brief Description',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            border: [true, true, true, true], // Add borders
          },
        ]);

        // 1st Congressional District
        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 6,
            alignment: 'left',
            fillColor: '#526D82',
            border: [true, true, true, true], // Add borders
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
              border: [true, true, true, true], // Add borders
            },
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                border: [true, true, true, true], // Add borders
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
                border: [true, true, true, true], // Add borders
              },
              {
                text: item.contactPerson,
                fillColor: '#FFFFFF',
                border: [true, true, true, true], // Add borders
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
                border: [true, true, true, true], // Add borders
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
                border: [true, true, true, true], // Add borders
              },
              {
                text: item.description,
                fillColor: '#FFFFFF',
                border: [true, true, true, true], // Add borders
              },
            ]);
          });
        }

        // 2nd Congressional District
        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 6,
            alignment: 'left',
            fillColor: '#526D82',
            border: [true, true, true, true], // Add borders
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
              border: [true, true, true, true], // Add borders
            },
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                border: [true, true, true, true], // Add borders
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
                border: [true, true, true, true], // Add borders
              },
              {
                text: item.contactPerson,
                fillColor: '#FFFFFF',
                border: [true, true, true, true], // Add borders
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
                border: [true, true, true, true], // Add borders
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
                border: [true, true, true, true], // Add borders
              },
              {
                text: item.description,
                fillColor: '#FFFFFF',
                border: [true, true, true, true], // Add borders
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
        this.pdfService.GeneratePdf(data, isPortrait, '');
        console.log(data);
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
    this.params.menuId = '1';
    let data: any = [];
    const columnsData: any = [];
    const columnsWidth: any = [];
    let countWidth: number = 0;
    let reports: any = [];
    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    countWidth = 5; // Adjust the number of columns here
    columnsData.push(
      { text: '#', bold: true, alignment: 'center' },
      { text: 'Name of Resort', bold: true, alignment: 'center' },
      { text: 'Contact Details', bold: true, alignment: 'center' },
      { text: 'Barangay', bold: true, alignment: 'center' },
      { text: 'Amenities/Remarks', bold: true, alignment: 'center' }
    );

    for (let index = 0; index < countWidth; index++) {
      if (index === 0) {
        columnsWidth.push(25);
      } else {
        columnsWidth.push('auto'); // Let the library auto-calculate width based on content
      }
    }

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

        tableData.push(columnsData);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: countWidth,
            alignment: 'left',
            fillColor: '#526D82', // Blue color
          },
          ...Array(countWidth - 1).fill({}),
        ]);

        for (const groupKey1 in dist1Group) {
          const group1 = dist1Group[groupKey1];
          tableData.push([
            {
              text: groupKey1,
              colSpan: countWidth,
              alignment: 'left',
              fillColor: '#526D82',
            },
            ...Array(countWidth - 1).fill({}),
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              { text: index + 1 },
              { text: item.name },
              { text: item.contactNo },
              { text: item.brgyName },
              { text: item.description },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: countWidth,
            alignment: 'left',
            fillColor: '#526D82', // Blue color
          },
          ...Array(countWidth - 1).fill({}),
        ]);

        for (const groupKey2 in dist2Group) {
          const group2 = dist2Group[groupKey2];
          tableData.push([
            {
              text: groupKey2,
              colSpan: countWidth,
              alignment: 'left',
              fillColor: '#526D82',
            },
            ...Array(countWidth - 1).fill({}),
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              { text: index + 1 },
              { text: item.name },
              { text: item.contactNo },
              { text: item.brgyName },
              { text: item.description },
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

        const chunkSize = 9; // Limit of columns per page excluding the Municipality/City column
        const columnChunks: any[][] = [];

        for (let i = 0; i < columnTypes.length; i += chunkSize) {
          columnChunks.push(columnTypes.slice(i, i + chunkSize));
        }

        columnChunks.forEach((columnsChunk: any[], chunkIndex: number) => {
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

          // Add the Municipality/City column
          columnWidth.push('auto');
          columns.push({
            text: 'Municipality/ City',
            bold: true,
            alignment: 'center',
            border: [true, true, true, true],
          });

          columnsChunk.forEach((b: any) => {
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

                columnsChunk.forEach((header: any) => {
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
                });
                tableData.push(data1); // PUSH DISTRICT 1 DATA
              }

              columnsChunk.forEach((header: any) => {
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
              });
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

                columnsChunk.forEach((header: any) => {
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
                });
                tableData.push(data2); // PUSH DISTRICT II DATA
              }

              columnsChunk.forEach((header: any) => {
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
              });
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
            pageBreak: chunkIndex > 0 ? 'before' : undefined, // Add a page break for new chunks
          });
        });

        data.push(...contentData);
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

  //CoopGeneratePdf()

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
        console.log('API Response:', response);
        reports = response.data || [];
        dist1 = response.districtOne || [];
        dist2 = response.districtTwo || [];

        data.push({
          text: `Number of Business/ Commercial Establishments by Municipality/City and related business Category for the year ${response.year}`,
          fontSize: 14,
          bold: true,
          alignment: 'center',
          margin: [0, 10],
        });

        reports.forEach((a: any, reportIndex: any) => {
          const chunkSize = 10; // Limit of columns per page
          const columnChunks: any[][] = [];

          // Consolidate line businesses with the same name within each category
          const consolidatedLineBusinesses = a.columnTypes.reduce(
            (acc: any, current: any) => {
              const existing = acc.find(
                (item: any) =>
                  item.lineBusinessName === current.lineBusinessName
              );
              if (existing) {
                // Merge data if line business already exists
                existing.recNo.push(current.recNo);
              } else {
                // Add new line business
                acc.push({ ...current, recNo: [current.recNo] });
              }
              return acc;
            },
            []
          );

          for (
            let i = 0;
            i < consolidatedLineBusinesses.length;
            i += chunkSize
          ) {
            columnChunks.push(
              consolidatedLineBusinesses.slice(i, i + chunkSize)
            );
          }

          columnChunks.forEach((columnsChunk: any[], chunkIndex: number) => {
            let columns: any = [];
            let columnWidth: any = [];
            const tableData: any = [];
            let grandTotal: any = [];

            let subtotal1: any = [
              {
                text: 'SUB TOTAL',
                fillColor: '#9DB2BF',
                fontSize: 8,
              },
            ];

            let subtotal2: any = [
              {
                text: 'SUB TOTAL',
                fillColor: '#9DB2BF',
                fontSize: 8,
              },
            ];

            // Define the first column for Municipality/City
            columns.push({
              text: 'Municipality/ City',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              fontSize: 6,
            });
            columnWidth.push('auto');

            columnsChunk.forEach((b: any) => {
              columnWidth.push('*');
              columns.push({
                text: b.lineBusinessName,
                fillColor: 'black',
                color: 'white',
                bold: true,
                alignment: 'center',
                fontSize: 6,
              });
            });

            contentData.push({
              text: `${a.catName} category`,
              margin: [0, 10, 0, 8],
              fillColor: 'black',
              color: 'black',
              bold: true,
              alignment: 'left',
              pageBreak: chunkIndex > 0 ? 'before' : undefined,
            });

            tableData.push(columns);

            (a.district || []).forEach((dataDistrict: any) => {
              const isDistrictOne = dataDistrict.district == 1;
              const districtLabel = isDistrictOne
                ? '1st Congressional District'
                : '2nd Congressional District';
              const districtData = isDistrictOne ? dist1 : dist2;

              tableData.push([
                {
                  text: districtLabel,
                  colSpan: columnWidth.length,
                  alignment: 'left',
                  fillColor: '#526D82',
                },
              ]);

              districtData.forEach((d: any) => {
                let rowData: any = [{ text: d.munCityName, fontSize: 10 }];

                columnsChunk.forEach((header: any) => {
                  let count = 0; // Initialize count
                  header.recNo.forEach((recNo: any) => {
                    (dataDistrict.lineBusiness || []).forEach((t: any) => {
                      if (recNo === t.lineBusiness) {
                        (t.data || []).forEach((f: any) => {
                          if (
                            d.munCityId == f.munCityId &&
                            recNo == f.lineBusiness
                          ) {
                            count += parseInt(f.countType || '0', 10); // Aggregate counts
                          }
                        });
                      }
                    });
                  });
                  rowData.push({
                    text: count > 0 ? count.toString() : '-',
                    fontSize: 10,
                  });
                });
                tableData.push(rowData);
              });

              columnsChunk.forEach((header: any) => {
                let countSubtotal = 0;
                header.recNo.forEach((recNo: any) => {
                  (dataDistrict.lineBusiness || []).forEach((t: any) => {
                    if (recNo === t.lineBusiness) {
                      countSubtotal += parseInt(t.subtotalType || '0', 10); // Aggregate subtotals
                    }
                  });
                });
                const subtotal = isDistrictOne ? subtotal1 : subtotal2;
                subtotal.push({
                  text: countSubtotal > 0 ? countSubtotal.toString() : '-',
                  fillColor: '#9DB2BF',
                });
              });
              tableData.push(isDistrictOne ? subtotal1 : subtotal2);
            });

            columnWidth.forEach((b: any, index: any) => {
              let grandTotalcount;
              if (index == 0) {
                grandTotalcount = 'GRAND TOTAL';
              } else {
                let sub1 =
                  subtotal1[index]?.text === '-'
                    ? 0
                    : parseInt(subtotal1[index]?.text || '0');
                let sub2 =
                  subtotal2[index]?.text === '-'
                    ? 0
                    : parseInt(subtotal2[index]?.text || '0');
                grandTotalcount =
                  sub1 + sub2 > 0 ? (sub1 + sub2).toString() : '-';
              }
              grandTotal.push({
                text: grandTotalcount,
                fillColor: '#F1C93B',
                fontSize: 10,
              });
            });

            tableData.push(grandTotal);

            contentData.push({
              margin: [0, 10, 0, 0],
              table: {
                widths: columnWidth,
                body: tableData,
                dontBreakRows: false,
              },
              layout: {
                hLineWidth: function (
                  i: number,
                  node: { table: { body: string | any[] } }
                ) {
                  return i === 0 || i === node.table.body.length ? 1 : 0.5;
                },
                vLineWidth: function (
                  i: number,
                  node: { table: { widths: string | any[] } }
                ) {
                  return i === 0 || i === node.table.widths.length ? 1 : 0.5;
                },
                hLineColor: function (
                  i: number,
                  node: { table: { body: string | any[] } }
                ) {
                  return i === 0 || i === node.table.body.length
                    ? 'black'
                    : 'gray';
                },
                vLineColor: function (
                  i: number,
                  node: { table: { widths: string | any[] } }
                ) {
                  return i === 0 || i === node.table.widths.length
                    ? 'black'
                    : 'gray';
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
                dontBreakRows: false, // Allow rows to break across pages
              },
            });
          });
        });

        data.push(...contentData);
      },
      error: (error: any) => {
        console.error('Error fetching report:', error);
      },
      complete: () => {
        try {
          let isPortrait = false; // Set to false for landscape orientation
          this.pdfService.GeneratePdf(data, isPortrait, 'report.pdf');
          console.log(data);
        } catch (error) {
          console.error('Error generating PDF:', error);
        }
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
                columns.push({
                  text: 'Municipality/ City',
                  fillColor: 'black',
                  color: 'white',
                  bold: true,
                  alignment: 'center',
                  fontSize: 10, // Adjust font size
                });
              }
              columns.push({
                text: b.typeName,
                fillColor: 'black',
                color: 'white',
                bold: true,
                alignment: 'center',
                fontSize: 10, // Adjust font size
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
              pageBreak: index === 0 ? '' : 'before', // Add page break before each new category except the first
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
                    colSpan: columns.length,
                    alignment: 'left',
                    fillColor: '#526D82',
                    fontSize: 10, // Adjust font size
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
                    fontSize: 10, // Adjust font size
                  });
                }
                tableData.push(subtotal1); // Push District 1 subtotal row
              }

              // Process District 2 data
              if (dataDistrict.district == 2) {
                tableData.push([
                  {
                    text: `2nd Congressional District`,
                    colSpan: columns.length,
                    alignment: 'left',
                    fillColor: '#526D82',
                    fontSize: 10, // Adjust font size
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
                    fontSize: 10, // Adjust font size
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
              fontSize: 10, // Adjust font size
            });

            for (let i = 1; i < columns.length; i++) {
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
                fontSize: 10, // Adjust font size
              });
            }
            tableData.push(grandTotalRow); // Push grand total row

            // Push table into content data with page break before each table
            contentData.push({
              margin: [0, 10, 0, 0],
              table: {
                widths: Array(columns.length).fill('auto'), // Adjust widths to auto
                body: tableData,
                dontBreakRows: true, // Prevent row breaks
              },
              layout: {
                hLineWidth: function (i: any, node: any) {
                  return i === 0 || i === node.table.body.length ? 1 : 0.5;
                },
                vLineWidth: function (i: any, node: any) {
                  return i === 0 || i === node.table.widths.length ? 1 : 0.5;
                },
                hLineColor: function (i: any, node: any) {
                  return i === 0 || i === node.table.body.length
                    ? 'black'
                    : 'gray';
                },
                vLineColor: function (i: any, node: any) {
                  return i === 0 || i === node.table.widths.length
                    ? 'black'
                    : 'gray';
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
              pageBreak: 'auto', // Add automatic page breaks
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
    const columnsData: any = [];
    const columnsWidth: any = [];
    let countWidth: number = 3; // Number of columns
    let dist1: any = [];
    let dist2: any = [];
    const tableData: any = [];

    // Define column headers
    columnsData.push(
      { text: '#', bold: true, alignment: 'center' },
      { text: 'Major Economic Activity', bold: true, alignment: 'center' },
      { text: 'Description', bold: true, alignment: 'center' }
    );

    // Define column widths
    columnsWidth.push(25, 'auto', 'auto');

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

        // District 1 title row
        tableData.push([
          {
            text: `1st Congressional District`,
            colSpan: countWidth,
            alignment: 'left',
            fillColor: '#526D82',
            color: 'white', // White text for better contrast
          },
          ...Array(countWidth - 1).fill({}),
        ]);

        // Populate table with data for district 1
        for (const groupKey1 in dist1Group) {
          const group1 = dist1Group[groupKey1];
          tableData.push([
            {
              text: groupKey1,
              colSpan: countWidth,
              alignment: 'left',
              fillColor: '#6E85B7',
              color: 'white',
            },
            ...Array(countWidth - 1).fill({}),
          ]);

          group1.forEach((item: any, index: any) => {
            tableData.push([
              { text: index + 1, alignment: 'center' },
              { text: item.mjrActivity },
              { text: item.description },
            ]);
          });
        }

        // District 2 title row
        tableData.push([
          {
            text: `2nd Congressional District`,
            colSpan: countWidth,
            alignment: 'left',
            fillColor: '#526D82',
            color: 'white',
          },
          ...Array(countWidth - 1).fill({}),
        ]);

        // Populate table with data for district 2
        for (const groupKey2 in dist2Group) {
          const group2 = dist2Group[groupKey2];
          tableData.push([
            {
              text: groupKey2,
              colSpan: countWidth,
              alignment: 'left',
              fillColor: '#6E85B7',
              color: 'white',
            },
            ...Array(countWidth - 1).fill({}),
          ]);

          group2.forEach((item: any, index: any) => {
            tableData.push([
              { text: index + 1, alignment: 'center' },
              { text: item.mjrActivity },
              { text: item.description },
            ]);
          });
        }

        // Table configuration
        const table = {
          margin: [0, 10, 0, 0],
          table: {
            widths: columnsWidth,
            body: tableData,
          },
          layout: {
            hLineWidth: (i: number, node: any) =>
              i === 0 || i === node.table.body.length ? 1 : 1,
            vLineWidth: () => 1,
            hLineColor: () => '#000000',
            vLineColor: () => '#000000',
          },
        };

        data.push(table);
      },
      error: (error: any) => {
        console.error('Error fetching MajorEcoReport:', error);
      },
      complete: () => {
        if (reports.length > 0) {
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log('PDF generation completed successfully.');
        } else {
          this.Error();
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
  DemographyBarangayGeneratePDF() {
    const data: any[] = [];
    const tableData: any[] = [];
    let reports: any[] = [];
    let grandTotal: any[] = [];
    let columns: any[] = [];
    let dist1: any[] = [];
    let dist2: any[] = [];

    this.reportService.GetDemographyBarangayReport(this.params).subscribe({
      next: (response: any = {}) => {
        reports = response.data || [];
        grandTotal = response.grandTotal || [];
        dist1 = response.districtOne || [];
        dist2 = response.districtTwo || [];
        columns = response.columns || [];

        // Title
        data.push({
          margin: [0, 40, 0, 0],
          columns: [
            {
              text: `Total Population and Households by Municipality/City and Barangay`,
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

        // Header row
        const columnHeader = [
          {
            text: '#',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Municipality/Barangay',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          ...columns.flatMap((col: any) => [
            {
              text: col.description,
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: col.male,
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: col.female,
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: col.household,
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
          ]),
        ];
        tableData.push(columnHeader);

        const buildDistrictSection = (
          label: string,
          districtData: any[],
          reportData: any
        ) => {
          tableData.push([
            {
              text: label,
              colSpan: 2 + columns.length * 4,
              fillColor: '#526D82',
              bold: true,
              alignment: 'left',
            },
            ...Array(1 + columns.length * 4).fill({}),
          ]);

          districtData.forEach((city: any, cityIndex: number) => {
            const cityReport = reportData.data?.find(
              (d: any) => `${d.munCityId}` === `${city.munCityId}`
            ) || { barangays: [], munData: [] };

            // City row
            const cityRow = [
              { text: cityIndex + 1, alignment: 'center', bold: true },
              { text: city.munCityName || 'Unknown City', bold: true },
            ];

            columns.forEach((col: any) => {
              const yearData =
                cityReport.munData?.find(
                  (m: any) => m.setYear === col.setYear
                ) || {};
              cityRow.push(
                {
                  text: yearData.population ?? '-',
                  alignment: 'center',
                } as any,
                { text: yearData.male ?? '-', alignment: 'center' } as any,
                { text: yearData.female ?? '-', alignment: 'center' } as any,
                {
                  text: yearData.householdNo ?? '-',
                  alignment: 'center',
                } as any
              );
            });

            tableData.push(cityRow);

            // Barangay rows
            cityReport.barangays?.forEach((brgy: any) => {
              const brgyRow = [
                { text: '', alignment: 'center' },
                {
                  text: `- ${brgy.brgyName || 'Unknown Barangay'}`,
                  margin: [10, 0, 0, 0],
                  italics: true,
                },
              ];

              columns.forEach((col: any) => {
                const yearData =
                  brgy.records?.find((r: any) => r.setYear === col.setYear) ||
                  {};
                brgyRow.push(
                  {
                    text: yearData.population ?? '-',
                    alignment: 'center',
                    fontSize: 9,
                  } as any,
                  {
                    text: yearData.male ?? '-',
                    alignment: 'center',
                    fontSize: 9,
                  } as any,
                  {
                    text: yearData.female ?? '-',
                    alignment: 'center',
                    fontSize: 9,
                  } as any,
                  {
                    text: yearData.householdNo ?? '-',
                    alignment: 'center',
                    fontSize: 9,
                  } as any
                );
              });

              tableData.push(brgyRow);
            });
          });

          // Subtotal row
          const subtotalRow = [
            {
              text: 'SUBTOTAL',
              colSpan: 2,
              fillColor: '#9DB2BF',
              bold: true,
              alignment: 'left',
            },
            {},
          ];
          columns.forEach((col: any) => {
            const sub =
              reportData.subTotal?.find(
                (s: any) => s.setYear === col.setYear
              ) || {};
            subtotalRow.push(
              {
                text: sub.population ?? '-',
                alignment: 'center',
                fillColor: '#9DB2BF',
              } as any,
              {
                text: sub.male ?? '-',
                alignment: 'center',
                fillColor: '#9DB2BF',
              } as any,
              {
                text: sub.female ?? '-',
                alignment: 'center',
                fillColor: '#9DB2BF',
              } as any,
              {
                text: sub.householdNo ?? '-',
                alignment: 'center',
                fillColor: '#9DB2BF',
              } as any
            );
          });
          tableData.push(subtotalRow);
        };

        // Add both districts
        reports.forEach((report: any) => {
          if (report.district === 1) {
            buildDistrictSection('1st Congressional District', dist1, report);
          } else if (report.district === 2) {
            buildDistrictSection('2nd Congressional District', dist2, report);
          }
        });

        // Grand total
        const grandTotalRow = [
          {
            text: 'GRANDTOTAL',
            colSpan: 2,
            fillColor: '#F1C93B',
            bold: true,
            alignment: 'left',
          },
          {},
        ];
        columns.forEach((col: any) => {
          const total =
            grandTotal.find((g: any) => g.setYear === col.setYear) || {};
          grandTotalRow.push(
            {
              text: total.population ?? '-',
              alignment: 'center',
              fillColor: '#F1C93B',
            } as any,
            {
              text: total.male ?? '-',
              alignment: 'center',
              fillColor: '#F1C93B',
            } as any,
            {
              text: total.female ?? '-',
              alignment: 'center',
              fillColor: '#F1C93B',
            } as any,
            {
              text: total.householdNo ?? '-',
              alignment: 'center',
              fillColor: '#F1C93B',
            } as any
          );
        });
        tableData.push(grandTotalRow);

        // Final table
        data.push({
          margin: [0, 20, 0, 0],
          table: {
            widths: [25, 180, ...Array(columns.length * 4).fill(45)],
            body: tableData,
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => 'black',
            vLineColor: () => 'black',
            paddingLeft: () => 4,
            paddingRight: () => 4,
            paddingTop: () => 2,
            paddingBottom: () => 2,
          },
        });
      },

      error: (error: any) => {
        console.error('PDF generation error:', error);
        this.Error();
      },

      complete: () => {
        if (reports.length > 0) {
          const isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
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
        data.push({
          margin: [0, 20, 0, 0],
          columns: [
            {
              text: `List of Physical / Geographic Profile by Municipality/ City`,
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

        // Initialize table data
        const tableData: any[] = [];

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
          margin: [0, 20, 0, 0], // Add margin before the table
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

        // Function to generate separate Revenue and Expenditure tables per Municipality
        const generateTablesForMunicipality = () => {
          const municipalities: { [key: string]: any } = {};

          // Group reports by municipality and category
          reports.forEach((item: any) => {
            const { munCityName, fiscalYear, category } = item;
            const key = `${munCityName}`;

            if (!municipalities[key]) {
              municipalities[key] = {
                cityName: munCityName,
                revenueData: [],
                expenditureData: [],
              };
            }

            if (category === 1) {
              municipalities[key].revenueData.push({
                fiscalYear: fiscalYear,
                name: item.name,
                amount: item.amount,
                category: 'Revenue',
              });
            } else {
              municipalities[key].expenditureData.push({
                fiscalYear: fiscalYear,
                name: item.name,
                amount: item.amount,
                category: 'Expenditure',
              });
            }
          });

          // Iterate over each municipality and add separate tables to data
          for (const key in municipalities) {
            const { cityName, revenueData, expenditureData } =
              municipalities[key];

            // Generate separate Revenue and Expenditure tables
            generateTables(cityName, revenueData, expenditureData);
          }
        };

        // Function to generate separate tables for a municipality
        const generateTables = (
          cityName: string,
          revenueData: any[],
          expenditureData: any[]
        ) => {
          // Generate Revenue Table
          generateTable(cityName, revenueData, 'Revenue');
          // Generate Expenditure Table without page break
          generateTable(cityName, expenditureData, 'Expenditure', false);
        };

        // Function to generate a table for a municipality
        const generateTable = (
          cityName: string,
          dataItems: any[],
          category: string,
          addPageBreak: boolean = true
        ) => {
          // Determine the section title
          const tableTitle = `${cityName} - ${category}`;

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
          const tableData = dataItems.map((item: any) => [
            {
              text: item.fiscalYear,
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

          // Add table to data
          if (tableData.length > 0) {
            // Add page break only if required
            if (addPageBreak && data.length > 0) {
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
                widths: ['auto', '*', 'auto'],
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

        // Call function to generate separate tables for each municipality
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
          text: 'List of Local Government Officials by Municipality/City',
          bold: true,
          alignment: 'center',
          margin: [0, 20, 0, 10],
        });

        // Group data by municipality and year
        const groupedData = reports.reduce((groups: any, item: any) => {
          const { munCityName, setYear } = item;
          const groupKey = `${munCityName}-${setYear}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        // Sort the group keys alphabetically by municipality name
        const sortedGroupKeys = Object.keys(groupedData).sort((a, b) => {
          const cityA = a.split('-')[0].toLowerCase(); // Extract city name
          const cityB = b.split('-')[0].toLowerCase(); // Extract city name
          return cityA.localeCompare(cityB); // Sort alphabetically
        });

        // Iterate over each sorted group and add it to the PDF
        for (const groupKey of sortedGroupKeys) {
          const group = groupedData[groupKey];
          const [cityName, year] = groupKey.split('-');

          // Add page break before each municipality (except the first one)
          if (data.length > 1) {
            data.push({ text: '', pageBreak: 'before' });
          }

          data.push({
            margin: [0, 10, 0, 0],
            columns: [
              {
                text: `${cityName}`,
                fontSize: 14,
                bold: true,
                width: 'auto',
              },
            ],
          });

          // Generate table for elective officials
          data.push({ text: 'Elective Officials', style: 'header' });
          const electiveTable = generateTable(
            group.filter((item: any) => item.category === 1),
            'Elective Officials'
          );
          data.push(electiveTable);

          // Generate table for appointed officials
          data.push({ text: 'Appointed Officials', style: 'header' });
          const appointedTable = generateTable(
            group.filter((item: any) => item.category === 2),
            'Appointed Officials'
          );
          data.push(appointedTable);
        }

        // Function to generate tables for a given category
        function generateTable(categoryReports: any[], categoryTitle: string) {
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
              text:
                categoryTitle === 'Elective Officials'
                  ? 'Term'
                  : 'Employment Status',
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
          categoryReports.forEach((item: any) => {
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
                text:
                  categoryTitle === 'Elective Officials'
                    ? item.term
                    : item.term,
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

          return {
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
        }
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

        // Sort reports alphabetically by municipality/city name
        reports.sort((a: any, b: any) =>
          a.munCityName.localeCompare(b.munCityName)
        );

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

  //ENVIRONMENT
  EnvProfileGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];
    const columnsData: any = [];
    const columnsWidth: any = [];
    const countWidth: number = 3; // Number of columns

    // Define column headers
    columnsData.push(
      { text: '#', bold: true, alignment: 'center' },
      { text: 'Category', bold: true, alignment: 'center' },
      { text: 'Description', bold: true, alignment: 'center' }
    );

    // Define column widths
    columnsWidth.push(25, '*', '*');

    this.params.menuId = '1';

    this.reportService.GetReportEnvironment(this.params).subscribe({
      next: (response: any = {}) => {
        reports = response;
        console.log('result: ', response);

        // Debug log: check the raw response
        console.log('Raw response:', response);

        if (!Array.isArray(reports)) {
          console.error('Reports is not an array:', reports);
          return;
        }

        // Assign data to dist1 and dist2
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
                text: `List of Physical Environment Profile by Municipality/City`,
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

        // Group data by munCityName for each district
        const dist1Group = dist1.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          if (!groups[munCityName]) {
            groups[munCityName] = [];
          }
          groups[munCityName].push(item);
          return groups;
        }, {});

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          if (!groups[munCityName]) {
            groups[munCityName] = [];
          }
          groups[munCityName].push(item);
          return groups;
        }, {});

        // Utility function to add rows for a district
        const addRowsForDistrict = (
          districtGroup: any,
          districtName: string
        ) => {
          if (Object.keys(districtGroup).length > 0) {
            tableData.push([
              {
                text: districtName,
                colSpan: countWidth,
                alignment: 'left',
                fillColor: '#526D82',
                bold: true,
                color: 'white',
              },
              {},
              {},
            ]);

            for (const cityName in districtGroup) {
              const group = districtGroup[cityName];
              tableData.push([
                {
                  text: cityName,
                  colSpan: countWidth,
                  alignment: 'left',
                  fillColor: '#9DB2BF',
                  bold: true,
                },
                {},
                {},
              ]);

              group.forEach((item: any, index: any) => {
                tableData.push([
                  { text: (index + 1).toString(), alignment: 'center' },
                  { text: 'General Topography', alignment: 'left' },
                  { text: item.desc1 || '', alignment: 'left' },
                ]);
                tableData.push([
                  { text: '', alignment: 'center' },
                  { text: 'Geology', alignment: 'left' },
                  { text: item.desc2 || '', alignment: 'left' },
                ]);
                tableData.push([
                  { text: '', alignment: 'center' },
                  { text: 'Soils', alignment: 'left' },
                  { text: item.desc3 || '', alignment: 'left' },
                ]);
                tableData.push([
                  { text: '', alignment: 'center' },
                  { text: 'Land Classification', alignment: 'left' },
                  { text: item.desc4 || '', alignment: 'left' },
                ]);
                tableData.push([
                  { text: '', alignment: 'center' },
                  { text: 'Climate', alignment: 'left' },
                  { text: item.desc5 || '', alignment: 'left' },
                ]);
                tableData.push([
                  { text: '', alignment: 'center' },
                  { text: 'Surface Water', alignment: 'left' },
                  { text: item.desc6 || '', alignment: 'left' },
                ]);
                tableData.push([
                  { text: '', alignment: 'center' },
                  { text: 'Others/Remarks', alignment: 'left' },
                  { text: item.desc7 || '', alignment: 'left' },
                ]);
              });
            }
          }
        };

        addRowsForDistrict(dist1Group, '1st Congressional District');
        addRowsForDistrict(dist2Group, '2nd Congressional District');

        // Table configuration
        const table = {
          margin: [0, 10, 0, 0],
          table: {
            widths: columnsWidth,
            body: [columnsData, ...tableData],
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#CCCCCC',
            vLineColor: () => '#CCCCCC',
            fillColor: (rowIndex: number) =>
              rowIndex % 2 === 0 ? '#F5F5F5' : null,
          },
        };

        data.push(table);
      },
      error: (error: any) => {
        console.error('Error fetching environment report:', error);
      },
      complete: () => {
        if (reports.length > 0) {
          let isPortrait = false; // Ensure landscape orientation
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log('PDF generation completed successfully.');
        } else {
          console.error('No data to generate PDF.');
        }
      },
    });
  }

  EnvBioGeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];
    const columnsData: any = [];
    const columnsWidth: any = [];
    const countWidth: number = 3; // Number of columns

    // Define column headers
    columnsData.push(
      { text: '#', bold: true, alignment: 'center' },
      { text: 'Category', bold: true, alignment: 'center' },
      { text: 'Description', bold: true, alignment: 'center' }
    );

    // Define column widths
    columnsWidth.push(25, '*', '*');

    this.params.menuId = '2';

    this.reportService.GetReportEnvironment(this.params).subscribe({
      next: (response: any = {}) => {
        reports = response;
        console.log('result: ', response);

        // Debug log: check the raw response
        console.log('Raw response:', response);

        if (!Array.isArray(reports)) {
          console.error('Reports is not an array:', reports);
          return;
        }

        // Assign data to dist1 and dist2
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
                text: `List of Natural/Biological Resources by Municipality/City`,
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

        // Group data by munCityName for each district
        const dist1Group = dist1.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          if (!groups[munCityName]) {
            groups[munCityName] = [];
          }
          groups[munCityName].push(item);
          return groups;
        }, {});

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          if (!groups[munCityName]) {
            groups[munCityName] = [];
          }
          groups[munCityName].push(item);
          return groups;
        }, {});

        // Utility function to add rows for a district
        const addRowsForDistrict = (
          districtGroup: any,
          districtName: string
        ) => {
          if (Object.keys(districtGroup).length > 0) {
            tableData.push([
              {
                text: districtName,
                colSpan: countWidth,
                alignment: 'left',
                fillColor: '#526D82',
                bold: true,
                color: 'white',
              },
              {},
              {},
            ]);

            for (const cityName in districtGroup) {
              const group = districtGroup[cityName];
              tableData.push([
                {
                  text: cityName,
                  colSpan: countWidth,
                  alignment: 'left',
                  fillColor: '#9DB2BF',
                  bold: true,
                },
                {},
                {},
              ]);

              group.forEach((item: any, index: any) => {
                tableData.push([
                  { text: (index + 1).toString(), alignment: 'center' },
                  { text: 'Forest/Wildlife Resources', alignment: 'left' },
                  { text: item.desc1 || '', alignment: 'left' },
                ]);
                tableData.push([
                  { text: '', alignment: 'center' },
                  {
                    text: 'Aquatic/Marine Resources and Habitats',
                    alignment: 'left',
                  },
                  { text: item.desc2 || '', alignment: 'left' },
                ]);
                tableData.push([
                  { text: '', alignment: 'center' },
                  { text: 'Protected Areas', alignment: 'left' },
                  { text: item.desc3 || '', alignment: 'left' },
                ]);
                tableData.push([
                  { text: '', alignment: 'center' },
                  { text: 'Land Resources', alignment: 'left' },
                  { text: item.desc4 || '', alignment: 'left' },
                ]);
                tableData.push([
                  { text: '', alignment: 'center' },
                  { text: 'Water Resources', alignment: 'left' },
                  { text: item.desc5 || '', alignment: 'left' },
                ]);
                tableData.push([
                  { text: '', alignment: 'center' },
                  { text: 'Minerals and Energy Resources', alignment: 'left' },
                  { text: item.desc6 || '', alignment: 'left' },
                ]);
                tableData.push([
                  { text: '', alignment: 'center' },
                  { text: 'Others/Remarks', alignment: 'left' },
                  { text: item.desc7 || '', alignment: 'left' },
                ]);
              });
            }
          }
        };

        addRowsForDistrict(dist1Group, '1st Congressional District');
        addRowsForDistrict(dist2Group, '2nd Congressional District');

        // Table configuration
        const table = {
          margin: [0, 10, 0, 0],
          table: {
            widths: columnsWidth,
            body: [columnsData, ...tableData],
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#CCCCCC',
            vLineColor: () => '#CCCCCC',
            fillColor: (rowIndex: number) =>
              rowIndex % 2 === 0 ? '#F5F5F5' : null,
          },
        };

        data.push(table);
      },
      error: (error: any) => {
        console.error('Error fetching environment report:', error);
      },
      complete: () => {
        if (reports.length > 0) {
          let isPortrait = false; // Ensure landscape orientation
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log('PDF generation completed successfully.');
        } else {
          console.error('No data to generate PDF.');
        }
      },
    });
  }

  EnvUrbanGeneratePDF() {
    let data: any = [];
    let reports: any = [];
    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];
    const columnsData: any = [];
    const columnsWidth: any = [];
    const countWidth: number = 3; // Number of columns

    // Define column headers
    columnsData.push(
      { text: '#', bold: true, alignment: 'center' },
      { text: 'Category', bold: true, alignment: 'center' },
      { text: 'Description', bold: true, alignment: 'center' }
    );

    // Define column widths
    columnsWidth.push(25, '*', '*');

    this.params.menuId = '4';

    this.reportService.GetReportEnvironment(this.params).subscribe({
      next: (response: any = {}) => {
        reports = response;
        console.log('result: ', response);

        // Debug log: check the raw response
        console.log('Raw response:', response);

        if (!Array.isArray(reports)) {
          console.error('Reports is not an array:', reports);
          return;
        }

        // Assign data to dist1 and dist2
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
                text: `List of Urban Environment Quality by Municipality/City`,
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

        // Group data by munCityName for each district
        const dist1Group = dist1.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          if (!groups[munCityName]) {
            groups[munCityName] = [];
          }
          groups[munCityName].push(item);
          return groups;
        }, {});

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          if (!groups[munCityName]) {
            groups[munCityName] = [];
          }
          groups[munCityName].push(item);
          return groups;
        }, {});

        // Utility function to add rows for a district
        const addRowsForDistrict = (
          districtGroup: any,
          districtName: string
        ) => {
          if (Object.keys(districtGroup).length > 0) {
            tableData.push([
              {
                text: districtName,
                colSpan: countWidth,
                alignment: 'left',
                fillColor: '#526D82',
                bold: true,
                color: 'white',
              },
              {},
              {},
            ]);

            for (const cityName in districtGroup) {
              const group = districtGroup[cityName];
              tableData.push([
                {
                  text: cityName,
                  colSpan: countWidth,
                  alignment: 'left',
                  fillColor: '#9DB2BF',
                  bold: true,
                },
                {},
                {},
              ]);

              group.forEach((item: any, index: any) => {
                tableData.push([
                  { text: (index + 1).toString(), alignment: 'center' },
                  { text: 'Air Quality Management', alignment: 'left' },
                  { text: item.desc1 || '', alignment: 'left' },
                ]);
                tableData.push([
                  { text: '', alignment: 'center' },
                  { text: 'Water Quality Management', alignment: 'left' },
                  { text: item.desc2 || '', alignment: 'left' },
                ]);
                tableData.push([
                  { text: '', alignment: 'center' },
                  { text: 'Land Quality Management', alignment: 'left' },
                  { text: item.desc3 || '', alignment: 'left' },
                ]);
                tableData.push([
                  { text: '', alignment: 'center' },
                  {
                    text: 'Toxic/Hazardous Waste Management',
                    alignment: 'left',
                  },
                  { text: item.desc4 || '', alignment: 'left' },
                ]);
                tableData.push([
                  { text: '', alignment: 'center' },
                  { text: 'Others/Remarks', alignment: 'left' },
                  { text: item.desc5 || '', alignment: 'left' },
                ]);
              });
            }
          }
        };

        addRowsForDistrict(dist1Group, '1st Congressional District');
        addRowsForDistrict(dist2Group, '2nd Congressional District');

        // Table configuration
        const table = {
          margin: [0, 10, 0, 0],
          table: {
            widths: columnsWidth,
            body: [columnsData, ...tableData],
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#CCCCCC',
            vLineColor: () => '#CCCCCC',
            fillColor: (rowIndex: number) =>
              rowIndex % 2 === 0 ? '#F5F5F5' : null,
          },
        };

        data.push(table);
      },
      error: (error: any) => {
        console.error('Error fetching environment report:', error);
      },
      complete: () => {
        if (reports.length > 0) {
          let isPortrait = false; // Ensure landscape orientation
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log('PDF generation completed successfully.');
        } else {
          console.error('No data to generate PDF.');
        }
      },
    });
  }

  EnvHazardGeneratePDF() {
    let data: any = [];
    let reports: any = [];
    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];
    const columnsData: any = [];
    const columnsWidth: any = [];
    const countWidth: number = 3; // Number of columns

    // Define column headers
    columnsData.push(
      { text: '#', bold: true, alignment: 'center' },
      { text: 'Category', bold: true, alignment: 'center' },
      { text: 'Description', bold: true, alignment: 'center' }
    );

    // Define column widths
    columnsWidth.push(25, '*', '*');

    this.params.menuId = '5';

    this.reportService.GetReportEnvironment(this.params).subscribe({
      next: (response: any = {}) => {
        reports = response;
        console.log('result: ', response);

        // Debug log: check the raw response
        console.log('Raw response:', response);

        if (!Array.isArray(reports)) {
          console.error('Reports is not an array:', reports);
          return;
        }

        // Assign data to dist1 and dist2
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
                text: `List of Environmental Hazards by Municipality/City`,
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

        // Group data by munCityName for each district
        const dist1Group = dist1.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          if (!groups[munCityName]) {
            groups[munCityName] = [];
          }
          groups[munCityName].push(item);
          return groups;
        }, {});

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          if (!groups[munCityName]) {
            groups[munCityName] = [];
          }
          groups[munCityName].push(item);
          return groups;
        }, {});

        // Utility function to add rows for a district
        const addRowsForDistrict = (
          districtGroup: any,
          districtName: string
        ) => {
          if (Object.keys(districtGroup).length > 0) {
            tableData.push([
              {
                text: districtName,
                colSpan: countWidth,
                alignment: 'left',
                fillColor: '#526D82',
                bold: true,
                color: 'white',
              },
              {},
              {},
            ]);

            for (const cityName in districtGroup) {
              const group = districtGroup[cityName];
              tableData.push([
                {
                  text: cityName,
                  colSpan: countWidth,
                  alignment: 'left',
                  fillColor: '#9DB2BF',
                  bold: true,
                },
                {},
                {},
              ]);

              group.forEach((item: any, index: any) => {
                tableData.push([
                  { text: (index + 1).toString(), alignment: 'center' },
                  { text: 'Flooding', alignment: 'left' },
                  { text: item.desc1 || '', alignment: 'left' },
                ]);
                tableData.push([
                  { text: '', alignment: 'center' },
                  { text: 'Landslides', alignment: 'left' },
                  { text: item.desc2 || '', alignment: 'left' },
                ]);
                tableData.push([
                  { text: '', alignment: 'center' },
                  { text: 'Coastal/Storm Surges', alignment: 'left' },
                  { text: item.desc3 || '', alignment: 'left' },
                ]);
                tableData.push([
                  { text: '', alignment: 'center' },
                  { text: 'Geologic Hazards', alignment: 'left' },
                  { text: item.desc4 || '', alignment: 'left' },
                ]);
                tableData.push([
                  { text: '', alignment: 'center' },
                  { text: 'Man-made Hazards', alignment: 'left' },
                  { text: item.desc5 || '', alignment: 'left' },
                ]);
                tableData.push([
                  { text: '', alignment: 'center' },
                  { text: 'Others Hazards/Remarks', alignment: 'left' },
                  { text: item.desc6 || '', alignment: 'left' },
                ]);
              });
            }
          }
        };

        addRowsForDistrict(dist1Group, '1st Congressional District');
        addRowsForDistrict(dist2Group, '2nd Congressional District');

        // Table configuration
        const table = {
          margin: [0, 10, 0, 0],
          table: {
            widths: columnsWidth,
            body: [columnsData, ...tableData],
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#CCCCCC',
            vLineColor: () => '#CCCCCC',
            fillColor: (rowIndex: number) =>
              rowIndex % 2 === 0 ? '#F5F5F5' : null,
          },
        };

        data.push(table);
      },
      error: (error: any) => {
        console.error('Error fetching environment report:', error);
      },
      complete: () => {
        if (reports.length > 0) {
          let isPortrait = false; // Ensure landscape orientation
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log('PDF generation completed successfully.');
        } else {
          console.error('No data to generate PDF.');
        }
      },
    });
  }

  EnvSocialGeneratePDF() {
    let data: any = [];
    let reports: any = [];
    const columnsData: any = [];
    const columnsWidth: any = [];
    let countWidth: number = 3; // Number of columns
    let dist1: any = [];
    let dist2: any = [];
    const tableData: any = [];

    // Define column headers
    columnsData.push(
      { text: '#', bold: true, alignment: 'center' },
      { text: 'Category', bold: true, alignment: 'center' },
      { text: 'Description', bold: true, alignment: 'center' }
    );

    // Define column widths
    columnsWidth.push(25, '*', '*');

    this.params.menuId = '6';

    this.reportService.GetReportEnvironment(this.params).subscribe({
      next: (response: any = {}) => {
        reports = response;
        console.log('result: ', response);

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
                text: `List of Social Condition and Vulnerability by Municipality/City`,
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

        // Group data by munCityName for each district
        const dist1Group = dist1.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          if (!groups[munCityName]) {
            groups[munCityName] = [];
          }
          groups[munCityName].push(item);
          return groups;
        }, {});

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          if (!groups[munCityName]) {
            groups[munCityName] = [];
          }
          groups[munCityName].push(item);
          return groups;
        }, {});

        // Add rows for each district
        const addRowsForDistrict = (
          districtGroup: any,
          districtName: string
        ) => {
          if (Object.keys(districtGroup).length > 0) {
            tableData.push([
              {
                text: districtName,
                colSpan: countWidth,
                alignment: 'left',
                fillColor: '#526D82',
                bold: true,
                color: 'white',
              },
              {},
              {},
            ]);

            for (const cityName in districtGroup) {
              const group = districtGroup[cityName];
              tableData.push([
                {
                  text: cityName,
                  colSpan: countWidth,
                  alignment: 'left',
                  fillColor: '#9DB2BF',
                },
                {},
                {},
              ]);

              group.forEach((item: any, index: any) => {
                tableData.push([
                  { text: (index + 1).toString(), alignment: 'center' },
                  {
                    text: 'Vulnerability of Population to Environmental Hazards',
                    alignment: 'left',
                  },
                  { text: item.desc1 || '', alignment: 'left' },
                ]);
                tableData.push([
                  { text: '', alignment: 'center' },
                  {
                    text: 'General Characteristics of Population',
                    alignment: 'left',
                  },
                  { text: item.desc2 || '', alignment: 'left' },
                ]);
                tableData.push([
                  { text: '', alignment: 'center' },
                  { text: 'Dependency Ratio', alignment: 'left' },
                  { text: item.desc3 || '', alignment: 'left' },
                ]);
                tableData.push([
                  { text: '', alignment: 'center' },
                  { text: 'Poverty Incidence', alignment: 'left' },
                  { text: item.desc4 || '', alignment: 'left' },
                ]);
                tableData.push([
                  { text: '', alignment: 'center' },
                  { text: 'Employment/Unemployment', alignment: 'left' },
                  { text: item.desc5 || '', alignment: 'left' },
                ]);
                tableData.push([
                  { text: '', alignment: 'center' },
                  {
                    text: 'Urbanization and Migration Patterns',
                    alignment: 'left',
                  },
                  { text: item.desc6 || '', alignment: 'left' },
                ]);
                tableData.push([
                  { text: '', alignment: 'center' },
                  { text: 'Others/Remarks', alignment: 'left' },
                  { text: item.desc7 || '', alignment: 'left' },
                ]);
              });
            }
          }
        };

        addRowsForDistrict(dist1Group, '1st Congressional District');
        addRowsForDistrict(dist2Group, '2nd Congressional District');

        const table = {
          margin: [0, 10, 0, 0],
          table: {
            widths: columnsWidth,
            body: [columnsData, ...tableData],
          },
          layout: {
            hLineWidth: (i: number, node: any) =>
              i === 0 || i === node.table.body.length ? 1 : 1,
            vLineWidth: () => 1,
            hLineColor: () => '#000000',
            vLineColor: () => '#000000',
            fillColor: (rowIndex: number) =>
              rowIndex % 2 === 0 ? '#F5F5F5' : null,
          },
        };

        data.push(table);
      },
      error: (error: any) => {
        console.error('Error fetching environment report:', error);
      },
      complete: () => {
        if (reports.length > 0) {
          let isPortrait = false; // Ensure landscape orientation
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
          console.log('PDF generation completed successfully.');
        } else {
          console.error('No data to generate PDF.');
        }
      },
    });
  }

  EnvActGeneratePDF() {
    let type: any = [
      { id: 1, transpotypename: 'Preservation/ Protection' },
      { id: 2, transpotypename: 'Reforestation' },
      { id: 3, transpotypename: 'Clearing of Waterways/ Dredging' },
      { id: 4, transpotypename: 'Commercial Fishing' },
      { id: 5, transpotypename: 'Aquatic Resources Reaping' },
      { id: 6, transpotypename: 'Quarrying' },
      { id: 7, transpotypename: 'Mining' },
      { id: 8, transpotypename: 'Logging' },
      { id: 9, transpotypename: 'Hunting of Wildlife Species' },
      { id: 10, transpotypename: 'Others' },
    ];
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.reportService.GetReportEnviromentAct(this.params).subscribe({
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
              text: `List of Environmental Activities by Municipality/ City`,
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

        // Header row
        tableData.push([
          {
            text: '#',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            border: [true, true, true, true],
          },
          {
            text: 'Organization/Operator Name',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            border: [true, true, true, true],
          },
          {
            text: 'Environmental Activity',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            border: [true, true, true, true],
          },
          {
            text: 'Description/Remarks',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            border: [true, true, true, true],
          },
          {
            text: 'Contact Person',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            border: [true, true, true, true],
          },
          {
            text: 'Barangay',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
            border: [true, true, true, true],
          },
        ]);

        // District 1
        tableData.push([
          {
            text: `1st Congressional District`,
            colSpan: 6,
            alignment: 'left',
            fillColor: '#526D82',
            color: 'white',
            border: [true, true, true, true],
            marginLeft: 5,
          },
          {},
          {},
          {},
          {},
          {},
        ]);

        for (const groupKey1 in dist1Group) {
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 6,
              alignment: 'left',
              fillColor: '#9DB2BF',
              color: 'white',
              border: [true, true, true, true],
              marginLeft: 5,
            },
            {},
            {},
            {},
            {},
            {},
          ]);

          group1.forEach((item: any, index: any) => {
            let transpo: string = '';
            type.forEach((a: any) => {
              if (a.id === item.type) {
                transpo = a.transpotypename;
              }
            });
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                border: [true, true, true, true],
                marginLeft: 5,
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
                border: [true, true, true, true],
              },
              {
                text: transpo,
                fillColor: '#FFFFFF',
                alignment: 'center',
                border: [true, true, true, true],
              },
              {
                text: item.description,
                fillColor: '#FFFFFF',
                alignment: 'center',
                border: [true, true, true, true],
              },
              {
                text: item.contactPerson,
                fillColor: '#FFFFFF',
                alignment: 'center',
                border: [true, true, true, true],
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
                alignment: 'center',
                border: [true, true, true, true],
              },
            ]);
          });
        }

        // District 2
        tableData.push([
          {
            text: `2nd Congressional District`,
            colSpan: 6,
            alignment: 'left',
            fillColor: '#526D82',
            color: 'white',
            border: [true, true, true, true],
            marginLeft: 5,
          },
          {},
          {},
          {},
          {},
          {},
        ]);

        for (const groupKey2 in dist2Group) {
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 6,
              alignment: 'left',
              fillColor: '#9DB2BF',
              color: 'white',
              border: [true, true, true, true],
              marginLeft: 5,
            },
            {},
            {},
            {},
            {},
            {},
          ]);

          group2.forEach((item: any, index: any) => {
            let transpo: string = '';
            type.forEach((a: any) => {
              if (a.id === item.type) {
                transpo = a.transpotypename;
              }
            });
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                border: [true, true, true, true],
                marginLeft: 5,
              },
              {
                text: item.name,
                fillColor: '#FFFFFF',
                border: [true, true, true, true],
              },
              {
                text: transpo,
                fillColor: '#FFFFFF',
                alignment: 'center',
                border: [true, true, true, true],
              },
              {
                text: item.description,
                fillColor: '#FFFFFF',
                alignment: 'center',
                border: [true, true, true, true],
              },
              {
                text: item.contactPerson,
                fillColor: '#FFFFFF',
                alignment: 'center',
                border: [true, true, true, true],
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
                alignment: 'center',
                border: [true, true, true, true],
              },
            ]);
          });
        }

        // Table configuration
        const table = {
          margin: [0, 20, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*', '*'],
            body: tableData,
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => '#CCCCCC',
            vLineColor: () => '#CCCCCC',
            fillColor: (rowIndex: number) =>
              rowIndex % 2 === 0 ? '#F5F5F5' : null,
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
  EnvHistoricalGeneratePDF() {
    let disasterType: any = [
      { id: 1, type_disas: 'Flooding' },
      { id: 2, type_disas: 'Typhoon with Sheet Flood' },
      { id: 3, type_disas: 'Flashflood' },
      { id: 4, type_disas: 'Rainfall-induced Landslides' },
      { id: 5, type_disas: 'Coastal/ Storm Surges' },
      { id: 6, type_disas: 'Earthquake' },
      { id: 7, type_disas: 'Earthquake-induced Landslides Ground Rupture' },
      { id: 8, type_disas: 'Soil Liquefaction' },
      { id: 9, type_disas: 'Tsunami' },
      { id: 10, type_disas: 'Volcanic Eruptions' },
      { id: 11, type_disas: 'Severe Drought/Heatwave' },
      { id: 12, type_disas: 'Strong Wind' },
      { id: 13, type_disas: 'Southeast Monsoon/Habagat' },
    ];

    let data: any = [];
    let reports: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.reportService.GetReportEnvironmentProf(this.params).subscribe({
      next: (response: any = {}) => {
        console.log('Response:', response);
        reports = response;

        // if (!reports || reports.length === 0) {
        //   this.Error('No data available');
        //   return; // Stop if no data
        // }

        // Separate reports by district
        reports.forEach((a: any) => {
          if (a.district === 1) {
            dist1.push(a);
          } else if (a.district === 2) {
            dist2.push(a);
          }
        });

        // Add header
        data.push({
          margin: [0, 20, 0, 0],
          columns: [
            {
              text: 'List of Historical Disasters by Municipality/ City',
              fontSize: 14,
              bold: true,
            },
            {
              text: `Year: ${response[0]?.setYear || 'N/A'}`,
              fontSize: 14,
              bold: true,
              alignment: 'right',
            },
          ],
        });

        // Process grouped data for District 1 if it has data
        if (dist1.length > 0) {
          this.addDistrictData(
            data,
            dist1,
            '1st Congressional District',
            disasterType
          );
        } else {
          console.log('No data for District 1');
        }

        // Process grouped data for District 2 if it has data
        if (dist2.length > 0) {
          this.addDistrictData(
            data,
            dist2,
            '2nd Congressional District',
            disasterType
          );
        } else {
          console.log('No data for District 2');
        }
      },
      error: (error: any) => {
        console.error('Error fetching data:', error);
        // this.Error('Failed to retrieve data');
      },
      complete: () => {
        console.log('Data to generate PDF:', data); // Ensure data is structured correctly
        if (reports.length > 0) {
          let isPortrait = false; // Use landscape orientation
          this.pdfService.GeneratePdf(data, isPortrait, this.remarks);
        }
      },
    });
  }

  addDistrictData(
    data: any[],
    districtData: any,
    districtName: string,
    disasterType: any
  ) {
    const districtGroup = districtData.reduce((groups: any, item: any) => {
      const { munCityName } = item;
      if (!groups[munCityName]) {
        groups[munCityName] = [];
      }
      groups[munCityName].push(item);
      return groups;
    }, {});

    // District title
    data.push({
      text: districtName,
      style: 'header',
      fontSize: 14,
      bold: true,
      margin: [0, 20, 0, 10],
    });

    for (const city in districtGroup) {
      const group = districtGroup[city];

      // City name
      data.push({
        text: city,
        style: 'subheader',
        fontSize: 15,
        bold: true,
        margin: [0, 10, 0, 5],
      });

      group.forEach((item: any) => {
        let transpo =
          disasterType.find((a: any) => a.id === item.disasterType)
            ?.type_disas || 'N/A';

        // Table structure with adjusted widths
        data.push({
          table: {
            widths: ['35%', '65%'], // Adjusted column widths to fit better
            body: [
              [
                {
                  text: 'Date of Occurrence',
                  bold: true,
                  fillColor: '#eeeeee',
                },
                { text: item.dateOccurence || 'N/A' },
              ],
              [
                { text: 'Type of Disaster', bold: true, fillColor: '#eeeeee' },
                { text: transpo },
              ],
              [
                { text: 'Area Affected', bold: true, fillColor: '#eeeeee' },
                { text: item.areasAffected || 'N/A' },
              ],
              [
                { text: 'Event Description', bold: true, fillColor: '#eeeeee' },
                { text: item.eventDesc || 'N/A' },
              ],
              [
                {
                  text: 'No. of People Affected',
                  bold: true,
                  fillColor: '#eeeeee',
                },
                { text: item.pplAffectedNo || 'N/A' },
              ],
              [
                {
                  text: 'No. of People Evacuated',
                  bold: true,
                  fillColor: '#eeeeee',
                },
                { text: item.pplEvacNo || 'N/A' },
              ],
              [
                {
                  text: 'No. of Families Affected',
                  bold: true,
                  fillColor: '#eeeeee',
                },
                { text: item.famAffectedNo || 'N/A' },
              ],
              [
                {
                  text: 'No. of Families Evacuated',
                  bold: true,
                  fillColor: '#eeeeee',
                },
                { text: item.famEvacNo || 'N/A' },
              ],
              [
                {
                  text: 'Place of Evacuation',
                  bold: true,
                  fillColor: '#eeeeee',
                },
                { text: item.placeEvac || 'N/A' },
              ],
              [
                {
                  text: 'No. of People Injured',
                  bold: true,
                  fillColor: '#eeeeee',
                },
                { text: item.pplInjuredNo || 'N/A' },
              ],
              [
                {
                  text: 'Houses Partially Damaged',
                  bold: true,
                  fillColor: '#eeeeee',
                },
                { text: item.hzPartialDmgNo || 'N/A' },
              ],
              [
                { text: 'No. of Deaths', bold: true, fillColor: '#eeeeee' },
                { text: item.deathNo || 'N/A' },
              ],
              [
                {
                  text: 'Houses Totally Damaged',
                  bold: true,
                  fillColor: '#eeeeee',
                },
                { text: item.hzTotDmgNo || 'N/A' },
              ],
              [
                {
                  text: 'Estimated Damages to Infrastructure (Php)',
                  bold: true,
                  colSpan: 2,
                  fillColor: '#eeeeee',
                },
                {},
              ],
              [
                { text: 'School Facilities', bold: true, fillColor: '#eeeeee' },
                { text: item.schoolFacilities || 'N/A' },
              ],
              [
                { text: 'Health Facilities', bold: true, fillColor: '#eeeeee' },
                { text: item.healthFacilities || 'N/A' },
              ],
              [
                { text: 'Roads', bold: true, fillColor: '#eeeeee' },
                { text: item.roads || 'N/A' },
              ],
              [
                { text: 'Bridges', bold: true, fillColor: '#eeeeee' },
                { text: item.bridges || 'N/A' },
              ],
              [
                {
                  text: 'Institutional Structures',
                  bold: true,
                  fillColor: '#eeeeee',
                },
                { text: item.insStructure || 'N/A' },
              ],
              [
                {
                  text: 'Other Infrastructures',
                  bold: true,
                  fillColor: '#eeeeee',
                },
                { text: item.otherInfra || 'N/A' },
              ],
              [
                {
                  text: 'Estimated Damages to Agriculture (Php)',
                  bold: true,
                  colSpan: 2,
                  fillColor: '#eeeeee',
                },
                {},
              ],
              [
                { text: 'Crops Production', bold: true, fillColor: '#eeeeee' },
                { text: item.cropsProd || 'N/A' },
              ],
              [
                {
                  text: 'Livestock Production',
                  bold: true,
                  fillColor: '#eeeeee',
                },
                { text: item.liveStockProd || 'N/A' },
              ],
              [
                { text: 'Poultry', bold: true, fillColor: '#eeeeee' },
                { text: item.poultry || 'N/A' },
              ],
              [
                { text: 'Fishery', bold: true, fillColor: '#eeeeee' },
                { text: item.fishery || 'N/A' },
              ],
              [
                { text: 'Forestry', bold: true, fillColor: '#eeeeee' },
                { text: item.forestry || 'N/A' },
              ],
              [
                { text: 'Others', bold: true, fillColor: '#eeeeee' },
                { text: item.others || 'N/A' },
              ],
            ],
          },
          layout: {
            hLineWidth: function () {
              return 1;
            }, // Horizontal line width
            vLineWidth: function () {
              return 1;
            }, // Vertical line width
            hLineColor: function () {
              return '#000000';
            }, // Horizontal line color
            vLineColor: function () {
              return '#000000';
            }, // Vertical line color
          }, // Add grid lines for better structure
          margin: [0, 0, 0, 15], // Add margin between tables
        });
      });
    }
  }
}
