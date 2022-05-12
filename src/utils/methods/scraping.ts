import {NextFunction, Request, Response} from "express";
import puppeteer from "puppeteer";
import CONNECT from "@/utils/config/firebase";
import activityModel from "@/resources/activity/activity.model";
import HttpException from "@/utils/exceptions/http.exception";
import firebase from "firebase/compat";

let Scraping = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {

    // Extract partners on the page, recursively check the next page in the URL pattern
    const extractPartners: any = async (url: string) => {

        // Scrape the data we want
        const page = await browser.newPage();
        await page.setViewport({width: 1400, height: 900});
        await page.goto(url);
        await page.waitForTimeout(1000);
        console.log(`Scraping : ${url}`);

        const partnersOnPage = await page.evaluate(() => {
            const GLOBAL_ACTIVITIES: any[] = [];
            const items = document.querySelectorAll("div.listing-card");
            items.forEach((item) => {
                const titleCategory: any = item.querySelector('p.listing-card__category');
                const title: any = item.querySelector('div.listing-card > div > p > a');
                const image: any = item.querySelector('.listing-card__image a img')
                const video: any = item.querySelector('div.listing-card > div > a > video');
                const price: any = item.querySelector('div.listing-card__price');
                const priceFrom: any = item.querySelector('div.listing-card__price-from');
                const averageRating: any = item.querySelector('span.listing-card__average-rating');


                GLOBAL_ACTIVITIES.push({
                    titleCategory: titleCategory ? titleCategory.innerText.trim() : null,
                    title: title ? title.innerText.trim() : null,
                    image: image ? image.currentSrc?.trim() : null,
                    video: video ? video.currentSrc.trim() : null,
                    price: price ? price.innerText.trim() : null,
                    priceFrom: priceFrom ? priceFrom.innerText.trim() : null,
                    averageRating: averageRating ? averageRating.innerText.trim() : null,
                })

                console.log(GLOBAL_ACTIVITIES);
            })


            return GLOBAL_ACTIVITIES;

        });

        await page.close();

        // Recursively scrape the next page
        if (partnersOnPage.length < 1) {
            // Terminate if no partners exist
            console.log(`Terminer la récursion sur : ${url}`)
            return partnersOnPage
        } else {
            // Go fetch the next page ?page=X+1
            const nextPageNumber = parseInt(url.match(/page=(\d+)$/)![1], 10) + 1;
            const nextUrl = `https://www.funbooker.com/fr/theme/sortie-entre-amis?search=Toutes+les+activit%C3%A9s&where=Paris&lat=48.85658&lng=2.35183&department=Paris&zip=75&page=${nextPageNumber}`

            return partnersOnPage.concat(await extractPartners(nextUrl))
        }
    };


    const browser = await puppeteer.launch({
        headless: true,
        args: ['--start-fullscreen']
    });
    const firstUrl =
        "https://www.funbooker.com/fr/theme/sortie-entre-amis?search=Toutes+les+activit%C3%A9s&where=Paris&lat=48.85658&lng=2.35183&department=Paris&zip=75&page=1";
    const partners = await extractPartners(firstUrl);


    // Todo: Update database with partners

    console.log(partners);

    /*const extracted = partners.map((doc: firebase.firestore.DocumentData) => {
        const res = CONNECT.firestore().collection('activities').doc().set(doc);
    })

    console.log(`extracted ${extracted}`)

    console.log(partners);
    activityModel.deleteMany({})
    await activityModel.insertMany(partners)*/


    return res.status(200).json({
        success: true,
        data: partners
    });


}


export {
    Scraping
}
