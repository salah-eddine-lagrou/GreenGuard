import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-history-details',
  templateUrl: './history-details.page.html',
  styleUrls: ['./history-details.page.scss'],
})
export class HistoryDetailsPage implements OnInit {
  id?: number;
  result: any;
  date: string = "";
  time: string = "";

  constructor(private route: ActivatedRoute, private router: Router, private navCntrl: NavController) { }

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

    this.extractDateTime(this.result.timestamp);

    console.log("PLANT IMAGE : ", this.result.plant_image);

  }


  replaceUnderscores(str: string): string {
    return str.replace(/_+/g, ' ');
  }

  extractDateTime(datetime: string) {
    const dateObj = new Date(datetime);
    this.date = dateObj.toISOString().split('T')[0];
    this.time = dateObj.toTimeString().split(' ')[0].slice(0, 5);
  }

  backToListing(newPlant=undefined) {
    // navigate to listing
    if(newPlant === undefined)
      this.router.navigate(['/listing']);
    else
      this.navCntrl.navigateForward(['listing'], { state: { newPlant } });
  }
}
