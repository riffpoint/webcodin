export interface User {
  uid: string;
  name: string;
  email: string;
  surname: string;
  occupation: string;
  photoURL: string;
  roles?: Array<string>;
}
