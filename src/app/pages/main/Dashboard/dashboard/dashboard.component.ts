import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import {
  Dimensions,
  ImageCroppedEvent,
  ImageCropperComponent,
  LoadedImage,
} from 'ngx-image-cropper';
import { ImagesService } from 'src/app/services/image.service';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { catchError } from 'rxjs/internal/operators/catchError';
import { map } from 'rxjs/internal/operators/map';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs/internal/Observable';
import { forkJoin, of } from 'rxjs';
import { NewsService } from 'src/app/shared/Tools/news.service';
import { Router } from '@angular/router';
import { ProvOfficialService } from 'src/app/shared/Governance/prov-official.service';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { EnvironmentService } from 'src/app/shared/Environment/environment.service';
import { Chart, ChartType, ChartConfiguration, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
declare var bootstrap: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('closeModal')
  closeModal!: ElementRef;
  @ViewChild('barCanvas') barCanvas!: ElementRef<HTMLCanvasElement>;
  barChart: Chart | undefined;
  //@ViewChild('barCanvas') barCanvas!: ElementRef;
  @ViewChild('modalBarCanvas') modalBarCanvas!: ElementRef;
  @ViewChild('printSection') printSection!: ElementRef;
  @ViewChild('chartImage') chartImage!: ElementRef<HTMLImageElement>;

  imageChangedEvent: any = '';
  img: any = '';
  croppedImage: any = '';
  file!: File;
  fileName: any = '';
  progressvalue = 0;
  totalGovernanceData: any; // Variable to store the governance data total
  totalSocioEcAct: any;
  municipalityWithGovData: any[] = [];
  governancePercentage: number = 0;
  overallPercentage: number = 0;
  munCityName: string = this.auth.munCityName;
  selectedMunicipality: any = null;
  showModal = false;
  selectedYear: number = this.auth.activeSetYear;
  selectedChartType: string = 'bar';

  //isGuest: boolean = false;
  showOverallModal = false;

  cityData: any;
  mun: any;
  overallPrevYear: any;
  EnvironmentService: any;

  constructor(
    private router: Router,
    private newsService: NewsService,
    private auth: AuthService,
    private baseUrl: BaseUrl,
    private imagesService: ImagesService,
    private service: ProvOfficialService,
    private modifyService: ModifyCityMunService,
    private Service: EnvironmentService
  ) {}
  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  isGuest: any;
  Prov: any = {};
  ProOfficial: any = [];
  chart: any;

  ngOnInit(): void {
    const guestFlag = localStorage.getItem('guest');
    this.isGuest = guestFlag === 'true';
    console.log('Guest mode:', this.isGuest); // ✅ DEBUG LINE

    this.GetGovernanceData();
    this.GetSocioEcAct();
    this.GetAllMunicipalitiesWithGovernance();
    this.loadImage();
    this.GetNews();
    Chart.register(...registerables, ChartDataLabels);
  }
  printMunicipalitySection() {
    const canvas = this.barCanvas.nativeElement;
    const img = this.chartImage.nativeElement;
    const printContent = this.printSection.nativeElement.innerHTML;

    // Convert canvas to image
    const chartImageData = canvas.toDataURL('image/png');
    img.src = chartImageData;
    img.style.display = 'block'; // make sure it shows for print

    // Wait a tick to ensure image is ready
    setTimeout(() => {
      const WindowPrt = window.open('', '', 'width=900,height=650');
      WindowPrt?.document.write(`
      <html>
        <head>
          <title>Print Municipality Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .municipality-card-container { page-break-inside: avoid; break-inside: avoid; margin-bottom: 20px; }
            .municipality-card { border: 1px solid #ccc; padding: 16px; }
            img { max-width: 100%; margin-bottom: 20px; }
            svg { display: block; margin: auto; }
          </style>
        </head>
        <body>
          <img src="${chartImageData}" />
          ${printContent}
        </body>
      </html>
    `);
      WindowPrt?.document.close();
      WindowPrt?.focus();
      WindowPrt?.print();
      WindowPrt?.close();
    }, 500);
  }
  //CHARTS
  openChartModal() {
    const modal = new bootstrap.Modal(document.getElementById('chartModal'));
    modal.show();

    // Re-render the chart in the modal if needed
    setTimeout(() => {
      this.createChart(this.modalBarCanvas.nativeElement);
    }, 300); // wait for modal to be visible
  }

  createChart(canvas: HTMLCanvasElement) {
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['High', 'Low'],
        datasets: [
          {
            label: 'Municipality Scores',
            data: [80, 20],
            backgroundColor: ['green', 'red'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }
  renderBarChart(
    canvasElement: HTMLCanvasElement = this.barCanvas?.nativeElement
  ): void {
    if (
      !this.municipalityWithGovData ||
      this.municipalityWithGovData.length === 0
    ) {
      console.warn('No data to render chart');
      return;
    }

    const sortedData = [...this.municipalityWithGovData].sort(
      (a, b) => b.overall - a.overall
    );
    const labels = sortedData.map((item) => item.munCityName);
    const values = sortedData.map((item) => item.overall);

    const context = canvasElement?.getContext('2d');
    if (!context) {
      console.error('Canvas context not found');
      return;
    }

    if (this.barChart) {
      this.barChart.destroy();
    }

    let chartType: ChartType =
      this.selectedChartType === 'horizontalBar'
        ? 'bar'
        : (this.selectedChartType as ChartType);

    this.barChart = new Chart(context, {
      type: chartType,
      data: {
        labels,
        datasets: [
          {
            label: 'Overall Rating (%)',
            data: values,
            backgroundColor: [
              '#4caf50', // green
              '#f44336', // red
              '#2196f3', // blue
              '#ffeb3b', // yellow
              '#9c27b0', // purple
              '#ff9800', // orange
              '#009688', // teal
              '#e91e63', // pink
              '#607d8b', // blue-grey
              '#795548', // brown
            ],
            borderWidth: 1,
            clip: false, // Prevents cutting off
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: this.selectedChartType === 'horizontalBar' ? 'y' : 'x',
        layout: {
          padding: {
            left: 10,
            right: 40, // 🔧 Prevent clipping of 100.00%
            top: 10,
            bottom: 10,
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Percentage',
            },
          },
          y: {
            ticks: {
              autoSkip: false,
            },
          },
        },
        plugins: {
          legend: {
            display: true,
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.parsed.toFixed(2)}%`,
            },
          },
          datalabels: {
            anchor: 'end',
            align:
              this.selectedChartType === 'horizontalBar' ? 'start' : 'right',
            color: '#000',
            formatter: (value: number) => `${value.toFixed(2)}%`,
            font: {
              weight: 'bold',
            },
          },
        },
      },
      plugins: [ChartDataLabels],
    });
  }
  onChartTypeChange() {
    this.renderBarChart(); // Re-render the chart with new type
  }

  private loadImage() {
    const id =
      this.auth.munCityId === 'null' && this.isGuest
        ? 'ddn'
        : this.auth.munCityId;
    this.imagesService
      .GetImage(id)
      .pipe(
        catchError((error) => {
          console.error('Error loading image:', error);
          return of(null);
        })
      )
      .subscribe((response) => {
        if (!response) return;
        const reader = new FileReader();
        reader.readAsDataURL(response);
        reader.onload = () => {
          if (reader.result) this.croppedImage = reader.result.toString();
        };
      });
  }
  openOverallModal(mun: any) {
    this.selectedMunicipality = mun;
    this.showOverallModal = true;
  }
  closeOverallModal() {
    this.showOverallModal = false;
  }
  openDetails(mun: any) {
    this.selectedMunicipality = mun;
    this.showModal = true;
  }
  closeDetails() {
    this.showModal = false;
    this.selectedMunicipality = null;
  }
  GetGovernanceData() {
    this.service.GetGovernance().subscribe({
      next: (response) => {
        this.totalGovernanceData = response; // Assign API response to totalGovernanceData
        console.log(
          'Total Governance Data:',
          this.totalGovernanceData.TotalData
        ); // Check if the value is correct
      },
      error: (error) => {
        console.error('Error fetching governance data:', error);
      },
    });
  }

  GetAllMunicipalitiesWithGovernance() {
    const excludedSectors = this.Service.getExcludedSectors();
    const setYear = this.auth.activeSetYear;

    this.service.ListOfMunicipality().subscribe({
      next: (municipalities) => {
        const requests = municipalities.map((mun: any) => {
          const naModules = JSON.parse(
            localStorage.getItem(`notApplicableModules_${mun.munCityId}`) ||
              '[]'
          );

          return this.service
            .GetAllPercentage(setYear, mun.munCityId, naModules)
            .pipe(
              map((govData) => {
                const data = {
                  governance: govData?.Governance?.currentYearPercentage ?? 0,
                  governancePrevYear:
                    govData?.Governance?.previousYearPercentage ?? 0,
                  socio:
                    govData?.TotalSocioEconomic?.currentYearPercentage ?? 0,
                  socioPrevYear:
                    govData?.TotalSocioEconomic?.previousYearPercentage ?? 0,
                  socialProfile:
                    govData?.TotalSocialProfile?.currentYearPercentage ?? 0,
                  socialProfilePrevYear:
                    govData?.TotalSocialProfile?.previousYearPercentage ?? 0,
                  environment: govData?.TotalEnv?.currentYearPercentage ?? 0,
                  environmentPrevYear:
                    govData?.TotalEnv?.previousYearPercentage ?? 0,
                  infrastructure:
                    govData?.TotalInfrastructure?.currentYearPercentage ?? 0,
                  infrastructurePrevYear:
                    govData?.TotalInfrastructure?.previousYearPercentage ?? 0,
                };

                // Filter current year values
                const filteredCurrent = Object.entries(data)
                  .filter(
                    ([key]) =>
                      !excludedSectors.includes(key.replace('PrevYear', ''))
                  )
                  .filter(([key]) => !key.includes('PrevYear'))
                  .map(([, value]) => Number(value));

                // Filter previous year values
                const filteredPrev = Object.entries(data)
                  .filter(([key]) => key.includes('PrevYear'))
                  .filter(
                    ([key]) =>
                      !excludedSectors.includes(key.replace('PrevYear', ''))
                  )
                  .map(([, value]) => Number(value));

                const overall = filteredCurrent.length
                  ? filteredCurrent.reduce((sum, val) => sum + val, 0) /
                    filteredCurrent.length
                  : 0;

                const overallPrevYear = filteredPrev.length
                  ? filteredPrev.reduce((sum, val) => sum + val, 0) /
                    filteredPrev.length
                  : 0;

                return {
                  ...mun,
                  ...data,
                  overall,
                  overallPrevYear,
                };
              }),
              catchError((err) => {
                console.error(
                  `Error loading governance for ${mun.munCityId}`,
                  err
                );
                return of({
                  ...mun,
                  governance: 0,
                  socio: 0,
                  socialProfile: 0,
                  environment: 0,
                  infrastructure: 0,
                  overall: 0,
                });
              })
            );
        });

        forkJoin(requests).subscribe((result) => {
          this.municipalityWithGovData = result;

          // Governance average
          const totalGov = result.reduce(
            (sum, item) => sum + Number(item.governance || 0),
            0
          );
          this.governancePercentage = result.length
            ? totalGov / result.length
            : 0;

          // Overall average
          const totalOverall = result.reduce(
            (sum, item) => sum + Number(item.overall || 0),
            0
          );
          this.overallPercentage = result.length
            ? totalOverall / result.length
            : 0;

          const totalOverallPrevYear = result.reduce(
            (sum, item) => sum + Number(item.overallPrevYear || 0),
            0
          );
          this.overallPrevYear = result.length
            ? totalOverallPrevYear / result.length
            : 0;

          this.renderBarChart();
        });
      },
      error: (err) => {
        console.error('Error loading municipalities:', err);
      },
    });
  }

  get filteredMunicipalityWithGovData() {
    // Show all if DDN or guest from DDN
    if (
      (this.auth.munCityId === 'null' && this.isGuest) ||
      this.auth.munCityId === 'DDN'
    ) {
      return this.municipalityWithGovData;
    }

    // Otherwise, show only the matching municipality
    return this.municipalityWithGovData.filter(
      (m) => m.munCityId === this.auth.munCityId
    );
  }

  overallSectorPercentage(mun: any): number {
    const excludedSectors = this.Service.getExcludedSectors();

    const sectors = [
      { key: 'governance', value: Number(mun.governance ?? 0) },
      { key: 'socio', value: Number(mun.socio ?? 0) },
      { key: 'socialProfile', value: Number(mun.socialProfile ?? 0) },
      { key: 'environment', value: Number(mun.environment ?? 0) },
      { key: 'infrastructure', value: Number(mun.infrastructure ?? 0) },
    ];

    const filtered = sectors.filter((s) => !excludedSectors.includes(s.key));
    const total = filtered.reduce((sum, s) => sum + s.value, 0);
    return filtered.length ? total / filtered.length : 0;
  }

  overallPrevYearPercentage(mun: any): number {
    const excludedSectors = this.Service.getExcludedSectors();

    const sectors = [
      { key: 'governance', value: Number(mun.governancePrevYear ?? 0) },
      { key: 'socio', value: Number(mun.socioPrevYear ?? 0) },
      { key: 'socialProfile', value: Number(mun.socialProfilePrevYear ?? 0) },
      { key: 'environment', value: Number(mun.environmentPrevYear ?? 0) },
      { key: 'infrastructure', value: Number(mun.infrastructurePrevYear ?? 0) },
    ];

    const filtered = sectors.filter((s) => !excludedSectors.includes(s.key));
    const total = filtered.reduce((sum, s) => sum + s.value, 0);
    return filtered.length ? total / filtered.length : 0;
  }

  GetSocioEcAct() {
    this.service.GetSocioEcAct().subscribe({
      next: (response) => {
        this.totalSocioEcAct = response; // Assign API response to totalGovernanceData
        console.log('Total Socio-EcAct Data:', this.totalSocioEcAct.TotalData); // Check if the value is correct
      },
      error: (error) => {
        console.error('Error fetching governance data:', error);
      },
    });
  }

  listNews: any = [];
  listNewsData: any = [];

  GetNews() {
    this.newsService.GetNews().subscribe({
      next: (response) => {
        this.listNewsData = <any>response;
      },
      error: (error) => {},
      complete: () => {
        console.log(this.listNewsData);
        if (this.auth.munCityId === 'null' && this.isGuest) {
          this.listNewsData.forEach((a: any) => {
            if (a.munCityId === 'DDN') {
              this.listNews.push(a);
            }
          });
        } else {
          this.listNewsData.forEach((a: any) => {
            if (a.munCityId === this.auth.munCityId) {
              this.listNews.push(a);
            }
          });
        }
      },
    });
  }

  get filterNews() {
    if (this.auth.o_munCityId) {
      return this.listNews.filter((a: any) => a.hidden == 0);
    } else {
      return this.listNews.filter((a: any) => a.hidden == 0 && a.isAdmin == 0);
    }
  }

  dataURItoBlob(dataURI: any) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.fileName = event.target.files[0].name;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.img = event.base64;
  }
  imageLoaded(image: LoadedImage) {}
  cropperReady(crop: Dimensions) {}
  loadImageFailed() {}
  updateImage() {
    this.croppedImage;
    const imageBlob = this.dataURItoBlob(this.croppedImage);
    const imageFile = new File([imageBlob], this.fileName);
    this.file = imageFile;
    this.ProceedUpload();
  }
  ProceedUpload() {
    let formdata = new FormData();
    formdata.append('file', this.file, this.auth.munCityId);

    this.imagesService
      .UploadImage(formdata)
      .pipe(
        map((events) => {
          switch (events.type) {
            case HttpEventType.UploadProgress:
              this.progressvalue = Math.round(
                (events.loaded / events.total!) * 100
              );
              break;
            case HttpEventType.Response:
              Swal.fire({
                icon: 'success',
                title: 'Image uploaded successfully!',
                showConfirmButton: false,
                timer: 1500,
              });
              this.closeModal.nativeElement.click();
              console.log('HttpEventType.Response : Upload completed');
              setTimeout(() => {
                this.progressvalue = 0;
              }, 2500);
              break;
          }
        }),
        catchError((error: HttpErrorResponse) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops, something went wrong!',
            showConfirmButton: false,
            timer: 1500,
          });
          return 'failed';
        })
      )
      .subscribe();
  }
  handleImageError(event: any) {
    event.target.src = 'assets/img/image.png';
    event.target.height = '100';
    event.target.width = '100';
  }
}
