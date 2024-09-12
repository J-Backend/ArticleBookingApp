import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dropmenu',
  standalone: true,
  imports: [NgbDropdownModule, CommonModule],
  templateUrl: './dropmenu.component.html',
  styleUrl: './dropmenu.component.css'
})
export class DropmenuComponent {

  @Input() actions: { label: string, action: () => void }[] = [];

  constructor() {}
}
