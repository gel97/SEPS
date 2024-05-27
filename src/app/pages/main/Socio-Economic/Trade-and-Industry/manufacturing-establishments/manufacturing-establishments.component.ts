import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ManEstabService } from 'src/app/shared/Trade&_Industry/man-estab.service';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-manufacturing-establishments',
  templateUrl: './manufacturing-establishments.component.html',
  styleUrls: ['./manufacturing-establishments.component.css'],
})
export class ManufacturingEstablishmentsComponent implements OnInit {
  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;
  searchText: string = '';

  @ViewChild(PdfComponent)
  private pdfComponent!: PdfComponent;

  message = 'Manufacturing Establishments';

  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private service: ManEstabService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService
  ) // private excel:ExcelComponent
  {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  munCityName    : string = this.auth.munCityName;
  toValidate     : any    = {};
  ManEstab       : any    = [];
  barangays      : any    = [];
  estab          : any    = {};
  editmodal      : any    = {};
  Updatelocation : any    = {};

  // Pagination
  pageSize    = 10;
  p           : number = 0;
  count       : number = 0;
  tableSize   : number = 20;
  tableSizes  : any    = [20, 40, 60, 80, 100];

  isCheck     : boolean = false;
  visible     : boolean = true;
  not_visible : boolean = true;

  list_of_category :any = [];
  listFilterType   :any = [];
  list_of_Business :any = [];

  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };

  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
  }

  clearData() {
    this.estab       = {};
    this.not_visible = false;
    this.visible     = true;
  }

  public showOverlay = false;
  importMethod() {
    this.showOverlay = true;
    this.service.Import().subscribe({
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

  ExportExcel() {
    this.reportService.GetExcelExport(
      this.auth.setYear,
      this.auth.munCityId,
      'ManEstab'
    );
  }
  ExportTemplate() {
    this.reportService.GetExport_tamplate('ManEstab', this.auth.munCityId);
  }

  ImportExcel(e: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, submit it!'
    }).then((result) => {
      console.log(result)
      if (result.isConfirmed) {
        this.reportService
        .Get_ExImport(
          e.target.files[0],
          this.auth.setYear,
          this.auth.munCityId,
          'ManEstab'
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
                  this.GetListManEstab();
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
      }
      else{
      }
    })

  }

  GeneratePDF() {
    let reports: any = [];
    let data: any = [];
    let dist1: any = [];
    let dist2: any = [];
    let contentData: any = [];

    this.reportService.GetManEstabReport(this.pdfComponent.data).subscribe({
      next: (response: any = {}) => {
        reports = response.data;
        dist1 = response.districtOne;
        dist2 = response.districtTwo;

        console.log(response);

        data.push({
          text: `Number of Manufacturing Industry by Municipality/City and related business Category for the year ${response.year}`, // Add the title text
          fontSize: 14,
          bold: true,
          alignment: 'center',
          margin: [0, 20], // Adjust the margin around the title as needed
        });

        reports.forEach((a: any, index: any) => {
          let columns: any = [];
          let columnWidth: any = [];
          const tableData: any = [];
          let grandTotal: any = [];

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

          a.columnTypes.forEach((b: any, index: any) => {
            // GET COLUMN
            if (index == 0) {
              columnWidth.push('auto');
              columns.push({
                text: 'Muncipality/ City',
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

          contentData.push({
            // Categpry Name
            text: a.catName + ' category',
            margin: [0, 20, 0, 8],
            fillColor: 'black',
            color: 'black',
            bold: true,
            alignment: 'left',
          });

          tableData.push(columns); // PUSH COLUMN

          for (let dataDistrict of a.district) {
            // LOOP DISTRICT

            if (dataDistrict.district == 1) {
              // GET DISTRICT I DATA
              tableData.push([
                {
                  text: `1st Congressional District `,
                  colSpan: columnWidth.length,
                  alignment: 'left',
                  fillColor: '#526D82',
                },
              ]);

              for (let d1 of dist1) {
                let data1 = [];
                data1.push(d1.munCityName);

                for (let header of a.columnTypes) {
                  let count = '-';
                  for (let t of dataDistrict.type) {
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
                  data1.push(count);
                }
                tableData.push(data1); // PUSH DISTRICT 1 DATA
              }

              for (let header of a.columnTypes) {
                // GET DISTRICT 1 SUBTOTAL
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
              tableData.push(subtotal1); // PUSH DISTRICT 1 SUBTOTAL
            }

            if (dataDistrict.district == 2) {
              // GET DISTRICT II DATA
              tableData.push([
                {
                  text: `2nd Congressional District `,
                  colSpan: columnWidth.length,
                  alignment: 'left',
                  fillColor: '#526D82',
                },
              ]);

              for (let d2 of dist2) {
                let data2 = [];
                data2.push(d2.munCityName);

                for (let header of a.columnTypes) {
                  let count = '-';
                  for (let t of dataDistrict.type) {
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
                  data2.push(count);
                }
                tableData.push(data2); // PUSH DISTRICT II DATA
              }

              for (let header of a.columnTypes) {
                // GET DISTRICT II SUBTOTAL
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
              tableData.push(subtotal2); // PUSH DISTRICT II SUBTOTAL
            }
          }

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
                  subtotal1[index].text == '-' ? 0 : subtotal1[index].text;
                let sub2 =
                  subtotal2[index].text == '-' ? 0 : subtotal2[index].text;

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
              fillColor: '#F1C93B',
            });
          });

          tableData.push(grandTotal);

          contentData.push([
            {
              margin: [0, 10, 0, 0],
              table: {
                // widths: columnWidth,
                body: tableData,
              },
            },
          ]);
        });

        data.push(contentData);
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
  date = new DatePipe('en-PH');
  ngOnInit(): void {
    this.GetListManEstab();
    this.list_of_barangay();
  }
  markerObj: any = {};

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

  //searchBar
  onChangeSearch(e: any) {
    this.searchText = e.target.value;
  }

  GetListManEstab() {
    this.service.GetManEstab().subscribe((data) => {
      this.ManEstab = <any>data;
      this.GetListManEstabCategory();
      this.GetListManEstabTypes();
    });
  }

  GetListManEstabCategory() {
    this.service.GetManEstabCategory().subscribe((data:any) => {
      this.list_of_category = data;
    });
  }

  GetListManEstabTypes() {
    this.service.GetManEstabType().subscribe((data:any) => {
      this.list_of_Business = data;
    });
  }

  list_of_barangay() {
    this.service.ListBarangay().subscribe((data) => {
      this.barangays = <any>data;
      console.log('fgxtxgcvcgcf', this.barangays);
    });
  }

  AddEstablishment() {
    this.toValidate.name =
      this.estab.name == '' || this.estab.name == undefined ? true : false;
    this.toValidate.category =
      this.estab.category == '' || this.estab.category == null ? true : false;
    this.toValidate.brgyId =
      this.estab.brgyId == '' || this.estab.brgyId == null ? true : false;
    this.toValidate.type =
      this.estab.type == '' || this.estab.type == null ? true : false;
    this.toValidate.workersNo =
      this.estab.workersNo == '' || this.estab.workersNo == undefined
        ? true
        : false;

    if (
      this.toValidate.name == true ||
      this.toValidate.category == true ||
      this.toValidate.type == true ||
      this.toValidate.workersNo == true
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.estab.munCityId = this.auth.munCityId;
      this.estab.setYear = this.auth.setYear;
      this.estab.transId = this.date.transform(Date.now(), 'YYMM');
      this.estab.tag = 1;
      this.service.AddManEstab(this.estab).subscribe((request) => {
        if (!this.isCheck) {
          this.closebutton.nativeElement.click();
        }
        console.log(request);
        this.clearData();
        this.GetListManEstab();

        console.log(request);
        Swal.fire('Good job!', 'Data Added Successfully!', 'success');
        // document.getElementById('close')?.click();
        this.estab = {};
        this.ManEstab.push(request);
      });
    }
  }

  edit_estab(edit_estab: any = {}) {
    this.editmodal = edit_estab;
    this.GetListManEstab();
  }

  //for modal
  UpdateManEstab() {
    this.editmodal.longtitude = this.gmapComponent.markers.lng;
    this.editmodal.latitude = this.gmapComponent.markers.lat;
    //this.editmodal.setYear = this.auth.activeSetYear;

    this.toValidate.name =
      this.editmodal.name == '' || this.editmodal.name == undefined
        ? true
        : false;
    this.toValidate.category =
      this.editmodal.category == '' || this.editmodal.category == null
        ? true
        : false;
    this.toValidate.brgyId =
      this.editmodal.brgyId == '' || this.editmodal.brgyId == null
        ? true
        : false;
    this.toValidate.type =
      this.editmodal.type == '' || this.editmodal.type == null ? true : false;
    this.toValidate.workersNo =
      this.editmodal.workersNo == '' || this.editmodal.workersNo == undefined
        ? true
        : false;

    if (
      this.toValidate.name == true ||
      this.toValidate.category == true ||
      this.toValidate.type == true ||
      this.toValidate.workersNo == true
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.service.UpdateManEstab(this.editmodal).subscribe({
        next: (_data) => {
          this.GetListManEstab();
        },
      });

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Your work has been updated',
        showConfirmButton: false,
        timer: 1000,
      });
      document.getElementById('ModalEdit')?.click();
      this.editmodal = {};
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
        for (let i = 0; i < this.ManEstab.length; i++) {
          if (this.ManEstab[i].transId == transId) {
            this.ManEstab.splice(i, 1);
            Swal.fire('Deleted', 'Removed successfully', 'success');
          }
        }

        this.service.DeleteManEstab(transId).subscribe((_data) => {
          this.GetListManEstab();
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  onTableDataChange(page: any) {
    //paginate
    this.p = page;
  }
  onTableSizeChange(event: any) {
    //paginate
    this.tableSize = event.target.value;
    this.p = 1;
  }

  filterTypes(catId:any){
    this.listFilterType = this.list_of_Business.filter(
      (item:any) => item.catId == catId
    );
  }

}
