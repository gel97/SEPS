import { Component, OnInit, ViewChild } from '@angular/core';
import { AgeGroupService } from './../../../../shared/Governance/AgeGroup.service';
import { AuthService } from 'src/app/services/auth.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { ImportComponent } from 'src/app/components/import/import.component';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';
import { request, response } from 'express';
import { isEmptyObject } from 'jquery';
@Component({
  selector: 'app-age-group',
  templateUrl: './age-group.component.html',
  styleUrls: ['./age-group.component.css'],
})
export class AgeGroupComponent implements OnInit {
  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
    private service: AgeGroupService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService
  ) { }
  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  munCityName: string = this.auth.munCityName;

  barangays: any = {};
  age: any = ([] = []);
  group: any = [];
  Agegroup: any = {};
  Listagegroup: any[] = [];
  searchText = '';
  toValidate: any = {};
  listofAgeGroup: any = [];
  addData: any = {};
  dummy_addData: any = {};
  setYear = this.auth.setYear;
  dummyData: any = {};
  munCityId = this.auth.munCityId;
  isCheck: boolean = false;
  visible: boolean = true;
  not_visible: boolean = true;
  required: boolean = true;
  data: any = {};
  editmodal: any = {};
  //paginate
  pageSize = 10;
  p: number = 0;
  count: number = 0;
  tableSize: number = 20;
  tableSizes: any = [20, 40, 60, 80, 100];

  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };

  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
    console.log('isCheck:', this.isCheck);
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

  ngOnInit(): void {
    this.list_of_barangay();
    this.GetAgeGroupList();
    this.getageGroup();
  }
  editagegroup(group: any = {}) {
    this.editmodal = group;
    this.getageGroup();
  }
  message = 'Age Group';

  list_of_barangay() {
    this.service.ListBarangay().subscribe((data) => {
      this.barangays = <any>data;
      console.log('barangay', data);
      console.log('assigned barangays', this.barangays);
    });
  }
  //get Sa add data
  agegrouplist: any;
  getageGroup() {
    this.group.setYear = this.auth.activeSetYear;
    this.service.GetAgeGroupListByYear().subscribe((data: any[]) => {
      this.agegrouplist = data.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      console.log('groupList---', this.agegrouplist);
    });
  }

  findBrgyId(brgyId: any) {
    return this.barangays.find(
      (item: { brgyId: any }) => item.brgyId === brgyId
    );
  }

  GetAgeGroupList() {
    this.service.GetAgeGroupList().subscribe((response) => {
      console.log('Age Group List Response:', response);
      // Filter out entries where createdAt is null
      this.listofAgeGroup = (<any>response).filter(
        (item: any) => item.createdAt !== null
      );
      console.log('Filtered Age Group List:', this.listofAgeGroup);
    });
  }

  ExportExcel() {
    this.reportService.GetExcelExport(
      this.auth.setYear,
      this.auth.munCityId,
      'AgeGroup'
    );
  }
  ImportExcel(e: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, submit it!'
    }).then((result) => {
      console.log(result)
      if (result.isConfirmed) {
        this.reportService
        .Get_ExImport(
          e.target.files[0],
          this.auth.setYear,
          this.auth.munCityId,
          'AgeGroup'
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
                  this.getageGroup();
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
      }
      else{
      }
    })

  }

  AddAgeGroup() {
    this.toValidate.brgyId =
      this.data.brgyId == '' || this.data.brgyId == null ? true : false;
    this.toValidate.male =
      this.data.male == '' || this.data.male == undefined ? true : false;
    this.toValidate.female =
      this.data.female == '' || this.data.female == undefined ? true : false;

    if (
      this.toValidate.brgyId == true ||
      this.toValidate.male == true ||
      this.toValidate.female == true
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.data.setYear = this.setYear;
      this.data.munCityId = this.munCityId;
      this.data.createdAt = new Date().toISOString(); // Set createdAt here

      this.service.AddAgeGroup(this.data).subscribe((request) => {
        if (!this.isCheck) {
          this.closebutton.nativeElement.click();
        }
        console.log('add', request);
        this.clearData();
        this.getageGroup();
        //this.GetAgeGroupList();
        Swal.fire('Good job!', 'Data Added Successfully!', 'success');
      });
    }
  }
  update() {
    // Validate required fields in editmodal
    if (
      !this.editmodal.brgyId ||
      !this.editmodal.category ||
      this.editmodal.male == null ||
      this.editmodal.female == null
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out all required fields before updating.',
        'warning'
      );
      return;
    }

    // Set the year for the update
    this.editmodal.setYear = this.auth.activeSetYear;

    // Call the service to update the age group
    this.service.Updateagegroup(this.editmodal).subscribe({
      next: (response) => {
        console.log('Update Response:', response); // Debug log
        if (this.closebutton && this.closebutton.nativeElement) {
          this.closebutton.nativeElement.click(); // Close the modal
        }
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your changes have been saved successfully!',
          showConfirmButton: false,
          timer: 1500,
        });
      },
      error: (err) => {
        console.error('Update Error:', err); // Debug log
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: 'An error occurred while updating the data. Please try again later.',
        });
      },
      complete: () => {
        this.editmodal = {}; // Clear the form after update
        this.getageGroup(); // Refresh the list after update
      },
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
        // Find the index of the item to delete in the Demo array
        const itemIndex = this.agegrouplist.findIndex(
          (item: any) => item.transId === transId
        );

        if (itemIndex !== -1) {
          this.agegrouplist.splice(itemIndex, 1); // Remove the item from the Demo array
          //this.Init(); // Reinitialize the view or data
          Swal.fire('Deleted!', 'Your file has been removed.', 'success');
        }

        // Call the service to delete the item from the backend
        this.service.DeleteAgeGroup(transId).subscribe((_data) => { });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Handle cancel action if needed
      }
    });
  }

  clearData() {
    this.data = {};
    this.not_visible = false;
    this.visible = true;
    this.required = false;
  }

  parentMethod() {
    // alert('parent Method');
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
