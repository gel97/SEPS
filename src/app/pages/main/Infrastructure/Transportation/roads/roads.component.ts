import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { TrasportationService } from 'src/app/shared/Trasportation/trasportation.service';
import Swal from 'sweetalert2';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';
import { SourceService } from 'src/app/shared/Source/Source.Service';
@Component({
  selector: 'app-roads',
  templateUrl: './roads.component.html',
  styleUrls: ['./roads.component.css'],
})
export class RoadsComponent implements OnInit {
  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private service: TrasportationService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService,
    private SourceService: SourceService
  ) {}

  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };

  @ViewChild(PdfComponent)
  private pdfComponent!: PdfComponent;

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  message = 'Roads';

  parentMethod() {
    // alert('parent Method');
    this.isNew = true;
  }

  public showOverlay = false;
  importMethod() {
    this.showOverlay = true;
    this.service.post_import_transpo_road().subscribe({
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

  munCityName: string = this.auth.munCityName;
  toValidate: any = {};
  TranspoRoadList: any = [];
  RoadList: any = {};
  isNew: boolean = true;
  sources: any = [];
  newSource: any = {};
  selectedSourceId: number | null = null;
  showAddForm: boolean = true;

  RoadType: any = [
    { id: 'rt01', roadtypename: 'National Roads' },
    { id: 'rt02', roadtypename: 'Provincial Roads' },
    { id: 'rt03', roadtypename: 'Municipal/City Roads' },
    { id: 'rt04', roadtypename: 'Barangay Roads' },
    { id: 'rt05', roadtypename: 'NIA Roads' },
    { id: 'rt06', roadtypename: 'Expressways/Toll Roads' },
    { id: 'rt07', roadtypename: 'Private Industrial Roads' },
    { id: 'rt08', roadtypename: 'Private Subdivision Roads' },
    { id: 'rt09', roadtypename: 'Other/Unspecified' },
  ];

  ngOnInit(): void {
    this.getListTranspoRoad();
    this.getSources();
  }
  getSources(): void {
    const setYear = this.auth.activeSetYear;
    const munCityId = this.auth.munCityId;
    const sourceFor = 'roads';

    this.SourceService.getSources(setYear, munCityId, sourceFor).subscribe({
      next: (data) => {
        this.sources = data;
        this.showAddForm = data.length === 0;
      },
      error: (error) => {
        console.error('Failed to fetch sources:', error);
      },
    });
  }

  addSource(): void {
    if (!this.newSource?.name) {
      Swal.fire('Warning', 'Please enter a source name.', 'warning');
      return;
    }

    const sourceFor = 'roads'; // 👈 assign your module name

    // ✅ Add metadata
    this.newSource.munCityId = this.auth.munCityId;
    this.newSource.setYear = this.auth.activeSetYear;
    this.newSource.sourceFor = sourceFor;

    this.SourceService.createSource(this.newSource).subscribe({
      next: () => {
        this.newSource = {};
        Swal.fire('Success', 'Source added successfully.', 'success');
        this.getSources(); // ✅ Re-fetch source list
      },
      error: (error) => {
        Swal.fire('Error', `Failed to create source.\n${error}`, 'error');
      },
    });
  }

  updateSource(): void {
    if (this.selectedSourceId === null || !this.newSource?.name) {
      Swal.fire('Warning', 'No source selected or missing name.', 'warning');
      return;
    }

    this.SourceService.updateSource(
      this.selectedSourceId,
      this.newSource
    ).subscribe({
      next: () => {
        this.getSources();
        this.selectedSourceId = null;
        this.newSource = {};
        Swal.fire('Success', 'Source updated successfully!', 'success');
      },
      error: (error) => {
        Swal.fire('Error', `Failed to update source.\n${error}`, 'error');
      },
    });
  }
  deleteSource(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action will delete the source.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // Show loading dialog
        Swal.fire({
          title: 'Deleting...',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        // Perform delete operation
        this.SourceService.deleteSource(id).subscribe({
          next: () => {
            this.getSources(); // Refresh list
            Swal.fire('Deleted!', 'Source has been deleted.', 'success');
          },
          error: (error) => {
            Swal.fire(
              'Error',
              `Failed to delete source.\n${error.message || error}`,
              'error'
            );
          },
        });
      }
    });
  }

  editSource(source: any): void {
    this.selectedSourceId = source.id;
    this.newSource = { ...source };
  }

  GeneratePDF() {
    let data: any = [];
    let reports: any = [];

    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    this.reportService.GetTranspoRoadReport(this.pdfComponent.data).subscribe({
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
              text: `Summary of Road Length by Type and Pavement Classification`,
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
            text: 'Road Type',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Concrete (Km)',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Asphalt (Km)',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Gravel (Km)',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Earth (Km)',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'Total (Kms)',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
        ]);

        tableData.push([
          {
            text: `1st Congressional District `,
            colSpan: 7,
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
              colSpan: 7,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group1.forEach((item: any, index: any) => {
            let roadName: string = '';
            this.RoadType.forEach((m: any) => {
              if (m.id === item.roadType) roadName = m.roadtypename;
            });
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: roadName,
                fillColor: '#FFFFFF',
              },
              {
                text: item.concrete,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.asphalt,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.gravel,
                fillColor: '#FFFFFF',
              },
              {
                text: item.earth,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.totalLength,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ]);
          });
        }

        tableData.push([
          {
            text: `2nd Congressional District `,
            colSpan: 7,
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
              colSpan: 7,
              alignment: 'left',
              fillColor: '#9DB2BF',
              marginLeft: 5,
            },
          ]);

          group2.forEach((item: any, index: any) => {
            let roadName: string = '';
            this.RoadType.forEach((m: any) => {
              if (m.id === item.roadType) roadName = m.roadtypename;
            });
            tableData.push([
              {
                text: index + 1,
                fillColor: '#FFFFFF',
                marginLeft: 5,
              },
              {
                text: roadName,
                fillColor: '#FFFFFF',
              },
              {
                text: item.concrete,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.asphalt,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.gravel,
                fillColor: '#FFFFFF',
              },
              {
                text: item.earth,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
              {
                text: item.totalLength,
                fillColor: '#FFFFFF',
                alignment: 'center',
              },
            ]);
          });
        }

        const table = {
          margin: [0, 20, 0, 0],
          table: {
            widths: [25, '*', '*', '*', '*', '*', '*'],
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

  getListTranspoRoad() {
    this.service.get_list_transpo_road().subscribe((data) => {
      this.TranspoRoadList = <any>data;
      // if (this.TranspoRoadList.length > 0) {
      //   this.isNew = true;
      // } else {
      //   this.isNew = false;
      // }
      for (let i of this.TranspoRoadList) {
        for (let r of this.RoadType) {
          if (i.roadType == r.id) {
            i.roadtypename = r.roadtypename;
            break;
          }
        }
      }
    });
  }

  saveRoadList() {
    this.toValidate.roadType =
      this.RoadList.roadType == '' || this.RoadList.roadType == null
        ? true
        : false;
    this.toValidate.concrete =
      this.RoadList.concrete == '' || this.RoadList.concrete == undefined
        ? true
        : false;
    this.toValidate.asphalt =
      this.RoadList.asphalt == '' || this.RoadList.asphalt == null
        ? true
        : false;
    this.toValidate.gravel =
      this.RoadList.gravel == '' || this.RoadList.gravel == undefined
        ? true
        : false;
    this.toValidate.earth =
      this.RoadList.earth == '' || this.RoadList.earth == undefined
        ? true
        : false;

    this.RoadList.setYear = this.auth.activeSetYear;
    this.RoadList.munCityId = this.auth.munCityId;
    this.RoadList.tag = 1;
    this.RoadList.totalLength = String(
      Number(this.RoadList.concrete) +
        Number(this.RoadList.asphalt) +
        Number(this.RoadList.gravel) +
        Number(this.RoadList.earth)
    );

    if (
      !this.toValidate.roadType &&
      !this.toValidate.concrete &&
      !this.toValidate.asphalt &&
      !this.toValidate.gravel &&
      !this.toValidate.earth
    ) {
      this.service.post_save_transpo_road(this.RoadList).subscribe(
        (data) => {
          Swal.fire('Saved!', 'Data successfully saved.', 'success');
          this.closebutton.nativeElement.click();
          for (let r of this.RoadType) {
            if ((<any>data).roadType == r.id) {
              (<any>data).roadtypename = r.roadtypename;
              break;
            }
          }

          this.TranspoRoadList.push(<any>data);
        },
        (error) => {
          alert('ERROR');
        }
      );
    } else {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields.',
        'warning'
      );
    }
  }

  updateRoadList() {
    this.toValidate.roadType =
      this.RoadList.roadType == '' || this.RoadList.roadType == null
        ? true
        : false;
    this.toValidate.concrete =
      this.RoadList.concrete == '' || this.RoadList.concrete == undefined
        ? true
        : false;
    this.toValidate.asphalt =
      this.RoadList.asphalt == '' || this.RoadList.asphalt == null
        ? true
        : false;
    this.toValidate.gravel =
      this.RoadList.gravel == '' || this.RoadList.gravel == undefined
        ? true
        : false;
    this.toValidate.earth =
      this.RoadList.earth == '' || this.RoadList.earth == undefined
        ? true
        : false;

    this.RoadList.totalLength = String(
      Number(this.RoadList.concrete) +
        Number(this.RoadList.asphalt) +
        Number(this.RoadList.gravel) +
        Number(this.RoadList.earth)
    );
    if (
      !this.toValidate.roadType &&
      !this.toValidate.concrete &&
      !this.toValidate.asphalt &&
      !this.toValidate.gravel &&
      !this.toValidate.earth
    ) {
      this.service.put_update_transpo_road(this.RoadList).subscribe(
        (data) => {
          Swal.fire('Updated!', 'Data successfully updated.', 'success');
          this.closebutton.nativeElement.click();
        },
        (err) => {
          alert('ERROR');
        }
      );
    } else {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields.',
        'warning'
      );
    }
  }

  deleteRoadList(transId: any = '', index: any = '') {
    this.service.delete_transpo_road(transId).subscribe(
      (data) => {
        Swal.fire('Deleted!', 'Data successfully deleted.', 'success');
        this.TranspoRoadList.splice(index, 1);
      },
      (err) => {
        alert('ERROR');
      }
    );
  }
}
