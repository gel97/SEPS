import { JsonPipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { isEmptyObject } from 'jquery';
import { AuthService } from 'src/app/services/auth.service';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { AgricultureProfileService } from 'src/app/shared/Socio-Economic/Agriculture/agriculturalProfile.service';
import Swal from 'sweetalert2';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';
@Component({
  selector: 'app-agricultural-profile',
  templateUrl: './agricultural-profile.component.html',
  styleUrls: ['./agricultural-profile.component.css'],
})
export class AgriculturalProfileComponent implements OnInit {
  @ViewChild(PdfComponent)
  private pdfComponent!: PdfComponent;

  munCityName: string = this.Auth.munCityName;

  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private Auth: AuthService,
    private Service: AgricultureProfileService,
    private modifyService: ModifyCityMunService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  closebutton!: { nativeElement: { click: () => void } };
  isCheck: boolean = false;

  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
  }

  message = 'General Agricultural Profile';

  Data: boolean = false;
  isAdd: boolean = true;
  toValidate: any = {};
  munCityId: string = this.Auth.munCityId;
  setYear: string = this.Auth.setYear;
  listData: any = [];
  addData: any = {};
  editData: any = {};
  updateData: any = {};
  deleteData: any = {};
  visible: boolean = true;
  not_visible: boolean = true;
  //button_edit: boolean = true;

  ngOnInit(): void {
    this.GetListAgricultureProfile();
  }

  public showOverlay = false;
  importMethod() {
    this.showOverlay = true;
    this.Service.Import().subscribe({
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

  GeneratePDF() {
    let data: any = [];
    let summary: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];
    let contentData:any = [];

    const columnNames: any = [
      'Commodities',
      'No. of Hectare',
      'No. of Farmers',
    ];
    let columns: any = [];
    let columnsWidth: any = [];
    this.reportService.GetAgriProfReport(this.pdfComponent.data).subscribe({
      next: (response: any = {}) => {
        reports = response.data;
        summary = response.summary;
        console.log('result: ', response);

        reports.forEach((a: any) => {
          if (a.district === 1) {
            dist1.push(a);
          } else {
            dist2.push(a);
          }
        });
        console.log('dist1: ', dist1);
        console.log('dist2: ', dist2);

        data.push({
          margin: [0, 40, 0, 0],
          columns: [
            {
              text: `Agricultural Profile of Davao del Norte`,
              fontSize: 14,
              bold: true,
            },
            {
              text: `Year: ${reports[0].setYear}`,
              fontSize: 14,
              bold: true,
              alignment: 'right',
            },
          ],
        });

        data.push({
          margin: [0, 10, 0, 0],
          columns: [
            {
              text: `Provincial Summary`,
              fontSize: 12,
              bold: true,
            },
          ],
        });

        columnNames.forEach((name: any) => {
          columnsWidth.push('*');
          columns.push({
            text: name,
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          });
        });
        tableData.push(columns);
        tableData.push(
          [
            {
              text: 'Paddy Rice - Irrigated',
              fillColor: '#FFFFFF',
            },
            {
              text: summary.riceIrrigArea,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
            {
              text: summary.riceIrrigFarmersNo,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Paddy Rice - Rain Fed',
              fillColor: '#9DB2BF',
            },
            {
              text: summary.riceRainArea,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
            {
              text: summary.riceRainFarmersNo,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Corn - White',
              fillColor: '#FFFFFF',
            },
            {
              text: summary.cornWhiteArea,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
            {
              text: summary.cornWhiteFarmersNo,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Corn - Yellow',
              fillColor: '#9DB2BF',
            },
            {
              text: summary.cornYellowArea,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
            {
              text: summary.cornYellowFarmersNo,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Banana - Cavendish',
              fillColor: '#FFFFFF',
              
            },
            {
              text: summary.bananaCavArea,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
            {
              text: summary.bananaCavFarmersNo,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Banana -Saba Banana',
              fillColor: '#9DB2BF',
            },
            {
              text: summary.bananaSabaArea,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
            {
              text: summary.bananaSabaFarmersNo,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Banana -Other Banana',
              fillColor: '#FFFFFF',
              
            },
            {
              text: summary.bananaOtherArea,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
            {
              text: summary.bananaFarmersNo,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Mango',
              fillColor: '#9DB2BF',
            },
            {
              text: summary.mangoArea,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
            {
              text: summary.mangoFarmersNo,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Durian',
              fillColor: '#FFFFFF',
            },
            {
              text: summary.durianArea,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
            {
              text: summary.durianFarmersNo,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Coffee',
              fillColor: '#9DB2BF',
            },
            {
              text: summary.coffeeArea,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
            {
              text: summary.coffeeFarmersNo,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Cacao',
              fillColor: '#FFFFFF',
            },
            {
              text: summary.cacaoArea,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
            {
              text: summary.cacaoFarmersNo,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Abaca',
              fillColor: '#9DB2BF',
            },
            {
              text: summary.abacaArea,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
            {
              text: summary.abacaFarmersNo,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Rubber',
              fillColor: '#FFFFFF',
            },
            {
              text: summary.rubberArea,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
            {
              text: summary.rubberFarmerNo,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Oil Palm',
              fillColor: '#9DB2BF',
            },
            {
              text: summary.oilpalmArea,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
            {
              text: summary.oilpalmArea,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Coconut',
              fillColor: '#FFFFFF',
            },
            {
              text: summary.coconutArea,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
            {
              text: summary.coconutNo,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Vegetables and Spices',
              fillColor: '#9DB2BF',
            },
            {
              text: summary.veggieArea,
              fillColor: '#9DB2BF',
              alignment: 'center',

            },
            {
              text: summary.veggieArea,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Other Crops',
              fillColor: '#FFFFFF',
            },
            {
              text: summary.otherCropsArea,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
            {
              text: summary.otherCropsNo,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
          ]
        );

        // tableData.push([{
        //   margin: [0, 10, 0, 0],
        //   columns: [
        //     {
        //       text: `1st Congressional District`,
        //       fontSize: 12,
        //       bold: true,
        //     },
        //   ],
        // }]);
        contentData.push([{
          margin: [0, 10, 0, 0],
          table: {
            widths: columnsWidth,
            body: tableData,
          },
          layout: 'lightHorizontalLines',
          pageBreak: 'after'
        }]);

        dist1.forEach((a: any) => {
          let newColumn:any = [];
          const newtableData: any = [];

          columnNames.forEach((name: any) => {
            newColumn.push({
              text: name,
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            });
          });

          contentData.push({
          margin: [0, 20, 0, 0],
          columns: [
            {
              text: a.munCityName,
              fontSize: 12,
              bold: true,
            },
          ],
        });
        newtableData.push(newColumn);
        newtableData.push(
            [
              {
                text: 'Paddy Rice - Irrigated',
                fillColor: '#FFFFFF',
              },
              {
                text: a.riceIrrigArea,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: a.riceIrrigFarmersNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Paddy Rice - Rain Fed',
                fillColor: '#9DB2BF',
              },
              {
                text: a.riceRainArea,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
              {
                text: a.riceRainFarmersNo,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Corn - White',
                fillColor: '#FFFFFF',
              },
              {
                text: a.cornWhiteArea,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: a.cornWhiteFarmersNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Corn - Yellow',
                fillColor: '#9DB2BF',
              },
              {
                text: a.cornYellowArea,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
              {
                text: a.cornYellowFarmersNo,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Banana - Cavendish',
                fillColor: '#FFFFFF',
                
              },
              {
                text: a.bananaCavArea,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: a.bananaCavFarmersNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Banana -Saba Banana',
                fillColor: '#9DB2BF',
              },
              {
                text: a.bananaSabaArea,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
              {
                text: a.bananaSabaFarmersNo,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Banana -Other Banana',
                fillColor: '#FFFFFF',
                
              },
              {
                text: a.bananaOtherArea,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: a.bananaFarmersNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Mango',
                fillColor: '#9DB2BF',
              },
              {
                text: a.mangoArea,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
              {
                text: a.mangoFarmersNo,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Durian',
                fillColor: '#FFFFFF',
              },
              {
                text: a.durianArea,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: a.durianFarmersNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Coffee',
                fillColor: '#9DB2BF',
              },
              {
                text: a.coffeeArea,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
              {
                text: a.coffeeFarmersNo,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Cacao',
                fillColor: '#FFFFFF',
              },
              {
                text: a.cacaoArea,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: a.cacaoFarmersNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Abaca',
                fillColor: '#9DB2BF',
              },
              {
                text: a.abacaArea,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
              {
                text: a.abacaFarmersNo,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Rubber',
                fillColor: '#FFFFFF',
              },
              {
                text: a.rubberArea,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: a.rubberFarmerNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Oil Palm',
                fillColor: '#9DB2BF',
              },
              {
                text: a.oilpalmArea,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
              {
                text: a.oilpalmArea,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Coconut',
                fillColor: '#FFFFFF',
              },
              {
                text: a.coconutArea,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: a.coconutNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Vegetables and Spices',
                fillColor: '#9DB2BF',
              },
              {
                text: a.veggieArea,
                fillColor: '#9DB2BF',
                alignment: 'center',

              },
              {
                text: a.veggieArea,
                fillColor: '#9DB2BF',
                alignment: 'center',
              },
            ],
            [
              {
                text: 'Other Crops',
                fillColor: '#FFFFFF',
              },
              {
                text: a.otherCropsArea,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: a.otherCropsNo,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ]
          );

          contentData.push([{
            margin: [0, 10, 0, 0],
            table: {
              widths: columnsWidth,
              body: newtableData,
            },
            layout: 'lightHorizontalLines',
          }]);
        });

        dist2.forEach((a: any) => {
          let newColumn:any = [];
          const newtableData: any = [];

          columnNames.forEach((name: any) => {
            newColumn.push({
              text: name,
              fillColor: 'black',
              color: 'white',
              bold: true,
              alignment: 'center',
            });
          });

          contentData.push({
          margin: [0, 20, 0, 0],
          columns: [
            {
              text: a.munCityName,
              fontSize: 12,
              bold: true,
            },
          ],
        });
        newtableData.push(newColumn);
        newtableData.push(
          [
            {
              text: 'Paddy Rice - Irrigated',
              fillColor: '#FFFFFF',
            },
            {
              text: a.riceIrrigArea,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
            {
              text: a.riceIrrigFarmersNo,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Paddy Rice - Rain Fed',
              fillColor: '#9DB2BF',
            },
            {
              text: a.riceRainArea,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
            {
              text: a.riceRainFarmersNo,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Corn - White',
              fillColor: '#FFFFFF',
            },
            {
              text: a.cornWhiteArea,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
            {
              text: a.cornWhiteFarmersNo,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Corn - Yellow',
              fillColor: '#9DB2BF',
            },
            {
              text: a.cornYellowArea,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
            {
              text: a.cornYellowFarmersNo,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Banana - Cavendish',
              fillColor: '#FFFFFF',
              
            },
            {
              text: a.bananaCavArea,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
            {
              text: a.bananaCavFarmersNo,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Banana -Saba Banana',
              fillColor: '#9DB2BF',
            },
            {
              text: a.bananaSabaArea,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
            {
              text: a.bananaSabaFarmersNo,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Banana -Other Banana',
              fillColor: '#FFFFFF',
              
            },
            {
              text: a.bananaOtherArea,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
            {
              text: a.bananaFarmersNo,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Mango',
              fillColor: '#9DB2BF',
            },
            {
              text: a.mangoArea,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
            {
              text: a.mangoFarmersNo,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Durian',
              fillColor: '#FFFFFF',
            },
            {
              text: a.durianArea,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
            {
              text: a.durianFarmersNo,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Coffee',
              fillColor: '#9DB2BF',
            },
            {
              text: a.coffeeArea,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
            {
              text: a.coffeeFarmersNo,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Cacao',
              fillColor: '#FFFFFF',
            },
            {
              text: a.cacaoArea,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
            {
              text: a.cacaoFarmersNo,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Abaca',
              fillColor: '#9DB2BF',
            },
            {
              text: a.abacaArea,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
            {
              text: a.abacaFarmersNo,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Rubber',
              fillColor: '#FFFFFF',
            },
            {
              text: a.rubberArea,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
            {
              text: a.rubberFarmerNo,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Oil Palm',
              fillColor: '#9DB2BF',
            },
            {
              text: a.oilpalmArea,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
            {
              text: a.oilpalmArea,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Coconut',
              fillColor: '#FFFFFF',
            },
            {
              text: a.coconutArea,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
            {
              text: a.coconutNo,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Vegetables and Spices',
              fillColor: '#9DB2BF',
            },
            {
              text: a.veggieArea,
              fillColor: '#9DB2BF',
              alignment: 'center',

            },
            {
              text: a.veggieArea,
              fillColor: '#9DB2BF',
              alignment: 'center',
            },
          ],
          [
            {
              text: 'Other Crops',
              fillColor: '#FFFFFF',
            },
            {
              text: a.otherCropsArea,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
            {
              text: a.otherCropsNo,
              fillColor: '#FFFFFF',
              alignment: 'center',
            },
          ]
        );

          contentData.push([{
            margin: [0, 10, 0, 0],
            table: {
              widths: columnsWidth,
              body: newtableData,
            },
            layout: 'lightHorizontalLines',
            pageBreak: 'after'
          }]);
        });

      
        // const table = {
        //   margin: [0, 10, 0, 0],
        //   table: {
        //     widths: columnsWidth,
        //     body: tableData,
        //   },
        //   layout: 'lightHorizontalLines',
        // };
      
        console.log("contentData: ", contentData);
        data.push(contentData);
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

  close() {}

  GetListAgricultureProfile() {
    this.Service.GetListAgricultureProfile(
      this.Auth.setYear,
      this.Auth.munCityId
    ).subscribe({
      next: (response) => {
        console.log('all_data', response);
        if (response.length > 0) {
          this.addData = <any>response[0];
          this.viewData = true;
          console.log('data: ', this.addData);

          this.Data = true;
        } else {
          this.Data = false;
          this.viewData = false;
        }
      },
      error: (error) => {
        Swal.fire('Oops!', 'Something went wrong.', 'error');
      },
      complete: () => {},
    });
  }

  viewData: boolean = false;
  parentMethod() {
    // alert('parent Method');
    this.viewData = true;
  }

  AddAgricultureProfile() {
    this.toValidate.riceIrrigTotal =
      this.addData.riceIrrigTotal == '' ||
      this.addData.riceIrrigTotal == undefined
        ? true
        : false;
    this.toValidate.riceRainTotal =
      this.addData.riceRainTotal == '' ||
      this.addData.riceRainTotal == undefined
        ? true
        : false;

    if (
      this.toValidate.riceIrrigTotal == false ||
      this.toValidate.riceRainTotal == false
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.addData.munCityId = this.Auth.munCityId;
      this.addData.setYear = this.Auth.activeSetYear;
      this.Service.AddAgricultureProfile(this.addData).subscribe(
        (_data) => {
          Swal.fire('Good job!', 'Data Added Successfully!', 'success');
          if (this.isCheck) {
            document.getElementById('mEducation')?.click();
          }
          console.log(_data);
          this.clearData();
          // this.addData();
          this.GetListAgricultureProfile();
        },
        (err) => {
          Swal.fire('ERROR!', 'Error', 'error');

          this.GetListAgricultureProfile();
          this.addData = {};
        }
      );
    }
  }
  clearData() {
    this.addData = {};
    this.not_visible = false;
    this.visible = true;
    // this.required = false;
  }

  EditAgricultureProfile() {
    {
      this.editData.setYear = this.setYear;
      this.editData.munCityId = this.munCityId;
      this.Service.EditAgricultureProfile(this.editData).subscribe({
        next: (request) => {
          this.GetListAgricultureProfile();
          Swal.fire('Good job!', 'Data Updated Successfully!', 'success');
          document.getElementById('mEducation')?.click();
        },
        error: (error) => {
          Swal.fire('Oops!', 'Something went wrong.', 'error');
        },
      });
    }
  }

  DeleteAgricultureProfile(transId: any) {
    {
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
          this.Service.DeleteAgricultureProfile(transId).subscribe(
            (request) => {
              this.GetListAgricultureProfile();
              this.addData = {};
            }
          );
          Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
        }
      });
    }
  }
}
