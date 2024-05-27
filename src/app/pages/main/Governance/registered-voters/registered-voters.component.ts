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
  Voter: any = [];
  voter: any = {};
  editmodal: any = {};
  searchText= '';
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
  ExportExcel(){
    this.reportService.GetExcelExport(this.auth.setYear, this.auth.munCityId, "RegVoters");
  }
  ExportTemplate(){
    this.reportService.GetExport_tamplate("RegVoters", this.auth.munCityId);
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

    this.reportService.GetRegvoterReport(this.pdfComponent.data).subscribe({
      next: (response:any ={}) => {
        this.reports = response.data;
        subtotal1 = response.subtotalData[0];
        subtotal2 = response.subtotalData[1];
        grandtotal = response.grandTotal;
        console.log(response);
        
        data.push({text:'Number of Precincts and Registered Voters by Municipality/City', bold: true, alignment:'center'});

        this.reports.forEach((a: any) => {
          console.log(a);
          if(a.district === 1){
           dist1.push(a)
          }
          else{
            dist2.push(a)
          }

        });

        data.push({
          margin: [0, 40, 0, 0],
          columns: [
            {
              text: `Year: ${response.data[0].setYear}`,
              fontSize: 14,
              bold: true,
            },
          ],
        });


           tableData.push([
           {
             text: 'Municipality/ City',
             fillColor: 'black',
             color: 'white',
             bold: true,
             alignment: 'center',
           },
           {
             text: 'No. of Puroks	',
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
         
         ]);

         tableData.push([
          { text: `1st Congressional District `, colSpan: 6, alignment: 'left',
          fillColor: '#526D82'}
        ],
          );

        dist1.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: item.munCityName,
                fillColor: '#FFFFFF',
              },
              {
                text: item.totalPurokNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.totalEstabNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.totalClusterNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.totalVotingCntrNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.totalRegVoterNo,
                fillColor: '#FFFFFF',
              },
             
            ]);
          });

          tableData.push([
            {
              text: 'SUBTOTAL',
              fillColor: '#9DB2BF',
            },
            {
              text: subtotal1.purokNo,
              fillColor: '#9DB2BF',
            },
            {
              text: subtotal1.estabNo,
              fillColor: '#9DB2BF',
            },
            {
              text: subtotal1.clusterNo,
              fillColor: '#9DB2BF',
            },
            {
              text: subtotal1.votingCntrNo,
              fillColor: '#9DB2BF',
            },
            {
              text: subtotal1.regVoterNo,
              fillColor: '#9DB2BF',
            },
           
          ]);

         tableData.push([
              { text: `2nd Congressional District `, colSpan: 6, alignment: 'left',
              fillColor: '#526D82' }
            ],
              );

        dist2.forEach((item: any, index: any) => {
            tableData.push([
              {
                text: item.munCityName,
                fillColor: '#FFFFFF',
              },
              {
                text: item.totalPurokNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.totalEstabNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.totalClusterNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.totalVotingCntrNo,
                fillColor: '#FFFFFF',
              },
              {
                text: item.totalRegVoterNo,
                fillColor: '#FFFFFF',
              },
             
            ]);
          });

          tableData.push([
            {
              text: 'SUBTOTAL',
              fillColor: '#9DB2BF',
            },
            {
              text: subtotal2.purokNo,
              fillColor: '#9DB2BF',
            },
            {
              text: subtotal2.estabNo,
              fillColor: '#9DB2BF',
            },
            {
              text: subtotal2.clusterNo,
              fillColor: '#9DB2BF',
            },
            {
              text: subtotal2.votingCntrNo,
              fillColor: '#9DB2BF',
            },
            {
              text: subtotal2.regVoterNo,
              fillColor: '#9DB2BF',
            },
           
          ]);  

          tableData.push([
            {
              text: 'GRANDTOTAL',
              fillColor: '#F1C93B',
            },
            {
              text: grandtotal.purokNo,
              fillColor: '#F1C93B',
            },
            {
              text: grandtotal.estabNo,
              fillColor: '#F1C93B',
            },
            {
              text: grandtotal.clusterNo,
              fillColor: '#F1C93B',
            },
            {
              text: grandtotal.votingCntrNo,
              fillColor: '#F1C93B',
            },
            {
              text: grandtotal.regVoterNo,
              fillColor: '#F1C93B',
            },
           
          ]);  
              
        const table = {
          margin: [0, 40, 0, 0],
          table: {
            widths: ['*', '*', '*', '*', '*', '*'],
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
