var express = require('express');
var router = express.Router();
var router = express.Router();
var Pool = require('pg-pool');
var pg = require("pg");
var fs = require("fs");
var md5=require("md5");
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var numeral = require('numeral');

var config = {
    user: 'postgres',
    database: 'DAUGIA',
    password: 'thienle',
    host: 'localhost',
    port: '5432'
};

var pool = new pg.Pool(config);

router.get('/serverheader', (req, res) => {
    var id_nguoidung=0;
    if(req.session.user)
    {
        id_nguoidung=req.session.user;
    }
     pool.connect(function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query('Select l.ms_loaitk from taikhoan tk join loai_taikhoan l on tk.ms_loaitk=l.ms_loaitk where tk.id='+id_nguoidung+';', function (err, result) {
                done();
                if (err) {
                    return console.error('error running query', err);
                    res.end();
                }
                if(req.session.user)
                {
                res.json({ten_hienthi: req.session.ten_hienthi,user_id:req.session.user,nguoidung:result.rows[0].ms_loaitk,username:req.cookies.username,password:req.cookies.password });
                }
                if(!req.session.user)
                {
                    res.json({ten_hienthi: req.session.ten_hienthi,user_id:0,nguoidung:2,username:req.cookies.username,password:req.cookies.password});
                }
            });
     });
    });

    router.get('/serverProduct', (req, res) => {
         pool.connect(function (err, client, done) {
                if (err) {
                    return console.error('error fetching client from pool', err);
                }
                client.query('Select * from loai_sanpham ', function (err, result) {
                    done();
                    if (err) {
                        return console.error('error running query', err);
                        res.end();
                    }
                   res.json(result.rows);
                });
         });
        });

router.get('/home', (req, res) => {
    var id_nguoidung=0;
    if(req.session.user)
    {
        id_nguoidung=req.session.user;
    }
     pool.connect(function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query('select count(ms_phieu),b.ms_phien,b.mssp,sp.hinhanh,b.gia_hientai,b.thoigian_bd,b.thoigiandau,b.gia_thapnhat from phieu_daugia p join phiendaugia b on p.ms_phien=b.ms_phien join sanpham sp on b.mssp=sp.mssp where b.thoigian_bd<=localtimestamp and b.thoigiandau>=now()  group by b.ms_phien,sp.hinhanh order by count desc limit 5;select b.ms_phien,b.mssp,sp.hinhanh,b.gia_hientai,b.thoigian_bd,b.thoigiandau,b.gia_thapnhat from phiendaugia b join sanpham sp on b.mssp=sp.mssp where b.thoigian_bd<=localtimestamp and b.thoigiandau>=now() order by b.gia_hientai desc limit 5;select b.ms_phien,b.mssp,sp.hinhanh,b.gia_hientai,b.thoigian_bd,b.thoigiandau,b.gia_thapnhat from phiendaugia b join sanpham sp on b.mssp=sp.mssp where b.thoigian_bd<=localtimestamp and b.thoigiandau>=now() order by b.thoigiandau asc limit 5;', function (err, result) {
                done();
                if (err) {
                    return console.error('error running query', err);
                    res.end();
                }
                res.json({ sp_luot: result[0].rows,sp_gia:result[1].rows,sp_thoigian:result[2].rows});
            });
     });
    });

router.get('/serverProduct/:ID', (req, res, next) => {
    var id = req.params.ID;
    var id_nguoidung=0;
    if(req.session.user)
    {
        id_nguoidung=req.session.user;
    }
    pool.connect(function (err, client, done) {
    
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query("select * from phiendaugia phien join sanpham sp on sp.mssp=phien.mssp join loai_sanpham l on l.mlsp=sp.ma_loai where localtimestamp>=phien.thoigian_bd and phien.thoigiandau>=now() and l.mlsp=" + id + ";select*from loai_sanpham where mlsp=" + id +";", function (err, result) {
            done();
            if (err) {
                return console.error('error running query', err);
                res.end();
            }
            if(req.session.user)
            {
            res.json({ sanpham: result[0].rows, ten_loaisp: result[1].rows, });
            }
            if(!req.session.user)
            {
                res.json({ sanpham: result[0].rows, ten_loaisp: result[1].rows});
            }

        });
    });
});
//pageDetail
router.get('/serverDetail/phien=:PHIEN/id=:ID', (req, res, next) => {
    var id = req.params.ID;
    var phien = req.params.PHIEN;
    var user_id=0;
    if(req.session.user)
    {
    user_id=req.session.user;
    }
    pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query("select * from phiendaugia phien join sanpham sp on sp.mssp=phien.mssp join loai_sanpham l on l.mlsp=sp.ma_loai where sp.mssp=" + id + ";select * from hinh where mssp=" + id + ";select max(gia_hientai) from phiendaugia where ms_phien=" + phien + ";select tk.ten_hienthi from phiendaugia phien join phieu_daugia phieu on phien.ms_phien=phieu.ms_phien join taikhoan tk on tk.id=phieu.mstk where phieu.ms_phieu=phien.phieudauthang and phien.ms_phien=" + phien + ";Select*from phiendaugia phien join phieu_daugia phieu on phien.phieudauthang=phieu.ms_phieu where phien.thoigiandau<now() and phieu.mstk="+user_id+" and phien.ms_phien="+phien+";", function (err, result) {
            done();
            if (err) {
                return console.error('error running query', err);
                res.end();
            }
            if(req.session.user)
            {
            res.json({ sanpham: result[0].rows, hinh: result[1].rows, giadau: result[2].rows, userWin: result[3].rows,user_id:req.session.user,ketqua:result[4].rowCount});
            }
            if(!req.session.user)
            {
            res.json({ sanpham: result[0].rows, hinh: result[1].rows, giadau: result[2].rows, userWin: result[3].rows,user_id:0,ketqua:result[4].rowCount});
            }
        });
    });
});
// trạng thái: Kiểm tra thời gian load sản phẩm lên trang web Đấu giá nếu hết rồi phải update lại trang thái database
router.get('/UpdatePhien/trangthai/:ID', (req, res) => {
    var id = req.params.ID;
    if (req.session.user) {
        pool.connect(function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query('update phiendaugia set tinhtrang=false where mssp=' + id + ';', function (err, result) {
                done();
                if (err) {
                    return console.error('error running query', err);
                    res.end();
                }
                res.end();
            });
        });
    }
});
// khi nhấn Đấu giá ngay thì phải insert trong bảng phiếu đấu và update lại tất cả trạng thái thắng thua của khách hàng
router.post('/Detail/Daugiangay', (req, res) => {
    var ms_phien = req.body.ms_phien;
    var giadau = req.body.giadau;
    var taikhoan = req.body.taikhoan;
    var status = req.body.status;
    if (status == 0) {
        pool.connect(function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query('update phieu_daugia set ms_tinhtrang=2 where ms_phien=' + ms_phien + ';insert into phieu_daugia (ms_phien,mstk,giadau,ms_tinhtrang,thoigian_lap) values(' + ms_phien + ',' + taikhoan + ',' + giadau + ',1,localtimestamp);select * from phieu_daugia where ms_phien=' + ms_phien + ' and mstk=' + taikhoan + ';', function (err, result) {
                done();
                if (err) {
                    console.error('error query', err);
                    res.end();
                }
                else {
                    res.json({ phieudau: result[2].rows });
                }
            })
        })
    }
    if (status == 1) {
        pool.connect(function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query('update phieu_daugia set ms_tinhtrang=2 where ms_phien=' + ms_phien + ';update phieu_daugia set giadau=' + giadau + ',ms_tinhtrang=1,thoigian_lap=localtimestamp where ms_phien=' + ms_phien + ' and mstk=' + taikhoan + ';select * from phieu_daugia where ms_phien=' + ms_phien + ' and mstk=' + taikhoan + ';', function (err, result) {
                done();
                if (err) {
                    console.error('error query', err);
                    res.end();
                }
                else {
                    res.json({ phieudau: result[2].rows });
                }
            })
        })
    }
});

//Update lại phiên đấu : giá đấu với mã phiếu thắng
router.put('/Detail/Daugiangay', (req, res) => {
    var phien = req.body.phien;
    var giadau = req.body.giadau;
    var phieu = req.body.phieu;
    pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('update phiendaugia set gia_hientai=' + giadau + ',phieudauthang=' + phieu + ' where ms_phien=' + phien + ';', function (err, result) {
            done();
            if (err) {
                console.error('error query', err);
                res.end();
            }
            else {
                res.end();
            }
        })
    })
});
// Check uers có tồn tại trong một phiên đấu giá chưa nếu rồi thì trả về 1 nếu chưa trả về 0
router.get('/Detail/checkUserInPhien/phien=:PHIEN/id=:ID', (req, res) => {
    var id = req.params.ID;
    var phien = req.params.PHIEN;
    if (req.session.user) {
        pool.connect(function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query('select * from phiendaugia p  where localtimestamp>=p.thoigian_bd and p.thoigiandau>=now() and p.ms_phien=' + phien + ';select * from phiendaugia p join phieu_daugia b on p.ms_phien=b.ms_phien where p.ms_phien=' + phien + 'and b.mstk=' + id + ';', function (err, result) {
                done();
                if (err) {
                    return console.error('error running query', err);
                    res.end();
                }
                if(result[0].rowCount!=0)//Con thoi gian dau
                {
                    if(result[1].rowCount==0)//insert phieu dau
                    {
                        return res.json(0);
                    }
                    if(result[1].rowCount!=0)
                    {
                        if(result[1].rows[0].ms_tinhtrang==2)
                        {
                            return res.json(1);
                        }
                        if(result[1].rows[0].ms_tinhtrang==1)
                        {
                            return res.json(-1);
                        }
                    }
                }
                if(result[0].rowCount==0)//Het thoi gian dau
                {
                    return res.json(2);
                }
                // if (result.rowCount != 0) {
                //     // if (result.rows[0].tinhtrang === true) {
                //     //     if (result.rows[0].ms_tinhtrang == 2) {
                //     //         return res.json(1);
                //     //     }
                //     //     if (result.rows[0].ms_tinhtrang == 1) {
                //     //         return res.json(-1);
                //     //     }
                //     // }
                //     // if (result.rows[0].tinhtrang === false) {
                //     //    return res.json(2);
                //     // }
                //     console.log(result.rows[0].phieudauthang+id+phien)
                // }
                // // Het thoi gian la 2
                // if (result.rowCount == 0) {
                //     return res.json(0);
                // }
            });
        });
    }
});

router.get('/serverDaugiacuatoi', (req, res) => {
    if (req.session.user) {
        pool.connect(function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query('Select * from phiendaugia phien join sanpham sp on sp.mssp=phien.mssp join phieu_daugia b on phien.ms_phien=b.ms_phien where localtimestamp>=phien.thoigian_bd and phien.thoigiandau>=now() and b.mstk=' + req.session.user + ';select * from phiendaugia phien join sanpham sp on sp.mssp=phien.mssp join phieu_daugia b on phien.ms_phien=b.ms_phien where phien.thoigiandau<now() and b.ms_tinhtrang=1 and b.mstk=' + req.session.user + ';select * from phiendaugia phien join sanpham sp on sp.mssp=phien.mssp join phieu_daugia b on phien.ms_phien=b.ms_phien where phien.thoigiandau<now() and b.ms_tinhtrang=2 and b.mstk=' + req.session.user + ';', function (err, result) {
                done();
                if (err) {
                    return console.error('error running query', err);
                    res.end();
                }
                res.json({daugia: result[0].rows, dauthang: result[1].rows, dauthua: result[2].rows });
            });
        });
    }
});

router.get('/serverQuanly', (req, res) => {
    if (req.session.user) {
        pool.connect(function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query('Select * from loai_sanpham;select * from sanpham sp join loai_sanpham l on sp.ma_loai=l.mlsp where duyet=false', function (err, result) {
                done();
                if (err) {
                    return console.error('error running query', err);
                    res.end();
                }
                res.json({ loaisp: result[0].rows, taikhoan: req.session.ten_hienthi,phien:result[1].rows});
            });
        });
    }
});

router.post('/Quanly/Image', (req, res) => {
    pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('select max(ms_hinh)+1 as max from hinh', function (err, result) {
            done();
            if (err) {
                return console.error('error running query', err);
                res.end();
            }
            // code true
            var address = "E:/Web/web2/public/client/public/images/sanpham/";
            var address_new = "E:/Web/web2/public/client/public/images/sanphammoi/";
            var Image = req.body.file;
            var id = req.body.img;
            var str = "C:/fakepath/";
            var str = str.length;
            var max = result.rows[0].max;
            Image = Image.substring(str);
            var saveTemp = 0;
            if (req.session.quanly) {
                temp = 0;
                var tempmax = 0;
                for (var i = 0; i < req.session.quanly.length; i++) {
                    tempmax = (Number(req.session.quanly[i].index) + 1);
                    console.log(tempmax);
                    // nếu file ảnh đã dùng rồi thì chỉ update lại đường dẫn
                    if (req.session.quanly[i].img == id) {
                        req.session.quanly[i].image = Image;
                        fs.copyFileSync(address_new + Image, address + req.session.quanly[i].index + ".png")
                        // để trả về client để hiện hình 
                        saveTemp = req.session.quanly[i].index;
                        temp = 1;
                        break;
                    }
                }
                if (temp == 0) {
                    req.session.quanly.push({ image: Image, index: tempmax, img: id })
                    fs.copyFileSync(address_new + Image, address + tempmax + ".png", )
                    saveTemp = tempmax;
                }
            }
            if (!req.session.quanly) {

                req.session.quanly = [{ image: Image, index: max, img: id }];
                fs.copyFileSync(address_new + Image, address + max + ".png")
                saveTemp = max;
            }

            console.log(req.session.quanly.length);
            console.log(req.session.quanly);
            var stringJson=saveTemp.toString() + ".png";
            res.json(stringJson);
        });
    });
});

router.post('/serverQuanly/Themsanpham/updateHinh', (req, res) => {
    var ms_hinh=req.body.mahinh;
    var mssp=req.body.mssp;
    pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('Update sanpham set hinhanh=$1 where mssp=$2 ',[ms_hinh,mssp], function (err, result) {
            done();
            if (err) {
                return console.error('error running query', err);
                res.end();
            }
            res.json(1);
    });
});

});

router.get('/serverQuanly/info/mssp', (req, res) => {

    pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('select max(mssp) from sanpham', function (err, result) {
            done();
            if (err) {
                return console.error('error running query', err);
                res.end();
            }
            res.json(result.rows[0].max);
    });
});
});
router.post('/serverQuanly/Themsanpham', (req, res) => {
    var tensanpham=req.body.tensanpham;
    var gia=req.body.gia;
    var mota=req.body.mota;
    var img1=req.body.img1;
    var img2=req.body.img2;
    var img3=req.body.img3;
    var img4=req.body.img4;
    var mlsp=req.body.mlsp;
    pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('insert into sanpham(ma_loai,ten_sp,dacta,gia) values($1,$2,$3,$4);',[mlsp,tensanpham,mota,gia], function (err, result) {
            done();
            if (err) {
                return console.error('error running query', err);
                res.end();
            }
            res.end();
    });
});
});

router.post('/serverQuanly/Themsanpham/Hinh', (req, res) => {
    var mssp=req.body.mssp;
    console.log(mssp);
    pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('insert into hinh(mssp) values($1),($2),($3),($4);',[mssp,mssp,mssp,mssp], function (err, result) {
            done();
            if (err) {
                return console.error('error running query', err);
                res.end();
            }
            res.json(mssp);
    });
});
});

router.post('/serverQuanly/Themsanpham/Folder', (req, res) => {
    var mssp=req.body.mssp;
    var img1=req.body.img1;
    var img2=req.body.img2;
    var img3=req.body.img3;
    var img4=req.body.img4;
    var address_new = "E:/Web/web2/client/public/images/sanpham/";
    var address = "E:/Web/web2/client/public";
    pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('select * from hinh where mssp='+mssp+';select min(ms_hinh) from hinh where mssp='+mssp+';', function (err, result) {
            done();
            if (err) {
                return console.error('error running query', err);
                res.end();
            }
            fs.renameSync(address+img1,address_new +result[0].rows[0].ms_hinh+ ".jpg");
            fs.renameSync(address+img2,address_new +result[0].rows[1].ms_hinh+ ".jpg");
            fs.renameSync(address+img3,address_new +result[0].rows[2].ms_hinh+ ".jpg");
            fs.renameSync(address+img4,address_new +result[0].rows[3].ms_hinh+ ".jpg");
            res.json(result[1].rows[0].min);
    });
});
});



router.post('/serverQuanly/Duyet', (req, res) => {
    var mssp=req.body.masp;
    var thoigian_bd=req.body.thoigian_bd;
    var thoigian_kt=req.body.thoigian_kt;
    var gia=req.body.giathapnhat;
    pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('insert into phiendaugia(mssp,thoigian_bd,thoigiandau,gia_thapnhat,gia_hientai) values($1,$2,$3,$4,$5);',[mssp,thoigian_bd,thoigian_kt,gia,gia], function (err, result) {
            done();
            if (err) {
                return console.error('error running query', err);
                res.end();
            }
            res.end();
    });
});
});

router.get('/serverQuanly/Duyet/UpdateSanpham/:id', (req, res) => {
    var mssp=req.params.id;
    pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('update sanpham set duyet=true where mssp='+mssp+';', function (err, result) {
            done();
            if (err) {
                return console.error('error running query', err);
                res.end();
            }
            res.end();
    });
});
});

router.get('/serverGiohang', (req, res) => {
    if (req.session.user) {
        pool.connect(function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query('Select * from phiendaugia p join sanpham sp on p.mssp=sp.mssp join phieu_daugia b on p.phieudauthang=ms_phieu  where thoigiandau<now() and tinhtrang_phien=1 and mstk='+req.session.user+';', function (err, result) {
                done();
                if (err) {
                    return console.error('error running query', err);
                    res.end();
                }
                var tongtien=0;
                for(var i=0 ;i<result.rowCount;i++)
                {
                    tongtien+=result.rows[i].gia_hientai*1000;
                }
                tongtien=numeral(tongtien).format('0,0');
                res.json({giohang:result.rows,tongtien:tongtien,user_id:req.session.user});
            });
        });
    }
    if(!req.session.user)
    {
        return res.json({user_id:0})
    }
});

router.get('/serverGiohang/Thanhtoan/:phien', (req, res) => {
    var phien=req.params.phien;
    if (req.session.user) {
        pool.connect(function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query('Update phiendaugia set tinhtrang_phien=2 where ms_phien='+phien+';', function (err, result) {
                done();
                if (err) {
                    return console.error('error running query', err);
                    res.end();
                }
                res.end();
            });
        });
    }
    if(!req.session.user)
    {
        return res.json({user_id:0})
    }
});

router.get('/serverGiohang/RemoveProduct/:phien', (req, res) => {
    var ms_phien=req.params.phien;
    if (req.session.user) {
        pool.connect(function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query('Update phiendaugia set tinhtrang_phien=3 where ms_phien='+ms_phien+';', function (err, result) {
                done();
                if (err) {
                    return console.error('error running query', err);
                    res.end();
                }
                res.end();
            });
        });
    }
});

router.get('/serverThongtin', (req, res) => {
    if (req.session.user) {
        pool.connect(function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query('select * from taikhoan where id=$1',[req.session.user], function (err, result) {
                done();
                if (err) {
                    return console.error('error running query', err);
                    res.end();
                }
                res.json(result.rows[0]);
            });
        });
    }
});

router.post('/Thongtin/save', (req, res) => {
    if(req.session.user)
    {
    var username=req.body.username;
    var user_id=req.body.user_id;
    var nickname=req.body.nickname;
    var email=req.body.email;
    var password=req.body.password;
    var status=req.body.status_password;
    console.log(req.body);
    if(status==1)
    {
        // update lai password
        if(nickname=="")
        {
            return res.json(1);
        }
        if(email.indexOf("@")==-1)
        {
            return res.json(2);
        }
        if(email.indexOf(".com")==-1)
        {
            return res.json(2);
        }
        if(password.length<8)
        {
            return res.json(3);
        }
        if(password.length>15)
        {
            return res.json(3);
        }
        if(nickname!=""&&email.indexOf("@")!=-1&&email.indexOf(".com")!=-1&&password.length>=8&&password.length<=15)
        {
            pool.connect(function (err, client, done) {
                if (err) {
                    return console.error('error fetching client from pool', err);
                }
                client.query('update taikhoan set ten_hienthi=$1,email=$2,matkhau=$3 where id=$4;',[nickname,email,md5(password),user_id], function (err, result) {
                    done();
                    if (err) {
                        return console.error('error running query', err);
                        res.end();
                    }
                    res.clearCookie("password");
                    res.clearCookie("username");
                    res.cookie('password', password);
                    res.cookie('username', username);
                    return res.json(4);
            });
        });
        }
    }
    if(status!=1)
    {
        // Khong update lai password
        if(nickname=="")
        {
            return res.json(1);
        }
        if(email.indexOf("@")==-1)
        {
            return res.json(2);
        }
        if(email.indexOf(".com")==-1)
        {
            return res.json(2);
        }
        if(nickname!=""&&email.indexOf("@")!=-1&&email.indexOf(".com")!=-1)
        {
            pool.connect(function (err, client, done) {
                if (err) {
                    return console.error('error fetching client from pool', err);
                }
                client.query('update taikhoan set ten_hienthi=$1,email=$2 where id=$3;',[nickname,email,user_id], function (err, result) {
                    done();
                    if (err) {
                        return console.error('error running query', err);
                        res.end();
                    }
                    return res.json(4);
            });
        });
        }

    }
    }
    else
    {
        res.end()
    }
});

module.exports = router;

