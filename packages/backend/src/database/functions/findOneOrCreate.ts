import { Document, DocumentQuery, FilterQuery, Model as MongooseModel } from 'mongoose';

export type findOneOrCreate<
  Props extends Document = Document,
  Model extends MongooseModel<Props> = MongooseModel<Props>,
> = (
  this: Model,
  condition: FilterQuery<Props>,
  callback: (result: Props) => unknown
) => DocumentQuery<Props, Props, {}>;

/**
 * @Choooks22 FILTER_QUERY !== CREATE_QUERY! This needs fixing soon.
 */
export const findOneOrCreate: findOneOrCreate = function(condition, callback) {
  return this.findOne(condition, (err, result) => {
    if (!result) {
      this.create(condition as any); // WARN: Cast filter query to any to silence create query params
    }
    return callback(result);
  });
};
