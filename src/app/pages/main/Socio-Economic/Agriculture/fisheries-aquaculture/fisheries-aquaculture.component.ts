import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AgricultureService } from 'src/app/shared/Socio-Economic/Agriculture/agriculture.service';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';
@Component({
  selector: 'app-fisheries-aquaculture',
  templateUrl: './fisheries-aquaculture.component.html',
  styleUrls: ['./fisheries-aquaculture.component.css'],
})
export class FisheriesAquacultureComponent implements OnInit {
  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private Auth: AuthService,
    private Service: AgricultureService,
    private modifyService: ModifyCityMunService
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

  menuId = '3';
  toValidate: any = {};
  dataList: any = [];
  addData: any = {};
  barangayList: any = [];
  listofHarvest: any = [
    { id: `1`, type: `Bangus` },
    { id: `2`, type: `Tilapia` },
    { id: `3`, type: `Shrimp` },
    { id: `4`, type: `Crabs` },
    { id: `5`, type: `Cream Dory` },
    { id: `6`, type: `Hito` },
    { id: `7`, type: `Others` },
  ];
  // listofFishing: any = [
  //   { id: `1`, type: `` },
  //   { id: `2`, type: `` },
  //   { id: `3`, type: `` },
  // ];
  visible: boolean = true;
  not_visible: boolean = true;
  dummy_addData: any = {};
  dummyData: any = {};

  required: boolean = true;
  latitude: any;
  longtitude: any;

  message = 'Fisheries/ Aquaculture Production';

  setYear = this.Auth.setYear;
  munCityId = this.Auth.munCityId;

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
  }

  GeneratePDF() {
    let data: any = [];
    let grandTotal: any = {};
    let district1: any = [];
    let district2: any = [];
    let columnTypes: any = [];

    let reports: any = [];
    let columnLenght: number = 0;

    const tableData: any = [];
    this.pdfComponent.data.menuId = this.menuId;

    this.reportService.GetAgricultureReport(this.pdfComponent.data).subscribe({
      next: (response: any = {}) => {
        reports = response.data;
        grandTotal = response.grandTotal;
        district1 = response.districtOne;
        district2 = response.districtTwo;
        columnTypes = response.columnTypes;

        console.log('result: ', response);

        data.push({
          margin: [0, 40, 0, 0],
          columns: [
            {
              text: `List of Fisheries/ Aquaculture Production by Municipality/City`,
              fontSize: 14,
              bold: true,
            },
            {
              text: `Year: ${response.year}`,
              fontSize: 14,
              bold: true,
              alignment: 'right',
            },
          ],
        });

        tableData.push(
          [
            {
              text: '#',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              rowSpan: 2,
            },
            {
              text: 'Municipality/ City',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              rowSpan: 2,
            },
            {
              text: 'Bangus',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              colSpan: 2,
            },
            {},
            {
              text: 'Tilapia',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              colSpan: 2,
            },
            {},
            {
              text: 'Shrimp',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              colSpan: 2,
            },
            {},
            {
              text: 'Crabs',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              colSpan: 2,
            },
            {},
            {
              text: 'Cream Dory',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              colSpan: 2,
            },
            {},
            {
              text: 'Hito',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              colSpan: 2,
            },
            {},
            {
              text: 'Others',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              colSpan: 2,
            },
            {},
          ],
          [
            {},
            {},
            {
              text: 'Total Production',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              fontSize: 8,
            },
            {
              text: 'Area Harvested',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              fontSize: 8,
            },
            {
              text: 'Total Production',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              fontSize: 8,
            },
            {
              text: 'Area Harvested',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              fontSize: 8,
            },
            {
              text: 'Total Production',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              fontSize: 8,
            },
            {
              text: 'Area Harvested',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              fontSize: 8,
            },
            {
              text: 'Total Production',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              fontSize: 8,
            },
            {
              text: 'Area Harvested',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              fontSize: 8,
            },
            {
              text: 'Total Production',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              fontSize: 8,
            },
            {
              text: 'Area Harvested',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              fontSize: 8,
            },
            {
              text: 'Total Production',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              fontSize: 8,
            },
            {
              text: 'Area Harvested',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              fontSize: 8,
            },
            {
              text: 'Total Production',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              fontSize: 8,
            },
            {
              text: 'Area Harvested',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
              fontSize: 8,
            },
          ]
        );

        reports.forEach((a: any) => {
          if (a.district == 1) {
            tableData.push([{ text: `1st Congressional District `, colSpan: 16, alignment: 'left',
            fillColor: '#526D82'}]);

            let sub: any = [];
            sub = [
              {
                text: 'SUBTOTAL',
                fillColor: '#9DB2BF',
                colSpan: 2,
                marginLeft: 2,
              },
              {},
            ];
            district1.forEach((b: any, i: any) => {
              let d1: any = [];
              d1 = [{ text: i + 1, marginLeft: 2 }, { text: b.munCityName }];

              columnTypes.forEach((c: any) => {
                let prod: any = '-';
                let area: any = '-';
                let subprod: any = '-';
                let subarea: any = '-';

                a.data.forEach((d: any) => {
                  if (c.recNo == d.type) {
                    d.typeData.forEach((e: any) => {
                      if (b.munCityId == e.munCityId) {
                        prod = e.totalProd;
                        area = e.area;
                      }
                    });
                    subprod = d.subtotalProd;
                    subarea = d.subtotalArea;
                  }
                });
                d1.push(
                  { text: prod, alignment: 'center' },
                  { text: area, alignment: 'center' }
                );
                if (i == 0) {
                  sub.push(
                    {
                      text: subprod,
                      fillColor: '#9DB2BF',
                      alignment: 'center',
                    },
                    { text: subarea, fillColor: '#9DB2BF', alignment: 'center' }
                  );
                }
              });
              tableData.push(d1);
            });
            tableData.push(sub);
          }
          if (a.district == 2) {
            tableData.push([{ text: `2nd Congressional District `, colSpan: 16, alignment: 'left',
            fillColor: '#526D82'}]);

            let sub: any = [];
            sub = [
              {
                text: 'SUBTOTAL',
                fillColor: '#9DB2BF',
                colSpan: 2,
                marginLeft: 2,
              },
              {},
            ];
            district2.forEach((b: any, i: any) => {
              let d1: any = [];
              d1 = [{ text: i + 1, marginLeft: 2 }, { text: b.munCityName }];

              columnTypes.forEach((c: any) => {
                let prod: any = '-';
                let area: any = '-';
                let subprod: any = '-';
                let subarea: any = '-';

                a.data.forEach((d: any) => {
                  if (c.recNo == d.type) {
                    d.typeData.forEach((e: any) => {
                      if (b.munCityId == e.munCityId) {
                        prod = e.totalProd;
                        area = e.area;
                      }
                    });
                    subprod = d.subtotalProd;
                    subarea = d.subtotalArea;
                  }
                });
                d1.push(
                  { text: prod, alignment: 'center' },
                  { text: area, alignment: 'center' }
                );
                if (i == 0) {
                  sub.push(
                    {
                      text: subprod,
                      fillColor: '#9DB2BF',
                      alignment: 'center',
                    },
                    { text: subarea, fillColor: '#9DB2BF', alignment: 'center' }
                  );
                }
              });
              tableData.push(d1);
            });
            tableData.push(sub);
          }
        });

        let grand: any = [];
        grand = [
              {
                text: 'GRANDTOTAL',
                fillColor: '#F1C93B',
                colSpan: 2,
                marginLeft: 2,
              },
              {},
            ];
        columnTypes.forEach((a:any) => {
          let prod:any = "-";
          let area:any = "-";
          grandTotal.forEach((b:any) => {
          
          if(a.recNo == b.type){
            prod = b.totalProd;
            area = b.area;
          }
          });
                     
          grand.push({
            text: prod,
            fillColor: '#F1C93B',
            alignment: 'center'
          },{
            text: area,
            fillColor: '#F1C93B',
            alignment: 'center'
          },);  
          
        });  
        
        tableData.push(grand);

    

        const table = {
          margin: [0, 10, 0, 0],
          table: {
            widths: [
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
              'auto',
            ],
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

  GetListAgriculture() {
    this.Service.GetListAgriculture(
      this.menuId,
      this.setYear,
      this.munCityId
    ).subscribe((response) => {
      this.dataList = <any>response;
      console.log('check', response);
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

  AddAgriculture() {
    this.toValidate.brgyId =
      this.addData.brgyId == '' || this.addData.brgyId == null ? true : false;
    this.toValidate.name =
      this.addData.name == '' || this.addData.name == undefined ? true : false;
    this.toValidate.type =
      this.addData.type == '' || this.addData.type == null ? true : false;
    this.toValidate.name =
      this.addData.source == '' || this.addData.source == null ? true : false;
    this.toValidate.totalProd =
      this.addData.totalProd == '' || this.addData.totalProd == undefined
        ? true
        : false;
    this.toValidate.area =
      this.addData.area == '' || this.addData.area == undefined ? true : false;
    this.toValidate.name =
      this.addData.name == '' || this.addData.name == undefined ? true : false;
    if (
      this.toValidate.brgyId == true ||
      this.toValidate.type == true ||
      this.toValidate.source == true ||
      this.toValidate.totalProd ||
      this.toValidate.area == true ||
      this.toValidate.name == true
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
    this.toValidate.name =
      this.addData.name == '' || this.addData.name == undefined ? true : false;
    this.toValidate.type =
      this.addData.type == '' || this.addData.type == null ? true : false;
    this.toValidate.name =
      this.addData.source == '' || this.addData.source == null ? true : false;
    this.toValidate.totalProd =
      this.addData.totalProd == '' || this.addData.totalProd == undefined
        ? true
        : false;
    this.toValidate.area =
      this.addData.area == '' || this.addData.area == undefined ? true : false;
    this.toValidate.name =
      this.addData.name == '' || this.addData.name == undefined ? true : false;
    if (
      this.toValidate.brgyId == true ||
      this.toValidate.type == true ||
      this.toValidate.source == true ||
      this.toValidate.totalProd ||
      this.toValidate.area == true ||
      this.toValidate.name == true
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
            this.clearData();
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
