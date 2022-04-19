import UserModel from '@/resources/user/user.model';
import token from '@/utils/token';
import {CallbackError} from "mongoose";
import userInterface from './user.interface';

class UserService {
    private user = UserModel;

    /**
     * Register a new user
     */
    public async register(
        name: string,
        email: string,
        password: string,
        image: string,
        role: string
    ): Promise<string | Error> {
        try {
            const user = await this.user.create({
                name,
                email,
                password,
                image,
                role,
            });

            const accessToken = token.createToken(user);

            return accessToken;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * Attempt to login a user
     */
    public async login(
        email: string,
        password: string
    ): Promise<string | Error> {
        try {
            const user = await this.user.findOne({email});

            if (!user) {
                throw new Error('Unable to find user with that email address');
            }

            if (await user.isValidPassword(password)) {
                return token.createToken(user);
            } else {
                throw new Error('Wrong credentials given');
            }
        } catch (error: any) {
            throw new Error('Unable to create user');
        }
    }


    /**
     * Get all user
     */

    public async getAllUser(res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { succes: boolean; message: string; data?: (userInterface & { _id: any; })[]; }): void; new(): any; }; }; }) {
        try {
            this.user.find({}, (error: CallbackError, users) => {
                if (users) {
                    res.status(200).json({
                        succes: true,
                        message: 'succes',
                        data: users
                    })
                } else {
                    res.status(400).json({
                        succes: false,
                        message: 'not work',
                    })
                }
            })

        } catch (error: any) {
            throw new Error('Unable to create user');
        }
    }
}

export default UserService;
