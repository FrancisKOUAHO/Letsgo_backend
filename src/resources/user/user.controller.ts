import {NextFunction, Request, Response, Router} from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/user/user.validation';
import UserService from '@/resources/user/user.service';
import authenticated from '@/middleware/authenticated.middleware';
import userModel from "@/resources/user/user.model";
import faker from "@faker-js/faker";
import {CallbackError} from 'mongoose';
import firebase from '@/utils/config/firebase'
import {any} from "joi";



class UserController implements Controller {
    public path = '/users';
    public router = Router();
    private UserService = new UserService();
    private image = faker.image.animals()

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(`${this.path}/register`, validationMiddleware(validate.register), this.register);
        this.router.post(`${this.path}/login`, validationMiddleware(validate.login), this.login);
        this.router.put(`${this.path}/:id`, this.updateUser);
        this.router.get(`${this.path}`, this.getAllUser);
        this.router.get(`${this.path}`, authenticated, this.getUser);


        this.router.get(`${this.path}/getAllUserFirebase`, this.getAllUserFirebase);
        this.router.post(`${this.path}/registerFirebase`, validationMiddleware(validate.register), this.registerFirebase);
        this.router.post(`${this.path}/loginFirebase`, validationMiddleware(validate.login), this.loginFirebase);


    }

    private register = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const {name, email, password} = req.body;

            const token = await this.UserService.register(
                name,
                email,
                password,
                this.image,
                'utilisateur'
            );

            res.status(201).json({token});
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private login = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const {email, password} = req.body;

            const token = await this.UserService.login(email, password);

            res.status(200).json({token});
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };


    private updateUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const id = req.params.id;
            const updates = req.body;

            const options = {new: true};

            const result = await userModel.findByIdAndUpdate(id, updates, options);
            res.status(200).json({
                success: true,
                message: "",
                data: result
            })
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error,
            })
            next(error);
        }
    }


    private getAllUser = (req: Request, res: Response, next: NextFunction): Response | void => {
        try {
            userModel.find({}, (error: CallbackError, users) => {
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
            next(new HttpException(400, error.message));
        }
    };


    private getUser = (req: Request, res: Response, next: NextFunction): Response | void => {
        if (!req.user) {
            return next(new HttpException(404, 'No logged in user'));
        }

        res.status(200).send({data: req.user});
    };


    private getAllUserFirebase = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const snapshot = await firebase.firestore().collection('users');
            const data = await snapshot.get();
            const list = data.docs.map((doc) => doc.data());
            res.status(200).send({data: list});
        } catch (e) {
            res.status(404).send({message: `Error ${e}`});
        }
    };

    // TODO TEST API REST FIREBASE
    private registerFirebase = async (req: Request, res: Response, next: NextFunction) => {

    };

    // TODO TEST API REST FIREBASE
    private loginFirebase = async (req: Request, res: Response, next: NextFunction) => {

    };

}

export default UserController;

function id(id: any) {
    throw new Error('Function not implemented.');
}

