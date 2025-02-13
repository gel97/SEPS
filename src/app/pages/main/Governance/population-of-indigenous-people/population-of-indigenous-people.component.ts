import { Component, OnInit, ViewChild } from '@angular/core';
import { PopulationOfIndigenousPeopleService } from 'src/app/shared/Governance/PopIndigenousPeople.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { ImportComponent } from 'src/app/components/import/import.component';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';

@Component({
  selector: 'app-population-of-indigenous-people',
  templateUrl: './population-of-indigenous-people.component.html',
  styleUrls: ['./population-of-indigenous-people.component.css'],
})
export class PopulationOfIndigenousPeopleComponent implements OnInit {
  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private service: PopulationOfIndigenousPeopleService,
    private auth: AuthService
  ) {}
  message = 'Population of Indigenous People';

  PopInd: any = ([] = []);
  barangayList: any = [];
  searchText = '';
  //paginate
  pageSize = 10;
  p: number = 0;
  count: number = 0;
  tableSize: number = 20;
  tableSizes: any = [20, 40, 60, 80, 100];
  ip: any = {};
  IPlist: any = [];
  categories: any = []; // Store unique categories
  selectedCategory: string = ''; // Track selected category
  selectedBarangay: string = '';
  ipMale: number = 0;
  ipFemale: number = 0;
  nonIpMale: number = 0;
  nonIpFemale: number = 0;
  category: string = '';
  IP: any = [];
  data: any = {};
  setYear = this.auth.setYear;
  munCityId = this.auth.munCityId;
  isCheck: boolean = false;
  visible: boolean = true;
  not_visible: boolean = false;
  required: boolean = true;
  toValidate: any = {};
  editmodal: any = {};
  isAdd: boolean = false;
  dummy_addData: any = {};
  dummyData: any = {};
  @ViewChild(ImportComponent)
  private importComponent!: ImportComponent;
  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };
  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
    console.log('isCheck:', this.isCheck);
  }
  Init() {
    this.GetBarangayList();
    this.getIp();
  }

  ngOnInit(): void {
    this.GetBarangayList();
    this.getIp();
  }
  import() {
    let importData = 'Population of Indigenous People';
    // this.view = this.importComponent.viewData;
    this.importComponent.import(importData);
  }
  public showOverlay = false;
  importMethod() {
    this.showOverlay = true;
    this.service.Import().subscribe({
      next: (data) => {
        this.Init();
        if (data === null) {
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
  ImportExcel(e: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: '',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, submit it!',
    }).then((result) => {
      console.log(result);
      if (result.isConfirmed) {
        this.reportService
          .Get_ExImport(
            e.target.files[0],
            this.auth.setYear,
            this.auth.munCityId,
            'Benificiaries'
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
                    this.getIp();
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
      } else {
      }
    });
  }
  autoAssignCategory() {
    if (this.ipMale > 0 || this.ipFemale > 0) {
      this.category = 'IP';
    } else if (this.nonIpMale > 0 || this.nonIpFemale > 0) {
      this.category = 'Non-IP';
    } else {
      this.category = '';
    }
  }

  onTableDataChange(page: any) {
    //paginate
    this.p = page;
  }
  onTableSizeChange(event: any) {
    //paginate
    this.tableSize = event.target.value;
    this.p = 1;
  }

  GetBarangayList(): void {
    this.service.GetBarangayList().subscribe({
      next: (response) => {
        this.barangayList = response || [];
        console.log('Fetched barangay list:', this.barangayList);
      },
      error: (err) => {
        console.error('Error fetching barangay list:', err);
      },
    });
  }

  saveData() {
    // Calculate totals before saving
    this.calculateTotals();

    // Validate Barangay ID
    this.dummy_addData = this.data;
    if (JSON.stringify(this.dummy_addData) != JSON.stringify(this.dummyData)) {
      this.toValidate.brgyId = !this.data.brgyId; // Check if brgyId is empty or null
    }
    if (this.toValidate.brgyId) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
      return; // Exit the function if validation fails
    }

    // Set additional data fields
    this.data.setYear = this.setYear;
    this.data.munCityId = this.munCityId;
    this.data.createdAt = new Date().toISOString();

    // Call service to add the data
    this.service.AddIP(this.data).subscribe(
      (response) => {
        console.log('Success:', response);

        // Close the modal properly
        setTimeout(() => {
          if (this.closebutton) {
            this.closebutton.nativeElement.click();
          }
        }, 100);

        // Clear data and refresh data list
        this.clearData();
        this.getIp();

        // Show success message
        Swal.fire('Good job!', 'Data Added Successfully!', 'success');
      },
      (error) => {
        console.error('Error:', error);
        Swal.fire('Oops!', 'Something went wrong!', 'error');
      }
    );
  }

  calculateTotals() {
    this.data.tot_pop_male =
      (this.data.non_Ip_Male || 0) + (this.data.ip_Male || 0);
    this.data.tot_pop_female =
      (this.data.non_Ip_Female || 0) + (this.data.ip_Female || 0);
  }

  EditIp(): void {
    this.calculateTotals(); // Ensure correct totals

    // Validate if Barangay is selected
    if (!this.data.brgyId) {
      Swal.fire('Missing Data!', 'Please select a Barangay.', 'warning');
      return;
    }

    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then((result) => {
      if (result.isConfirmed) {
        setTimeout(() => {
          if (this.closebutton) {
            this.closebutton.nativeElement.click();
          }
        }, 100);

        // Ensure brgyId is correctly assigned
        if (this.data.brgyId && typeof this.data.brgyId === 'object') {
          this.data.brgyId = this.data.brgyId.brgyId;
        }

        this.data.setYear = this.setYear;
        this.data.munCityId = this.munCityId;
        this.data.tag = 1;

        console.log('Saving edited data:', this.data);

        this.service.UpdateIP(this.data).subscribe({
          next: (request) => {
            console.log('Edit response:', request);
            Swal.fire('Saved!', '', 'success');
            this.getIp(); // Reload data
          },
          error: (err) => {
            console.error('Error updating data:', err);
          },
        });
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info');
        this.getIp();
      }
    });
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
        for (let i = 0; i < this.IPlist.length; i++) {
          if (this.IPlist[i].transId == transId) {
            this.IPlist.splice(i, 1);
            Swal.fire('Deleted!', 'Your file has been removed.', 'success');
          }
        }

        this.service.DeleteIP(transId).subscribe((_data: any) => {
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

  getIp() {
    this.ip.setYear = this.auth.activeSetYear;

    this.service.GetIPListByYear(this.setYear, this.munCityId).subscribe(
      (data: any[]) => {
        console.log('Received Data:', data);

        // Assign data directly
        this.IPlist = data;

        console.log('Updated IPlist:', this.IPlist);
      },
      (error) => {
        console.error('Error fetching IP List:', error);
      }
    );
  }

  clearData() {
    this.data = {};
    this.not_visible = false;
    this.visible = true;
  }
  parentMethod() {
    this.data = {};
    this.not_visible = false;
    this.visible = true;
    this.required = false;
  }

  editToggle() {
    this.not_visible = true;
    this.visible = false;
  }
}
