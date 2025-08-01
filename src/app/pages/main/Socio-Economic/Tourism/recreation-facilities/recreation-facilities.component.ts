import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { TourismService } from 'src/app/shared/Socio-Economic/Tourism/tourism.service';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';
import { SourceService } from 'src/app/shared/Source/Source.Service';

@Component({
  selector: 'app-recreation-facilities',
  templateUrl: './recreation-facilities.component.html',
  styleUrls: ['./recreation-facilities.component.css'],
})
export class RecreationFacilitiesComponent implements OnInit {
  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private Auth: AuthService,
    private Service: TourismService,
    private modifyService: ModifyCityMunService,
    private SourceService: SourceService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;
  @ViewChild(PdfComponent)
  private pdfComponent!: PdfComponent;

  isCheck: boolean = false;

  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
    console.log('isCheck:', this.isCheck);
  }

  message = 'Recreation Facilities';
  munCityName: string = this.Auth.munCityName;
  toValidate: any = {};
  menuId = '2';
  searchText = '';
  dataList: any = [];
  setYear = this.Auth.setYear;
  munCityId = this.Auth.munCityId;
  barangayList: any = [];
  addData: any = {};
  dummy_addData: any = {};
  dummyData: any = {};
  listofRecreation: any = [];
  visible: boolean = true;
  not_visible: boolean = true;
  //required == not_visible
  required: boolean = true;
  latitude: any;
  longtitude: any;
  checker_brgylist: any = {};
  sources: any = [];
  newSource: any = {};
  selectedSourceId: number | null = null;
  showAddForm: boolean = true;

  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };

  markerObj: any = {};

  SetMarker(data: any = {}) {
    console.log('lnglat: ', data.longtitude + ' , ' + data.latitude);

    if (data.longtitude == undefined && data.latitude == undefined) {
      data.longtitude = this.longtitude;
      data.latitude = this.latitude;
    }

    this.markerObj = {
      lat: data.latitude,
      lng: data.longtitude,
      label: data.brgyName.charAt(0),
      brgyName: data.brgyName,
      munCityName: this.munCityName,
      draggable: true,
    };
    this.gmapComponent.setMarker(this.markerObj);
    console.log('marker', this.markerObj);
  }
  ExportExcel() {
    this.reportService.GetExcelExport(
      this.Auth.setYear,
      this.Auth.munCityId,
      'Tourism'
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
          .PostImportWithMenuId(
            e.target.files[0],
            this.Auth.setYear,
            this.Auth.munCityId,
            'Tourism',
            '2'
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
                    this.GetListTourism();
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
    let columnTypes: any = [];
    let contentData: any = [];

    this.pdfComponent.data.menuId = this.menuId;

    this.reportService.GetTourismReport(this.pdfComponent.data).subscribe({
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
          fillColor: '#9DB2BF',
        });

        let subtotal2: any = [];
        subtotal2.push({
          text: 'SUB TOTAL',
          fillColor: '#9DB2BF',
        });

        columnTypes.forEach((b: any, index: any) => {
          // GET COLUMN
          if (index == 0) {
            columnWidth.push(100);
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

        tableData.push(columns); // PUSH COLUMN
        reports.forEach((a: any, index: any) => {
          if (a.district == 1) {
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
                data1.push(count);
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
                fillColor: '#9DB2BF',
              });
            }
            tableData.push(subtotal1);
          } // PUSH DISTRICT 1 SUBTOTAL

          if (a.district == 2) {
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
                data2.push(count);
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
                fillColor: '#9DB2BF',
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
              widths: columnWidth,
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
        let isPortrait = false;
        this.pdfService.GeneratePdf(data, isPortrait, '');
        console.log(data);
      },
    });
  }

  public showOverlay = false;
  importMethod() {
    this.showOverlay = true;
    this.Service.Import(this.menuId).subscribe({
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

  ngOnInit(): void {
    this.GetListTourism();
    this.GetBarangayList();
    this.getSources();
  }
  getSources(): void {
    const setYear = this.Auth.activeSetYear;
    const munCityId = this.Auth.munCityId;
    const sourceFor = 'recration';

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

    const sourceFor = 'recration'; // 👈 assign your module name

    // ✅ Add metadata
    this.newSource.munCityId = this.Auth.munCityId;
    this.newSource.setYear = this.Auth.activeSetYear;
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

  GetListTourism() {
    this.Service.GetListTourism(
      this.menuId,
      this.setYear,
      this.munCityId
    ).subscribe((response) => {
      this.dataList = <any>response;
      console.log('check', response);
      this.GetTourismTypeList();
    });
  }

  GetTourismTypeList() {
    this.Service.GetTourismTypeList().subscribe((response) => {
      console.log('recreationList:', response);
      this.listofRecreation = <any>response;
    });
  }

  GetBarangayList() {
    this.Service.GetBarangayList(this.munCityId).subscribe((response) => {
      this.barangayList = <any>response;
      console.log('barangay', response);
    });
  }

  findBrgyId(brgyId: any) {
    return this.barangayList.find(
      (item: { brgyId: any }) => item.brgyId === brgyId
    );
  }

  AddTourism() {
    this.toValidate.brgyId =
      this.addData.brgyId == '' || this.addData.brgyId == null ? true : false;
    this.toValidate.name =
      this.addData.name == '' || this.addData.name == undefined ? true : false;

    if (this.toValidate.brgyId == true || this.toValidate.name == true) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      console.log('trap', this.addData);
      console.log('brgyid', this.addData.brgyId);
      this.dummy_addData = this.addData;
      console.log('trap_2', this.dummy_addData);
      if (
        JSON.stringify(this.dummy_addData) != JSON.stringify(this.dummyData) &&
        this.addData.brgyId != undefined
      ) {
        this.addData.setYear = this.setYear;
        this.addData.munCityId = this.munCityId;
        this.addData.menuId = this.menuId;
        console.log('brgylist', this.barangayList);

        const result = this.findBrgyId(this.addData.brgyId);
        this.longtitude = result.longitude;
        this.addData.longtitude = this.longtitude;
        console.log('long', this.longtitude);
        this.latitude = result.latitude;
        this.addData.latitude = this.latitude;
        console.log('lat', this.latitude);

        this.Service.AddTourism(this.addData).subscribe((request) => {
          if (!this.isCheck) {
            this.closebutton.nativeElement.click();
          }
          console.log('add', request);
          this.clearData();
          this.GetListTourism();
          Swal.fire('Good job!', 'Data Added Successfully!', 'success');
        });
      } else {
        this.required = true;
        Swal.fire({
          icon: 'warning',
          title: 'Oops...',
          text: 'Missing data!',
        });
      }
    }
  }

  EditTourism() {
    this.toValidate.brgyId =
      this.addData.brgyId == '' || this.addData.brgyId == null ? true : false;
    this.toValidate.name =
      this.addData.name == '' || this.addData.name == undefined ? true : false;

    if (this.toValidate.brgyId == true || this.toValidate.name == true) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.addData.longtitude = this.gmapComponent.markers.lng;
          this.addData.latitude = this.gmapComponent.markers.lat;

          this.addData.setYear = this.setYear;
          this.closebutton.nativeElement.click();
          this.addData.munCityId = this.munCityId;
          this.addData.menuId = this.menuId;
          this.addData.tag = 1;
          console.log('edit', this.addData);
          this.Service.EditTourism(this.addData).subscribe((request) => {
            console.log('edit', request);
            this.GetListTourism();
          });
          Swal.fire('Saved!', '', 'success');
          document.getElementById('exampleModal')?.click();
        } else if (result.isDenied) {
          Swal.fire('Changes are not saved', '', 'info');
        }
      });
    }
  }
  DeleteTourism(dataItem: any) {
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
        this.Service.DeleteTourism(dataItem.transId).subscribe((request) => {
          this.GetListTourism();
        });
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  }

  clearData() {
    this.addData = {};
    this.not_visible = false;
    this.visible = true;
    this.required = false;
  }

  parentMethod() {
    // alert('parent Method');
    this.addData = {};
    this.not_visible = false;
    this.visible = true;
    this.required = false;
  }

  editToggle() {
    this.not_visible = true;
    this.visible = false;
  }
}
