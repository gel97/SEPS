import { Component, OnInit, ViewChild } from '@angular/core';
import { BarangaysComponent } from '../../Governance/barangays/barangays.component';
@Component({
  selector: 'app-summary-report',
  templateUrl: './summary-report.component.html',
  styleUrls: ['./summary-report.component.css']
})
export class SummaryReportComponent implements OnInit {
  @ViewChild(BarangaysComponent)
  private brgy!: BarangaysComponent;

  constructor(
    //private brgy: BarangaysComponent
    ) { }

  ngOnInit(): void {
  }

  BrgyGeneratePdf(){
    this.brgy?.isAdd;
  }

}
