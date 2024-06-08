export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
  categories: [];
  phone: string;
  location: {
    adress: string;
    city: {};
    country: {};
  };
  createdAt: Date;
}
