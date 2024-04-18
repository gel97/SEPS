import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ManEstabService } from 'src/app/shared/Trade&_Industry/man-estab.service';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';
import { ExcelComponent } from 'src/app/components/excel/excel.component';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-manufacturing-establishments',
  templateUrl: './manufacturing-establishments.component.html',
  styleUrls: ['./manufacturing-establishments.component.css'],
})
export class ManufacturingEstablishmentsComponent implements OnInit {
  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;
  searchText: string = '';

   @ViewChild(ExcelComponent)
   private ExcelComponent!: ExcelComponent;
  @ViewChild(PdfComponent)
  private pdfComponent!: PdfComponent;

  get filteredItems() {
    return this.list_of_Business.filter(
      (item) => item.categoryId == this.estab.category
    );
  }
  get EDITfilteredItems() {
    return this.list_of_Business.filter(
      (item) => item.categoryId == this.editmodal.category
    );
  }

  message = 'Manufacturing Establishments';

  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private service: ManEstabService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService,
  
    // private excel:ExcelComponent
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  munCityName: string = this.auth.munCityName;

  toValidate: any = {};
  ManEstab: any = [];
  barangays: any = [];
  estab: any = {};
  editmodal: any = {};
  Updatelocation: any = {};

  // Pagination
  pageSize2 = 10;
  p2: string | number | undefined;
  count2: number = 1;
  tableSize2: number = 20;
  tableSizes2: any = [20, 40, 60, 80, 100];

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
    this.estab = {};
    this.not_visible = false;
    this.visible = true;
    // this.required = false;
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
      complete: () => {
       
      },
    });
  }

  ExportExcel(){
    const httpOptions : any = {
      headers: new HttpHeaders({
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        
      }),
      responseType: 'blob', 
      observe:'response'
    };
    let data: any = [];
    this.reportService.GetExcelExport(this.auth.setYear, this.auth.munCityId, httpOptions).subscribe(response => {
      this.saveFile(response);
    });
}
private saveFile(response: any): void {
  const contentDispositionHeader = response.headers.get('Content-Disposition');
  const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  const matches = fileNameRegex.exec(contentDispositionHeader);
  const fileName = matches !== null && matches[1] ? matches[1].replace(/['"]/g, '') : 'file.xlsx';

  const blob = new Blob([response.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

 
    // For other browsers
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  
}
   
   getFileName(response: HttpResponse<Blob>) {
    let filename: string;
    try {
      const contentDisposition: any = response.headers.get('content-disposition');
      const r = /(?:filename=")(.+)(?:;")/
      filename = r.exec(contentDisposition)![1];
    }
    catch (e) {
      filename = 'myfile.txt'
    }
    return filename
  }
  GeneratePDF() {
    let reports: any = [];
    let data: any = [];
    let dist1: any = [];
    let dist2: any = [];
    let contentData:any = [];

    this.reportService.GetManEstabReport(this.pdfComponent.data).subscribe({
      next: (response: any = {}) => {
        reports = response.data;
        dist1 = response.districtOne;
        dist2 = response.districtTwo;
       
        console.log(response);

        data.push(    {
          text: `Number of Manufacturing Industry by Municipality/City and related business Category for the year ${response.year}`, // Add the title text
          fontSize: 14,
          bold: true, 
          alignment: 'center',
          margin: [0, 20] // Adjust the margin around the title as needed
        });

        reports.forEach((a: any, index: any) => {
          let columns:any = [];
          let columnWidth:any = [];
          const tableData: any = [];
          let grandTotal:any = [];
         
          let subtotal1:any=[];
              subtotal1.push({
                text: 'SUB TOTAL',
                fillColor: '#9DB2BF',
              });

          let subtotal2:any=[];
              subtotal2.push({
                text: 'SUB TOTAL',
                fillColor: '#9DB2BF',
              });


          a.columnTypes.forEach((b: any, index: any) => { // GET COLUMN
            if(index == 0){
              columnWidth.push('auto');
              columns.push({
                text: "Muncipality/ City",
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

          contentData.push({ // Categpry Name
            text: a.catName + ' category',
            margin: [0, 20, 0, 8],
            fillColor: 'black',
            color: 'black',
            bold: true,
            alignment: 'left',
          });

          tableData.push(columns); // PUSH COLUMN
                 
          for (let dataDistrict of a.district) { // LOOP DISTRICT

            if (dataDistrict.district==1) { // GET DISTRICT I DATA
              tableData.push([{ text: `1st Congressional District `, colSpan: columnWidth.length, alignment: 'left',
              fillColor: '#526D82'}]);
              
              for (let d1 of dist1) {
                let data1=[];
                data1.push(d1.munCityName);
            
                for (let header of a.columnTypes) {
                    let count = '-';
                        for (let t of dataDistrict.type) {
                          if (header.recNo == t.type) {
                            //true
                            for(let f of t.data){
                              if (d1.munCityId == f.munCityId && header.recNo == f.type) {
                                count=f.countType;
                                break;
                              }
                            }                              
                          }       
                        }
                        data1.push(count);
                  }
                      tableData.push(data1); // PUSH DISTRICT 1 DATA
              }

                for (let header of a.columnTypes) { // GET DISTRICT 1 SUBTOTAL
                    let countSubtotal1 = '-';
                        for (let t of dataDistrict.type) {
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
                      tableData.push(subtotal1); // PUSH DISTRICT 1 SUBTOTAL
            }

            if (dataDistrict.district==2) {// GET DISTRICT II DATA
              tableData.push([{ text: `2nd Congressional District `, colSpan: columnWidth.length, alignment: 'left',
              fillColor: '#526D82'}]);

              for (let d2 of dist2) {
                let data2=[];
                data2.push(d2.munCityName);

                  for (let header of a.columnTypes) {
                    let count = '-';
                        for (let t of dataDistrict.type) {
                          if (header.recNo == t.type) {
                            //true
                            for(let f of t.data){
                              if (d2.munCityId == f.munCityId && header.recNo == f.type) {
                                count=f.countType;
                                break;
                              }
                            }
                          }
                        }
                        data2.push(count)
                  }
                      tableData.push(data2); // PUSH DISTRICT II DATA
              }

                for (let header of a.columnTypes) { // GET DISTRICT II SUBTOTAL
                    let countSubtotal2 = '-';
                        for (let t of dataDistrict.type) {
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
          }

          columnWidth.forEach((b: any, index: any) => {  // GET GRANDTOTAL
            let grandTotalcount ;
            if(index == 0){
              grandTotalcount ='GRAND TOTAL';
            }
            else{
              if(subtotal1.length>1 && subtotal2.length == 1 && index > 0){
                grandTotalcount = subtotal1[index].text;

              }
              if(subtotal2.length>1 && subtotal1.length == 1 && index > 0){
                grandTotalcount = subtotal2[index].text;
              }
              if(subtotal1.length>1 && subtotal2.length > 1 && index > 0){ 
                let sub1 = subtotal1[index].text == '-'? 0: subtotal1[index].text;
                let sub2 = subtotal2[index].text == '-'? 0: subtotal2[index].text;
                
                if(subtotal2[index].text == '-' && subtotal1[index].text == '-'){
                  grandTotalcount = '-'
                }
                else{
                  grandTotalcount = sub1 + sub2;
                }          
              }
           }
            grandTotal.push( {  // PUSH GRANDTOTAL
              text: grandTotalcount,
              fillColor: '#F1C93B',
            });                  
          });

          tableData.push(grandTotal);

          contentData.push([{
            margin: [0, 10, 0, 0],
            table: {
           // widths: columnWidth,
            body: tableData,
          },
          }])
        });

        data.push(contentData);
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
  date = new DatePipe('en-PH');
  ngOnInit(): void {
    this.GetListManEstab();
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

  //searchBar
  onChangeSearch(e: any) {
    this.searchText = e.target.value;
  }

  GetListManEstab() {
    this.service.GetManEstab().subscribe((data) => {
      this.ManEstab = <any>data;
      this.ManEstab = this.ManEstab.filter((s: any) => s.tag == 1);
      console.log(this.ManEstab);
    });
  }

  list_of_barangay() {
    this.service.ListBarangay().subscribe((data) => {
      this.barangays = <any>data;
      console.log('fgxtxgcvcgcf', this.barangays);
    });
  }

  AddEstablishment() {
    this.toValidate.name =
      this.estab.name == '' || this.estab.name == undefined ? true : false;
    this.toValidate.category =
      this.estab.category == '' || this.estab.category == null ? true : false;
    this.toValidate.brgyId =
      this.estab.brgyId == '' || this.estab.brgyId == null ? true : false;
    this.toValidate.type =
      this.estab.type == '' || this.estab.type == null ? true : false;
    this.toValidate.workersNo =
      this.estab.workersNo == '' || this.estab.workersNo == undefined
        ? true
        : false;

    if (
      this.toValidate.name == true ||
      this.toValidate.category == true ||
      this.toValidate.type == true ||
      this.toValidate.workersNo == true
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.estab.munCityId = this.auth.munCityId;
      this.estab.setYear = this.auth.setYear;
      this.estab.transId = this.date.transform(Date.now(), 'YYMM');
      this.estab.tag = 1;
      this.service.AddManEstab(this.estab).subscribe((request) => {
        if (!this.isCheck) {
          this.closebutton.nativeElement.click();
        }
        console.log(request);
        this.clearData();
        this.GetListManEstab();

        console.log(request);
        Swal.fire('Good job!', 'Data Added Successfully!', 'success');
        // document.getElementById('close')?.click();
        this.estab = {};
        this.ManEstab.push(request);
      });
    }
  }

  edit_estab(edit_estab: any = {}) {
    this.editmodal = edit_estab;
    this.GetListManEstab();
  }

  //for modal
  UpdateManEstab() {
    this.editmodal.longtitude = this.gmapComponent.markers.lng;
    this.editmodal.latitude = this.gmapComponent.markers.lat;
    //this.editmodal.setYear = this.auth.activeSetYear;

    this.toValidate.name =
      this.editmodal.name == '' || this.editmodal.name == undefined
        ? true
        : false;
    this.toValidate.category =
      this.editmodal.category == '' || this.editmodal.category == null
        ? true
        : false;
    this.toValidate.brgyId =
      this.editmodal.brgyId == '' || this.editmodal.brgyId == null
        ? true
        : false;
    this.toValidate.type =
      this.editmodal.type == '' || this.editmodal.type == null ? true : false;
    this.toValidate.workersNo =
      this.editmodal.workersNo == '' || this.editmodal.workersNo == undefined
        ? true
        : false;

    if (
      this.toValidate.name == true ||
      this.toValidate.category == true ||
      this.toValidate.type == true ||
      this.toValidate.workersNo == true
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.service.UpdateManEstab(this.editmodal).subscribe({
        next: (_data) => {
          this.GetListManEstab();
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
        for (let i = 0; i < this.ManEstab.length; i++) {
          if (this.ManEstab[i].transId == transId) {
            this.ManEstab.splice(i, 1);
            Swal.fire('Deleted', 'Removed successfully', 'success');
          }
        }

        this.service.DeleteManEstab(transId).subscribe((_data) => {
          this.GetListManEstab();
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  onTableDataChange2(page: any) {
    //paginate
    console.log(page);
    this.p2 = page;
  }
  onTableSizeChange2(event: any) {
    //paginate
    this.tableSize2 = event.target.value;
    this.p2 = 1;
  }
  list_of_category = [
    { id: 1, name_category: 'Food processing' },
    { id: 2, name_category: 'Agricultural products' },
    { id: 3, name_category: 'Garments and embroidery' },
    { id: 4, name_category: 'Crafts/ Furnitures' },
    { id: 5, name_category: 'Ceramics/ Paper/ Plastic' },
    { id: 6, name_category: 'Chemical and pharmaceutical' },
    { id: 7, name_category: 'Jewelry' },
    { id: 8, name_category: 'Other non-metallic products' },
  ];

  list_of_Business = [
    { id: 1, name_business: 'Bakeries/ Bakeshop', categoryId: 1 },
    { id: 2, name_business: 'Meat products/ processed meat', categoryId: 1 },
    {
      id: 3,
      name_business: 'Fish products/ fish drying and smoking',
      categoryId: 1,
    },
    { id: 4, name_business: 'Ice Plant', categoryId: 1 },
    {
      id: 5,
      name_business: 'Ice cream/ Ice drops/ frozen products',
      categoryId: 1,
    },
    { id: 6, name_business: 'Native Delicacies', categoryId: 1 },
    { id: 7, name_business: 'Sweet Preserves', categoryId: 1 },
    { id: 8, name_business: 'Nuts/ Kornik/ Chicharon', categoryId: 1 },
    { id: 9, name_business: 'Noodles / Bihon products', categoryId: 1 },
    { id: 10, name_business: 'Vinegar/ patis/ bagoong making', categoryId: 1 },
    { id: 11, name_business: 'Juices and Beverages', categoryId: 1 },
    {
      id: 12,
      name_business: 'Poultry and farm products processing',
      categoryId: 1,
    },
    { id: 13, name_business: 'Other processed food', categoryId: 1 },

    {
      id: 14,
      name_business: 'Agricultural equipments and supplies',
      categoryId: 2,
    },
    { id: 15, name_business: 'Feeds manufacturing', categoryId: 2 },
    { id: 16, name_business: 'Fertilizer manufacturing', categoryId: 2 },

    { id: 17, name_business: 'Gowns and Barong', categoryId: 3 },
    { id: 18, name_business: 'Ladies Wear', categoryId: 3 },
    { id: 19, name_business: 'Shirts/ Pants Manufacturing', categoryId: 3 },
    { id: 20, name_business: 'Needlecraft/ Embroidery', categoryId: 3 },
    { id: 21, name_business: 'Knitting', categoryId: 3 },
    {
      id: 22,
      name_business: 'Bed Sheets/ Pillow cases/ Curtains',
      categoryId: 3,
    },
    { id: 23, name_business: 'Dress making/ undergarments', categoryId: 3 },

    { id: 24, name_business: 'Woodcrafts/ Wooden Furniture', categoryId: 4 },
    { id: 25, name_business: 'Casket/coffin making', categoryId: 4 },
    { id: 26, name_business: 'Sash manufacturing', categoryId: 4 },
    { id: 27, name_business: 'Rattan products manufacturing', categoryId: 4 },
    { id: 28, name_business: 'Bamboo products', categoryId: 4 },
    { id: 29, name_business: 'Steel products/ Iron works', categoryId: 4 },
    { id: 30, name_business: 'Handicrafts/ Shellcraft', categoryId: 4 },
    { id: 31, name_business: 'Upholstery', categoryId: 4 },

    { id: 32, name_business: 'Ceramics / pottery', categoryId: 5 },
    { id: 33, name_business: 'Plastic wares', categoryId: 5 },
    { id: 34, name_business: 'Paper Products ', categoryId: 5 },
    { id: 35, name_business: 'Glasswares', categoryId: 5 },

    { id: 36, name_business: 'Laboratories', categoryId: 6 },
    { id: 37, name_business: 'Chemical industries', categoryId: 6 },
    { id: 38, name_business: 'Soap making', categoryId: 6 },
    { id: 39, name_business: 'Candle making', categoryId: 6 },
    { id: 40, name_business: 'Tobacco/ Cigarettes', categoryId: 6 },

    { id: 41, name_business: 'Fancy Jewelry maker', categoryId: 7 },
    { id: 42, name_business: 'Jewelry tools and equipments', categoryId: 7 },
    { id: 43, name_business: 'Fine Jewelries', categoryId: 7 },
    { id: 44, name_business: 'Fashion Accessories', categoryId: 7 },

    { id: 45, name_business: 'Cement Factories', categoryId: 8 },
    { id: 46, name_business: 'Marble Craft', categoryId: 8 },
    { id: 47, name_business: 'Pyro-tecnics/ Firecrackers', categoryId: 8 },
    { id: 48, name_business: 'Rubber/ Leather products', categoryId: 8 },
    {
      id: 49,
      name_business: 'Concrete products/ Tiles/ Hollowblocks',
      categoryId: 8,
    },
    { id: 50, name_business: 'Foam Products', categoryId: 8 },
  ];
}
