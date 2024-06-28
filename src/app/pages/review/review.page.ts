import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { LoadingController, NavController } from '@ionic/angular';
import { PlantService } from 'src/app/services/plant.service';

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

  currentDate: string = "";
  currentTime: string = "";

  constructor(
    private loadingCtrl: LoadingController,
    private router: Router,
    private plantService: PlantService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    console.log("running from the review page");
    this.loadMostRecentImage()
    this.initializeCurrentDateTime();
  }

  initializeCurrentDateTime() {
    const now = new Date();
    this.currentDate = now.toISOString().split('T')[0];
    this.currentTime = now.toTimeString().split(' ')[0].slice(0, 5);
  }

  onDateTimeChange(event: any) {
    const selectedDate = new Date(event.detail.value);
    this.currentDate = selectedDate.toISOString().split('T')[0];
    this.currentTime = selectedDate.toTimeString().split(' ')[0].slice(0, 5);
  }

  buttonText: string = 'Send';
  onButtonClick() {
    this.buttonText = 'Sent';
    const btn = document.querySelector("#btn");
    btn?.classList.add("active");

    // this.analyzeImage();
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

  getCurrentDateTime() {
    const now = new Date();
    this.currentDate = now.toISOString().split('T')[0];
    this.currentTime = now.toTimeString().split(' ')[0].slice(0, 5);
  }

  //! Start the process of sending data using the service
  analyzeImage() {
    if (this.imageReview) {
      this.sendImageToBackend(this.imageReview);
    } else {
      console.error('No image selected.');
    }
  }

  base64ToBlob(base64: string, contentType = '', sliceSize = 512): Blob {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  }

  sendImageToBackend(localFile: LocalFile) {
    const base64Data = localFile.data.split(',')[1] || localFile.data;
    const contentType = this.getImageContentType(localFile.data) || 'image/jpeg';
    const blob = this.base64ToBlob(base64Data, contentType);
    const file = new File([blob], localFile.name, { type: contentType });

    const formData = new FormData();
    formData.append('image', file);
    formData.append('plant_image_data', localFile.data);

    this.plantService.analyzeImage(formData).subscribe(
      (result) => {
        console.log(result);
        // this.router.navigate(['history-details'], { state: { result } });
        this.navCtrl.navigateForward(['history-details'], { state: { result } });
      },
      (error) => {
        console.error('There was an error!', error);
      }
    );
  }

  getImageContentType(base64: string): string | null {
    const result = base64.match(/data:(image\/[^;]+);base64/);
    return result ? result[1] : null;
  }

}
