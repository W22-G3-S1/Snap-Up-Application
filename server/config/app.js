let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

// modules for authentication
let session = require('express-session');
let passport = require('passport');

let passportJWT = require('passport-jwt');
let JWTStrategy = passportJWT.Strategy;
let ExtractJWT = passportJWT.ExtractJwt;

let passportLocal = require('passport-local');
let localStratgy = passportLocal.Strategy;
let flash = require('express-flash');
let MongoDbStore = require('connect-mongo')(session)

// database setup
let mongoose = require('mongoose');
let DB = require('./db');

// point mongoose to the DB URI
mongoose.connect(DB.URI, {useNewUrlParser: true, useUnifiedTopology: true});

let mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind(console.error, 'Connection Error:'));
mongoDB.once('open', ()=>{
  console.log('Connected to MongoDB ... ');
});

let indexRouter = require('../routes/index');
let usersRouter = require('../routes/users');
let cartRouter = require('../routes/cart');
let wishListRouter = require('../routes/wishlist');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../node_modules')))

app.locals.products=require('../../products.json')
app.locals.product2=require('../../product2.json')
app.locals.men=require('../../Men.json')
app.locals.sale1=require('../../sale1.json')
app.locals.sale2=require('../../sale2.json')
app.locals.sale3=require('../../sale3.json')

//sesssion store
let mongoStore= new MongoDbStore({
  mongooseConnection: mongoDB,
  collection:'sessions'
})
//setup express session

//setup express session
app.use(session({
  secret: "SomeSecret",
  saveUninitialized: false,
  resave: false,
  store: mongoStore,
  cookie:{ maxAge: 1000 * 60 * 60 * 24}
}));

// initialize flash
app.use(flash());

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//global middleware
app.use((req,res,next)=>{
  res.locals.session=req.session
  next()
})

// passport user configuration

// create a User Model Instance
let userModel = require('../models/user');
let User = userModel.User;

// impletment a User Authentication Strategy
passport.use(User.createStrategy());

// serialize and deserialize the User Info
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = DB.Secret;

let strategy = new JWTStrategy(jwtOptions, (jwt_payload, done) => {
  User.findById(jwt_payload.id)
    .then(user => {
      return done(null, user);
    })
    .catch(err => {
      return done(err, false);
    });
});

passport.use(strategy);

// routing
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/cart', cartRouter);
app.use('/wishlist', wishListRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {title: 'Error'});
});

module.exports = app;
