import {NextFunction, Request, Response, Router} from 'express';
import Controller from "@/utils/interfaces/controller.interface";
import CategoryService from "@/resources/category/category.service";
import HttpException from "@/utils/exceptions/http.exception";
import validationMiddleware from "@/middleware/validation.middleware";
import validate from "@/resources/category/category.validation";
import categoryModel from "@/resources/category/category.model";
import puppeteer from "puppeteer";
import CONNECT from "@/utils/config/firebase";

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

        this.router.post(
            `${this.path}/search`,
            this.search
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

    private getCategories = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        categoryModel.find((error, data) => {
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


    private search = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {

        try {
            const browser = await puppeteer.launch({
                headless: false,
            });
            const page = await browser.newPage();
            let where: string = req.body.where;

            const URL = 'https://www.funbooker.com/fr/category/activites';
            console.log('Start scraping');
            await page.setViewport({width: 1366, height: 768});
            await page.goto(URL, {waitUntil: 'networkidle2'});
            await page.waitForSelector('input#location');
            await page.click('input#location');
            await page.keyboard.type(where);
            await page.waitForTimeout(3000);
            await page.keyboard.press('Enter');
            await page.waitForTimeout(3000);

            const extractedData = await page.evaluate(() => {
                const GLOBAL_CATEGORIES: any[] = [];
                const items = document.querySelectorAll('div.owl-item.active');
                 Array.from(items).map((item, index) => {
                    const title: any = item.querySelector('div.fb-thumbnail__title');
                    let image: any = item.querySelector('img.fb-thumbnail__image');

                    GLOBAL_CATEGORIES.push({
                        index: index,
                        title: title ? title.innerText.trim() : null,
                        image: image ? image.src : null,
                    })
                })
                return GLOBAL_CATEGORIES;
            })
            const extracted = extractedData.map((doc) => {
                CONNECT.firestore().collection('categories').doc().set(doc);
            })

            console.log(`extracted ${extracted}`)

            console.log(extractedData);
            categoryModel.deleteMany({})
            await categoryModel.insertMany(extractedData)


            return res.status(200).json({
                success: true,
                data: extractedData
            });

        } catch (e) {
            next(new HttpException(400, 'Cannot scraping data'));
        }
    }

}

export default CategoryController;
