import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})

export class ToolbarComponent {
  @Input() toolbar: any
  @Output() toolbarChange = new EventEmitter<boolean>();

  constructor(private router: Router) {
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        if(ev['url']!='/')
          localStorage['url'] = ev.url
      }
    });
  }
}
