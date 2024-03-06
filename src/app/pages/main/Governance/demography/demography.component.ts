import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DemographyService } from 'src/app/shared/Governance/demography.service';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { ImportComponent } from 'src/app/components/import/import.component';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';

@Component({
  selector: 'app-demography',
  templateUrl: './demography.component.html',
  styleUrls: ['./demography.component.css'],
})
export class DemographyComponent implements OnInit {
  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;
  @ViewChild(PdfComponent)
  private pdfComponent!: PdfComponent;

  searchText: string = '';

  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private service: DemographyService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService
  ) {}
  demo: any = {};
  Demo: any = [];
  editmodal: any = {};
  ViewBarangayOfficial: any = {};
  barangays: any = {};
  toValidate: any = {};
  munCityName: string = this.auth.munCityName;

  isLoading: boolean = true;
  isCheck: boolean = false;
  visible: boolean = true;
  not_visible: boolean = true;

  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };

  @ViewChild(ImportComponent)
  private importComponent!: ImportComponent;

  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
    console.log('isCheck:', this.isCheck);
  }
  markerObj: any = {};

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

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

  date = new DatePipe('en-PH');
  ngOnInit(): void {
    this.Init();
    this.list_of_barangay();
  }

  message = 'Demography';

  Init() {
    this.demo.munCityId = this.auth.munCityId;
    this.demo.setYear = this.auth.activeSetYear;
    this.service.GetDemography().subscribe((data) => {
      this.Demo = <any>data;
      this.import();
      this.Demo.sort((n1: any, n2: any) => {
        //order by Descending
        if (n1.setYear < n2.setYear) return 1;
        if (n1.setYear > n2.setYear) return -1;
        else return 0;
      });
      console.log(this.Demo);
    });
  }

  GeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    let dist1: any = [];
    let dist2: any = [];

    let grandTotal:any = [];
    let columns:any = [];


    this.reportService.GetDemographyReport(this.pdfComponent.data).subscribe({
      next: (response: any = {}) => {
        reports = response.data;
        grandTotal = response.grandTotal;
        dist1 = response.districtOne;
        dist2 = response.districtTwo;
        columns = response.columns;

        console.log('result: ', response);

        data.push({
          margin: [0, 40, 0, 0],
          columns: [
            {
              text: `Total Population and Households by Municipality/City`,
              fontSize: 14,
              bold: true,
            },
            {
              text: `Year: ${response.fromYear} - ${response.year}`,
              fontSize: 14,
              bold: true,
              alignment: 'right',
            },
          ],
        });

        let columnData:any=[];
        columns.forEach((a:any,index:any) => {
          if(index==0){
            columnData.push({
              text: '#',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },
            {
              text: 'Municipality/ City',
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            },)
          }
          columnData.push({
            text: a.description,
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },{
            text: a.male,
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },{
            text: a.female,
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },{
            text: a.household,
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },);
        });
        tableData.push(columnData);

        reports.forEach((a:any, index:any) => {
          if(a.district === 1){
            tableData.push([
              {
                text: `1st Congressional District `,
                colSpan: 14,
                alignment: 'left',
                fillColor: '#526D82',
                marginLeft: 5,
              },
            ]);
            dist1.forEach((b:any, index2:any) => {
              let d1:any= [];
              d1.push({
                text: index2 + 1,
                alignment: 'center'
              },{
                text: b.munCityName,
              });

                columns.forEach((c:any, index3:any) => {
                  let _population:any = "-";
                  let _male:any = "-";
                  let _female:any = "-";
                  let _householdNo:any = "-";

                  a.data.forEach((d:any, index4:any) => {
                    if(b.munCityId === d.munCityId){
                      d.munData.forEach((e:any, index5:any) => {
                      if(c.setYear === e.setYear){
                      _population = e.population;
                      _male = e.male;
                      _female = e.female;
                      _householdNo = e.female;

                    }
                      });
                    }

                  });
                   d1.push({
                    text: _population,
                    alignment: 'center'
                  },{
                    text: _male,
                    alignment: 'center'
                  },{
                    text: _female,
                    alignment: 'center'
                  },{
                    text: _householdNo,
                    alignment: 'center'
                  });        
                });                  
              tableData.push(d1);
              
            });

            let _subTotal:any=[];
            _subTotal.push({
              text: 'SUBTOTAL',
              colSpan: 2,
              marginLeft: 5,
              fillColor: '#9DB2BF',
            },{});
            columns.forEach((c:any, index3:any) => {
              let _population:any = "-";
              let _male:any = "-";
              let _female:any = "-";
              let _householdNo:any = "-";

              a.subTotal.forEach((e:any, index5:any) => {
                  if(c.setYear === e.setYear){
                  _population = e.population;
                  _male = e.male;
                  _female = e.female;
                  _householdNo = e.householdNo;

                }
                  }); 
              _subTotal.push({
                text: _population,
                alignment: 'center',
                fillColor: '#9DB2BF',
              },{
                text: _male,
                alignment: 'center',
                fillColor: '#9DB2BF',
              },{
                text: _female,
                alignment: 'center',
                fillColor: '#9DB2BF',
              },{
                text: _householdNo,
                alignment: 'center',
                fillColor: '#9DB2BF',
              });        
            });                  
          tableData.push(_subTotal);

          }
          if(a.district === 2){
            tableData.push([
              {
                text: `2nd Congressional District `,
                colSpan: 14,
                alignment: 'left',
                fillColor: '#526D82',
                marginLeft: 5,
              },
            ]);
            dist2.forEach((b:any, index2:any) => {
              let d2:any= [];
              d2.push({
                text: index2 + 1,
                alignment: 'center'
              },{
                text: b.munCityName,
              });

                columns.forEach((c:any, index3:any) => {
                  let _population:any = "-";
                  let _male:any = "-";
                  let _female:any = "-";
                  let _householdNo:any = "-";

                  a.data.forEach((d:any, index4:any) => {
                    if(b.munCityId === d.munCityId){
                      d.munData.forEach((e:any, index5:any) => {
                      if(c.setYear === e.setYear){
                      _population = e.population;
                      _male = e.male;
                      _female = e.female;
                      _householdNo = e.householdNo;

                    }
                      });
                    }

                  });
                   d2.push({
                    text: _population,
                    alignment: 'center'
                  },{
                    text: _male,
                    alignment: 'center'
                  },{
                    text: _female,
                    alignment: 'center'
                  },{
                    text: _householdNo,
                    alignment: 'center'
                  });        
                });                  
              tableData.push(d2);
              
            });

            let _subTotal:any=[];
            _subTotal.push({
              text: 'SUBTOTAL',
              colSpan: 2,
              marginLeft: 5,
              fillColor: '#9DB2BF',
            },{});
            columns.forEach((c:any, index3:any) => {
              let _population:any = "-";
              let _male:any = "-";
              let _female:any = "-";
              let _householdNo:any = "-";

              a.subTotal.forEach((e:any, index5:any) => {
                  if(c.setYear === e.setYear){
                  _population = e.population;
                  _male = e.male;
                  _female = e.female;
                  _householdNo = e.householdNo;

                }
                  }); 
              _subTotal.push({
                text: _population,
                alignment: 'center',
                fillColor: '#9DB2BF',
              },{
                text: _male,
                alignment: 'center',
                fillColor: '#9DB2BF',
              },{
                text: _female,
                alignment: 'center',
                fillColor: '#9DB2BF',
              },{
                text: _householdNo,
                alignment: 'center',
                fillColor: '#9DB2BF',
              });        
            });                  
          tableData.push(_subTotal);

          }
          
        });

        let _grandTotal:any=[];
            _grandTotal.push({
              text: 'GRANDTOTAL',
              colSpan: 2,
              marginLeft: 5,
              fillColor: '#F1C93B',
            },{});
            columns.forEach((c:any, index3:any) => {
              let _population:any = "-";
              let _male:any = "-";
              let _female:any = "-";
              let _householdNo:any = "-";

              grandTotal.forEach((e:any, index5:any) => {
                  if(c.setYear === e.setYear){
                  _population = e.population;
                  _male = e.male;
                  _female = e.female;
                  _householdNo = e.householdNo;

                }
                  }); 
              _grandTotal.push({
                text: _population,
                alignment: 'center',
                fillColor: '#F1C93B',
              },{
                text: _male,
                alignment: 'center',
                fillColor: '#F1C93B',
              },{
                text: _female,
                alignment: 'center',
                fillColor: '#F1C93B',
              },{
                text: _householdNo,
                alignment: 'center',
                fillColor: '#F1C93B',
              });        
            });                  
          tableData.push(_grandTotal);

     
     

        const table = {
          margin: [0, 20, 0, 0],
          table: {
            widths: [25, 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', '*'],
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

  import() {
    let importData = 'Demography';
    this.importComponent.import(importData);
  }

  list_of_barangay() {
    this.service.ListBarangay().subscribe((data) => {
      this.barangays = <any>data;
      console.log('fgxtxgcvcgcf', this.barangays);
    });
  }

  AddDemo() {
    this.toValidate.brgyId =
      this.demo.brgyId == '' || this.demo.brgyId == null ? true : false;
    this.toValidate.householdPop =
      this.demo.householdPop == '' || this.demo.householdPop == undefined
        ? true
        : false;
    this.toValidate.male =
      this.demo.male == '' || this.demo.male == undefined ? true : false;
    this.toValidate.female =
      this.demo.female == '' || this.demo.female == undefined ? true : false;

    if (
      this.toValidate.brgyId == true ||
      this.toValidate.householdPop == true ||
      this.toValidate.male == true ||
      this.toValidate.female == true
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.demo.munCityId = this.auth.munCityId;
      this.demo.setYear = this.auth.activeSetYear;
      this.service.AddDemography(this.demo).subscribe(
        (_data) => {
          Swal.fire('Good job!', 'Data Added Successfully!', 'success');
          if (this.isCheck) {
            document.getElementById('ModalAdd')?.click();
          }
          console.log(_data);
          this.clearData();
          this.Init();
        },
        (err) => {
          Swal.fire('ERROR!', 'Error', 'error');

          this.Init();
          this.demo = {};
        }
      );
    }
  }
  clearData() {
    this.demo = {};
    this.not_visible = false;
    this.visible = true;
    // this.required = false;
  }

  editdemo(editdemo: any = {}) {
    this.editmodal = editdemo;
    //passing the data from table (modal)
    this.Init();
  }

  //for modal
  update() {
    this.toValidate.brgyId =
      this.editmodal.brgyId == '' || this.editmodal.brgyId == null
        ? true
        : false;
    this.toValidate.householdPop =
      this.editmodal.householdPop == '' ||
      this.editmodal.householdPop == undefined
        ? true
        : false;
    this.toValidate.male =
      this.editmodal.male == '' || this.editmodal.male == undefined
        ? true
        : false;
    this.toValidate.female =
      this.editmodal.female == '' || this.editmodal.female == undefined
        ? true
        : false;

    if (
      this.toValidate.brgyId == true ||
      this.toValidate.householdPop == true ||
      this.toValidate.male == true ||
      this.toValidate.female == true
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.service.UpdateDemography(this.editmodal).subscribe((_data) => {
        // if (this.isCheck) {

        // }
        this.clearData();
        this.Init();

        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your work has been updated',
          showConfirmButton: false,
          timer: 1000,
        });
        document.getElementById('ModalEdit')?.click();
        this.Init();
      });
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
        for (let i = 0; i < this.Demo.length; i++) {
          if (this.Demo[i].transId == transId) {
            this.Demo.splice(i, 1);
            this.Init();
            Swal.fire('Deleted!', 'Your file has been removed.', 'success');
          }
        }

        this.service.DeleteDemography(transId).subscribe((_data) => {});
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }
}
