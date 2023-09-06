import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AssociationService } from 'src/app/shared/SocialProfile/Association/association.service';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';

@Component({
  selector: 'app-commercial',
  templateUrl: './commercial.component.html',
  styleUrls: ['./commercial.component.css'],
})
export class CommercialComponent implements OnInit {
  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;

  @ViewChild(PdfComponent)
  private pdfComponent!: PdfComponent;

  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private Auth: AuthService,
    private service: AssociationService,
    private modifyService: ModifyCityMunService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  menuId = '4';
  munCityId = this.Auth.munCityId;
  munCityName: string = this.Auth.munCityName;
  munName = this.Auth.munCityName;
  setYear = Number(this.Auth.setYear);

  addData: any = {};
  editData: any = {};
  listData: any = {};
  listBarangayData: any = [];
  idCounter: number = 1;
  updateForm: boolean = false;
  markerObj: any = {};
  toValidate: any = {};
  latitude: any;
  longtitude: any;

  ngOnInit(): void {
    this.resetForm();
    this.getListOfBarangay();
    this.GetAssociation();
  }

  public showOverlay = false;
  message = 'Commercial/ Industrial/ Labor Organizations';
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
  GeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.pdfComponent.data.menuId = this.menuId;

    this.reportService.GetAssociationReport(this.pdfComponent.data).subscribe({
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
          margin: [0, 20, 0, 0],
          columns: [
            {
              text: `List of Commercial/ Industrial/ Labor Organizations by Municipality/ City`,
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
            text: 'Name',
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
          },
          {
            text: 'Remarks',
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
            text: 'Location',
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
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 8,
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
              colSpan: 8,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group1.forEach((item: any, index: any) => {    
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
                text: item.membersNo,
                fillColor: '#FFFFFF',
                alignment: 'center'
              },
              {
                text: item.totalAssets,
                fillColor: '#FFFFFF',
                alignment: 'center'
              },
              {
                text: item.remarks,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
                alignment: 'center'
              },
              {
                text: item.location,
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
            colSpan: 8,
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
              colSpan: 8,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group2.forEach((item: any, index: any) => {
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
                text: item.membersNo,
                fillColor: '#FFFFFF',
                alignment: 'center'
              },
              {
                text: item.totalAssets,
                fillColor: '#FFFFFF',
                alignment: 'center'
              },
              {
                text: item.remarks,
                fillColor: '#FFFFFF',
              },
              {
                text: item.contactNo,
                fillColor: '#FFFFFF',
                alignment: 'center'
              },
              {
                text: item.location,
                fillColor: '#FFFFFF',
              },
              {
                text: item.brgyName,
                fillColor: '#FFFFFF',
              }
            ]);
          });
        }

        const table = {
          margin: [0, 20, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*', '*', '*', '*'],
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

  resetForm(): void {
    this.addData = {};
  }

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
      munCityName: this.munName,
      draggable: true,
    };
    this.gmapComponent.setMarker(this.markerObj);
    console.log('marker', this.markerObj);
  }

  GetAssociation(): void {
    this.service
      .GetAssociation(this.menuId, this.setYear, this.munCityId)
      .subscribe({
        next: (response) => {
          this.listData = response;
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          console.log('GetAssociations() completed.');
        },
      });
  }

  AddAssociation(addData: any): void {
    this.toValidate.brgyId =
      this.addData.brgyId == '' || this.addData.brgyId == null ? true : false;
    this.toValidate.name =
      this.addData.estabName == '' || this.addData.name == undefined
        ? true
        : false;

    if (this.toValidate.brgyId == true || this.toValidate.name == true) {
      Swal.fire('', 'Please fill out the required fields', 'warning');
    } else {
      this.addData.longtitude = this.gmapComponent.markers.lng;
      this.addData.latitude = this.gmapComponent.markers.lat;
      this.addData.setYear = Number(this.setYear);
      this.addData.menuId = String(this.menuId);
      this.addData.id = this.idCounter++;
      this.service.AddAssociation(this.addData).subscribe({
        next: (response) => {
          this.listData.push(response);
          console.log(response);
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Your work has been saved',
            showConfirmButton: false,
            timer: 1000,
          });
          this.resetForm();
        },
        error: (err) => {
          console.log(err);
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Something went wrong!',
            text: err.message,
            showConfirmButton: false,
            timer: 3000,
          });
        },
        complete: () => {
          console.log('AddAssociations() completed.');
        },
      });
    }
  }

  //   AddAssociation(addData: any): void {
  //         addData.longtitude = this.gmapComponent.markers.lng;
  //         addData.latitude = this.gmapComponent.markers.lat;
  //         addData.setYear = Number(this.setYear);
  //         addData.menuId = String(this.menuId);
  //         addData.location = this.munName;
  //         addData.id = this.idCounter++;
  //         this.service.AddAssociation(addData).subscribe({
  //             next: (response) => {
  //                 this.listData.push(response);
  //                 console.log(response);
  //                 Swal.fire({
  //                     position: 'center',
  //                     icon: 'success',
  //                     title: 'Your work has been saved',
  //                     showConfirmButton: false,
  //                     timer: 1000,
  //                 });
  //                 this.resetForm();
  //             },
  //             error: (err) => {
  //                 console.log(err);
  //                 Swal.fire({
  //                     position: 'center',
  //                     icon: 'error',
  //                     title: 'Something went wrong!',
  //                     text: err.message,
  //                     showConfirmButton: false,
  //                     timer: 3000,
  //                 });
  //             },
  //             complete: () => {
  //                 console.log('AddAssociations() completed.');
  //             },
  //         });

  // }

  EditAssociation(): void {
    this.toValidate.brgyId =
      this.addData.brgyId == '' || this.addData.brgyId == null ? true : false;
    this.toValidate.name =
      this.addData.estabName === '' || this.addData.name == undefined
        ? true
        : false;

    if (this.toValidate.brgyId == true || this.toValidate.name == true) {
      Swal.fire('', 'Please fill out the required fields', 'warning');
    } else {
      // this.gmapComponent.markers.lat = this.GetAssociation();
      // this.gmapComponent.markers.lng = this.GetAssociation();

      this.addData.longtitude = this.gmapComponent.markers.lng;
      this.addData.latitude = this.gmapComponent.markers.lat;

      this.service.EditAssociation(this.addData).subscribe({
        next: (response) => {
          this.GetAssociation();

          this.addData.longtitude = this.gmapComponent.markers.lng;
          this.addData.latitude = this.gmapComponent.markers.lat;

          //this.listData.push(response);
          console.log(response);
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Your work has been updated',
            showConfirmButton: false,
            timer: 1000,
          });
          this.resetForm();
        },
        error: (err) => {
          console.log(err);
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Something went wrong!',
            text: err.message,
            showConfirmButton: false,
            timer: 3000,
          });
        },
        complete: () => {
          console.log('UpdateAssociation() completed.');
        },
      });
    }
  }

  DeleteAssociation(id: any): void {
    Swal.fire({
      title: 'Are you sure you want to delete this Organization Record?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.DeleteAssociation(id).subscribe({
          next: (response) => {
            const index = this.listData.findIndex((d: any) => d.transId === id);
            //console.log(index);
            this.deleteData(id);
            this.listData.splice(index, 1);
            console.log(response);
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'The health facility has been deleted',
              showConfirmButton: false,
              timer: 1000,
            });
          },
          error: (err) => {
            console.log(err);
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Something went wrong!',
              text: err.message,
              showConfirmButton: false,
              timer: 3000,
            });
          },
          complete: () => {
            console.log('DeleteHealthFacility() completed.');
          },
        });
      }
    });
  }

  deleteData(id: number) {
    this.listData = this.listData.filter(
      (data: { id: number }) => data.id !== id
    );
  }

  getListOfBarangay(): void {
    this.service.ListOfBarangay(this.munCityId).subscribe((response) => {
      console.log('Barangay: ', response);
      this.listBarangayData = response;
    });
  }
}
