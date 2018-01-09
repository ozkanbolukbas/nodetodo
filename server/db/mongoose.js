const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/ToDoAppNew');
mongoose.Promise = global.Promise;

module.exports={mongoose};
