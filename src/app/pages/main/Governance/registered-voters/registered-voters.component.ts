import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RegVoterService } from './../../../../shared/Governance/reg-voter.service';
import Swal from 'sweetalert2';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { ImportComponent } from 'src/app/components/import/import.component';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { PdfService } from 'src/app/services/pdf.service';
import { ReportsService } from 'src/app/shared/Tools/reports.service';
@Component({
  selector: 'app-registered-voters',
  templateUrl: './registered-voters.component.html',
  styleUrls: ['./registered-voters.component.css'],
})
export class RegisteredVotersComponent implements OnInit {
  constructor(
    private pdfService: PdfService,
    private reportService: ReportsService,
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
  Voter: any = ([] = []);
  voter: any = {};
  editmodal: any = {};
  searchText = '';
  isCheck: boolean = false;
  visible: boolean = true;
  not_visible: boolean = true;

  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };

  @ViewChild(ImportComponent)
  private importComponent!: ImportComponent;

  @ViewChild(PdfComponent)
  private pdfComponent!: PdfComponent;

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
  get totals() {
    return this.Voter.reduce(
      (
        acc: {
          purokNo: any;
          estabNo: any;
          clusterNo: any;
          votingCntrNo: any;
          regVoterNo: any;
        },
        text: {
          purokNo: any;
          estabNo: any;
          clusterNo: any;
          votingCntrNo: any;
          regVoterNo: any;
        }
      ) => {
        acc.purokNo += text.purokNo || 0;
        acc.estabNo += text.estabNo || 0;
        acc.clusterNo += text.clusterNo || 0;
        acc.votingCntrNo += text.votingCntrNo || 0;
        acc.regVoterNo += text.regVoterNo || 0;
        return acc;
      },
      { purokNo: 0, estabNo: 0, clusterNo: 0, votingCntrNo: 0, regVoterNo: 0 }
    );
  }

  public showOverlay = false;
  importMethod() {
    this.showOverlay = true;
    this.service.Import().subscribe({
      next: (data) => {
        this.Init();
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

  reports: any = [];
  GeneratePDF() {
    let data: any = [];
    let subtotal1: any = {};
    let subtotal2: any = {};
    let grandtotal: any = {};
    const tableData: any = [];
    const dist1: any = [];
    const dist2: any = [];

    // Fetch the report data from the service
    this.reportService.GetRegvoterMunReport(this.pdfComponent.data).subscribe({
      next: (response: any = {}) => {
        this.reports = response.data;
        subtotal1 = response.subtotalData[0];
        subtotal2 = response.subtotalData[1];
        grandtotal = response.grandTotal;

        // Title for the PDF
        data.push({
          text: 'Number of Precincts and Registered Voters by Municipality/City',
          bold: true,
          alignment: 'center',
        });

        // Organize reports into districts (optional, can keep for data categorization)
        this.reports.forEach((item: any) => {
          item.district === 1 ? dist1.push(item) : dist2.push(item);
        });

        // Year header
        data.push({
          margin: [0, 40, 0, 0],
          columns: [
            {
              text: `Year: ${response.data[0]?.setYear || ''}`,
              fontSize: 14,
              bold: true,
            },
          ],
        });

        // Define table headers
        const headers = [
          {
            text: 'Municipality/City',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'No. of Puroks',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'No. of Established Precincts',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'No. of Clustered Precincts',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'No. of Voting Centers',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
          {
            text: 'No. of Registered Voters',
            fillColor: 'black',
            color: 'white',
            bold: true,
            alignment: 'center',
          },
        ];

        // Add headers to tableData
        tableData.push(headers);

        // Function to add district data (now without district labels)
        const addDistrictData = (districtData: any[]) => {
          districtData.forEach((item: any) => {
            tableData.push([
              { text: item.munCityName, alignment: 'center' },
              { text: item.totalPurokNo, alignment: 'center' },
              { text: item.totalEstabNo, alignment: 'center' },
              { text: item.totalClusterNo, alignment: 'center' },
              { text: item.totalVotingCntrNo, alignment: 'center' },
              { text: item.totalRegVoterNo, alignment: 'center' },
            ]);
          });
        };

        // Add data for District 1 and District 2 (without district labels)
        addDistrictData(dist1);
        addDistrictData(dist2);

        // Define table layout and push it to the PDF data
        data.push({
          margin: [0, 40, 0, 0],
          table: {
            widths: ['*', '*', '*', '*', '*', '*'],
            body: tableData,
          },
          layout: {
            hLineWidth: (i: any) => (i === 0 ? 2 : 1), // Bold line for header
            vLineWidth: () => 1,
            hLineColor: () => '#CCCCCC',
            vLineColor: () => '#CCCCCC',
            paddingLeft: () => 5,
            paddingRight: () => 5,
            paddingTop: () => 3,
            paddingBottom: () => 3,
          },
        });
      },
      error: (error: any) => {
        console.error('Error fetching report data:', error);
      },
      complete: () => {
        // Generate the PDF after fetching the data
        const isPortrait = false;
        this.pdfService.GeneratePdf(data, isPortrait, '');
        console.log(data);
      },
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
    this.service.GetRegVoter().subscribe((data: any) => {
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
    this.service.ListBarangay().subscribe((data: any) => {
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
        (_data: any) => {
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
        (_err: any) => {
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
        next: (_data: any) => {
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

        this.service.DeleteRegVoter(transId).subscribe((_data: any) => {
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
