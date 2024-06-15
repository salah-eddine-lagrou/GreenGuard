import { TabsComponent } from 'src/app/components/shared/tabs/tabs.component';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { LoadingController } from '@ionic/angular';
import { Criterion } from 'src/app/models/criterion.model';
import { DataService } from 'src/app/services/data.service';

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

  constructor(private router: Router, private loadingCtrl: LoadingController) { }

  ngOnInit(): void {
    this.getCriteria();
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

  goToDetailHistory(id: number) {
    this.router.navigate(['history-details', id]);
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

}
