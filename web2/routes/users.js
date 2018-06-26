var express = require('express');
var router = express.Router();
var pg = require("pg");
var md5 = require('md5');
var nodemailer = require('nodemailer');
var transporter =  nodemailer.createTransport({ // config mail server
    service: 'Gmail',
    auth: {
        user: 'teamauction149@gmail.com',
        pass: 'leminhthien'
    }
});

var config = {
    user: 'postgres',
    database: 'DAUGIA',
    password: 'thienle',
    host: 'localhost',
    port: '5432'
};
const secretKey = 'foobarbaz1234567foobarbaz1234567'
const cookieParams = {
    httpOnly: true,
    signed: true,
    maxAge: 1000*60*60*24 
}

function randomPassword(length, special) {
    var iteration = 0;
    var password = "";
    var randomNumber;
    if(special == undefined){
        var special = false;
    }
    while(iteration < length){
      randomNumber = (Math.floor((Math.random() * 100)) % 94) + 33;
      if(!special){
        if ((randomNumber >=33) && (randomNumber <=47)) { continue; }
        if ((randomNumber >=58) && (randomNumber <=64)) { continue; }
        if ((randomNumber >=91) && (randomNumber <=96)) { continue; }
        if ((randomNumber >=123) && (randomNumber <=126)) { continue; }
      }
      iteration++;
      password += String.fromCharCode(randomNumber);
    }
    return password;
  }

var pool = new pg.Pool(config);
//Get Login
router.get('/login', function (req, res) {
    if (req.session.user) {
        var info = { id: req.session.user, ten_hienthi: req.session.ten_hienthi,nguoidung:req.session.nguoidung }
        return res.json(info);
    }
    if (!req.session.user) {
        if (req.cookies.username) {
           return res.json({ username: req.cookies.username, password: req.cookies.password });
        }
        return res.json({ username:"", password:""});
    }
});

router.post('/login', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT * from taikhoan where ten_dangnhap=$1 and matkhau=$2', [username, md5(password)], function (err, result) {
            done();
            if (err) {
                console.error('error query', err);
                res.end();
            }
            else {
                if (result.rowCount != 0) {
                    res.cookie('password', req.body.password);
                    res.cookie('username', req.body.username);
                    req.session.ten_hienthi = result.rows[0].ten_hienthi;
                    req.session.user = result.rows[0].id;
                    req.session.nguoidung=result.rows[0].ms_loaitk
                    res.json(1);
                }
                if (result.rowCount == 0) {
                    res.json(0);
                }
            }
        })
    })
});

router.get('/serverlogout', function (req, res) {
    req.session.destroy();
    req.session = null;
    res.json(1);
});

router.get('/register/:username', function (req, res) {
    console.log("ok");
    var username=req.params.username;
        pool.connect(function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query('select * from taikhoan where ten_dangnhap=$1;',[username], function (err, result) {
                done();
                if (err) {
                    console.error('error query', err);
                    res.end();
                }
                else {
                   res.json(result.rowCount);
                }
            })
        })
    
});

router.post('/register', function (req, res) {
    var username=req.body.username;
    var nickname=req.body.nickname;
    var email=req.body.email;
    var password=req.body.password;

    if(username!=""&&nickname!=""&& email!=""&&password!=""&&email.indexOf("@")!=-1&&email.indexOf(".com")!=-1&&password.length>=8&&password.length<=15)
    {
        pool.connect(function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query('insert into taikhoan(ten_dangnhap,ten_hienthi,email,matkhau,ms_loaitk) values($1,$2,$3,$4,$5)', [username,nickname,email, md5(password),2], function (err, result) {
                done();
                if (err) {
                    console.error('error query', err);
                    res.end();
                }
                else {
                  return res.json(1);
                }
            })
        })
    }
    if(username=="")
    {
       return res.json(2);
    }
    if(nickname=="")
    {
       return res.json(2);
    }
    if(email.indexOf("@")==-1)
    {
      return  res.json(3);
    }
    if(email.indexOf(".com")==-1)
    {
       return res.json(3);
    }
    if(password.length<8)
    {
       return res.json(4);
    }
    if(password.length>15)
    {
       return res.json(4);
    }
    
});
router.post('/forget', (req, res) => {
    var email = req.body.email;
    var email_server='teamauction149@gmail.com'
    var username=req.body.username;
    var pass=randomPassword(8);
     var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
        from: 'teamAution',
        to: email,
        subject: 'Account Auction',
        text: 'You recieved message from ' + email,
        html: '<p>You have got a new message</b><ul><li>Username:' + username + '</li><li>Email:' + email_server + '</li><li>Password:' + pass + '</li></ul>'
    }
    transporter.sendMail(mainOptions, function(err, info){
        if (err) {
            console.log(err);
        } else {
            console.log('Message sent: ' +  info.response);
        }
    });
    if(email.indexOf('@')!=-1&&email.indexOf('.com')!=-1){
    pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('Update taikhoan set matkhau=$1 where ten_dangnhap=$2', [md5(pass),username], function (err, result) {
            done();
            if (err) {
                console.error('error query', err);
                res.end();
            }
            else {
                res.json(1);
            }
        })
    })
    }
    else
    {
        return res.json(0);
    }
});

module.exports = router;