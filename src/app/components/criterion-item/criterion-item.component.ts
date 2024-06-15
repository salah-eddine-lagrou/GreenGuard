import { Component, Input, OnInit } from '@angular/core';
import { Criterion } from 'src/app/models/criterion.model';

@Component({
  selector: 'app-criterion-item',
  templateUrl: './criterion-item.component.html',
  styleUrls: ['./criterion-item.component.scss'],
})
export class CriterionItemComponent {
  @Input() item?: Criterion;
}
