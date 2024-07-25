import { CommercialEstablishmentService } from './../../../../../shared/Trade&_Industry/commercial-establishment.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';
@Component({
  selector: 'app-commercial-establishments',
  templateUrl: './commercial-establishments.component.html',
  styleUrls: ['./commercial-establishments.component.css'],
})
export class CommercialEstablishmentsComponent implements OnInit {
  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;
  searchText: string = '';
  @ViewChild(PdfComponent)
  private pdfComponent!: PdfComponent;

  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private service: CommercialEstablishmentService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  message = 'Commercial Establishments';

  munCityName: string = this.auth.munCityName;

  toValidate: any = {};
  ComEstab: any = [];
  barangays: any = [];
  comm: any = {};
  editmodal: any = {};

  list_of_category: any = [];
  list_of_Business: any = [];
  listFilterType: any = [];

  // Pagination
  pageSize = 10;
  p: number = 0;
  count: number = 0;
  tableSize: number = 20;
  tableSizes: any = [20, 40, 60, 80, 100];

  isCheck: boolean = false;
  visible: boolean = true;
  not_visible: boolean = true;

  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };

  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
    console.log('isCheck:', this.isCheck);
  }

  clearData() {
    this.comm = {};
    this.not_visible = false;
    this.visible = true;
    // this.required = false;
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

  filterTypes(catId: any) {
    this.listFilterType = this.list_of_Business.filter(
      (item: any) => item.catId == catId
    );
  }

  date = new DatePipe('en-PH');
  ngOnInit(): void {
    this.GetListCommercialEstab();
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
  GetListCom() {
    {
      this.service.Get_Com_Estab().subscribe((data) => {
        this.ComEstab = <any>data;
        this.ComEstab = this.ComEstab.filter((s: any) => s.tag == 1);
        console.log(this.ComEstab);
      });
    }
  }

  //searchBar
  onChangeSearch(e: any) {
    this.searchText = e.target.value;
  }
  ExportExcel() {
    this.reportService.GetExcelExport(
      this.auth.setYear,
      this.auth.munCityId,
      'ComEstab'
    );
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
            'ComEstab'
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
                    this.GetListCommercialEstab();
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
    let dist1: any = [];
    let dist2: any = [];
    let contentData: any = [];

    this.reportService.GetComEstabReport(this.pdfComponent.data).subscribe({
      next: (response: any = {}) => {
        console.log('API Response:', response);
        reports = response.data || [];
        dist1 = response.districtOne || [];
        dist2 = response.districtTwo || [];

        if (!reports.length) {
          console.error('No reports data available');
          return;
        }

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

          // Split columns into chunks
          for (let i = 0; i < a.columnTypes.length; i += chunkSize) {
            columnChunks.push(a.columnTypes.slice(i, i + chunkSize));
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
              if (dataDistrict.district == 1) {
                tableData.push([
                  {
                    text: `1st Congressional District`,
                    colSpan: columnWidth.length,
                    alignment: 'left',
                    fillColor: '#526D82',
                  },
                ]);

                dist1.forEach((d1: any) => {
                  let data1: any = [{ text: d1.munCityName, fontSize: 10 }];

                  columnsChunk.forEach((header: any) => {
                    let count = '-';
                    (dataDistrict.lineBusiness || []).forEach((t: any) => {
                      if (header.recNo == t.lineBusiness) {
                        (t.data || []).forEach((f: any) => {
                          if (
                            d1.munCityId == f.munCityId &&
                            header.recNo == f.lineBusiness
                          ) {
                            count = f.countType;
                          }
                        });
                      }
                    });
                    data1.push({ text: count.toString(), fontSize: 10 });
                  });
                  tableData.push(data1);
                });

                columnsChunk.forEach((header: any) => {
                  let countSubtotal1 = '-';
                  (dataDistrict.lineBusiness || []).forEach((t: any) => {
                    if (header.recNo == t.lineBusiness) {
                      countSubtotal1 = t.subtotalType;
                    }
                  });
                  subtotal1.push({
                    text: countSubtotal1.toString(),
                    fillColor: '#9DB2BF',
                  });
                });
                tableData.push(subtotal1);
              }

              if (dataDistrict.district == 2) {
                tableData.push([
                  {
                    text: `2nd Congressional District`,
                    colSpan: columnWidth.length,
                    alignment: 'left',
                    fillColor: '#526D82',
                  },
                ]);

                dist2.forEach((d2: any) => {
                  let data2: any = [{ text: d2.munCityName, fontSize: 10 }];

                  columnsChunk.forEach((header: any) => {
                    let count = '-';
                    (dataDistrict.lineBusiness || []).forEach((t: any) => {
                      if (header.recNo == t.lineBusiness) {
                        (t.data || []).forEach((f: any) => {
                          if (
                            d2.munCityId == f.munCityId &&
                            header.recNo == f.lineBusiness
                          ) {
                            count = f.countType;
                          }
                        });
                      }
                    });
                    data2.push({ text: count.toString(), fontSize: 10 });
                  });
                  tableData.push(data2);
                });

                columnsChunk.forEach((header: any) => {
                  let countSubtotal2 = '-';
                  (dataDistrict.lineBusiness || []).forEach((t: any) => {
                    if (header.recNo == t.lineBusiness) {
                      countSubtotal2 = t.subtotalType;
                    }
                  });
                  subtotal2.push({
                    text: countSubtotal2.toString(),
                    fillColor: '#9DB2BF',
                  });
                });
                tableData.push(subtotal2);
              }
            });

            columnWidth.forEach((b: any, index: any) => {
              let grandTotalcount;
              if (index == 0) {
                grandTotalcount = 'GRAND TOTAL';
              } else {
                if (
                  subtotal1.length > 1 &&
                  subtotal2.length == 1 &&
                  index > 0
                ) {
                  grandTotalcount = subtotal1[index].text;
                }
                if (
                  subtotal2.length > 1 &&
                  subtotal1.length == 1 &&
                  index > 0
                ) {
                  grandTotalcount = subtotal2[index].text;
                }
                if (subtotal1.length > 1 && subtotal2.length > 1 && index > 0) {
                  let sub1 =
                    subtotal1[index].text == '-'
                      ? 0
                      : parseInt(subtotal1[index].text);
                  let sub2 =
                    subtotal2[index].text == '-'
                      ? 0
                      : parseInt(subtotal2[index].text);

                  if (
                    subtotal2[index].text == '-' &&
                    subtotal1[index].text == '-'
                  ) {
                    grandTotalcount = '-';
                  } else {
                    grandTotalcount = (sub1 + sub2).toString();
                  }
                }
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

  GetListCommercialEstab() {
    this.service.Get_Com_Estab().subscribe((data) => {
      this.ComEstab = <any>data;
      this.GetListComEstabCategory();
      this.GetListComEstabTypes();
    });
  }

  GetListComEstabCategory() {
    this.service.Get_Com_Estab_Cat().subscribe((data: any) => {
      this.list_of_category = data;
    });
  }

  GetListComEstabTypes() {
    this.service.Get_Com_Estab_Type().subscribe((data: any) => {
      this.list_of_Business = data;
    });
  }

  list_of_barangay() {
    this.service.ListBarangay().subscribe((data) => {
      this.barangays = <any>data;
      console.log('fgxtxgcvcgcf', this.barangays);
    });
  }
  Add_Com_Estab() {
    this.toValidate.brgyId =
      this.comm.brgyId == '' || this.comm.brgyId == null ? true : false;
    this.toValidate.permitNo =
      this.comm.permitNo == '' || this.comm.permitNo == undefined
        ? true
        : false;
    this.toValidate.estabName =
      this.comm.estabName == '' || this.comm.estabName == undefined
        ? true
        : false;
    this.toValidate.category =
      this.comm.category == '' || this.comm.category == undefined
        ? true
        : false;
    this.toValidate.status =
      this.comm.status == '' || this.comm.status == undefined ? true : false;
    this.toValidate.lineBusiness =
      this.comm.lineBusiness == '' || this.comm.lineBusiness == undefined
        ? true
        : false;
    this.toValidate.owner =
      this.comm.owner == '' || this.comm.owner == undefined ? true : false;

    if (
      this.toValidate.brgyId == true ||
      this.toValidate.permitNo == true ||
      this.toValidate.estab == true ||
      this.toValidate.category == true ||
      this.toValidate.status == true ||
      this.toValidate.lineBusiness == true ||
      this.toValidate.owner
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.comm.munCityId = this.auth.munCityId;
      this.comm.setYear = this.auth.setYear;
      this.comm.transId = this.date.transform(Date.now(), 'YYMM');
      //this.comm.tag = 1;
      this.service.Add_Com_Estab(this.comm).subscribe((request) => {
        if (!this.isCheck) {
          this.closebutton.nativeElement.click();
        }
        console.log(request);
        this.clearData();
        this.GetListCommercialEstab();

        console.log(request);
        Swal.fire('Good job!', 'Data Added Successfully!', 'success');

        this.comm = {};
        this.ComEstab.push(request);
      });
    }
  }

  edit_estab(edit_estab: any = {}) {
    this.editmodal = edit_estab;
    this.GetListCommercialEstab();
  }

  //for modal
  UpdateCommercial() {
    this.editmodal.longtitude = this.gmapComponent.markers.lng;
    this.editmodal.latitude = this.gmapComponent.markers.lat;

    this.toValidate.brgyId =
      this.editmodal.brgyId == '' || this.editmodal.brgyId == null
        ? true
        : false;
    this.toValidate.permitNo =
      this.editmodal.permitNo == '' || this.editmodal.permitNo == undefined
        ? true
        : false;
    this.toValidate.estabName =
      this.editmodal.estabName == '' || this.editmodal.estabName == undefined
        ? true
        : false;
    this.toValidate.category =
      this.editmodal.category == '' || this.editmodal.category == undefined
        ? true
        : false;
    this.toValidate.status =
      this.editmodal.status == '' || this.editmodal.status == undefined
        ? true
        : false;
    this.toValidate.lineBusiness =
      this.editmodal.lineBusiness == '' ||
      this.editmodal.lineBusiness == undefined
        ? true
        : false;
    this.toValidate.owner =
      this.editmodal.owner == '' || this.editmodal.owner == undefined
        ? true
        : false;

    if (
      this.toValidate.brgyId == true ||
      this.toValidate.permitNo == true ||
      this.toValidate.estab == true ||
      this.toValidate.category == true ||
      this.toValidate.status == true ||
      this.toValidate.lineBusiness == true ||
      this.toValidate.owner == true
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.service.Update_Com_Estab(this.editmodal).subscribe({
        next: (_data) => {
          // if (!this.isCheck) {
          //   this.closebutton.nativeElement.click();
          // }
          this.clearData();
          this.GetListCommercialEstab();
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
        for (let i = 0; i < this.ComEstab.length; i++) {
          if (this.ComEstab[i].transId == transId) {
            this.ComEstab.splice(i, 1);
            Swal.fire('Deleted!', 'Your file has been removed.', 'success');
          }
        }

        this.service.Delete_Com_Estab(transId).subscribe((_data) => {
          // this.MajorAct.splice(index,1);

          this.GetListCommercialEstab();
          // this.mjr = {};
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
      // this.Init();
      // this.mjr = {};
    });
  }

  onTableDataChange(page: any) {
    //paginate
    console.log(page);
    this.p = page;
  }
  onTableSizeChange(event: any) {
    //paginate
    this.tableSize = event.target.value;
    this.p = 1;
  }
  list_of_status = [
    { id: 1, status: 'NEW' },
    { id: 2, status: 'RENEW' },
    { id: 3, status: 'DELINQUENT' },
    { id: 4, status: 'RETIRED' },
  ];
}
