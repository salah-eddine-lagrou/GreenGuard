import { TabsComponent } from 'src/app/components/shared/tabs/tabs.component';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { LoadingController, NavController } from '@ionic/angular';
import { Criterion } from 'src/app/models/criterion.model';
import { DataService } from 'src/app/services/data.service';
import { PlantService } from 'src/app/services/plant.service';

const IMAGE_DIR = "stored-images";

interface LocalFile {
  name: string;
  path: string;
  data: string;
}

@Component({
  selector: 'app-listing',
  templateUrl: './listing.page.html',
  styleUrls: ['./listing.page.scss'],
})
export class ListingPage implements OnInit {
  criteria: Criterion[] = [];
  imagesData: LocalFile[] = [];
  dignostics: any[] = [];
  filteredDiagnostics: any[] = [];

  date: string = "";
  time: string = "";

  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private plantService: PlantService,
    private navCtrl: NavController
  ) { }

  ngOnInit(): void {
    this.getCriteria();
    this.getDignostics();

    // ! remove the state after removing this comment
    // if (this.router.getCurrentNavigation()?.extras.state) {
    //   const navigationState = this.router.getCurrentNavigation()?.extras.state as { newPlant: any };

    //   if (navigationState.newPlant) {
    //     const newPlant = navigationState.newPlant;
    //     this.dignostics.push(newPlant)
    //   }
    // }
    // this.loadFiles();  right now we don't need to load anything in listing page
  }

  getCriteria() {
    this.criteria = [
      {
        id: 1,
        label: "healthy",
        image: "assets/icon/sucess.png",
        active: true
      },
      {
        id: 2,
        label: "disease",
        image: "assets/icon/danger.png",
        active: true
      },
      {
        id: 3,
        label: "draft",
        image: "assets/icon/draft.png",
        active: false
      },
      {
        id: 4,
        label: "completed",
        image: "assets/icon/completed.png",
        active: false
      }
    ];
  }

  toggleItemStatus(item: any) {
    item.active = !item.active;
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;

    if (!clickedElement.closest('.criteria')) {
      this.criteria.forEach((item) => (item.active = false));
    }
  }

  goToDetailHistory(result: any) {
    this.navCtrl.navigateForward(['history-details'], { state: { result } });
  }

  async loadFiles() {
    this.imagesData = [];

    const loading = await this.loadingCtrl.create({
      message: 'Loading data...',
    });
    await loading.present();

    Filesystem.readdir({
      directory: Directory.Data,
      path: IMAGE_DIR
    }).then(result => {
      console.log('HERE: ', result);
      this.loadFileData(result.files);

    }, async err => {
      console.log('err: ',err);
      await Filesystem.mkdir({
        directory: Directory.Data,
        path: IMAGE_DIR
      });
    }).then(_ => {
      loading.dismiss();
    });

    console.log('from the listining : ', this.imagesData)
  }

  async loadFileData(fileNames: any[]) {
    for(let fileName of fileNames) {
      const filePath = `${IMAGE_DIR}/${fileName.name}`;

      const readFile = await Filesystem.readFile({
        directory: Directory.Data,
        path: filePath
      });

      this.imagesData.push({
        name: fileName.name,
        path: filePath,
        data: `data:image/jpeg;base64,${readFile.data}`
      });
    }
  }

  getDignostics() {
    this.plantService.getDignostics().subscribe(
      (result) => {
        this.dignostics = result;
        console.log(this.dignostics);
        this.filteredDiagnostics = [...this.dignostics];
      },
      (error) => {
        console.error("ERROR OCCURED while getting the dignostics: ", error);

      }
    )
  }

  extractDateTime(datetime: string): string{
    const dateObj = new Date(datetime);
    this.date = dateObj.toISOString().split('T')[0];
    this.time = dateObj.toTimeString().split(' ')[0].slice(0, 5);

    return this.date;
  }


  handleRefresh(event: any) {
    setTimeout(() => {
      this.plantService.getDignostics().subscribe(
        (result) => {
          this.dignostics = result;
          console.log(this.dignostics);

        },
        (error) => {
          console.error("ERROR OCCURED while getting the dignostics: ", error);

        }
      )
      event.target.complete();
    }, 3000);
  }

  filterDiagnostics(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if (!searchTerm) {
      this.filteredDiagnostics = [...this.dignostics];
    } else {
      this.filteredDiagnostics = this.dignostics.filter(item =>
        item.plant.name.toLowerCase().includes(searchTerm)
      );
    }
  }
}
