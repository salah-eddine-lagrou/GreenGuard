import { NavigationEnd, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { LoadingController, NavController, Platform } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { Subscription, filter } from 'rxjs';

const IMAGE_DIR = "stored-images";

interface LocalFile {
  name: string;
  path: string;
  data: string;
}

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent  implements OnInit {
  images: LocalFile[] = [];
  routerSubscription!: Subscription;
  checkboxClass: string = "";

  constructor(
    private platform: Platform,
    private loadingCtrl: LoadingController,
    private router: Router,
    private navCtrl: NavController
  ) { }

  async ngOnInit() {
    console.log("run the tabs")
    // this.loadFiles();
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkboxDown();
      });

    // Initial call in case the component is already on the desired route
    this.checkboxDown();
  }

  selectedTab: string | null = null;
  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  // ! ALREADY in use in the listing page (loadFiles method and loadFileData)
  // async loadFiles() {
  //   this.images = [];

  //   const loading = await this.loadingCtrl.create({
  //     message: 'Loading data...',
  //   });
  //   await loading.present();

  //   Filesystem.readdir({
  //     directory: Directory.Data,
  //     path: IMAGE_DIR
  //   }).then(result => {
  //     console.log('HERE: ', result);
  //     this.loadFileData(result.files);

  //   }, async err => {
  //     console.log('err: ',err);
  //     await Filesystem.mkdir({
  //       directory: Directory.Data,
  //       path: IMAGE_DIR
  //     });
  //   }).then(_ => {
  //     loading.dismiss();
  //   })
  // }

  // async loadFileData(fileNames: any[]) {
  //   for(let fileName of fileNames) {
  //     const filePath = `${IMAGE_DIR}/${fileName.name}`;

  //     const readFile = await Filesystem.readFile({
  //       directory: Directory.Data,
  //       path: filePath
  //     });

  //     this.images.push({
  //       name: fileName.name,
  //       path: filePath,
  //       data: `data:image/jpeg;base64,${readFile.data}`
  //     });
  //   }

  // }

  getImages() {
    return this.images;
  }

  async selectImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos
    });

    console.log(image)

    if(image) {
      this.saveImage(image);
      this.navCtrl.navigateForward(['review']);
    }
  }

  async takeImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera
    });

    console.log(image);

    if(image) {
      this.saveImage(image);
      this.navCtrl.navigateForward(['review']);
    }
  }

  async saveImage(photo: Photo) {
    const base64Data = await this.readAsBase64(photo);
    console.log(base64Data);


    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      directory: Directory.Data,
      path: `${IMAGE_DIR}/${fileName}`,
      data: base64Data
    });
    console.log('saved: ', savedFile);

  }

  async readAsBase64(photo: Photo) {
    // "hybrid" will detect Cordova or Capacitor
    if (this.platform.is('hybrid')) {
      // Read the file into base64 format
      const file = await Filesystem.readFile({
        path: photo.path!
      });

      return file.data;
    }
    else {
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();

      return await this.convertBlobToBase64(blob) as string;
    }
  }

  // Helper function
  convertBlobToBase64 = (blob: Blob) => new Promise((resolved, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolved(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  checkboxDown() {
    const currentRoute = this.router.url;
    if (currentRoute.includes("/settings")) {
      this.checkboxClass = "checkbox-down";
    } else {
      this.checkboxClass = "";
    }
  }

}
