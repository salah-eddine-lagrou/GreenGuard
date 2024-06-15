import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-history-details',
  templateUrl: './history-details.page.html',
  styleUrls: ['./history-details.page.scss'],
})
export class HistoryDetailsPage implements OnInit {
  id?: number;

  constructor(private activatedRoute: ActivatedRoute) {
    this.id = +this.activatedRoute.snapshot.paramMap.get('id')! ?? 0;
  }

  ngOnInit() {
    console.log("hello from history details");
  }

}
