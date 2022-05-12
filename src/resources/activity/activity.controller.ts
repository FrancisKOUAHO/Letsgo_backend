import {NextFunction, Request, Response, Router} from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/activity/activity.validation';
import ActivityService from '@/resources/activity/activity.service';
import puppeteer from "puppeteer";
import activityModel from "@/resources/activity/activity.model";
import xlsx from "xlsx"
import moment from "moment";
import CONNECT from "@/utils/config/firebase";
import sliceNameAndLastname from '@/utils/methods/sliceWord';
import sliceWord from "@/utils/methods/sliceWord";
import {Scraping} from "@/utils/methods/scraping";


class ActivityController implements Controller {
    public path = '/activities';
    public router = Router();
    private ActivityService = new ActivityService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(
            `${this.path}`,
            validationMiddleware(validate.create),
            this.create
        );
        this.router.get(
            `${this.path}/download/excel`,
            this.downloadExcel
        );

        this.router.get(
            `${this.path}/search`,
            this.getSearch
        );

        this.router.get(
            `${this.path}/scraping`,
            Scraping
        );

    }

    private downloadExcel = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        activityModel.find({}).lean().exec((err, data) => {
            if (err) {
                return res.status(500).json(
                    {
                        success: false,
                        message: `${err} Télechargement impossible du fichier excel ❌`,
                    }
                );
            } else {
                const dateTime = moment().format('YYYYMMDDhhmmss');
                const wb = xlsx.utils.book_new();
                const ws = xlsx.utils.json_to_sheet(data);
                let file_excel = `downloads/exports/xlsx-${dateTime}.xlsx`;
                xlsx.utils.book_append_sheet(wb, ws);
                let file = xlsx.writeFile(wb, file_excel);
                return res.status(201).json(
                    {
                        data: file,
                        success: true,
                        message: "Télechargement du fichier excel ✅",
                    }
                );
            }
        });
    }

    private create = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const {
                title,
                body,
                image,
                fromPerson,
                time,
                forUpTo,
                fromPrice,
                suggestedBy,
                price,
                theLocation,
                number,
                cancellationPolicy
            } = req.body;

            const activity = await this.ActivityService.create(title, body, image, fromPerson, time, forUpTo, fromPrice, suggestedBy, price, theLocation, number, cancellationPolicy);

            res.status(201).json({activity});
        } catch (error) {
            next(new HttpException(400, 'Cannot create activity'));
        }
    };


    private getSearch = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        activityModel.find((error, data) => {
            try {
                return res.status(200).json({
                    success: true,
                    data: data,
                    message: 'the activities has been successfully recovered!'
                });
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    data: error,
                    message: 'the activities has been successfully recovered!'
                });

            }
        });
    }

}

export default ActivityController;

