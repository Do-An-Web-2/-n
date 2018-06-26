import React, { Component } from 'react';
import $ from 'jquery';
import axios from 'axios'
import { stringify } from 'querystring';
class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alert_error: 0,
            alert_username_register: 0,
            error_dangky: 0,
            error_forget: 1,
            nguoidung: 0,
            user_id: 0,
            ten_hienthi: "",
            imageHome: "",
            address:0,
            cookie_username:"",
            cookie_password:"",
        }
        this.Dangxuat=this.Dangxuat.bind(this);
        this.Dangnhap = this.Dangnhap.bind(this);
        this.Dangky = this.Dangky.bind(this);
        this.Forget = this.Forget.bind(this);
        this.Link_Dangnhap=this.Link_Dangnhap.bind(this);
        this.Link_Giohang=this.Link_Giohang.bind(this);
    }
    Link_Giohang()
    { 
        this.setState({address:1,
            alert_error: 0,
            alert_username_register: 0,
            error_dangky: 0,
            error_forget: 1,})
            // refresh
        $("#login_username").val(this.state.cookie_username);
        $("#login_pwd").val(this.state.cookie_password);
        $("#register_username").val("");
        $("#register_nickname").val("");
        $("#register_email").val("");
        $("#register_pwd").val("");
        $("#forget_username").val("");
        $("#forget_email").val("");
    }
    Link_Dangnhap()
    {
        this.setState({address:0,
            alert_error: 0,
            alert_username_register: 0,
            error_dangky: 0,
            error_forget: 1,});
        // refresh
        $("#login_username").val(this.state.cookie_username);
        $("#login_pwd").val(this.state.cookie_password);
        $("#register_username").val("");
        $("#register_nickname").val("");
        $("#register_email").val("");
        $("#register_pwd").val("");
        $("#forget_username").val("");
        $("#forget_email").val("");
    }
    Dangxuat()
    {
        axios.get("/users/serverlogout")
        .then((res)=>{
            if(res.data===1)
            {
                window.location.reload();
            }
        })
    }

    Forget() {
        var body = {
            email: $("#forget_email").val(),
            username: $("#forget_username").val()
        }
        axios.get('/users/register/' + body.username) //không phải register mà dùng để kiễm tra username có tồn tại không
            .then((res) => {
                alert(res.data)
                // tai khoan ton tai
                if (res.data === 1) {
                    axios({
                        method: 'post',
                        url: "/users/forget",
                        data: stringify(body),
                    })
                        .then((res) => {
                            this.setState({ error_forget: res.data })
                            // tai khoan hop le 
                            if (res.data === 1) {
                                this.setState({alert_error:0});
                                $('#Forgetpassword_form').attr({ 'class': 'tab-pane fade' });
                                $('#login-form').attr({ 'class': 'tab-pane fade in active' });
                                $("#login_username").val(body.username);
                                $("#login_pwd").val("");
                            }
                        })
                }
                // tai khoan khong ton tai
                if (res.data !== 1) {
                    this.setState({ error_forget: -1 })
                }
            })
    }
    Dangky() {
        var body = {
            username: $('#register_username').val(),
            nickname: $('#register_nickname').val(),
            email: $('#register_email').val(),
            password: $('#register_pwd').val()
        }
        //    Nếu kết quả trả về 1 thì username đã tồn tại ngược lại 0 thì tài khoảng đó không tồn tại có thể đăng ký được
        axios.get('/users/register/' + body.username)
            .then((res) => {
                if (res.data === 1) {
                    this.setState({ alert_username_register: 1 })
                    $('#register_username').val("");
                    $('#register_nickname').val("");
                    $('#register_email').val("");
                    $('#register_pwd').val("");
                }
                if (res.data === 0) {
                    this.setState({ alert_username_register: 0 })
                    axios({
                        method: 'post',
                        url: "/users/register",
                        data: stringify(body),
                    })
                        .then((res) => {
                            this.setState({ error_dangky: res.data })
                            if (res.data === 1) {
                                $('#registration-form').attr({ 'class': 'tab-pane fade' });
                                $('#li_register').removeClass('active');
                                $('#li_login').addClass('active');
                                $('#login-form').attr({ 'class': 'tab-pane fade in active' });
                                this.setState({alert_error:0});
                                $('#login_username').val(body.username);
                                $('#login_pwd').val(body.password);
                            }
                        })
                    console.log(body);
                }
            })
    }
    Dangnhap() {
        var body = {
            username: $('#login_username').val(),
            password: $('#login_pwd').val()
        }
        axios({
            method: 'post',
            url: "/users/login",
            data: stringify(body),
        })
            .then((res) => {
                if (res.data === 0) {
                    this.setState({ alert_error: 1 })
                }
                if (res.data !== 0) {
                    if(this.state.address===1)
                    {
                        window.location.href="/Giohang"
                    }
                    else
                    {
                        window.location.reload();
                    }
                }
            })
    }
    componentWillMount() {
        this.setState({ imageHome: window.location.pathname });
         
    }
    componentDidMount() {
        axios.get('/serverheader')
            .then((res) => {
                this.setState({ user_id: res.data.user_id, 
                    ten_hienthi: res.data.ten_hienthi, 
                    nguoidung: res.data.nguoidung,
                    cookie_username:res.data.username,
                    cookie_password:res.data.password
                 })
                $("#login_username").val(res.data.username);
                $("#login_pwd").val(res.data.password);
            })       
    }

    render() {
        let elementQuanly,
            elementDangnhap,
            elementAlert_Dangnhap,
            elementAlert_username_tontai,
            elementError_dangky,
            elementError_forget,
            elementImageHome,
            elementGiohang;
        if (this.state.imageHome === "/") {
            elementImageHome = (
                <div id="myCarousel" className="carousel slide" data-ride="carousel" style={{ marginTop: '-20px' }}>
                    {/* Indicators */}
                    <ol className="carousel-indicators">
                        <li data-target="#myCarousel" data-slide-to={0} className="active" />
                        <li data-target="#myCarousel" data-slide-to={1} />
                        <li data-target="#myCarousel" data-slide-to={2} />
                    </ol>
                    {/* Wrapper for slides */}
                    <div className="carousel-inner daugia_header">
                        <div className="item active">
                            <img src="/images/header/header(1).jpg" alt="Los Angeles" />
                        </div>
                        <div className="item ">
                            <img src="/images/header/header(2).jpg" alt="Chicago" />
                        </div>
                        <div className="item">
                            <img src="/images/header/header(3).jpg" alt="New york" />
                        </div>
                    </div>
                    {/* Left and right controls */}
                    <a className="left carousel-control" href="#myCarousel" data-slide="prev">
                        <span className="glyphicon glyphicon-chevron-left" />
                        <span className="sr-only">Previous</span>
                    </a>
                    <a className="right carousel-control" href="#myCarousel" data-slide="next">
                        <span className="glyphicon glyphicon-chevron-right" />
                        <span className="sr-only">Next</span>
                    </a>
                </div>
            )
        }
        if (this.state.error_forget === -1) {
            elementError_forget = (
                <div class="alert alert-danger">
                    <strong>(?)</strong>Tài khoản không tồn tại.
                </div>
            )
        }
        if (this.state.error_forget === 0) {
            elementError_forget = (
                <div class="alert alert-danger">
                    <strong>(?)</strong>Email không hợp lệ.
                </div>
            )
        }
        if (this.state.error_dangky === 2) {
            elementError_dangky = (
                <div class="alert alert-danger">
                    <strong>(?)</strong>Vui lòng điền đầy đủ thông tin.
                </div>
            )
        }
        if (this.state.error_dangky === 3) {
            elementError_dangky = (
                <div class="alert alert-danger">
                    <strong>(?)</strong>Email không hợp lệ.
                </div>
            )
        }
        if (this.state.error_dangky === 4) {
            elementError_dangky = (
                <div class="alert alert-danger">
                    <strong>(?)</strong>Chiều dài password từ 8-15 kí tự.
                </div>
            )
        }
        if (this.state.alert_error === 1) {
            elementAlert_Dangnhap = (
                <div class="alert alert-danger">
                    <strong>(?)</strong>Tài khoản không chính xác.
                </div>
            )
        }
        if (this.state.alert_username_register === 1) {
            elementAlert_username_tontai = (
                <div class="alert alert-danger">
                    <strong>(?)</strong>Username đã tồn tại.
                </div>
            )
        }
        if (this.state.user_id != 0) {
            elementDangnhap = (
                <li>
                    <a className="dropdown-toggle" data-toggle="dropdown"><span id="ten_hienthi">Chào! {this.state.ten_hienthi}</span></a>
                    <ul className="dropdown-menu">
                        <li><a href="/Thongtin">Cá nhân</a></li>
                        <li><a href="#">Đơn hàng</a></li>
                        <li><a href="#" onClick={this.Dangxuat}>Đăng xuất</a></li>
                    </ul>
                </li>
            )
            elementGiohang=(
            <a href="/Giohang"><span className="glyphicon glyphicon-shopping-cart" />Giỏ hàng</a>
            )
        }
        if (this.state.user_id == 0) {
            elementDangnhap = (
                <li>
                    <a href="#" onClick={this.Link_Dangnhap}  data-toggle="modal" data-target=".login-register-form">
                        <span className="glyphicon glyphicon-user" />Đăng nhập
                    </a>
                    <div className="modal fade login-register-form" role="dialog">
                        <div className="modal-dialog modal-sm">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal">
                                        <span className="glyphicon glyphicon-remove" />
                                    </button>
                                    <ul className="nav nav-tabs">
                                        <li className="active" id='li_login'><a data-toggle="tab" href="#login-form"> Login <span className="glyphicon glyphicon-user" /></a></li>
                                        <li id='li_register'><a data-toggle="tab" id='register' href="#registration-form"> Register <span className="glyphicon glyphicon-pencil" /></a></li>
                                    </ul>
                                </div>
                                <div className="modal-body">
                                    <div className="tab-content">
                                        {/* Login */}
                                        <div id="login-form" className="tab-pane fade in active">
                                            {elementAlert_Dangnhap}
                                            <form >
                                                <div className="form-group">
                                                    <label >Username:</label>
                                                    <input type="text" className="form-control" id="login_username" placeholder="Enter username" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="pwd">Password:</label>
                                                    <input type="password" className="form-control" id="login_pwd" placeholder="Enter password" />
                                                </div>
                                                <a data-toggle="tab" href="#Forgetpassword_form">Forget password ?</a>
                                                <a className="btn btn-default btn_Login" id='a_login' onClick={this.Dangnhap}>Login</a>
                                            </form>
                                        </div>
                                        {/* register */}
                                        <div id="registration-form" className="tab-pane fade">
                                            {elementAlert_username_tontai}
                                            {elementError_dangky}
                                            <form >
                                                <div className="form-group">
                                                    <label htmlFor="name">Username :</label>
                                                    <input type="text" className="form-control" id="register_username" placeholder="Enter your username" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="name">Nickname :</label>
                                                    <input type="text" className="form-control" id="register_nickname" placeholder="Enter your nickname" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="newemail">Email:</label>
                                                    <input type="email" className="form-control" id="register_email" placeholder="Enter new email" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="newpwd">Password:</label>
                                                    <input type="password" className="form-control" id="register_pwd" placeholder="New password" />
                                                </div>
                                                <a className="btn btn-default btn_Register_Submit" id="a_register" onClick={this.Dangky}>Register</a>
                                            </form>
                                        </div>
                                        {/* Forget */}
                                        <div id="Forgetpassword_form" className="tab-pane fade">
                                            {elementError_forget}
                                            <form>
                                                <div className="form-group">
                                                    <label htmlFor="newemail">Username:</label>
                                                    <input type="text" className="form-control" id="forget_username" placeholder="Enter username" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="newemail">Email:</label>
                                                    <input type="email" className="form-control" id="forget_email" placeholder="Enter email" />
                                                </div>
                                                <a className="btn btn-default btn_Register_Submit" id="a_forget" onClick={this.Forget}>Submit</a>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            )
            elementGiohang=(
                <a href="#" onClick={this.Link_Giohang} data-toggle="modal" data-target=".login-register-form"><span className="glyphicon glyphicon-shopping-cart" />Giỏ hàng</a>
            )
        }
        if (this.state.nguoidung == 1) {
            elementQuanly = (
                <li><a href="/Quanly"><span class="glyphicon glyphicon-th-list"></span>Quản lý</a></li>
            )
        }
        return (
            <div>
                <nav className="navbar navbar-inverse">
                    <div className="container-fluid" id="header">
                        <div className="navbar-header">
                            <a className="navbar-brand" href="/">
                                <span className="w3-tag w3-jumbo w3-red">T</span>
                                <span className="w3-tag w3-jumbo">E</span>
                                <span className="w3-tag w3-jumbo w3-yellow">A</span>
                                <span className="w3-tag w3-jumbo">M</span>
                            </a>
                        </div>
                        <ul className="nav navbar-nav">
                            <li>{elementGiohang}</li>
                            <li><a href="/Daugiacuatoi"><span className="glyphicon glyphicon-leaf" />Đấu giá</a></li>
                        </ul>
                        <form className="navbar-form navbar-left" action="/action_page.php">
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="Search" />
                            </div>
                            <button type="submit" className="btn btn-default" id="btn_submit"><span className='glyphicon glyphicon-search'></span></button>
                        </form>
                        <ul className="nav navbar-nav navbar-right">
                            {elementQuanly}
                            {elementDangnhap}
                        </ul>
                    </div>
                </nav>
                {/* ImageHader index */}
                {elementImageHome}
            </div>
        );
    }
}

export default Header;
