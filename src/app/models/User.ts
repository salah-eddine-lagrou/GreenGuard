export class User {
  id: number;
  email: string;
  password: string;
  phone: string;

  constructor(id: number, email: string, password: string, phone: string) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.phone = phone;
  }
}
