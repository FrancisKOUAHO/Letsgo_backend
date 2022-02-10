import {model, Schema} from 'mongoose';
import Category from '@/resources/category/category.interface'

const CategorySchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        body: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: false
        }
    },
    {timestamps: true}
);

export default model<Category>('Category', CategorySchema);
