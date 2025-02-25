import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { BarangayOfficialService } from 'src/app/shared/Governance/barangay-official.service';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { isEmptyObject } from 'jquery';
import { request } from 'express';
@Component({
  selector: 'app-barangays',
  templateUrl: './barangays.component.html',
  styleUrls: ['./barangays.component.css'],
})
export class BarangaysComponent implements OnInit {
  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;
  @ViewChild(PdfComponent)
  private pdfComponent!: PdfComponent;

  @ViewChild('closebutton') closebutton!: ElementRef;
  apiControllerName!: string;

  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private service: BarangayOfficialService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  munCityName: string = this.auth.munCityName;
  toValidate: any = {};
  isAdd: boolean = false;

  ViewBarangayOfficial: any = [];
  ViewPrkChair: any = [];
  listBarangay: any = [];
  listPrkBrgy: any = [];
  isBarangay: boolean = true;
  editPrk: any = {};
  listData: any = [];
  listPrk: any = [];
  visible: boolean = true;
  not_visible: boolean = true;
  data: any = {};
  searchText = '';
  isAccordionOpen: boolean[] = [];

  ngOnInit(): void {
    this.Init();
    this.isAccordionOpen = this.listPrkBrgy.map(() => false);
  }
  toggleAccordion(index: number) {
    this.isAccordionOpen[index] = !this.isAccordionOpen[index];
  }
  Init() {
    this.GetBarangay();
    this.GetBarangayPrk();
    // this.ListPrkBrgy();
    this.GetListBarangay();
  }
  // ExportExcel() {
  //   this.reportService.GetExcelExport(
  //     this.auth.setYear,
  //     this.auth.munCityId,
  //     'PurokChair'
  //   );
  // }

  GetLisbarangay() {
    this.service.GetBarangay().subscribe((data) => {
      this.listBarangay = <any>data;
      this.listBarangay = this.listBarangay.filter((s: any) => s.tag == 1);
      console.log(this.listBarangay);
    });
  }
  //for PrkBrgy
  GetBarangayPrk() {
    this.service.GetBarangayPrk().subscribe((data) => {
      this.listPrkBrgy = data;
      console.log(this.listPrkBrgy);
    });
  }
  // ExportExcelBrgy() {
  //   this.reportService.GetExcelExportWithMenuIdBrgyId(
  //     this.auth.setYear,
  //     this.auth.munCityId,
  //     this.apiControllerName,
  //     this.auth.brgyId,
  //     'PurokChair'
  //   );
  // }

  handleOnTabChange(isBarangay: boolean) {
    this.isBarangay = isBarangay;
  }

  ImportExcel(e: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: '',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, submit it!',
    }).then((result) => {
      console.log(result);
      if (result.isConfirmed) {
        this.reportService
          .Get_ExImport(
            e.target.files[0],
            this.auth.setYear,
            this.auth.munCityId,
            'MajorAct'
          )
          .subscribe((success) => {
            Swal.fire({
              title: 'Importing Data',
              html: 'Please wait for a moment.',
              timerProgressBar: true,
              allowOutsideClick: false,
              didOpen: () => {
                Swal.showLoading();
                setTimeout(() => {
                  if (success) {
                    this.listBarangay();
                    Swal.close();
                    Swal.fire({
                      position: 'center',
                      icon: 'success',
                      title: 'File imported successfully',
                      showConfirmButton: true,
                    });
                  } else {
                    Swal.close();
                    Swal.fire({
                      position: 'center',
                      icon: 'error',
                      title: 'Something went wrong. possible invalid file',
                      showConfirmButton: true,
                    });
                  }
                }, 5000);
              },
            });
          });
      } else {
      }
    });
  }

  GeneratePDF() {
    let reports: any = [];
    let data: any = [];

    this.reportService.GetBarangayReport(this.pdfComponent.data).subscribe({
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
        let isPortrait = true;
        this.pdfService.GeneratePdf(data, isPortrait, '');
        console.log(data);
      },
    });
  }

  public showOverlay = false;
  importMethod() {
    this.showOverlay = true;

    this.service.Import().subscribe({
      next: (data) => {
        this.service.Import2().subscribe({
          next: (data2) => {
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
      },
    });
  }

  GetBarangay() {
    this.service.GetBarangay().subscribe({
      next: (response) => {
        this.ViewBarangayOfficial = <any>response;
        if (this.ViewBarangayOfficial.length > 0) {
          this.viewData = true;
        } else {
          this.viewData = false;
        }
        console.log(this.ViewBarangayOfficial);
      },
      error: (error) => {},
      complete: () => {
        this.GetListBarangay();
      },
    });
  }

  message = 'Barangays';
  viewData: boolean = false;
  parentMethod() {
    this.data = {};
    this.viewData = true;
    this.not_visible = false;
    this.visible = false;
  }
  editToggle() {
    this.not_visible = true;
    this.visible = false;
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
  // ListPrkBrgy() {
  //   this.service.ListPrkBrgy().subscribe({
  //     next: (response) => {
  //       this.listPrkBrgy = <any>response;
  //     },
  //     error: (error) => {},
  //     complete: () => {},
  //   });
  // }

  FilterList() {
    let isExist;
    this.listData = [];

    this.listBarangay.forEach((a: any) => {
      this.ViewBarangayOfficial.forEach((b: any) => {
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

  AddPrkChair() {
    if (!isEmptyObject(this.data)) {
      this.data.munCityId = this.auth.munCityId;
      this.data.setYear = this.auth.activeSetYear;

      // Check if brgyId is present
      if (!this.data.brgyId) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Barangay ID is required',
          showConfirmButton: true,
        });
        return;
      }

      this.service.AddPrkChair(this.data).subscribe({
        next: (request) => {
          console.log('Purok Chair Data:', request);
          console.log('Update listPrkBrgy:', this.listPrkBrgy);
          this.listPrkBrgy.push({ ...this.data });
          this.GetBarangayPrk();
          this.isAccordionOpen.push(false);
        },
        complete: () => {
          this.data = {}; // Reset form data
          this.closebutton.nativeElement.click(); // Close the modal

          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Purok Chair has been added successfully!',
            showConfirmButton: false,
            timer: 1000,
          });
          this.data = {};
          this.closebutton.nativeElement.click();
        },
        error: (err) => {
          console.error('Error adding Purok Chair: ', err);
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Error adding Purok Chair',
            showConfirmButton: true,
          });
        },
      });
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Please fill out the required fields',
        showConfirmButton: true,
      });
    }
  }
  EditPrk() {
    this.editPrk.setYear = this.auth.activeSetYear;

    // Make the API call to update the Purok data
    this.service.EditPrk(this.editPrk).subscribe({
      next: (request) => {
        // Close modal and reset data on success
        this.closebutton.nativeElement.click();
        this.editPrk = {};
      },
      complete: () => {
        // Show success message once the process is completed
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

  DeletePrk(transId: any, index: any, data: any) {
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
        this.service.DeletePrk(transId).subscribe({
          next: (_data) => {},
          error: (err) => {
            Swal.fire('Oops!', 'Something went wrong.', 'error');
          },
          complete: () => {
            this.listData[index] = {};
            this.listData[index].brgyId = data.brgyId;
            this.listData[index].brgyName = data.brgyName;
            const wasOpen = this.isAccordionOpen[index];
            if (index >= 0 && index < this.listData.length) {
              this.listData.splice(index, 1);
              this.isAccordionOpen.splice(index, 1);
            }
            if (wasOpen && this.isAccordionOpen.length > 0) {
              const newIndextoOpen =
                index < this.isAccordionOpen.length ? index : index - 1;
              this.isAccordionOpen[newIndextoOpen] = true;
            }
            // this.listData.splice(index, 1);
            // this.isAccordionOpen.splice(index, 1);
            // if (this.isAccordionOpen.length > 0) {
            //   this.isAccordionOpen[index > 0 ? index - 1 : 0] = true;
            // }

            this.Init();
            Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
          },
        });
      }
    });
  }

  AddData() {
    this.toValidate.punongBrgy =
      this.data.punongBrgy == '' || this.data.punongBrgy == null ? true : false;
    this.toValidate.purokNo =
      this.data.purokNo == '' || this.data.purokNo == null ? true : false;
    this.toValidate.address =
      this.data.address == '' || this.data.address == undefined ? true : false;
    if (
      this.toValidate.punongBrgy == true ||
      this.toValidate.address == true ||
      this.toValidate.purokNo == true
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.data.setYear = this.auth.activeSetYear;
      this.service.AddBarangay(this.data).subscribe({
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
            timer: 500,
          });
        },
      });
    }
  }

  EditData() {
    this.toValidate.punongBrgy =
      this.data.punongBrgy == '' || this.data.punongBrgy == null ? true : false;
    this.toValidate.address =
      this.data.address == '' || this.data.address == undefined ? true : false;
    if (this.toValidate.punongBrgy == true || this.toValidate.address == true) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      if (
        this.gmapComponent.markers.lng !== undefined &&
        this.gmapComponent.markers.lat !== undefined
      ) {
        this.data.longitude = this.gmapComponent.markers.lng;
        this.data.latitude = this.gmapComponent.markers.lat;
      }

      this.data.setYear = this.auth.activeSetYear;
      this.service.UpdateBarangay(this.data).subscribe({
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
        this.service.Delete_Barangay(transId).subscribe({
          next: (_data) => {},
          error: (err) => {
            Swal.fire('Oops!', 'Something went wrong.', 'error');
          },
          complete: () => {
            this.listData[index] = {};
            this.listData[index].brgyId = data.brgyId;
            this.listData[index].brgyName = data.brgyName;
            this.Init();
            Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
          },
        });
      }
    });
  }

  markerObj: any = {};
  SetMarker(data: any = {}) {
    this.markerObj = {
      lat: data.latitude,
      lng: data.longitude,
      label: data.brgyName.charAt(0),
      brgyName: data.brgyName,
      munCityName: this.munCityName,
      draggable: true,
    };
    this.gmapComponent.setMarker(this.markerObj);
  }
  pdfMake: any;

  async loadPdfMaker() {
    if (!this.pdfMake) {
      const pdfMakeModule = await import('pdfmake/build/pdfmake');
      const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
      this.pdfMake = pdfMakeModule;
      this.pdfMake.vfs = pdfFontsModule.pdfMake.vfs;
    }
  }
  clearData() {
    this.data = {};
    this.not_visible;
    this.visible;
  }
  async GeneratePdf() {
    await this.loadPdfMaker();

    const def = {
      content: ['hello', 'hi'],
    };
    this.pdfMake.createPdf(def).open();
  }
}
