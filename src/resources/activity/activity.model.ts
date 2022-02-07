import { Schema, model } from 'mongoose';
import Activity from '@/resources/activity/activity.interface';

const ActivitySchema = new Schema(
    {
        title: {
            type: String,
        },
        body: {
            type: String,
        },
        image: {
            type: String,
        },
        time: {
            type: Number,
        },
        forUpTo: {
            type: Number,
        },
        fromPerson: {
            type: String,
        },
        suggestedBy: {
            type: String,
        },
        price: {
            type: Number,
        },
        theLocation: {
            type: String,
        },
        number: {
            type: Number,
        },
        cancellationPolicy: {
            type: String,
        },
    },
    { timestamps: true }
);

export default model<Activity>('Activity', ActivitySchema);
