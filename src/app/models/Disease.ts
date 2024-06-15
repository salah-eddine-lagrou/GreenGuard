export class Disease {
  id: number;
  description: string;
  image: string;
  name: string;

  constructor(id: number, description: string, image: string, name: string) {
    this.id = id;
    this.description = description;
    this.image = image;
    this.name = name;
  }
}
