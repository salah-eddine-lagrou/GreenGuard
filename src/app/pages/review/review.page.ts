import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { LoadingController } from '@ionic/angular';

const IMAGE_DIR = "stored-images";

interface LocalFile {
  name: string;
  path: string;
  data: string;
}

@Component({
  selector: 'app-review',
  templateUrl: './review.page.html',
  styleUrls: ['./review.page.scss'],
})
export class ReviewPage implements OnInit {
  imageReview?: LocalFile;

  constructor(private loadingCtrl: LoadingController, private router: Router) { }

  ngOnInit() {
    console.log("running from the review page");
    this.loadMostRecentImage()
  }

  buttonText: string = 'Send';
  onButtonClick() {
    this.buttonText = 'Sent';
    const btn = document.querySelector("#btn");
    btn?.classList.add("active");
  }

  back2listening() {
    this.router.navigate(['/listening']);
  }

  async getLastImage(): Promise<any> {
    const loading = await this.loadingCtrl.create({
      message: 'Loading data...',
    });
    await loading.present();

    try {
      const result = await Filesystem.readdir({
        directory: Directory.Data,
        path: IMAGE_DIR
      });

      //* Check if there are no files
      if (!result.files.length) {
        loading.dismiss();
        return null;
      }

      //* Sort files by modification time
      const sortedFiles = await Promise.all(result.files.map(async file => {
        const fileInfo = await Filesystem.stat({
          directory: Directory.Data,
          path: `${IMAGE_DIR}/${file.name}`
        });
        return { name: file.name, mtime: fileInfo.mtime };
      })).then(files => files.sort((a, b) => b.mtime - a.mtime));

      //* Get the most recent file
      const latestFile = sortedFiles[0];
      const filePath = `${IMAGE_DIR}/${latestFile.name}`;
      const readFile = await Filesystem.readFile({
        directory: Directory.Data,
        path: filePath
      });

      const imageData = {
        name: latestFile.name,
        path: filePath,
        data: `data:image/jpeg;base64,${readFile.data}`
      };

      loading.dismiss();
      return imageData;
    } catch (err) {
      console.log('err:', err);
      await Filesystem.mkdir({
        directory: Directory.Data,
        path: IMAGE_DIR
      });
      loading.dismiss();
      return null;
    }
  }

  async loadMostRecentImage() {
    const latestImage = await this.getLastImage();
    if (latestImage) {
      this.imageReview = latestImage;
      console.log(this.imageReview);

    } else {
        console.log('No images found or error occurred.');
    }
  }

  //! Start the process of sending data using the service
}
