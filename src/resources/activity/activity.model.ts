import { Schema, model } from 'mongoose';
import Activity from '@/resources/activity/activity.interface';

const ActivitySchema = new Schema(
    {
        titleCategory: {
            type: String,
        },
        title: {
            type: String,
        },
        image: {
            type: String,
        },
        price: {
            type: String,
        },
        priceFrom: {
            type: String,
        },
        averageRating: {
            type: String,
        },
    },
    { timestamps: true }
);

export default model<Activity>('Activity', ActivitySchema);
