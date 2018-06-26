var express=require('express');
var bodyParser=require('body-parser');
var path=require("path");
var cookieParser=require("cookie-parser");
var session=require('express-session');
var pg=require("pg");
var md5 =require('md5');
var fs =require("fs-extra");
const cookieEncrypter = require('cookie-encrypter');
const secretKey = 'foobarbaz1234567foobarbaz1234567'
const cookieParams = {
  httpOnly: true,
  signed: true,
  maxAge: 300000
}

var app=express();
app.use(express.static(path.join(__dirname,'public')));

// bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser(secretKey));
app.use(cookieEncrypter(secretKey));
// 

app.post('/login',(req,res)=>{
   console.log(req.body);
})

app.use(session({
    secret:'thienle',
    resave:true,
    saveUninitialized:true,
    cookie:{maxAge:1000*60*60*24}
}));


var routes=require('./routes/index');
var users=require('./routes/users');
app.use('/', routes);
app.use('/users', users);


app.set('port',(process.env.Port || 4000));

app.listen(app.get('port'),function(){
    console.log('Server started on port '+app.get('port'));
}); 