import activityModel from '@/resources/activity/activity.model';
import Activity from '@/resources/activity/activity.interface';

class ActivityService {
    private activity = activityModel;

    /**
     * Create a new activity
     */
    public async create(title: string, body: string, image: string, fromPrice: number, time: number, forUpTo: number, fromPerson: string, suggested_by: string, price: number, theLocation: string, number: number, cancellationPolicy: string): Promise<Activity> {
        try {
            const activity = await this.activity.create({
                title,
                body,
                image,
                fromPerson,
                time,
                forUpTo,
                fromPrice,
                suggested_by,
                price,
                theLocation,
                number,
                cancellationPolicy
            });

            return activity

        } catch (error) {
            throw new Error('Unable to create activity');
        }
    }
}

export default ActivityService;
