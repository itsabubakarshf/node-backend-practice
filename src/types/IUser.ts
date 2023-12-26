export interface IUser extends Document {
    userName: string;
    email: string;
    password: string;
    age?: number;
    createdAt: Date;
    updatedAt: Date;
    About?: string;
  }