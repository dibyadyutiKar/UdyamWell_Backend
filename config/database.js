const mongoose = require('mongoose');

require('dotenv').config();

// console.log(process.env.Mongo_Uri);

exports.connect = () => {
  mongoose
    .connect(process.env.Mongo_Uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log(`DB connected successfully`);
    })
    .catch((err) => {
      console.log('Db connection issue');
      console.error(err);
      process.exit(1);
    });
};
