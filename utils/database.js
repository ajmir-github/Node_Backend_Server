const mongoose = require('mongoose');

function database(
  DATABASE_URL,
  onSuccessCallBack = () => {},
  onErrorCallBack = () => {}
) {

  // Database Connection
  mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });

  // log database connection status
  mongoose.connection
    .on("error", () => {
      console.log("+++ Connection to the database failed!");
      onErrorCallBack();
    })
    .on("open", () => {
      console.log("--- Connected to the database");
      onSuccessCallBack();
    });

}

module.exports = database;