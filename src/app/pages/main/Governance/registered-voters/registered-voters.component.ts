import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RegVoterService } from './../../../../shared/Governance/reg-voter.service';
import Swal from 'sweetalert2';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { ImportComponent } from 'src/app/components/import/import.component';

@Component({
  selector: 'app-registered-voters',
  templateUrl: './registered-voters.component.html',
  styleUrls: ['./registered-voters.component.css'],
})
export class RegisteredVotersComponent implements OnInit {
  constructor(
    private service: RegVoterService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService
  ) {}
  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  munCityName: string = this.auth.munCityName;

  toValidate: any = {};
  barangays: any = {};
  Voter: any = [];
  voter: any = {};
  editmodal: any = {};

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

  clearData() {
    this.voter = {};
    this.not_visible = false;
    this.visible = true;
    // this.required = false;
  }

  public showOverlay = false;
  importMethod() {
    this.showOverlay = true;
    this.service.Import().subscribe({
      next: (data) => {
        this.Init();
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

  date = new DatePipe('en-PH');
  ngOnInit(): void {
    this.Init();
    this.list_of_barangay();
  }

  message = 'Polling Precincts and Registered Voters';
  Init() {
    this.voter.munCityId = this.auth.munCityId;
    this.service.GetRegVoter().subscribe((data) => {
      // this.import();
      this.Voter = <any>data;
      console.log(this.Voter);
    });
  }

  import() {
    let importData = 'Polling Precincts and Registered Voters';
    this.importComponent.import(importData);
  }

  list_of_barangay() {
    this.service.ListBarangay().subscribe((data) => {
      this.barangays = <any>data;
      console.log('fgxtxgcvcgcf', this.barangays);
    });
  }

  addVoter() {
    this.toValidate.brgyId =
      this.voter.brgyId == '' || this.voter.brgyId == null ? true : false;
    this.toValidate.votingCntrNo =
      this.voter.votingCntrNo == '' || this.voter.votingCntrNo == undefined
        ? true
        : false;
    this.toValidate.regVoterNo =
      this.voter.regVoterNo == '' || this.voter.regVoterNo == undefined
        ? true
        : false;
    this.toValidate.estabNo =
      this.voter.estabNo == '' || this.voter.estabNo == undefined
        ? true
        : false;
    this.toValidate.clusterNo =
      this.voter.clusterNo == '' || this.voter.clusterNo == undefined
        ? true
        : false;

    if (
      this.toValidate.brgyId == true ||
      this.toValidate.votingCntrNo == true ||
      this.toValidate.regVoterNo == true ||
      this.toValidate.estabNo == true ||
      this.toValidate.clusterNo == true
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.voter.munCityId = this.auth.munCityId;
      this.voter.setYear = this.auth.activeSetYear;

      this.service.AddRegVoter(this.voter).subscribe(
        (_data) => {
          if (!this.isCheck) {
            this.closebutton.nativeElement.click();
          }
          console.log(_data);
          this.clearData();
          this.Init();

          Swal.fire('Good job!', 'Data Added Successfully!', 'success');
          this.Init();
          this.voter = {};
        },
        (_err) => {
          Swal.fire('ERROR!', 'Error', 'error');

          this.Init();
          this.voter = {};
        }
      );
    }
  }
  editdemo(editdemo: any = {}) {
    this.editmodal = editdemo;
    //passing the data from table (modal)
    this.Init();
  }

  //for modal
  updateVoter() {
    this.toValidate.brgyId =
      this.editmodal.brgyId == '' || this.editmodal.brgyId == null
        ? true
        : false;
    this.toValidate.votingCntrNo =
      this.editmodal.votingCntrNo == '' ||
      this.editmodal.votingCntrNo == undefined
        ? true
        : false;
    this.toValidate.regVoterNo =
      this.editmodal.regVoterNo == '' || this.editmodal.regVoterNo == undefined
        ? true
        : false;
    this.toValidate.estabNo =
      this.editmodal.estabNo == '' || this.editmodal.estabNo == undefined
        ? true
        : false;
    this.toValidate.clusterNo =
      this.editmodal.clusterNo == '' || this.editmodal.clusterNo == undefined
        ? true
        : false;

    if (
      this.toValidate.brgyId == true ||
      this.toValidate.votingCntrNo == true ||
      this.toValidate.regVoterNo == true ||
      this.toValidate.estabNo == true ||
      this.toValidate.clusterNo == true
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.service.UpdateRegVoter(this.editmodal).subscribe({
        next: (_data) => {
          this.Init();
        },
      });

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Your work has been updated',
        showConfirmButton: false,
        timer: 1000,
      });
      this.editmodal = {};
      document.getElementById('ModalEdit')?.click();
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
        for (let i = 0; i < this.Voter.length; i++) {
          if (this.Voter[i].transId == transId) {
            this.Voter.splice(i, 1);
            Swal.fire('Deleted!', 'Your file has been removed.', 'success');
          }
        }

        this.service.DeleteRegVoter(transId).subscribe((_data) => {
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
}
