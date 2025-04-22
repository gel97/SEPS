import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { pdfpService } from 'src/app/shared/Province/pdfp.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { isEmptyObject } from 'jquery';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { response } from 'express';
import { request } from 'http';

@Component({
  selector: 'app-rain-induced',
  templateUrl: './rain-induced.component.html',
  styleUrls: ['./rain-induced.component.css'],
})
export class RainInducedComponent implements OnInit {
  @ViewChild('closebutton') closebutton!: {
    nativeElement: { click: () => void };
  };
  @ViewChild('fileInput') fileInput!: ElementRef;

  //Auth-related
  munCityName: string = this.auth.munCityName;
  o_munCityId = this.auth.o_munCityId;
  setYear: number = this.auth.setYear;

  //Data List
  listMunCity: any = {};
  listpdfp: any = [];
  listData: any = [];
  //Data structure for dynamic tables
  structuredTableData: any[] = [];
  sheetNames: string[] = [];

  constructor(
    private auth: AuthService,
    private Service: pdfpService,
    private modifyService: ModifyCityMunService
  ) {}
  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  isAdd: boolean = false;

  // Store subheaders dynamically
  tableData: string[][] = []; // Store table data dynamically

  fristColumnNam: string = '';
  ngOnInit(): void {
    this.Getpdfp();
    this.GetListMunicipality();
    this.loadSheetNames();
  }
  GetListMunicipality() {
    this.Service.ListOfMunicipality().subscribe({
      next: (response) => {
        this.listMunCity = <any>response;
      },
      error: (error) => {},
      complete: () => {
        this.FilterList();
      },
    });
  }
  loadSheetNames() {
    const savedSheets = localStorage.getItem('sheetNames');
    if (savedSheets) {
      this.sheetNames = JSON.parse(savedSheets);
    }
  }

  objectKeys<T extends Record<string, any>>(obj: T): (keyof T)[] {
    return Object.keys(obj) as (keyof T)[];
  }
  Getpdfp() {
    this.Service.Getpdfp(this.auth.setYear, this.auth.munCityId).subscribe({
      next: (response: any) => {
        if (response?.tables?.length) {
          this.structuredTableData = response.tables.map((table: any) => {
            const formattedTable = {
              title: table.title,
              sheetNames: table.sheetNames || [],
              mainHeaders: table.mainHeaders || [],
              subHeaders: table.subHeaders || [],
              hasSubHeaders: table.hasSubHeaders || false,
              structuredData: this.formatTableData(table.tableData),
            };
            return formattedTable;
          });

          localStorage.setItem(
            'sheetNames',
            JSON.stringify(
              this.structuredTableData.flatMap((t) => t.sheetNames)
            )
          );
        }
      },
      error: (error) => {
        console.error('Error fetching PDFP data:', error);
        Swal.fire('Empty', 'No File Uploaded', 'error');
      },
    });
  }
  hasSubHeaders(headers: any[]): boolean {
    return headers?.some((h) => h.subHeaders && h.subHeaders.length > 0);
  }

  startEdit(table: any) {
    table.isEditing = true;
  }

  cancelEdit(table: any) {
    table.isEditing = false;
  }

  saveEdit(table: any) {
    // Save logic here — push changes to backend if needed
    table.isEditing = false;
  }

  deleteTable(table: any) {
    const index = this.structuredTableData.indexOf(table);
    if (index > -1) {
      this.structuredTableData.splice(index, 1);
    }
  }

  ngOnDestroy() {
    localStorage.removeItem('sheetNames');
  }
  formatTableData(tableData: any[]): any[] {
    if (!Array.isArray(tableData) || tableData.length === 0) return [];

    // Split all column data into arrays for each column
    const columnDataArrays = tableData.map(
      (col) => col.data[0]?.split('||').map((v: string) => v.trim()) || []
    );

    // Find the row count based on the longest column
    const rowCount = Math.max(...columnDataArrays.map((arr) => arr.length));
    const formattedRows: any[][] = [];

    // Fill the rows with cell data
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      const row: any[] = [];
      for (let colIndex = 0; colIndex < columnDataArrays.length; colIndex++) {
        const cellValue = columnDataArrays[colIndex][rowIndex] ?? '';
        row.push({ value: cellValue, rowSpan: 1 });
      }
      formattedRows.push(row);
    }

    return formattedRows;
  }

  FilterList() {
    let isExist;
    this.listData = [];

    this.listMunCity.forEach((a: any) => {
      this.listpdfp.forEach((b: any) => {
        if (a.munCityId == b.munCityId) {
          isExist = this.listData.filter(
            (x: any) => x.munCityId == a.munCityId
          );
          if (isExist.length == 0) {
            this.listData.push(b);
          }
        }
      });

      isExist = this.listData.filter((x: any) => x.munCityId == a.munCityId);
      if (isExist.length == 0) {
        this.listData.push({
          munCityId: a.munCityId,
          munCityName: a.munCityName,
        });
      }
    });
  }

  resetTable() {
    this.structuredTableData = [];
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('Title', file.name);
      formData.append('Details', 'Uploaded file');
      formData.append('Interpretation', 'Generated data');
      formData.append('SetYear', this.auth.setYear.toString());

      this.Service.Postpdfp(formData).subscribe({
        next: (response: any) => {
          Swal.fire('Success!', 'File uploaded successfully.', 'success');
          this.sheetNames = response.sheetNames || [];
          localStorage.setItem('sheetNames', JSON.stringify(this.sheetNames));
          this.Getpdfp(); // Re-fetch and render the table data
        },
        error: (error) => {
          console.error('Upload error:', error);
          Swal.fire('Error!', 'Upload failed. Please try again.', 'error');
        },
      });
    }
  }
}

// GetrainIn() {
//   this.service.GetRainIn(this.auth.setYear).subscribe({
//     next: (response) => {
//       this.listrainIn = <any>response;
//     },
//     error: (error) => {},
//     complete: () => {
//       this.GetListMunicipality();
//     },
//   });
// }
// GetListMunicipality() {
//   this.service.ListOfMunicipality().subscribe({
//     next: (response) => {
//       this.listMunCity = <any>response;
//     },
//     error: (error) => {},
//     complete: () => {
//       this.FilterList();
//     },
//   });
// }
// FilterList() {
//   let isExist;
//   this.listData = [];

//   this.listMunCity.forEach((a: any) => {
//     this.listrainIn.forEach((b: any) => {
//       if (a.munCityId == b.munCityId) {
//         isExist = this.listData.filter(
//           (x: any) => x.munCityId == a.munCityId
//         );
//         if (isExist.length == 0) {
//           this.listData.push(b);
//         }
//       }
//     });

//     isExist = this.listData.filter((x: any) => x.munCityId == a.munCityId);
//     if (isExist.length == 0) {
//       this.listData.push({
//         munCityId: a.munCityId,
//         munCityName: a.munCityName,
//       });
//     }
//   });
// }
// getTotal(field: string): number {
//   return this.listData.reduce(
//     (sum: number, item: { [x: string]: any }) =>
//       sum + (item[field] ? Number(item[field]) : 0),
//     0
//   );
// }
// AddData() {
//   if (isEmptyObject(this.data)) {
//     Swal.fire(
//       'Missing Data!',
//       'Please fill out the required fields',
//       'warning'
//     );
//   } else {
//     this.data.munCityId = this.auth.munCityId;
//     this.data.setYear = this.auth.activeSetYear;
//     this.service.AddRainIn(this.data).subscribe({
//       next: (request) => {
//         let index = this.listData.findIndex(
//           (obj: any) => obj.munCityId === this.data.munCityId
//         );
//         this.listData[index] = request;
//         console.log(request);
//       },
//       complete: () => {
//         this.data = {};
//         if (this.closebutton) {
//           this.closebutton.nativeElement.click();
//         } else {
//           console.warn('Close button not found');
//         }

//         Swal.fire({
//           position: 'center',
//           icon: 'success',
//           title: 'Your work has been saved',
//           showConfirmButton: false,
//           timer: 1000,
//         });
//       },
//     });
//   }
// }
// EditData() {
//   this.data.setYear = this.auth.activeSetYear;
//   this.service.EditRainIn(this.data).subscribe({
//     next: (request) => {
//       this.closebutton.nativeElement.click();
//       this.data = {};
//     },
//     complete: () => {
//       Swal.fire({
//         position: 'center',
//         icon: 'success',
//         title: 'Your work has been updated',
//         showConfirmButton: false,
//         timer: 1000,
//       });
//     },
//   });
// }
// DeleteData(transId: any, index: any, data: any) {
//   Swal.fire({
//     title: 'Are you sure?',
//     text: "You won't be able to revert this!",
//     icon: 'warning',
//     showCancelButton: true,
//     confirmButtonColor: '#3085d6',
//     cancelButtonColor: '#d33',
//     confirmButtonText: 'Yes, delete it!',
//   }).then((result) => {
//     if (result.isConfirmed) {
//       this.service.DeleteSusFlood(transId).subscribe({
//         next: (_data) => {},
//         error: (err) => {
//           Swal.fire('Oops!', 'Something went wrong.', 'error');
//         },
//         complete: () => {
//           this.listData[index] = {};
//           this.listData[index].munCityId = data.munCityId;
//           this.listData[index].munCityName = data.munCityName;
//           Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
//         },
//       });
//     }
//   });
// }
