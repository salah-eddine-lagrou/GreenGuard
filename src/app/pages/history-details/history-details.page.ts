import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-history-details',
  templateUrl: './history-details.page.html',
  styleUrls: ['./history-details.page.scss'],
})
export class HistoryDetailsPage implements OnInit {
  id?: number;
  result: any;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.id = +this.route.snapshot.paramMap.get('id')! ?? 0;
  }

  ngOnInit() {
    console.log("hello from history details");
    // Check if the router state contains navigation extras
    if (this.router.getCurrentNavigation()?.extras.state) {
      // Access the result from navigation extras
      const navigationState = this.router.getCurrentNavigation()?.extras.state as { result: any };

      // Check if result is present
      if (navigationState.result) {
        this.result = navigationState.result;
        console.log('Received Result:', this.result);
      } else {
        console.error('No result found in navigation state.');
      }
    } else {
      console.error('No navigation extras or state found.');
    }

    console.log("PLANT IMAGE : ", this.result.plant_image);

  }

}
