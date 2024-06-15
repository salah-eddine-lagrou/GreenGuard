export class Diagnostic {
  id: number;
  is_infected: boolean;
  plant_image: string;
  timestamp: Date;

  constructor(id: number, is_infected: boolean, plant_image: string, timestamp: Date) {
    this.id = id;
    this.is_infected = is_infected;
    this.plant_image = plant_image;
    this.timestamp = timestamp;
  }
}
