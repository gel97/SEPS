import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { AuthService } from 'src/app/services/auth.service';
import { EducationService } from 'src/app/shared/SocialProfile/Education/education.service';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';

@Component({
  selector: 'app-training-center',
  templateUrl: './training-center.component.html',
  styleUrls: ['./training-center.component.css'],
})
export class TrainingCenterComponent implements OnInit {
  menuId: string = '8';
  munCityName: string = this.auth.munCityName;
  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private service: EducationService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService
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
  }

  public showOverlay = false;
  message = 'Schools';
  importMethod() {
    this.showOverlay = true;
    this.service.Import(this.menuId).subscribe({
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
  munCityId: string = this.auth.munCityId;
  setYear: string = this.auth.setYear;

  isAdd: boolean = true;
  listSchool: any = [];
  school: any = {};
  listBarangay: any = [];

  Init() {
    this.GetListBarangay();
    this.GetListSchool();
  }

  GeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];
    this.pdfComponent.data.menuId = this.menuId;

    this.reportService.GetEducationReport(this.pdfComponent.data).subscribe({
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
              text: `List of Training Centers by Municipality/City`,
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
            text: 'Name of School',
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
            text: 'Contact Person',
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
            text: 'Courses Offered/ Remarks',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 6,
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
              colSpan: 6,
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
              text: item.brgyName,
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
             text: item.remarks,
             fillColor: '#FFFFFF',
           }
             
          ]);

          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 6,
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
              colSpan: 6,
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
                text: item.brgyName,
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
               text: item.remarks,
               fillColor: '#FFFFFF',
             }
               
            ]);

          });
        }

        const table = {
          margin: [0, 20, 0, 0],
          table: {
            widths: [25, '*', '*','*', '*', '*'],
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
        this.pdfService.GeneratePdf(data, isPortrait);
        console.log(data);
      },
    });
  }

  GetListBarangay() {
    this.service.ListOfBarangay(this.auth.munCityId).subscribe((data) => {
      this.listBarangay = <any>data;
    });
  }

  GetListSchool() {
    this.service
      .GetListEducation(this.menuId, this.setYear, this.munCityId)
      .subscribe({
        next: (response) => {
          this.listSchool = <any>response;
        },
        error: (error) => {
          Swal.fire('Oops!', 'Something went wrong.', 'error');
        },
        complete: () => {},
      });
  }

  AddSchool() {
    this.toValidate.name =
      this.school.name == '' || this.school.name == undefined ? true : false;

    this.toValidate.brgyId =
      this.school.brgyId == '' || this.school.brgyId == null ? true : false;

    this.school.menuId = this.menuId;
    this.school.setYear = this.setYear;
    this.school.munCityId = this.munCityId;

    if (
      !this.toValidate.name &&
      !this.toValidate.brgyId 
    ) {
      this.service.AddEducation(this.school).subscribe({
        next: (request) => {
          this.GetListSchool();
          this.school = {};
        },
        error: (error) => {
          Swal.fire('Oops!', 'Something went wrong.', 'error');
        },
        complete: () => {
          if (!this.isCheck) {
            this.closebutton.nativeElement.click();
          }
          this.school = {};
          this.GetListSchool();

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

  EditSchool() {
    this.toValidate.name =
      this.school.name == '' || this.school.name == undefined ? true : false;
    this.toValidate.teacherNo =
      this.school.teacherNo == '' || this.school.teacherNo == undefined
        ? true
        : false;
    this.toValidate.classroomNo =
      this.school.classroomNo == '' || this.school.classroomNo == undefined
        ? true
        : false;
    this.toValidate.classesNo =
      this.school.classesNo == '' || this.school.classesNo == undefined
        ? true
        : false;
    this.toValidate.brgyId =
      this.school.brgyId == '' || this.school.brgyId == null ? true : false;
    this.toValidate.enrollyNo =
      this.school.enrollyNo == '' || this.school.enrollyNo == undefined
        ? true
        : false;

    this.school.longtitude = this.gmapComponent.markers.lng;
    this.school.latitude = this.gmapComponent.markers.lat;

    this.school.menuId = this.menuId;
    this.school.setYear = this.setYear;
    this.school.munCityId = this.munCityId;

    if (
      !this.toValidate.name &&
      !this.toValidate.brgyId &&
      !this.toValidate.teacherNo &&
      !this.toValidate.classroomNo &&
      !this.toValidate.classesNo &&
      !this.toValidate.enrollyNo
    ) {
      this.service.EditEducation(this.school).subscribe({
        next: (request) => {
          this.GetListSchool();
          this.school = {};
        },
        error: (error) => {
          Swal.fire('Oops!', 'Something went wrong.', 'error');
        },
        complete: () => {
          // this.closebutton.nativeElement.click();
          Swal.fire('Good job!', 'Data Updated Successfully!', 'success');
          this.school = {};
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

  DeleteSchool(transId: any) {
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
        this.service.DeleteEducation(transId).subscribe((request) => {
          this.GetListSchool();
        });
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  }
}
