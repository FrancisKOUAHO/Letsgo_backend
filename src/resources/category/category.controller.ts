import {NextFunction, Request, Response, Router} from 'express';
import Controller from "@/utils/interfaces/controller.interface";
import CategoryService from "@/resources/category/category.service";
import HttpException from "@/utils/exceptions/http.exception";
import validationMiddleware from "@/middleware/validation.middleware";
import validate from "@/resources/category/category.validation";

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

}

export default CategoryController;
