import { IndustrialEstatesService } from './../../../../../shared/Trade&_Industry/industrial-estates.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';
import { ExcelComponent } from 'src/app/components/excel/excel.component';

@Component({
  selector: 'app-industrial-estates',
  templateUrl: './industrial-estates.component.html',
  styleUrls: ['./industrial-estates.component.css'],
})
export class IndustrialEstatesComponent implements OnInit {
  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;
  @ViewChild(ExcelComponent)
  private ExcelComponent!: ExcelComponent;
  @ViewChild(PdfComponent)
  private pdfComponent!: PdfComponent;

  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private service: IndustrialEstatesService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  munCityName: string = this.auth.munCityName;
  searchText: string = '';

  message = 'Industrial Estates';

  // status = "Completed"
  // disabledValue = false;
  toValidate: any = {};
  Industrial: any = [];
  industrial: any = {};
  editmodal: any = {};
  barangays: any = {};

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
    this.industrial = {};
    this.not_visible = false;
    this.visible = true;
    // this.required = false;
  }
  ExportExcel(){
    this.reportService.GetExcelExport(this.auth.setYear, this.auth.munCityId, "IndEst");
  }
  ExportTemplate(){
    this.reportService.GetExport_tamplate("IndEst");
  }

  GeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.reportService.GetIndustrialReport(this.pdfComponent.data).subscribe({
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
              text: `List of Industrial Estates by Municipality/City`,
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
            text: 'Name of Industrial Estate',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Area (Has)',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
           {
            text: 'No. of Locators',
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
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 5,
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
              colSpan: 5,
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
              text: item.name,
              fillColor: '#FFFFFF',
            },
            {
              text: item.area,
              fillColor: '#FFFFFF',
            },
             {
              text: item.locatorsNo,
              fillColor: '#FFFFFF',
            },
             {
              text: item.brgyName,
              fillColor: '#FFFFFF',
            }
             
          ]);

          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 5,
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
              colSpan: 5,
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
              text: item.name,
              fillColor: '#FFFFFF',
            },
            {
              text: item.area,
              fillColor: '#FFFFFF',
            },
             {
              text: item.locatorsNo,
              fillColor: '#FFFFFF',
            },
             {
              text: item.brgyName,
              fillColor: '#FFFFFF',
            },
          ]);

          });
        }

        const table = {
          margin: [0, 40, 0, 0],
          table: {
            widths: [25, '*', '*','*', '*'],
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

  public showOverlay = false;
  importMethod() {
    this.showOverlay = true;
    this.service.Import().subscribe({
      next: (data) => {
        this.ngOnInit();
        if(data.length === 0){
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
        }
        else
        {
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

  // Pagination
  pageSize = 25;
  p: string | number | undefined;
  count: number = 0;
  tableSize: number = 5;
  tableSizes: any = [5, 10, 15, 25, 50, 100];

  date = new DatePipe('en-PH');
  ngOnInit(): void {
    this.GetIndustrialEstates();
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

  GetIndustrialEstates() {
    this.service.GetIndustrial().subscribe((data) => {
      console.log(data);
      this.Industrial = <any>data;
      this.Industrial = this.Industrial.filter((s: any) => s.tag == 1);
      console.log(this.Industrial);
    });
  }

  //searchBar
  onChangeSearch(e: any) {
    this.searchText = e.target.value;
  }

  list_of_barangay() {
    this.service.ListBarangay().subscribe((data) => {
      this.barangays = <any>data;
      console.log('fgxtxgcvcgcf', this.barangays);
    });
  }

  Add_Industrial() {
    this.toValidate.name =
      this.industrial.name == '' || this.industrial.name == undefined
        ? true
        : false;
    this.toValidate.contactPerson =
      this.industrial.contactPerson == '' ||
      this.industrial.contactPerson == undefined
        ? true
        : false;
    this.toValidate.brgyId =
      this.industrial.brgyId == '' || this.industrial.brgyId == null
        ? true
        : false; //dropdown (category)
    this.toValidate.contactPerson =
      this.industrial.contactPerson == '' ||
      this.industrial.contactPerson == undefined
        ? true
        : false;
    this.toValidate.contactNo =
      this.industrial.contactNo == '' || this.industrial.contactNo == undefined
        ? true
        : false;
    this.toValidate.area =
      this.industrial.area == '' || this.industrial.area == undefined
        ? true
        : false;
    this.toValidate.locatorsNo =
      this.industrial.locatorsNo == '' ||
      this.industrial.locatorsNo == undefined
        ? true
        : false;
    //  this.toValidate.longtitude = this.industrial.longtitude =="" || this.industrial.longtitude ==undefined ?true:false;
    //  this.toValidate.longtitude = this.industrial.longtitude =="" || this.industrial.longtitude ==undefined ?true:false;

    // alert(this.industrial.contactPerson)

    if (
      this.toValidate.contactPerson == true ||
      this.toValidate.brgyId == true ||
      this.toValidate.contactPerson == true ||
      this.toValidate.contactNo == true ||
      this.toValidate.area == true ||
      this.toValidate.locatorsNo == true
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.industrial.munCityId = this.auth.munCityId;
      this.industrial.setYear = this.auth.setYear;
      this.industrial.transId = this.date.transform(Date.now(), 'YYMM');
      this.service.Add_Industrial(this.industrial).subscribe((request) => {
        if (!this.isCheck) {
          this.closebutton.nativeElement.click();
        }
        console.log(request);
        this.clearData();
        this.GetIndustrialEstates();

        console.log(request);
        Swal.fire('Good job!', 'Data Added Successfully!', 'success');
        // document.getElementById('close')?.click();
        this.industrial = {};
        this.Industrial.push(request);
      });
    }
  }

  editindustrial(editindustrial: any = {}) {
    this.editmodal = editindustrial;
    this.GetIndustrialEstates();
  }

  //for modal
  Update_Industrial() {
    this.editmodal.longtitude = this.gmapComponent.markers.lng;
    this.editmodal.latitude = this.gmapComponent.markers.lat;

    this.toValidate.name =
      this.editmodal.name == '' || this.editmodal.name == undefined
        ? true
        : false;
    this.toValidate.contactPerson =
      this.editmodal.contactPerson == '' ||
      this.editmodal.contactPerson == undefined
        ? true
        : false;
    this.toValidate.brgyId =
      this.editmodal.brgyId == '' || this.editmodal.brgyId == null
        ? true
        : false; //dropdown (category)
    this.toValidate.contactPerson =
      this.editmodal.contactPerson == '' ||
      this.editmodal.contactPerson == undefined
        ? true
        : false;
    this.toValidate.contactNo =
      this.editmodal.contactNo == '' || this.editmodal.contactNo == undefined
        ? true
        : false;
    this.toValidate.area =
      this.editmodal.area == '' || this.editmodal.area == undefined
        ? true
        : false;
    this.toValidate.locatorsNo =
      this.editmodal.locatorsNo == '' || this.editmodal.locatorsNo == undefined
        ? true
        : false;
    //  this.toValidate.longtitude = this.industrial.longtitude =="" || this.industrial.longtitude ==undefined ?true:false;
    //  this.toValidate.longtitude = this.industrial.longtitude =="" || this.industrial.longtitude ==undefined ?true:false;

    // alert(this.industrial.contactPerson)

    if (
      this.toValidate.contactPerson == true ||
      this.toValidate.brgyId == true ||
      this.toValidate.contactPerson == true ||
      this.toValidate.contactNo == true ||
      this.toValidate.area == true ||
      this.toValidate.locatorsNo == true
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.service.Update_Industrial(this.editmodal).subscribe({
        next: (_data) => {
          if (!this.isCheck) {
            this.closebutton.nativeElement.click();
          }
          this.clearData();
          this.GetIndustrialEstates();
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

  delete_Industrial(transId: any, index: any) {
    Swal.fire({
      text: 'Do you want to remove this file?',
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!',
    }).then((result) => {
      if (result.value) {
        for (let i = 0; i < this.Industrial.length; i++) {
          if (this.Industrial[i].transId == transId) {
            this.Industrial.splice(i, 1);
            Swal.fire('Deleted!', 'Your file has been removed.', 'success');
          }
        }

        this.service.Delete_Industrial(transId).subscribe((_data) => {
          this.GetIndustrialEstates();
          this.industrial = {};
          // this.MajorAct.splice(index,1);

          // this.Init();
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
    this.GetIndustrialEstates();
  }
  onTableSizeChange(event: any) {
    //paginate
    this.tableSize = event.target.value;
    this.p = 1;
    this.GetIndustrialEstates();
  }
}
