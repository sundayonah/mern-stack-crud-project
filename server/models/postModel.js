const { schema, model, Schema } = require('mongoose');

const postSChema = new Schema(
   {
      title: { type: String, required: true },
      category: {
         type: String,
         enum: [
            'Agriculture',
            'Bussiness',
            'Education',
            'Entertainment',
            'Art',
            'Investment',
            'Uncategorized',
            'Weather',
         ],
         message: 'VALUE is not supported',
      },
      desc: { type: String, required: true },
      // thumbnail: { type: Schema.Types.ObjectId, ref: 'User' },
      creator: { type: Schema.Types.ObjectId, ref: 'User' },
      thumbnail: { type: String, required: true },
   },
   { timestamps: true }
);

module.exports = model('Post', postSChema);
