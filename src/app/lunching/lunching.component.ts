import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lunching',
  templateUrl: './lunching.component.html',
  styleUrls: ['./lunching.component.css'],
})
export class LunchingComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    var h = window.innerHeight;
    $('.center-button').css('height', h);
    $('.btn').css('transform', 'scale(3)');
  }
  launch() {
    $('#SEPS').toggleClass('is-clicked');
    setTimeout(() => {
      this.router.navigateByUrl('home');
    }, 1000);
  }
}
