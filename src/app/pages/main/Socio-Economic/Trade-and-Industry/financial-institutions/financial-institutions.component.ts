import { FinancialInstitutionsService } from './../../../../../shared/Trade&_Industry/financial-institutions.service';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { SepDataService } from 'src/app/shared/Tools/sep-data.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';
import { PdfService } from 'src/app/services/pdf.service';

@Component({
  selector: 'app-financial-institutions',
  templateUrl: './financial-institutions.component.html',
  styleUrls: ['./financial-institutions.component.css'],
})
export class FinancialInstitutionsComponent implements OnInit {
  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;

  list_sep_year: any = [];
  filter_sep_year: any = [];
  pdf_data: any = {};
  list_cat_type: any = [];

  list_of_category = [
    { id: 1, name_category: 'Commercial Bank' },
    { id: 2, name_category: 'Thrift Bank' },
    { id: 3, name_category: 'Government-owned Bank' },
    { id: 4, name_category: 'Rural Bank' },
    { id: 5, name_category: 'Insurance Company/ Pre-need plans' },
    { id: 6, name_category: 'Cooperative' },
    { id: 7, name_category: 'Lending Investor/ Credit Union' },
    { id: 8, name_category: 'Money Remittance Center/ Pawnshop' },
    { id: 9, name_category: 'Money Changers/ Foreign Exchange' },
    { id: 10, name_category: 'others' },
  ];

  errorinput: any;

  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private sepDataService: SepDataService,
    private service: FinancialInstitutionsService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService
  ) {
    this.pdf_data.year = this.auth.activeSetYear - 1;
    this.pdf_data.allMunCity = true;
    this.pdf_data.munCityId = this.auth.munCityId;
  }

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }
  munCityName: string = this.auth.munCityName;
  searchText: string = '';

  toValidate: any = {};
  Financial: any = [];
  barangays: any = [];
  financial: any = {};
  editmodal: any = {};

  message = 'Financial Institutions';

  //Updatelocation:any={};

  // Pagination
  pageSize = 10;
  p: string | number | undefined;
  count: number = 0;
  tableSize: number = 5;
  tableSizes: any = [5, 15, 25, 50, 100];

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
    this.financial = {};
    this.not_visible = false;
    this.visible = true;
    // this.required = false;
  }
  Maps() {
    var seps = 'SepsId?ModuleId=2&MunCityId=112314';

    var decoded = btoa(seps);
    var url = 'http://172.16.19.108/gis/seps/' + decoded;
    console.log(url);
    window.open(url, '_blank');
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

  date = new DatePipe('en-PH');
  ngOnInit(): void {
    this.GetListFinancial();
    this.list_of_barangay();
    this.GetListSepYear();
    this.GetListCatType();
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
            'FinIns'
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
                    this.GetListFinancial();
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

  generatePdf(cat: number) {
    this.pdf_data.allMunCity = this.pdf_data.allMunCity ? 1 : 0;
    let data: any = [];
    const columnsData: any = [];
    const columnsWidth: any = [];
    let countWidth: number = 0;

    let reports: any = [];
    let pdf_title: string = '';

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];
    console.log('cat :', cat);
    if (cat == 1) {
      pdf_title = 'Banking Institutions';
      countWidth = 4;
      columnsData.push(
        {
          text: '#',
          fillColor: 'black',
          color: 'white',
          bold: true,
          alignment: 'center',
        },
        {
          text: 'Name of Bank',
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
          text: 'Barangay',
          fillColor: 'black',
          color: 'white',
          bold: true,
          alignment: 'center',
        }
      );
    }
    if (cat == 2) {
      pdf_title = 'Cooperatives';
      countWidth = 7;
      columnsData.push(
        {
          text: '#',
          fillColor: 'black',
          color: 'white',
          bold: true,
          alignment: 'center',
        },
        {
          text: 'Name of Cooperative',
          fillColor: 'black',
          color: 'white',
          bold: true,
          alignment: 'center',
        },
        {
          text: 'Contact Person/ Designation',
          fillColor: 'black',
          color: 'white',
          bold: true,
          alignment: 'center',
        },
        {
          text: 'Contact Details',
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
          text: 'No. of Members',
          fillColor: 'black',
          color: 'white',
          bold: true,
          alignment: 'center',
        },
        {
          text: 'Total Assets',
          fillColor: 'black',
          color: 'white',
          bold: true,
          alignment: 'center',
        }
      );
    }
    if (cat == 3) {
      pdf_title = 'Insurance Company';
      countWidth = 4;
      columnsData.push(
        {
          text: '#',
          fillColor: 'black',
          color: 'white',
          bold: true,
          alignment: 'center',
        },
        {
          text: 'Name of Bank',
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
          text: 'Barangay',
          fillColor: 'black',
          color: 'white',
          bold: true,
          alignment: 'center',
        }
      );
    }
    if (cat == 4) {
      pdf_title = 'Financial Institutions';
      countWidth = 4;
      columnsData.push(
        {
          text: '#',
          fillColor: 'black',
          color: 'white',
          bold: true,
          alignment: 'center',
        },
        {
          text: 'Name of Institution',
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
          text: 'Barangay',
          fillColor: 'black',
          color: 'white',
          bold: true,
          alignment: 'center',
        }
      );
    }

    for (let index = 0; index < countWidth; index++) {
      if (index === 0) {
        columnsWidth.push(25);
      }
      if (index > 0) {
        columnsWidth.push('*');
      }
    }

    this.reportService.GetFinancialInsReport(this.pdf_data).subscribe({
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
              text: `List of ${pdf_title} by Municipality/City`,
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
        console.log('columnsData ', columnsData);
        console.log('columnsWidth ', columnsWidth);

        tableData.push(columnsData);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: countWidth,
            alignment: 'left',
            fillColor: '#526D82',
          },
        ]);

        for (const groupKey1 in dist1Group) {
          // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: countWidth,
              alignment: 'left',
              fillColor: '#9DB2BF',
            },
          ]);

          if (cat == 1) {
            group1.forEach((item: any, index: any) => {
              tableData.push([
                {
                  text: index + 1,
                  fillColor: '#FFFFFF',
                },
                {
                  text: item.name,
                  fillColor: '#FFFFFF',
                },
                {
                  text: item.catName,
                  fillColor: '#FFFFFF',
                },
                {
                  text: item.brgyName,
                  fillColor: '#FFFFFF',
                },
              ]);
            });
          }
          if (cat == 2) {
            group1.forEach((item: any, index: any) => {
              tableData.push([
                {
                  text: index + 1,
                  fillColor: '#FFFFFF',
                },
                {
                  text: item.name,
                  fillColor: '#FFFFFF',
                },
                {
                  text: item.contactPerson,
                  fillColor: '#FFFFFF',
                },
                {
                  text: item.contactNo,
                  fillColor: '#FFFFFF',
                },
                {
                  text: item.brgyName,
                  fillColor: '#FFFFFF',
                },
                {
                  text: item.members,
                  fillColor: '#FFFFFF',
                },
                {
                  text: item.totAssets,
                  fillColor: '#FFFFFF',
                },
              ]);
            });
          }
          if (cat == 3) {
            group1.forEach((item: any, index: any) => {
              tableData.push([
                {
                  text: index + 1,
                  fillColor: '#FFFFFF',
                },
                {
                  text: item.name,
                  fillColor: '#FFFFFF',
                },
                {
                  text: item.catName,
                  fillColor: '#FFFFFF',
                },
                {
                  text: item.brgyName,
                  fillColor: '#FFFFFF',
                },
              ]);
            });
          }
          if (cat == 4) {
            group1.forEach((item: any, index: any) => {
              tableData.push([
                {
                  text: index + 1,
                  fillColor: '#FFFFFF',
                },
                {
                  text: item.name,
                  fillColor: '#FFFFFF',
                },
                {
                  text: item.catName,
                  fillColor: '#FFFFFF',
                },
                {
                  text: item.brgyName,
                  fillColor: '#FFFFFF',
                },
              ]);
            });
          }
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: countWidth,
            alignment: 'left',
            fillColor: '#526D82',
          },
        ]);

        for (const groupKey2 in dist2Group) {
          // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: countWidth,
              alignment: 'left',
              fillColor: '#9DB2BF',
            },
          ]);

          if (cat == 1) {
            group2.forEach((item: any, index: any) => {
              tableData.push([
                {
                  text: index + 1,
                  fillColor: '#FFFFFF',
                },
                {
                  text: item.name,
                  fillColor: '#FFFFFF',
                },
                {
                  text: item.catName,
                  fillColor: '#FFFFFF',
                },
                {
                  text: item.brgyName,
                  fillColor: '#FFFFFF',
                },
              ]);
            });
          }
          if (cat == 2) {
            group2.forEach((item: any, index: any) => {
              tableData.push([
                {
                  text: index + 1,
                  fillColor: '#FFFFFF',
                },
                {
                  text: item.name,
                  fillColor: '#FFFFFF',
                },
                {
                  text: item.contactPerson,
                  fillColor: '#FFFFFF',
                },
                {
                  text: item.contactNo,
                  fillColor: '#FFFFFF',
                },
                {
                  text: item.brgyName,
                  fillColor: '#FFFFFF',
                },
                {
                  text: item.members,
                  fillColor: '#FFFFFF',
                },
                {
                  text: item.totAssets,
                  fillColor: '#FFFFFF',
                },
              ]);
            });
          }
          if (cat == 3) {
            group2.forEach((item: any, index: any) => {
              tableData.push([
                {
                  text: index + 1,
                  fillColor: '#FFFFFF',
                },
                {
                  text: item.name,
                  fillColor: '#FFFFFF',
                },
                {
                  text: item.catName,
                  fillColor: '#FFFFFF',
                },
                {
                  text: item.brgyName,
                  fillColor: '#FFFFFF',
                },
              ]);
            });
          }
          if (cat == 4) {
            group2.forEach((item: any, index: any) => {
              tableData.push([
                {
                  text: index + 1,
                  fillColor: '#FFFFFF',
                },
                {
                  text: item.name,
                  fillColor: '#FFFFFF',
                },
                {
                  text: item.catName,
                  fillColor: '#FFFFFF',
                },
                {
                  text: item.brgyName,
                  fillColor: '#FFFFFF',
                },
              ]);
            });
          }
        }

        const table = {
          margin: [0, 10, 0, 0],
          table: {
            widths: columnsWidth,
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
  GetListCatType() {
    this.service.GetListCatType().subscribe({
      next: (response) => {
        this.list_cat_type = <any>response;
        this.pdf_data.category = this.list_cat_type[0].recNo;
      },
      error: () => {},
      complete: () => {},
    });
  }

  GetListSepYear() {
    this.sepDataService.ListSepYear().subscribe({
      next: (response) => {
        this.list_sep_year = <any>response;
      },
      error: () => {},
      complete: () => {
        this.FilterByNotActiveYear();
      },
    });
  }
  FilterByNotActiveYear() {
    this.filter_sep_year = [];

    this.list_sep_year.forEach((a: any) => {
      if (a.isActive == 0) {
        this.filter_sep_year.push(a);
      }
    });
  }
  //searchBar
  onChangeSearch(e: any) {
    this.searchText = e.target.value;
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

  GetListFinancial() {
    this.service.GetFinancial().subscribe((data) => {
      this.Financial = <any>data;
      // this.Financial=this.Financial.filter((s:any) => s.tag == 1);
      console.log(this.Financial);
    });
  }

  list_of_barangay() {
    this.service.ListBarangay().subscribe((data) => {
      this.barangays = <any>data;
      console.log('fgxtxgcvcgcf', this.barangays);
    });
  }

  Add_Financial() {
    this.toValidate.name =
      this.financial.name == '' || this.financial.name == null ? true : false;
    this.toValidate.category =
      this.financial.category == '' || this.financial.category == null
        ? true
        : false;
    this.toValidate.members =
      this.financial.members == '' || this.financial.members == undefined
        ? true
        : false;
    this.toValidate.totAssets =
      this.financial.totAssets == '' || this.financial.totAssets == undefined
        ? true
        : false;
    this.toValidate.brgyId =
      this.financial.brgyId == '' || this.financial.brgyId == null
        ? true
        : false;

    if (
      this.toValidate.category == true ||
      this.toValidate.name == true ||
      this.toValidate.members == true ||
      this.toValidate.totAssets == true ||
      this.toValidate.brgyI == true
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.financial.munCityId = this.auth.munCityId;
      this.financial.setYear = this.auth.setYear;
      this.financial.transId = this.date.transform(Date.now(), 'YYMM');
      //this.comm.tag = 1;
      this.service.Add_Financial_Ins(this.financial).subscribe(
        (request) => {
          if (!this.isCheck) {
            this.closebutton.nativeElement.click();
          }
          console.log(request);
          this.clearData();
          this.GetListFinancial();

          console.log(request);
          Swal.fire('Good job!', 'Data Added Successfully!', 'success');

          this.financial = {};
          this.Financial.push(request);
        },
        (err) => {
          console.log(err.error);
          this.errorinput = err.error;
        }
      );
    }
  }

  edit_fin(edit_fin: any = {}) {
    this.editmodal = edit_fin;
    this.GetListFinancial();
  }

  //for modal
  UpdateFinancial() {
    this.editmodal.longtitude = this.gmapComponent.markers.lng;
    this.editmodal.latitude = this.gmapComponent.markers.lat;
    this.toValidate.name =
      this.editmodal.name == '' || this.editmodal.name == null ? true : false;
    this.toValidate.category =
      this.editmodal.category == '' || this.editmodal.category == null
        ? true
        : false;
    this.toValidate.members =
      this.editmodal.members == '' || this.editmodal.members == undefined
        ? true
        : false;
    this.toValidate.totAssets =
      this.editmodal.totAssets == '' || this.editmodal.totAssets == undefined
        ? true
        : false;
    this.toValidate.brgyId =
      this.editmodal.brgyId == '' || this.editmodal.brgyId == null
        ? true
        : false;

    if (
      this.toValidate.category == true ||
      this.toValidate.name == true ||
      this.toValidate.members == true ||
      this.toValidate.totAssets == true ||
      this.toValidate.brgyI == true
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.service.Update_Financial_Ins(this.editmodal).subscribe({
        next: (_data) => {
          this.GetListFinancial();
        },
      });

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Your work has been updated',
        showConfirmButton: false,
        timer: 1000,
      });
      document.getElementById('exampleModal_EDIT')?.click();
      this.editmodal = {};
      this.GetListFinancial();
    }
  }

  deleteFinancial(transId: any, index: any) {
    Swal.fire({
      text: 'Do you want to remove this file?',
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!',
    }).then((result) => {
      if (result.value) {
        for (let i = 0; i < this.Financial.length; i++) {
          if (this.Financial[i].transId == transId) {
            this.Financial.splice(i, 1);
            Swal.fire('Deleted!', 'Your file has been removed.', 'success');
          }
        }

        this.service.Delete_Financial_Ins(transId).subscribe((_data) => {
          this.GetListFinancial();
          // this.Financial.splice(index,1);

          // this.Init();
          // this.mjr = {};
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
      // this.Init();
      // this.mjr = {};
    });
  }

  onTableDataChange2(page: any) {
    //paginate
    console.log(page);
    this.p = page;
  }
  onTableSizeChange2(event: any) {
    //paginate
    this.tableSize = event.target.value;
    this.p = 1;
  }
}
