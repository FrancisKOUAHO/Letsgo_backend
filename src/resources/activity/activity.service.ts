import activityModel from '@/resources/activity/activity.model';
import userModel from "@/resources/user/user.model";
import Activity from '@/resources/activity/activity.interface';
import {NextFunction, Request, Response} from "express";

class ActivityService {
    private activity = activityModel;

    /**
     * Create a new activity
     */
    public async create(title: string, body: string, image: string, fromPrice: number, time: number, forUpTo: number, fromPerson: string, suggested_by: string, price: number, theLocation: string, number: number, cancellationPolicy: string): Promise<Activity> {
        try {
            const activity = await this.activity.create({title, body, image, fromPerson, time, forUpTo, fromPrice, suggested_by, price, theLocation, number, cancellationPolicy});

            return activity;
        } catch (error) {
            throw new Error('Unable to create activity');
        }
    }

    public async get(error: any, data: any){
        try {
            const search = await this.activity.find(error, data)
            return search;
        } catch (error) {
            throw new Error('Unable to get');
        }
    }

    public async update(req: { params: { id: any; }; }, res: { json: (arg0: any) => void; }, next: (arg0: any) => any, error: any, data: any){
        userModel.findById(req.params.id, (error: any, data: any) => {
            if (error) {
                return next(error)
            } else {
                res.json(data)
                console.log('client a été modifié avec succès !')
            }
        })
    }
}

export default ActivityService;
