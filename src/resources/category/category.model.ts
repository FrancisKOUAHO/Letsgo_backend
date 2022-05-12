import {model, Schema} from 'mongoose';
import Category from '@/resources/category/category.interface'

const CategorySchema = new Schema(
    {
        title: {
            type: String,
        },
        image: {
            type: String,
        }
    },
    {timestamps: true}
);

export default model<Category>('Category', CategorySchema);
