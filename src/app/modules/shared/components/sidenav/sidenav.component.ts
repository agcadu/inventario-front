import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  mobileQuery: MediaQueryList;

  menuNav=[
    {
      name: 'Home',
      icon: 'home',
      route: 'home'
    },
    {
      name: 'Catedorias',
      icon: 'category',
      route: 'category'
    },
    {
      name: 'Produtos',
      icon: 'production_quantity_limits',
      route: 'product'
    },
  ]

  constructor(media: MediaMatcher) { 
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
  }

  ngOnInit(): void {
  }

}
