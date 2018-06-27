import React, { Component } from 'react';
import axios from 'axios';
import $ from 'jquery';
class pageDaugia extends Component {

    constructor(props) {
        super(props);
        this.state = {
            daugiacuatoi: [],
            seconds: 0,
            dauthang: [],
            dauthua: [],
        };
    }
    scriptHieuungBtn() {
        $("#btn_hientai").click(function () {
            $(".daugiacuatui_table").show();
            $(".daugiadathang_table").hide();
            $(".daugiathua_table").hide();
        });

        $("#btn_dathang").click(function () {
            $(".daugiadathang_table").show();
            $(".daugiacuatui_table").hide();
            $(".daugiathua_table").hide();
        });

        $("#btn_dathua").click(function () {
            $(".daugiathua_table").show();
            $(".daugiacuatui_table").hide();
            $(".daugiadathang_table").hide();
        });
    }
    tick() {
        this.setState(prevState => ({
            seconds: prevState.seconds + 1
        }));
        axios.get('/serverDaugiacuatoi')
            .then(res => {
                this.setState({ daugiacuatoi: res.data.daugia, dauthang: res.data.dauthang, dauthua: res.data.dauthua })
            })
            .catch(err => console.log("Error"));
    }
    componentDidMount() {
        this.scriptHieuungBtn();
        this.interval = setInterval(() => this.tick(), 1000);
    }

    render() {
        var elementDaugia = this.state.daugiacuatoi.map((sp, index) => {
            return <tr>
                {sp.ms_tinhtrang == 1 ?
                    <td><img src="/images/bieutuong/check.png" /></td> :
                    <td> <img src="/images/bieutuong/nocheck.png" alt="Canvas Logo" /></td>
                }
                <td>
                    <a href={"/Detail/phien="+sp.ms_phien+"/id="+sp.mssp}>{sp.ten_sp}[{sp.ms_phien}]</a>
                      <p>{sp.gia_hientai}K</p>
                </td>
                <td><br /><p>{sp.gia_thapnhat}K</p></td>
                <td><br />{sp.thoigian_lap}</td>
            </tr>
        });
        var elementDauthang = this.state.dauthang.map((sp, index) => {
            return <tr>
                <td>
                    <img src="/images/bieutuong/check.png" /></td>
                <td>
                    <a href={"/Detail/phien="+sp.ms_phien+"/id="+sp.mssp}>{sp.ten_sp}[{sp.ms_phien}]</a>
                      <p>{sp.gia_hientai}K</p>
                </td>
                <td><br /><p>{sp.gia_thapnhat}K</p></td>
                <td><br />{sp.thoigiandau}</td>
            </tr>
        });
        var elementDauthua = this.state.dauthua.map((sp, index) => {
            return <tr>
                <td>
                    <img src="/images/bieutuong/nocheck.png" /></td>
                <td>
                    <a href={"/Detail/phien="+sp.ms_phien+"/id="+sp.mssp}>{sp.ten_sp}[{sp.ms_phien}]</a>
                      <p>{sp.gia_hientai}K</p>
                </td>
                <td><br /><p>{sp.gia_thapnhat}K</p></td>
                <td><br />{sp.thoigiandau}</td>
            </tr>
        });
        return (

            <div >
                <div>
                    {/* noi dung */}
                    <div className="col-md-9" id="content">
                        <div className="panel panel-default">
                            <div className="panel-heading daugia_panle">Đấu giá của tôi</div>
                            <div className="panel-body">
                                <div className="row">
                                    <div className="index_daugiacuatoi">
                                        <div className="daugiacuatui_btn" />
                                        <div className="btn-group">
                                            <button type="button" className="btn btn-default" id="btn_hientai">Đấu giá hiện tại</button>
                                            <button type="button" className="btn btn-default " id="btn_dathang">Đấu giá đã thắng</button>
                                            <button type="button" className="btn btn-default" id="btn_dathua">Đấu giá thua</button>
                                        </div>
                                        <div className="daugiacuatui_table ">
                                            <table className="table table-condensed">
                                                <thead>
                                                    <tr>
                                                        <th>Trạng thái</th>
                                                        <th>Giá hiện tại của bạn</th>
                                                        <th>Giá thầu</th>
                                                        <th>Hoàn thành</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {elementDaugia}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="daugiadathang_table " hidden="true">
                                            <table className="table table-condensed">
                                                <thead>
                                                    <tr>
                                                        <th>Trạng thái</th>
                                                        <th>Giá thắng của bạn</th>
                                                        <th>Giá thầu</th>
                                                        <th>Hoàn thành</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {elementDauthang}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="daugiathua_table " hidden="true">
                                            <table className="table table-condensed">
                                                <thead>
                                                    <tr>
                                                        <th>Trạng thái</th>
                                                        <th>Giá thầu tối đa của bạn</th>
                                                        <th>Giá thầu</th>
                                                        <th>Hoàn thành</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {elementDauthua}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* end noi dung */}
                </div>
            </div>
        );
    }
}

export default pageDaugia;
