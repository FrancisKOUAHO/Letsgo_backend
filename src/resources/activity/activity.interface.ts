import {Document} from 'mongoose';

export default interface Activity extends Document {
    title: string;
    body: string;
    image: string;
    fromPrice: number;
    time: number;
    forUpTo: number;
    fromPerson: string;
    suggestedBy: string;
    price: number;
    theLocation: string;
    number: number;
    cancellationPolicy: string;

}
