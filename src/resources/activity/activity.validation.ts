import Joi from 'joi';

const create = Joi.object({
    title: Joi.string(),
    body: Joi.string(),
    image: Joi.string(),
    fromPrice: Joi.number(),
    time: Joi.number(),
    forUpTo: Joi.number(),
    fromPerson: Joi.string(),
    suggested_by: Joi.string(),
    price: Joi.number(),
    theLocation: Joi.string(),
    number: Joi.number(),
    cancellationPolicy: Joi.string(),
});

export default {create};
