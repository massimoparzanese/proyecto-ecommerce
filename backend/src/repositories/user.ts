import { IUserDocument } from '../models/user';
import UserModel from '../models/user';

export class UserRepository {
  async getUserByEmail(email: string): Promise<IUserDocument | null> {
    if (email === undefined || email === '') return null;

    const user = await UserModel.findOne({ email });
    return user;
  }

  async getUserById(id: string): Promise<IUserDocument | null> {
    const user = await UserModel.findById(id);
    return user;
  }

  async createUser(data: {
    name: string;
    email: string;
    password: string;
    role?: 'user' | 'admin';
  }): Promise<IUserDocument> {
    const user = new UserModel(data);
    await user.save();
    return user;
  }

  async updatePassword(
    userId: string,
    newPassword: string
  ): Promise<IUserDocument | null> {
    const user = await this.getUserById(userId);
    if (!user) return null;
    user.password = newPassword;
    await user.save();
    return user;
  }
}

const userRepository = new UserRepository();
export default userRepository;
export { userRepository };
