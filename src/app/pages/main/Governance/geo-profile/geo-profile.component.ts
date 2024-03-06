import { MunCityLocService } from './../../../../shared/Governance/mun-city-loc.service';
import { CityOfficialService } from '../../../../shared/Governance/city-official.service';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { GeoProfileService } from 'src/app/shared/Governance/geo-profile.service';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { ImportComponent } from 'src/app/components/import/import.component';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';
@Component({
  selector: 'app-geo-profile',
  templateUrl: './geo-profile.component.html',
  styleUrls: ['./geo-profile.component.css'],
})
export class GeoProfileComponent implements OnInit {
  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;

  @ViewChild(ImportComponent)
  private importComponent!: ImportComponent;

  @ViewChild(PdfComponent)
  private pdfComponent!: PdfComponent;
  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private service: GeoProfileService,
    private gmap: MunCityLocService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService
  ) {}
  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  munCityName: string = this.auth.munCityName;

  ViewGeo: any = [];
  geo: any = {};
  updategeo: any = {};
  inputDisabled: boolean = false;
  editgeo: any = {};
  toValidate: any = {};
  isAdd: boolean = true;
  MunLoc: any = [];
  munCity: any = {};

  date = new DatePipe('en-PH');

  ngOnInit(): void {
    this.GmapLocation();
    this.Init();
  }

  public showOverlay = false;
  importMethod() {
    this.showOverlay = true;
    this.service.Import().subscribe({
      next: (data) => {
        this.Init();
        if(data === null){
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

  reports: any = [];
  GeneratePDF() {
    let data: any = [];

    this.reportService.GetGeoProfReport(this.pdfComponent.data).subscribe({
      next: (response) => {
        this.reports = <any>response;
        console.log(this.reports);
        //data.push([{text:'Physical/ Geographic Profile by Municipality/City', bold: true, alignment:'center'}]);

        const groupedData = this.reports.reduce((groups: any, item: any) => {
          const { district } = item;
          const groupKey = `${district}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

         // Create the table
         const tableData: any = [];
         tableData.push([
           {
             text: 'Municipality/ City',
             fillColor: 'black',
             color: 'white',
             bold: true,
             alignment: 'center',
           },
           {
             text: 'Total Land Area (Has)',
             fillColor: 'black',
             color: 'white',
             bold: true,
             alignment: 'center',
           },
           {
             text: 'As of Year',
             fillColor: 'black',
             color: 'white',
             bold: true,
             alignment: 'center',
           },
           {
             text: 'Residential Area (Has)',
             fillColor: 'black',
             color: 'white',
             bold: true,
             alignment: 'center',
           },
           {
             text: 'Commercial (Has)',
             fillColor: 'black',
             color: 'white',
             bold: true,
             alignment: 'center',
           },
           {
             text: 'Industrial (Has)',
             fillColor: 'black',
             color: 'white',
             bold: true,
             alignment: 'center',
           },
           {
             text: 'Agricultural (Has)',
             fillColor: 'black',
             color: 'white',
             bold: true,
             alignment: 'center',
           },
           {
             text: 'Institutional (Has)',
             fillColor: 'black',
             color: 'white',
             bold: true,
             alignment: 'center',
           },
           {
             text: 'Forest Lands (Has)',
             fillColor: 'black',
             color: 'white',
             bold: true,
             alignment: 'center',
           },
           {
             text: 'Open Spaces (Has)',
             fillColor: 'black',
             color: 'white',
             bold: true,
             alignment: 'center',
           },
           {
             text: 'Quarry (Has)',
             fillColor: 'black',
             color: 'white',
             bold: true,
             alignment: 'center',
           },
           {
             text: 'Fish Ponds (Has)',
             fillColor: 'black',
             color: 'white',
             bold: true,
             alignment: 'center',
           },
           {
             text: 'Other Land Uses (Has)',
             fillColor: 'black',
             color: 'white',
             bold: true,
             alignment: 'center',
           }
         ]);

        // Iterate over each group and add it to the PDF
        for (const groupKey in groupedData) {
          const group = groupedData[groupKey];
          const [district] = groupKey.split('-');

         
          if(district === '1'){
            tableData.push([
              { text: `1st Congressional District `, colSpan: 13, alignment: 'left',
              fillColor: '#526D82'}
            ],
              );
          }
          else{
            tableData.push([
              { text: `2nd Congressional District `, colSpan: 13, alignment: 'left',
              fillColor: '#526D82' }
            ],
              );
          }

          group.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: item.munCityName,
                fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
              },
              {
                text: item.totalLandArea,
                fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
              },
              {
                text: item.setYear,
                fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
              },
              {
                text: item.residential,
                fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
              },
              {
                text: item.commercial,
                fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
              },
              {
                text: item.industrial,
                fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
              },
              {
                text: item.agricultural,
                fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
              },
              {
                text: item.institutional,
                fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
              },
              {
                text: item.forestLand,
                fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
              },
              {
                text: item.openSpaces,
                fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
              },
              {
                text: item.quarryAreas,
                fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
              },
              {
                text: item.fishpond,
                fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
              },
              {
                text: item.otherUses,
                fillColor: index % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
              },
             
            ]);
          });
          const table = {
            margin: [0, 40, 0, 0],
            table: {
              widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
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
        let isPortrait = false;
        this.pdfService.GeneratePdf(data[0], isPortrait, "");
        console.log(data);
      },
    });
  }

  viewData: boolean = false;
  parentMethod() {
    // alert('parent Method');
    this.viewData = true;
  }

  markerObj: any = {};

  SetMarker(data: any = {}) {
    console.log('lnglat: ', data.longtitude + ' , ' + data.latitude);

    this.markerObj = {
      lat: data.latitude,
      lng: data.longtitude,
      label: null,
      brgyName: null,
      munCityName: null,
      draggable: true,
    };
    this.gmapComponent.setMarker(this.markerObj);
  }
  message = 'Physical / Geographic Profile';
  Init() {
    this.service.GetGeo().subscribe((data) => {
      this.ViewGeo = <any>data;
      console.log('viewgeo', this.ViewGeo);
      // this.import();
      //textfield(enable/disabled)
      this.inputDisabled = this.ViewGeo != null ? true : false;

      if (this.ViewGeo !== null) {
        this.geo = this.ViewGeo;
      }
      console.log(this.ViewGeo);
      if (this.ViewGeo != null) {
        this.viewData = true;
        console.log('tru or false', this.viewData);
      } else {
        this.viewData = false;
      }
    });
  }

  import() {
    let importData = 'Physical / Geographic Profile';
    // this.view = this.importComponent.viewData;
    this.importComponent.import(importData);
  }

  GmapLocation() {
    this.gmap.GetMunCity().subscribe({
      next: (response) => {
        this.MunLoc = <any>response;
      },
      error: (error) => {},
      complete: () => {
        this.munCity = this.MunLoc.find(
          (a: { munCityId: any }) => a.munCityId == this.auth.munCityId
        );
        // this.SetMarker(this.munCity);
        // console.log(this.munCity);
      },
    });
  }

  AddGeo() {
    this.toValidate.totalLandArea =
      this.geo.totalLandArea == '' || this.geo.totalLandArea == null
        ? true
        : false;
    this.toValidate.setYear =
      this.geo.setYear == '' || this.geo.setYear == undefined ? true : false;
    this.toValidate.residential =
      this.geo.residential == '' || this.geo.residential == undefined
        ? true
        : false;
    this.toValidate.commercial =
      this.geo.commercial == '' || this.geo.commercial == undefined
        ? true
        : false;
    this.toValidate.industrial =
      this.geo.industrial == '' || this.geo.industrial == null ? true : false;
    this.toValidate.agricultural =
      this.geo.agricultural == '' || this.geo.agricultural == undefined
        ? true
        : false;
    this.toValidate.institutional =
      this.geo.institutional == '' || this.geo.institutional == undefined
        ? true
        : false;
    this.toValidate.forestLand =
      this.geo.forestLand == '' || this.geo.forestLand == undefined
        ? true
        : false;
    this.toValidate.openSpaces =
      this.geo.openSpaces == '' || this.geo.openSpaces == null ? true : false;
    this.toValidate.fishpond =
      this.geo.fishpond == '' || this.geo.fishpond == undefined ? true : false;
    this.toValidate.quarryAreas =
      this.geo.quarryAreas == '' || this.geo.quarryAreas == undefined
        ? true
        : false;
    this.toValidate.otherUses =
      this.geo.otherUses == '' || this.geo.otherUses == undefined
        ? true
        : false;
    this.toValidate.reclassified =
      this.geo.reclassified == '' || this.geo.reclassified == null
        ? true
        : false;

    if (
      this.toValidate.totalLandArea == true ||
      this.toValidate.setYear == true ||
      this.toValidate.residential == true ||
      this.toValidate.commercial == true ||
      this.toValidate.industrial == true ||
      this.toValidate.agricultural == true ||
      this.toValidate.institutional == true ||
      this.toValidate.forestLand == true ||
      this.toValidate.openSpaces == true ||
      this.toValidate.fishpond == true ||
      this.toValidate.quarryAreas == true ||
      this.toValidate.otherUses == true ||
      this.toValidate.reclassified == true
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.geo.munCityId = this.auth.munCityId;
      this.geo.setYear = this.auth.activeSetYear;
      this.service.AddGeoP(this.geo).subscribe(
        (_data) => {
          Swal.fire('Good job!', 'Data Added Successfully!', 'success');
          // this.geo = {};
          this.Init();
        },
        (_err) => {
          Swal.fire('ERROR!', 'Error', 'error');
          this.geo = {};
          this.Init();
        }
      );
    }
  }

  editgeoprof(editgeoprof: any = {}) {
    this.editgeo = editgeoprof;
    //passing the data from table (modal)
    this.Init();
  }

  //for modal
  update_Geo() {
    this.toValidate.totalLandArea =
      this.geo.totalLandArea == '' || this.geo.totalLandArea == null
        ? true
        : false;
    this.toValidate.setYear =
      this.geo.setYear == '' || this.geo.setYear == undefined ? true : false;
    this.toValidate.residential =
      this.geo.residential == '' || this.geo.residential == undefined
        ? true
        : false;
    this.toValidate.commercial =
      this.geo.commercial == '' || this.geo.commercial == undefined
        ? true
        : false;
    this.toValidate.industrial =
      this.geo.industrial == '' || this.geo.industrial == null ? true : false;
    this.toValidate.agricultural =
      this.geo.agricultural == '' || this.geo.agricultural == undefined
        ? true
        : false;
    this.toValidate.institutional =
      this.geo.institutional == '' || this.geo.institutional == undefined
        ? true
        : false;
    this.toValidate.forestLand =
      this.geo.forestLand == '' || this.geo.forestLand == undefined
        ? true
        : false;
    this.toValidate.openSpaces =
      this.geo.openSpaces == '' || this.geo.openSpaces == null ? true : false;
    this.toValidate.fishpond =
      this.geo.fishpond == '' || this.geo.fishpond == undefined ? true : false;
    this.toValidate.quarryAreas =
      this.geo.quarryAreas == '' || this.geo.quarryAreas == undefined
        ? true
        : false;
    this.toValidate.otherUses =
      this.geo.otherUses == '' || this.geo.otherUses == undefined
        ? true
        : false;
    this.toValidate.reclassified =
      this.geo.reclassified == '' || this.geo.reclassified == null
        ? true
        : false;

    if (
      this.toValidate.totalLandArea == true ||
      this.toValidate.setYear == true ||
      this.toValidate.residential == true ||
      this.toValidate.commercial == true ||
      this.toValidate.industrial == true ||
      this.toValidate.agricultural == true ||
      this.toValidate.institutional == true ||
      this.toValidate.forestLand == true ||
      this.toValidate.openSpaces == true ||
      this.toValidate.fishpond == true ||
      this.toValidate.quarryAreas == true ||
      this.toValidate.otherUses == true ||
      this.toValidate.reclassified == true
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.service.UpdateGeo(this.editgeo).subscribe({
        next: (_data) => {
          this.Init();
        },
      });
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Your work has been updated',
        showConfirmButton: false,
        timer: 1000,
      });
      document.getElementById('exampleModalLong')?.click();
      this.editgeo = {};
    }
  }

  delete(transId: any) {
    Swal.fire({
      text: 'Do you want to remove this file',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.Delete(transId).subscribe({
          next: (_data) => {
            this.Init();
          },
          error: (err) => {
            this.Init();
            this.geo = {};
          },
        });
        Swal.fire('Deleted!', 'Your file has been removed.', 'success');
      }
    });
  }
}
