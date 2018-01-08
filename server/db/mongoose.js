const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ToDoAppNew');
mongoose.Promise = global.Promise;

module.exports={mongoose};
