import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { AuthService } from 'src/app/services/auth.service';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { EducationTertiaryService } from 'src/app/shared/SocialProfile/Education/educationTertiary.service';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';
import { SourceService } from 'src/app/shared/Source/Source.Service';
@Component({
  selector: 'app-tertiary-ins',
  templateUrl: './tertiary-ins.component.html',
  styleUrls: ['./tertiary-ins.component.css'],
})
export class TertiaryInsComponent implements OnInit {
  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;

  @ViewChild(PdfComponent)
  private pdfComponent!: PdfComponent;

  munCityName: string = this.auth.munCityName;
  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private service: EducationTertiaryService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService,
    private SourceService: SourceService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  toValidate: any = {};
  sources: any = [];
  newSource: any = {};
  selectedSourceId: number | null = null;
  showAddForm: boolean = true;

  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };
  isCheck: boolean = false;
  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
  }

  ngOnInit(): void {
    this.Init();
    this.getSources();
  }
  getSources(): void {
    const setYear = this.auth.activeSetYear;
    const munCityId = this.auth.munCityId;
    const sourceFor = 'tertiary-ins'; // 👈 assign your module name

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

    const sourceFor = 'tertiary-ins'; // 👈 assign your module name

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

  public showOverlay = false;
  importMethod() {
    this.showOverlay = true;
    this.service.Import().subscribe({
      next: (data) => {
        this.Init();
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
      complete: () => {
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
      },
    });
  }

  message = 'Tertiary Institution';
  viewData: boolean = false;
  parentMethod() {
    this.viewData = true;
  }

  GeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.reportService
      .GetEducationTertiaryReport(this.pdfComponent.data)
      .subscribe({
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
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, '');
          console.log(data);
        },
      });
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
      .GetListEducationTertiary(this.setYear, this.munCityId)
      .subscribe({
        next: (response) => {
          this.list = <any>response;
          console.log(this.list);
          if (this.list.length > 0) {
            this.viewData = true;
          } else {
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
    this.toValidate.school =
      this.data.school == '' || this.data.school == null ? true : false;
    this.toValidate.brgyId =
      this.data.brgyId == '' || this.data.brgyId == null ? true : false;

    this.data.setYear = this.setYear;
    this.data.munCityId = this.munCityId;

    if (!this.toValidate.school && !this.toValidate.brgyId) {
      this.service.AddEducationTertiary(this.data).subscribe({
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

    this.service.EditEducationTertiary(this.data).subscribe({
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
        this.service.DeleteEducationTertiary(transId).subscribe((request) => {
          this.GetListData();
        });
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  }
}
