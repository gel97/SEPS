import { MajorEconomicService } from './../../../../../shared/Trade&_Industry/major-economic.service';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';

@Component({
  selector: 'app-major-economic-activities',
  templateUrl: './major-economic-activities.component.html',
  styleUrls: ['./major-economic-activities.component.css'],
})
export class MajorEconomicActivitiesComponent implements OnInit {
  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private service: MajorEconomicService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  message = 'Major Economic Activities';

  munCityName: string = this.auth.munCityName;

  toValidate: any = {};
  MajorAct: any = [];
  mjr: any = {};
  editmodal: any = {};
  searchText = '';

  isCheck: boolean = false;
  visible: boolean = true;
  not_visible: boolean = true;

  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };

  @ViewChild(PdfComponent)
  private pdfComponent!: PdfComponent;

  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
    console.log('isCheck:', this.isCheck);
  }

  clearData() {
    this.mjr = {};
    this.not_visible = false;
    this.visible = true;
    // this.required = false;
  }

  public showOverlay = false;
  importMethod() {
    this.showOverlay = true;
    this.service.Import().subscribe({
      next: (data) => {
        this.Init();
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
  GetListMjrcoAct(){
    this.service.GetMajorEco().subscribe((data) => {
      this.MajorAct = <any>data;
      this.MajorAct = this.MajorAct.filter((s: any) => s.tag == 1);
      console.log(this.MajorAct);
    });
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
          'MjrEcoAct'
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
                  this.GetListMjrcoAct();
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
 reports: any = [];
  GeneratePDF() {
    let data: any = [];
    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.reportService.GetMajorEcoReport(this.pdfComponent.data).subscribe({
      next: (response: any = {}) => {
        this.reports = response;
        console.log('result: ', response);

        this.reports.forEach((a: any) => {
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
            text: `Major Economic Activities by Municipality/City`,
            fontSize: 14,
            bold: true,
          },
            {
              text: `Year: ${response[0].setYear}`,
              fontSize: 14,
              bold: true,
              alignment: 'right'
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

        console.log("dist1Group ", dist1Group);

        const dist2Group = dist2.reduce((groups: any, item: any) => {
          const { munCityName } = item;
          const groupKey = `${munCityName}`;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(item);
          return groups;
        }, {});

        console.log("dist2Group ", dist2);

        tableData.push([
          {
            text: '#',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Major Economic Activity',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Description',
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
          },
        ]);

        for (const groupKey1 in dist1Group) { // Iterate district I data
          const group1 = dist1Group[groupKey1];
          const [cityName1] = groupKey1.split('-');
          tableData.push([
            {
              text: cityName1,
              colSpan: 3,
              alignment: 'left',
              fillColor: '#9DB2BF',
            },
          ]);

          group1.forEach((item: any, index: any) => {
               tableData.push([
            {
              text: index+1,
              fillColor: '#FFFFFF',
            },
            {
              text: item.mjrActivity,
              fillColor: '#FFFFFF',
            },
            {
              text: item.description,
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
          },
        ]);

        for (const groupKey2 in dist2Group) { // Iterate district II data
          const group2 = dist2Group[groupKey2];
          const [cityName2] = groupKey2.split('-');
          tableData.push([
            {
              text: cityName2,
              colSpan: 3,
              alignment: 'left',
              fillColor: '#9DB2BF',
            },
          ]);

          group2.forEach((item: any, index: any) => {
               tableData.push([
            {
              text: index+1,
              fillColor: '#FFFFFF',
            },
            {
              text: item.mjrActivity,
              fillColor: '#FFFFFF',
            },
            {
              text: item.description,
              fillColor: '#FFFFFF',
            },
          ]);

          });
        }

        const table = {
          margin: [0, 40, 0, 0],
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
        this.pdfService.GeneratePdf(data, isPortrait, "");
        console.log(data);
      },
    });
  }

  pageSize = 10;
  p: string | number | undefined;
  count: number = 1;
  tableSize: number = 20;
  tableSizes: any = [20, 40, 60, 80, 100];

  date = new DatePipe('en-PH');
  ngOnInit(): void {
    this.Init();
  }

  Init() {
    this.service.GetMajorEco().subscribe((data) => {
      console.log(data);
      this.MajorAct = <any>data;
      this.MajorAct = this.MajorAct.filter((s: any) => s.tag == 1);
      console.log(this.MajorAct);
    });
  }

  //searchBar
  onChangeSearch(e: any) {
    this.searchText = e.target.value;
  }

  AddMajorAct() {
    this.toValidate.mjrActivity =
      this.mjr.mjrActivity == '' || this.mjr.mjrActivity == undefined
        ? true
        : false;
    this.toValidate.description =
      this.mjr.description == '' || this.mjr.description == undefined
        ? true
        : false;

    if (
      this.toValidate.mjrActivity == true ||
      this.toValidate.description == true
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.mjr.munCityId = this.auth.munCityId;
      this.mjr.setYear = this.auth.setYear;
      this.mjr.transId = this.date.transform(Date.now(), 'YYMM');
      this.mjr.tag = 1;
      this.service.AddMajorEco(this.mjr).subscribe((request) => {
        if (!this.isCheck) {
          this.closebutton.nativeElement.click();
        }
        console.log(request);
        this.clearData();
        this.Init();

        console.log(request);
        Swal.fire('Good job!', 'Data Added Successfully!', 'success');
        //document.getElementById('close')?.click();
        this.mjr = {};
        this.MajorAct.push(request);
      });
    }
  }

  editmajor(editmajor: any = {}) {
    this.editmodal = editmajor;
    this.Init();
  }

  //for modal
  UpdateMajorAct() {
    this.toValidate.mjrActivity =
      this.editmodal.mjrActivity == '' ||
      this.editmodal.mjrActivity == undefined
        ? true
        : false;
    this.toValidate.description =
      this.editmodal.description == '' ||
      this.editmodal.description == undefined
        ? true
        : false;

    if (
      this.toValidate.mjrActivity == true ||
      this.toValidate.description == true
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.service.UpdateMajorEco(this.editmodal).subscribe({
        next: (_data) => {
          this.Init();
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
        for (let i = 0; i < this.MajorAct.length; i++) {
          if (this.MajorAct[i].transId == transId) {
            this.MajorAct.splice(i, 1);
            Swal.fire('Deleted', 'Removed successfully', 'success');
          }
        }

        this.service.DeleteMajorEco(transId).subscribe((_data) => {
          // this.MajorAct.splice(index,1);
          this.Init();
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
    this.Init();
  }
  onTableSizeChange(event: any) {
    //paginate
    this.tableSize = event.target.value;
    this.p = 1;
    this.Init();
  }
}
