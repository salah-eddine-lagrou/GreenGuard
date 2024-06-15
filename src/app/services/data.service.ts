import { Injectable } from '@angular/core';

interface LocalFile {
  name: string;
  path: string;
  data: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  images: LocalFile[] = [];

  constructor() { }

  setImages(images: LocalFile[]) {
    this.images = images;
  }

  getImages() {
    return this.images;
  }
}
