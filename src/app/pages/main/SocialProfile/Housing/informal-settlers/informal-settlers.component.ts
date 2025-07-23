import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HousingSettlersService } from 'src/app/shared/SocialProfile/Housing/housing-settlers.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { isEmptyObject } from 'jquery';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';
import { SourceService } from 'src/app/shared/Source/Source.Service';
@Component({
  selector: 'app-informal-settlers',
  templateUrl: './informal-settlers.component.html',
  styleUrls: ['./informal-settlers.component.css'],
})
export class InformalSettlersComponent implements OnInit {
  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };
  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;
  @ViewChild(PdfComponent)
  private pdfComponent!: PdfComponent;
  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private auth: AuthService,
    private service: HousingSettlersService,
    private modifyService: ModifyCityMunService,
    private SourceService: SourceService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  munCityName: string = this.auth.munCityName;
  listHousingSet: any = [];
  listBarangay: any = [];

  isAdd: boolean = false;
  listData: any = [];
  data: any = {};

  editmodal: any = {};
  UpdateBarangay: any = {};

  markerObj: any = {};
  sources: any = [];
  newSource: any = {};
  selectedSourceId: number | null = null;
  showAddForm: boolean = true;

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

  ngOnInit(): void {
    this.Init();
    this.getSources();
  }
  getSources(): void {
    const setYear = this.auth.activeSetYear;
    const munCityId = this.auth.munCityId;
    const sourceFor = 'informalSettlers'; // 👈 assign your module name

    this.SourceService.getSources(setYear, munCityId, sourceFor).subscribe({
      next: (data) => {
        this.sources = data;
        this.showAddForm = data.length === 0;
      },
      error: (error) => {
        console.error('Failed to fetch sources:', error);
      },
    });
  }

  addSource(): void {
    if (!this.newSource?.name) {
      Swal.fire('Warning', 'Please enter a source name.', 'warning');
      return;
    }

    const sourceFor = 'informalSettlers'; // 👈 assign your module name

    // ✅ Add metadata
    this.newSource.munCityId = this.auth.munCityId;
    this.newSource.setYear = this.auth.activeSetYear;
    this.newSource.sourceFor = sourceFor;

    this.SourceService.createSource(this.newSource).subscribe({
      next: () => {
        this.newSource = {};
        Swal.fire('Success', 'Source added successfully.', 'success');
        this.getSources(); // ✅ Re-fetch source list
      },
      error: (error) => {
        Swal.fire('Error', `Failed to create source.\n${error}`, 'error');
      },
    });
  }

  updateSource(): void {
    if (this.selectedSourceId === null || !this.newSource?.name) {
      Swal.fire('Warning', 'No source selected or missing name.', 'warning');
      return;
    }

    this.SourceService.updateSource(
      this.selectedSourceId,
      this.newSource
    ).subscribe({
      next: () => {
        this.getSources();
        this.selectedSourceId = null;
        this.newSource = {};
        Swal.fire('Success', 'Source updated successfully!', 'success');
      },
      error: (error) => {
        Swal.fire('Error', `Failed to update source.\n${error}`, 'error');
      },
    });
  }
  deleteSource(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action will delete the source.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // Show loading dialog
        Swal.fire({
          title: 'Deleting...',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        // Perform delete operation
        this.SourceService.deleteSource(id).subscribe({
          next: () => {
            this.getSources(); // Refresh list
            Swal.fire('Deleted!', 'Source has been deleted.', 'success');
          },
          error: (error) => {
            Swal.fire(
              'Error',
              `Failed to delete source.\n${error.message || error}`,
              'error'
            );
          },
        });
      }
    });
  }

  editSource(source: any): void {
    this.selectedSourceId = source.id;
    this.newSource = { ...source };
  }

  Init() {
    this.GetHousingSettlers();
    this.GetListBarangay();
  }

  GeneratePDF() {
    let data: any = [];
    let grandTotal: any = {};

    let reports: any = [];
    let columnLenght: number = 0;

    const tableData: any = [];

    this.reportService
      .GetHousingSettlersReport(this.pdfComponent.data)
      .subscribe({
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
              text: 'No. of Dwelling Units',
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

          reports.forEach((a: any) => {
            tableData.push([
              {
                text: a.munCityName,
                fillColor: '#9DB2BF',
                bold: true,
                alignment: 'left',
                colSpan: 6,
                marginLeft: 5,
              },
            ]);

            a.data.forEach((b: any, index2: any) => {
              tableData.push([
                {
                  text: index2 + 1,
                  fillColor: index2 % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
                  alignment: 'center',
                },
                {
                  text: b.location,
                  fillColor: index2 % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
                },
                {
                  text: b.brgyName,
                  fillColor: index2 % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
                },
                {
                  text: b.unitsNo,
                  fillColor: index2 % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
                  alignment: 'center',
                },
                {
                  text: b.familiesNo,
                  fillColor: index2 % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
                  alignment: 'center',
                },
                {
                  text: b.remarks,
                  fillColor: index2 % 2 === 0 ? '#FFFFFF' : '#9DB2BF',
                },
              ]);
            });

            tableData.push([
              {
                text: 'SUBTOTAL',
                fillColor: '#FFFFFF',
                colSpan: 2,
                marginLeft: 5,
              },
              {},
              {
                text: a.subtotal.brgyCount,
                fillColor: '#FFFFFF',
              },
              {
                text: a.subtotal.unitsNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: a.subtotal.familiesNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: '',
                fillColor: '#FFFFFF',
              },
            ]);
          });

          tableData.push([
            {
              text: 'GRANDTOTAL',
              fillColor: '#F1C93B',
              colSpan: 2,
              marginLeft: 5,
            },
            {},
            {
              text: grandTotal.brgyCount,
              fillColor: '#F1C93B',
            },
            {
              text: grandTotal.unitsNo,
              fillColor: '#F1C93B',
              alignment: 'center',
            },
            {
              text: grandTotal.familiesNo,
              fillColor: '#F1C93B',
              alignment: 'center',
            },
            {
              text: '',
              fillColor: '#F1C93B',
            },
          ]);

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
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, '');
          console.log(data);
        },
      });
  }

  GetHousingSettlers() {
    this.service
      .GetHousingSettlers(this.auth.setYear, this.auth.munCityId)
      .subscribe({
        next: (response) => {
          this.listHousingSet = <any>response;
          console.log(this.listHousingSet);
        },
        error: (error) => {},
        complete: () => {
          this.GetListBarangay();
        },
      });
  }

  GetListBarangay() {
    this.service.ListBarangay().subscribe({
      next: (response) => {
        this.listBarangay = <any>response;
      },
      error: (error) => {},
      complete: () => {
        this.FilterList();
      },
    });
  }

  FilterList() {
    let isExist;
    this.listData = [];

    this.listBarangay.forEach((a: any) => {
      this.listHousingSet.forEach((b: any) => {
        if (a.brgyId == b.brgyId) {
          isExist = this.listData.filter((x: any) => x.brgyId == a.brgyId);
          if (isExist.length == 0) {
            this.listData.push(b);
          }
        }
      });

      isExist = this.listData.filter((x: any) => x.brgyId == a.brgyId);
      if (isExist.length == 0) {
        this.listData.push({
          brgyId: a.brgyId,
          brgyName: a.brgyName,
        });
      }
    });
  }

  AddData() {
    if (isEmptyObject(this.data)) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.data.munCityId = this.auth.munCityId;
      this.data.setYear = this.auth.activeSetYear;
      this.service.AddHousingSettlers(this.data).subscribe({
        next: (request) => {
          let index = this.listData.findIndex(
            (obj: any) => obj.brgyId === this.data.brgyId
          );
          this.listData[index] = request;
        },
        complete: () => {
          this.data = {};
          this.closebutton.nativeElement.click();

          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Your work has been saved',
            showConfirmButton: false,
            timer: 1000,
          });
        },
      });
    }
  }

  EditData() {
    this.data.setYear = this.auth.activeSetYear;
    this.service.UpdateHousingSettlers(this.data).subscribe({
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
          timer: 1000,
        });
      },
    });
  }

  DeleteData(transId: any, index: any, data: any) {
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
        this.service.DeleteHousingSettlers(transId).subscribe({
          next: (_data) => {},
          error: (err) => {
            Swal.fire('Oops!', 'Something went wrong.', 'error');
          },
          complete: () => {
            this.listData[index] = {};
            this.listData[index].brgyId = data.brgyId;
            this.listData[index].brgyName = data.brgyName;
            Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
          },
        });
      }
    });
  }

  updateM() {
    this.editmodal.longtitude = this.gmapComponent.markers.lng;
    this.editmodal.latitude = this.gmapComponent.markers.lat;

    this.editmodal.setYear = this.auth.activeSetYear;
    this.service.UpdateHousingSettlers(this.editmodal).subscribe({
      next: (_data) => {
        this.Init();
        this.editmodal = {};
      },
    });

    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Your work has been updated',
      showConfirmButton: false,
      timer: 1000,
    });
  }
}
