import {NextFunction, Request, Response, Router} from 'express';
import Controller from "@/utils/interfaces/controller.interface";
import CategoryService from "@/resources/category/category.service";
import HttpException from "@/utils/exceptions/http.exception";
import validationMiddleware from "@/middleware/validation.middleware";
import validate from "@/resources/category/category.validation";
import CategoryModel from "@/resources/category/category.model";

class CategoryController implements Controller {
    public path = '/categories';
    public router = Router();
    private CategoryService = new CategoryService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(
            `${this.path}`,
            validationMiddleware(validate.createCategory),
            this.create
        );

        this.router.get(
            `${this.path}`,
            this.getCategories
        );
    }


    private create = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const {title, body, image} = req.body;
            const category = await this.CategoryService.create(title, body, image!);
            res.status(201).json({
                success: true,
                message: "",
                data: category
            })

        } catch (error) {
            next(new HttpException(400, 'Cannot create activity'));
        }

    };

    private getCategories = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>{
        CategoryModel.find((error, data) => {
            try {
                return res.status(200).json({
                    success: true,
                    data: data,
                    message: 'the categories has been successfully recovered!'
                });
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    data: error,
                    message: 'the categories has been successfully recovered!'
                });

            }
        });
    }

}

export default CategoryController;
