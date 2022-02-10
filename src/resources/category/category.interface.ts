import {Document} from 'mongoose';

export default interface Category extends Document {
    title: string;
    body: string;
    image: string;
}
