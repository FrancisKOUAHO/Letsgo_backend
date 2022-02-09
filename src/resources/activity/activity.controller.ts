import {NextFunction, Request, Response, Router} from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/activity/activity.validation';
import ActivityService from '@/resources/activity/activity.service';
import puppeteer from "puppeteer";
import activityModel from "@/resources/activity/activity.model";

import * as fs from "fs";
import moment from "moment";

const Json2csvParser = require("json2csv").Parser;


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

        this.router.post(
            `${this.path}/search`,
            this.search
        );
    }

    private downloadExcel = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        await activityModel.find({}).lean().exec((err, data) => {
            if (err)
                throw err;
            const csvFields = ['_id', 'title', 'body', 'image', 'fromPerson', 'time', 'forUpTo', 'fromPrice', 'suggestedBy', 'price', 'theLocation', 'number', 'cancellationPolicy'];
            const json2csvParser = new Json2csvParser({
                csvFields
            });
            const csvData = json2csvParser.parse(data);
            const dateTime = moment().format('YYYYMMDDhhmmss');
            const filespath = `downloads/exports/csv-${dateTime}.csv`
            fs.writeFile(filespath, csvData, function (error) {
                if (error)
                    throw error;
                return res.status(401).json({
                    message: `impossible d'ecrire dans le ${filespath} avec succès !`
                })
            });
            res.status(200).json({
                message: `Écriture dans le ${filespath} avec succès !`,
                data: data
            })
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

    public search = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const browser = await puppeteer.launch({headless: true});
            const page = await browser.newPage();
            let where: string = req.body.where;
            let what: string = req.body.what;

            const URL = 'https://www.koifaire.com/';
            console.log('Start scraping');
            await page.goto(URL, {waitUntil: 'networkidle2'});
            await page.waitForTimeout(2000);
            await page.waitForSelector('#input_ou');
            await page.click('#input_ou');
            await page.waitForTimeout(2000);
            await page.keyboard.type(where);
            await page.waitForTimeout(2000);
            await page.waitForSelector('#input_quoi');
            await page.click('#input_quoi');
            await page.keyboard.type(what);
            await page.waitForTimeout(2000);
            console.log('click ok')
            await page.waitForSelector('input.submitcitysearch');
            await page.click('input.submitcitysearch');
            await page.waitForTimeout(2000);
            console.log('fin click ok')
            await page.waitForTimeout(2000);


            const extractedData = await page.evaluate(() => {
                const GLOBAL_ACTIVITIES: any[] = [];
                const items = document.querySelectorAll(`div#blockres`);
                const activities = Array.from(items).map((item) => {
                    const title: any = item.querySelector('#left > div > div > div > div > a');
                    const body: any = item.querySelector('font.comment2.petit');
                    const activity: any = item.querySelector('a.titre');
                    const image: any = item.querySelector('img.vignette')

                    GLOBAL_ACTIVITIES.push({
                        title: title ? title.innerText.trim() : null,
                        body: body ? body.innerText.trim() : null,
                        image: image ? image.src : null,
                        activity: activity ? activity.innerText.trim() : null,
                    })
                });

                console.log(GLOBAL_ACTIVITIES)

                return GLOBAL_ACTIVITIES;

            });

            console.log(extractedData);
            activityModel.deleteMany({})
            activityModel.insertMany(extractedData)

            return res.status(200).json({
                success: true,
                data: extractedData
            });

        } catch (error) {
            next(new HttpException(400, 'Cannot scraping data'));
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
