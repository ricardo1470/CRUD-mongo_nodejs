const path = require('path');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const  cors = require('cors');
const createError = require('http-errors');
const favicon = require('serve-favicon');

const app = express();

const port = 9000 || process.env.PORT;

// connection to db
mongoose.connect('mongodb://localhost/crud', {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})

var db = mongoose.connection

db.on('error', function(err){
  console.log('connection error', err)
});

db.once('open', function(){
  console.log('Connection to DB successful')
});

// importing routes
const indexRoutes = require('./routes/index');

// settings
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

// middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(favicon(path.join(__dirname, 'public/img', 'favicon.ico')))

// routes
app.use('/', indexRoutes);

// static files
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res) {
    //set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error.html');
});

// listen server on port
app.listen(port, function () {
    console.log(`CORS-enabled, web server listening on port: ${port}`)
});

// process terminated
process.on('SIGTERM', () => {
  app.close(() => {
    console.log('Process terminated')
  })
})
