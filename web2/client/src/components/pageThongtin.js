import React, { Component } from 'react';
import axios from 'axios';
import $ from 'jquery';
import { stringify } from 'querystring';
class Thongtin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "123456789",
            email: "",
            nickname: "",
            temp_btn: 0,
            user_id: 0,
            error_alert: 0,
            temp_thongtin: 0,
        };
        this.Save = this.Save.bind(this);
        this.Thaydoi = this.Thaydoi.bind(this);
    }
    Thaydoi() {
        $("#thaydoi_pwd").removeAttr('readonly');
        $("#thaydoi_pwd").val('');
        this.setState({ temp_btn: 1 })
    }

    Save() {
        var body = {
            username:this.state.username,
            user_id: this.state.user_id,
            nickname: $("#thaydoi_nickname").val(),
            email: $("#thaydoi_email").val(),
            password: $("#thaydoi_pwd").val(),
            status_password: this.state.temp_btn,
        }
        axios({
            method: 'post',
            url: "/Thongtin/save",
            data: stringify(body),
        })
            .then((res) => {
                this.setState({ error_alert: res.data })
                if(res.data===4)
                {
                    axios.get('users/serverlogout')
                    .then((res)=>{
                        window.location.href="/";
                    })
                }
            })
    }
    componentWillMount() {
        axios.get('serverThongtin')
            .then((res) => {
                console.log(res.data)
                this.setState({ username: res.data.ten_dangnhap, nickname: res.data.ten_hienthi, email: res.data.email, user_id: res.data.id })
                $("#thaydoi_nickname").val(res.data.ten_hienthi);
                $("#thaydoi_email").val(res.data.email);
                $("#thaydoi_pwd").val(this.state.password);
            })
    }
    render() {
        let Alert_Error, Thongtin;
        if (this.state.temp_thongtin === 0) {
            Thongtin = (
                <div>
                    <span style={{ fontFamily: 'sans-serif', marginLeft: 5 }}>Username:</span> <strong>{this.state.username}</strong>
                    <br />
                    <br />
                    <div className="col-md-4" style={{ height: 260 }}>
                        <div className="form-group">
                            <label htmlFor="email">Nickname:</label>
                            <input type="text" className="form-control" id="thaydoi_nickname" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="pwd">Email:</label>
                            <input type="text" className="form-control" id="thaydoi_email" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="pwd">Password:</label>
                            <input type="password" className="form-control" id="thaydoi_pwd" readonly="true" />
                            <button className="btn btn_thaydoi" onClick={this.Thaydoi}><span className="glyphicon glyphicon-edit" />edit</button>
                        </div>
                    </div>
                    <button type="submit" className=" col-md-2 btn btn-info btnTT_save" onClick={this.Save}>SAVE</button>
                </div>
            )
        }
        if(this.state.temp_thongtin!==0)
        {
            Thongtin=(
                <div >
                 Chúc mừng bạn thay đổi thông tin thành công.
                 <div>
                 <a href="/" className="btn btn-info thongtin_back"><span className="glyphicon glyphicon-circle-arrow-left"></span>Back</a>
                </div>
                </div>
            )
        }
        if (this.state.error_alert === 1) {
            Alert_Error = (
                <div class="alert alert-danger">
                    <strong>(?)</strong> Vui lòng điền đầy đủ thông tin.
             </div>
            )
        }
        if (this.state.error_alert === 2) {
            Alert_Error = (
                <div class="alert alert-danger">
                    <strong>(?)</strong> Email không hợp lệ.
             </div>
            )
        }
        if (this.state.error_alert === 3) {
            Alert_Error = (
                <div class="alert alert-danger">
                    <strong>(?)</strong> Chiều dài password từ 8-15.
             </div>
            )
        }
        return (

            <div >
                <div>
                    {/* noi dung */}
                    <div className="col-md-9" id="content">
                        <div className="panel panel-default">
                            <div className="panel-heading daugia_panle">THÔNG TIN CÁ NHÂN</div>
                            <div className="panel-body panel_thongtin">
                                <div className="col-md-offset-1">
                                    <h2>Thay đổi thông tin người dùng</h2>
                                    {Alert_Error}
                                    {Thongtin}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Thongtin;
