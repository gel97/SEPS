import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { SafetyStatisticsService } from 'src/app/shared/SocialProfile/PublicOrder/safety-statistics.service';
@Component({
  selector: 'app-crime-stat',
  templateUrl: './crime-stat.component.html',
  styleUrls: ['./crime-stat.component.css'],
})
export class CrimeStatComponent implements OnInit {
  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;
  @ViewChild(PdfComponent)
  private pdfComponent!: PdfComponent;

  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void; }; };

  constructor(
    private pdfService: PdfService, 
    private reportService: ReportsService,
    private service: SafetyStatisticsService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  munCityName: string = this.auth.munCityName;
  toValidate: any = {};
  isAdd: boolean = false;

  listStatistics: any = [];
  listData: any = [];
  listCrimeTypes: any = [];

  data: any = {};
  reports:any = [];

  ngOnInit(): void {
    this.Init();
  }

  Init() {
    this.GetData();
    this.GetCrimeTypes();
  }


  GetData() {
    this.service.GetSafetyStatistics(this.auth.setYear, this.auth.munCityId).subscribe({
      next: (response) => {
        this.listStatistics = (<any>response);
        console.log("listStatistics:" , this.listStatistics);
      },
      error: (error) => {
      },
      complete: () => {
        this.GetCrimeTypes();
      }
    });
  }

  GetCrimeTypes() {
    this.service.GetListCrimeTypes().subscribe({
      next: (response) => {
        this.listCrimeTypes = (<any>response);
        console.log("Course:" ,this.listCrimeTypes);

      },
      error: (error) => {
      },
      complete: () => {
        this.FilterList();
      }
    });
  }


   FilterList() {
    let isExist;
    this.listData = [];

    this.listCrimeTypes.forEach((a: any) => {
      this.listStatistics.forEach((b: any) => {
        if (a.recNo === b.type) {
          isExist = this.listData.filter((x: any) => x.type === a.type);
          if (isExist.length === 0) {
            this.listData.push(b);
          }
        }
      });

      isExist = this.listData.filter((x: any) => x.type == a.recNo);
      if (isExist.length === 0) {
        this.listData.push({
          'type': a.recNo,
          'crime': a.crime,
        });
      }
    });
    console.log("mergeList: ", this.listData);

  }

  AddData() {
      this.data.setYear = this.auth.activeSetYear;
      this.data.munCityId = this.auth.o_munCityId;
      console.log(this.data);
      this.service.AddSafetyStatistics(this.data).subscribe({
        next: (request) => {
          let index = this.listData.findIndex((obj: any) => obj.type === this.data.type);
          this.listData[index] = request;
          console.log(request)
        },
        complete: () => {
          this.data = {};
          this.closebutton.nativeElement.click();

          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Your work has been saved',
            showConfirmButton: false,
            timer: 1000
          });
        }
      });
    
  }

  EditData() {
      this.data.setYear = this.auth.activeSetYear;
      this.service.EditSafetyStatistics(this.data).subscribe({
        next: (request) => {
          this.closebutton.nativeElement.click();
          this.data = {};
        },
        complete: () => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Your work has been updated',
            showConfirmButton: false,
            timer: 1000
          });
        }
      });
    
  }

  DeleteData(transId: any, index: any, data:any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.DeleteSafetyStatistics(transId).subscribe({
          next: (_data) => {
          },
          error: (err) => {
            Swal.fire(
              'Oops!',
              'Something went wrong.',
              'error'
            )
          },
          complete: () => {
            this.listData[index] = {};
            this.listData[index].type = data.type;
            this.listData[index].crime = data.crime;
            Swal.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            )
          }

        });

      }
    })
  }

  markerObj: any = {};
  SetMarker(data: any = {}) {
    this.markerObj = {
      lat: data.latitude,
      lng: data.longitude,
      label: data.brgyName.charAt(0),
      brgyName: data.brgyName,
      munCityName: this.munCityName,
      draggable: true
    };
    this.gmapComponent.setMarker(this.markerObj);
  }
  pdfMake: any;

  async loadPdfMaker() {
    if (!this.pdfMake) {
      const pdfMakeModule = await import("pdfmake/build/pdfmake");
      const pdfFontsModule = await import("pdfmake/build/vfs_fonts");
      this.pdfMake = pdfMakeModule;
      this.pdfMake.vfs = pdfFontsModule.pdfMake.vfs;
    }
  }

  
}
