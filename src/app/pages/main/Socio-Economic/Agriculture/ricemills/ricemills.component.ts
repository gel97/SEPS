import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AgricultureService } from 'src/app/shared/Socio-Economic/Agriculture/agriculture.service';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';
import { SourceService } from 'src/app/shared/Source/Source.Service';
@Component({
  selector: 'app-ricemills',
  templateUrl: './ricemills.component.html',
  styleUrls: ['./ricemills.component.css'],
})
export class RicemillsComponent implements OnInit {
  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private Auth: AuthService,
    private Service: AgricultureService,
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

  munCityName: string = this.Auth.munCityName;

  message = 'Ricemills';

  menuId = '5';
  toValidate: any = {};
  dataList: any = [];
  addData: any = {};
  barangayList: any = [];
  listofRicemill: any = [];
  visible: boolean = true;
  not_visible: boolean = true;
  dummy_addData: any = {};
  dummyData: any = {};

  required: boolean = true;
  latitude: any;
  longtitude: any;

  setYear = this.Auth.setYear;
  munCityId = this.Auth.munCityId;
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
            'Agriculture',
            '5'
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
                    this.GetListAgriculture();
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
    this.GetListAgriculture();
    this.GetBarangayList();
    this.getSources();
  }
  getSources(): void {
    const setYear = this.Auth.activeSetYear;
    const munCityId = this.Auth.munCityId;
    const sourceFor = 'ricemills';

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

    const sourceFor = 'ricemills'; // 👈 assign your module name

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

  GeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];
    this.pdfComponent.data.menuId = this.menuId;

    this.reportService.GetAgricultureReport(this.pdfComponent.data).subscribe({
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
            this.listofRicemill.forEach((a: any) => {
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
            this.listofRicemill.forEach((a: any) => {
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

  GetListAgriculture() {
    this.Service.GetListAgriculture(
      this.menuId,
      this.setYear,
      this.munCityId
    ).subscribe((response) => {
      this.dataList = <any>response;
      this.GetListRicemillTypes();
    });
  }

  GetListRicemillTypes() {
    this.Service.GetListRicemillTypes().subscribe((response) => {
      this.listofRicemill = <any>response;
    });
  }

  GetBarangayList() {
    this.Service.GetBarangayList(this.munCityId).subscribe((response) => {
      this.barangayList = <any>response;
    });
  }

  findBrgyId(brgyId: any) {
    return this.barangayList.find(
      (item: { brgyId: any }) => item.brgyId === brgyId
    );
  }

  AddAgriculture() {
    this.toValidate.brgyId =
      this.addData.brgyId == '' || this.addData.brgyId == null ? true : false;
    this.toValidate.type =
      this.addData.type == '' || this.addData.type == undefined ? true : false;
    this.toValidate.capacity =
      this.addData.capacity == '' || this.addData.capacity == undefined
        ? true
        : false;
    this.toValidate.area =
      this.addData.area == '' || this.addData.area == undefined ? true : false;
    this.toValidate.name =
      this.addData.name == '' || this.addData.name == undefined ? true : false;

    if (
      this.toValidate.brgyId == true ||
      this.toValidate.name == true ||
      this.toValidate.capacity == true ||
      this.toValidate.area == true ||
      this.toValidate.area == true
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.dummy_addData = this.addData;
      if (
        JSON.stringify(this.dummy_addData) != JSON.stringify(this.dummyData) &&
        this.addData.brgyId != undefined
      ) {
        this.addData.setYear = this.setYear;
        this.addData.munCityId = this.munCityId;
        this.addData.menuId = this.menuId;

        const result = this.findBrgyId(this.addData.brgyId);
        this.longtitude = result.longitude;
        this.addData.longtitude = this.longtitude;
        console.log('long', this.longtitude);
        this.latitude = result.latitude;
        this.addData.latitude = this.latitude;
        console.log('lat', this.latitude);

        this.Service.AddAgriculture(this.addData).subscribe((request) => {
          if (!this.isCheck) {
            this.closebutton.nativeElement.click();
          }

          console.log('add', request);
          this.GetListAgriculture();
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

  EditAgriculture() {
    this.toValidate.brgyId =
      this.addData.brgyId == '' || this.addData.brgyId == null ? true : false;
    this.toValidate.type =
      this.addData.type == '' || this.addData.type == undefined ? true : false;
    this.toValidate.capacity =
      this.addData.capacity == '' || this.addData.capacity == undefined
        ? true
        : false;
    this.toValidate.area =
      this.addData.area == '' || this.addData.area == undefined ? true : false;
    this.toValidate.name =
      this.addData.name == '' || this.addData.name == undefined ? true : false;
    if (
      this.toValidate.brgyId == true ||
      this.toValidate.name == true ||
      this.toValidate.capacity == true ||
      this.toValidate.area == true ||
      this.toValidate.area == true
    ) {
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
          this.Service.EditAgriculture(this.addData).subscribe((request) => {
            console.log('edit', request);
            this.GetListAgriculture();
          });
          Swal.fire('Saved!', '', 'success');
          document.getElementById('exampleModal')?.click();
        } else if (result.isDenied) {
          Swal.fire('Changes are not saved', '', 'info');
        }
      });
    }
  }

  DeleteAgriculture(dataItem: any) {
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
        this.Service.DeleteAgriculture(dataItem.transId).subscribe(
          (request) => {
            this.GetListAgriculture();
          }
        );
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  }
}
