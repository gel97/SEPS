import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { PopulationOfIndigenousPeopleService } from 'src/app/shared/Governance/PopIndigenousPeople.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { ImportComponent } from 'src/app/components/import/import.component';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';
import { isEmptyObject } from 'jquery';
import { SourceService } from 'src/app/shared/Source/Source.Service';

@Component({
  selector: 'app-population-of-indigenous-people',
  templateUrl: './population-of-indigenous-people.component.html',
  styleUrls: ['./population-of-indigenous-people.component.css'],
})
export class PopulationOfIndigenousPeopleComponent implements OnInit {
  listData: any;
  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private service: PopulationOfIndigenousPeopleService,
    private auth: AuthService,
    private cdr: ChangeDetectorRef,
    private SourceService: SourceService
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
  isBarangay: boolean = true;
  listPrkBrgy: any[] = [];
  barangay: any = { sitio: [] };
  isAccordionOpen: boolean[] = [];
  isEditMode: boolean = false;
  editPrk: any = {};
  sources: any = [];
  newSource: any = {};
  selectedSourceId: number | null = null;
  showAddForm: boolean = true;
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
    this.GetBarangayPrk();
  }

  ngOnInit(): void {
    this.Init();
    this.GetBarangayList();
    this.getIp();
    this.getSources();
    this.isAccordionOpen = this.listPrkBrgy.map(() => false);
  }
  getSources(): void {
    const setYear = this.auth.activeSetYear;
    const munCityId = this.auth.munCityId;
    const sourceFor = 'PopulationBrgy';

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

    const sourceFor = 'PopulationBrgy'; // 👈 assign your module name

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
  toggleAccordion(index: number) {
    this.isAccordionOpen[index] = !this.isAccordionOpen[index];
  }
  GetBarangayPrk() {
    this.service.GetBarangayPrk().subscribe((data) => {
      console.log('Data from service:', data);
      this.listPrkBrgy = data;
      this.isAccordionOpen = new Array(data.length).fill(false); // Sync open state
    });
  }

  import() {
    let importData = 'Population of Indigenous People';
    // this.view = this.importComponent.viewData;
    this.importComponent.import(importData);
  }
  handleOnTabChange(isBarangay: boolean) {
    this.isBarangay = isBarangay;
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
  //prkIP
  saveDataIP() {
    if (!isEmptyObject(this.data)) {
      this.data.munCityId = this.auth.munCityId;
      this.data.setYear = this.auth.activeSetYear;

      if (!this.data.brgyId) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Barangay ID is required',
          showConfirmButton: true,
        });
        return;
      }

      this.service.AddPrkIP(this.data).subscribe({
        next: () => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Purok Chair has been added successfully!',
            showConfirmButton: false,
            timer: 1000,
          });

          this.GetBarangayPrk(); // Refresh UI with updated data
          this.data = {};
          (document.activeElement as HTMLElement)?.blur(); // Fix aria-hidden warning
          this.closebutton.nativeElement.click(); // Close modal
        },
        error: (err) => {
          console.error('Error adding Purok Chair: ', err);
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Error adding Purok Chair',
            showConfirmButton: true,
          });
        },
      });
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Please fill out the required fields',
        showConfirmButton: true,
      });
    }
  }
  EditPrk() {
    if (this.data.brgyId) {
      // Make sure we have a valid brgyId (indicating an update)
      this.data.munCityId = this.auth.munCityId;
      this.data.setYear = this.auth.activeSetYear;

      // Call the EditPrk service to update the data
      this.service.EditPrk(this.data).subscribe({
        next: (response) => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Purok Chair has been updated successfully!',
            showConfirmButton: false,
            timer: 1000,
          });

          this.GetBarangayPrk(); // Refresh the UI with updated data
          this.data = {}; // Reset data after successful update
          (document.activeElement as HTMLElement)?.blur(); // Fix aria-hidden warning
          this.closebutton.nativeElement.click(); // Close modal
        },
        error: (err) => {
          console.error('Error updating Purok Chair: ', err);
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Error updating Purok Chair',
            showConfirmButton: true,
          });
        },
      });
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Barangay ID is required for updating',
        showConfirmButton: true,
      });
    }
  }
  DeleteData(transId: any, index: any, data: any) {
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
        this.service.DeletePrk(transId).subscribe({
          next: (_data) => {},
          error: (err) => {
            Swal.fire('Oops!', 'Something went wrong.', 'error');
          },
          complete: () => {
            this.Init();
            Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
          },
        });
      }
    });
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

  editToggle(a: any) {
    this.data = { ...a }; // copy the selected record
    this.isEditMode = true;
    this.not_visible = true;
    this.visible = false;
  }
  addToggle() {
    this.data = {}; // reset the form model
    this.isEditMode = false;
    this.visible = true;
    this.not_visible = false;
  }
  formatNumber(value: number | string): string {
    if (value == null || value === '') return '';
    return Number(value).toLocaleString('en-US');
  }

  unformatNumber(value: string): number {
    return Number(value.replace(/,/g, ''));
  }

  onFormattedInputChange(event: any, field: string) {
    const rawValue = event.target.value;
    const numericValue = this.unformatNumber(rawValue);
    this.data[field] = numericValue;

    this.autoAssignCategory();
    this.calculateTotals();
  }

  formatField(field: string) {
    this.data[field] = this.unformatNumber(this.data[field]);
  }
}
