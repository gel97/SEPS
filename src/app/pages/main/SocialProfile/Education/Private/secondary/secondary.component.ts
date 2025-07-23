import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { AuthService } from 'src/app/services/auth.service';
import { EducationSchoolsService } from 'src/app/shared/SocialProfile/Education/educationSchools.service';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';
import { SourceService } from 'src/app/shared/Source/Source.Service';
@Component({
  selector: 'app-secondary',
  templateUrl: './secondary.component.html',
  styleUrls: ['./secondary.component.css'],
})
export class SecondaryComponent implements OnInit {
  menuId: string = '2';
  munCityName: string = this.auth.munCityName;
  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private service: EducationSchoolsService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService,
    private SourceService: SourceService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  toValidate: any = {};
  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;
  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };
  @ViewChild(PdfComponent)
  private pdfComponent!: PdfComponent;
  isCheck: boolean = false;
  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
  }

  markerObj: any = {};
  sources: any = [];
  newSource: any = {};
  selectedSourceId: number | null = null;
  showAddForm: boolean = true;

  SetMarker(data: any = {}) {
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
    const sourceFor = 'secondary';

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

    const sourceFor = 'secondary'; // 👈 assign your module name

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
  message = 'Schools';
  importMethod() {
    this.showOverlay = true;
    this.service.Import(this.menuId).subscribe({
      next: (data) => {
        this.ngOnInit();
        if (data.length === 0) {
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
        } else {
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

  GeneratePDF() {
    let data: any = [];
    let grandTotal: any = {};

    let reports: any = [];
    let columnLenght: number = 0;

    const tableData: any = [];

    this.pdfComponent.data.menuId = this.menuId;

    this.reportService
      .GetEducationSchoolReport(this.pdfComponent.data)
      .subscribe({
        next: (response: any = {}) => {
          reports = response.data;
          grandTotal = response.grandTotal;

          console.log('result: ', response);

          data.push({
            margin: [0, 40, 0, 0],
            columns: [
              {
                text: `Private Secondary by Municipality/City`,
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
          let isPortrait = false;
          this.pdfService.GeneratePdf(data, isPortrait, '');
          console.log(data);
        },
      });
  }
  munCityId: string = this.auth.munCityId;
  setYear: string = this.auth.setYear;

  isAdd: boolean = true;
  listElems: any = [];
  secondary: any = {};
  listBarangay: any = [];

  Init() {
    this.GetListBarangay();
    this.GetListPrivateSecSchool();
  }

  GetListBarangay() {
    this.service.ListOfBarangay(this.auth.munCityId).subscribe((data) => {
      this.listBarangay = <any>data;
    });
  }

  GetListPrivateSecSchool() {
    this.service
      .GetListEducationSchools(this.menuId, this.setYear, this.munCityId)
      .subscribe({
        next: (response) => {
          this.listElems = <any>response;
        },
        error: (error) => {
          Swal.fire('Oops!', 'Something went wrong.', 'error');
        },
        complete: () => {},
      });
  }

  AddPrivateSecSchool() {
    this.toValidate.name =
      this.secondary.name == '' || this.secondary.name == null ? true : false;
    this.toValidate.schoolId =
      this.secondary.schoolId == '' || this.secondary.schoolId == null
        ? true
        : false;
    this.toValidate.brgyId =
      this.secondary.brgyId == '' || this.secondary.brgyId == null
        ? true
        : false;

    this.secondary.menuId = this.menuId;
    this.secondary.setYear = this.setYear;
    this.secondary.munCityId = this.munCityId;

    if (
      !this.toValidate.name &&
      !this.toValidate.brgyId &&
      !this.toValidate.schoolId
    ) {
      this.service.AddEducationSchool(this.secondary).subscribe({
        next: (request) => {
          this.GetListPrivateSecSchool();
        },
        error: (error) => {
          Swal.fire('Oops!', 'Something went wrong.', 'error');
        },
        complete: () => {
          if (!this.isCheck) {
            this.closebutton.nativeElement.click();
          }
          this.secondary = {};
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

  EditPrivateSecSchool() {
    this.toValidate.name =
      this.secondary.name == '' || this.secondary.name == null ? true : false;
    this.toValidate.schoolId =
      this.secondary.schoolId == '' || this.secondary.schoolId == null
        ? true
        : false;
    this.toValidate.brgyId =
      this.secondary.brgyId == '' || this.secondary.brgyId == null
        ? true
        : false;

    this.secondary.longtitude = this.gmapComponent.markers.lng;
    this.secondary.latitude = this.gmapComponent.markers.lat;

    this.secondary.menuId = this.menuId;
    this.secondary.setYear = this.setYear;
    this.secondary.munCityId = this.munCityId;

    if (
      !this.toValidate.name &&
      !this.toValidate.brgyId &&
      !this.toValidate.schoolId
    ) {
      this.service.EditEducationSchool(this.secondary).subscribe({
        next: (request) => {
          this.GetListPrivateSecSchool();
        },
        error: (error) => {
          Swal.fire('Oops!', 'Something went wrong.', 'error');
        },
        complete: () => {
          this.closebutton.nativeElement.click();
          Swal.fire('Good job!', 'Data Updated Successfully!', 'success');
          document.getElementById('mEducation')?.click();
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

  DeletePrivateSecSchool(transId: any) {
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
        this.service.DeleteEducationSchool(transId).subscribe((request) => {
          this.GetListPrivateSecSchool();
        });
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  }
}
