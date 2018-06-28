import React, { Component } from 'react';
import axios from 'axios';
import $ from 'jquery';
import { stringify } from 'querystring'
import monent from 'moment';
class pageQuanly extends Component {
    constructor(props) {
        super(props);
        this.Duyet = this.Duyet.bind(this);
        this.Remove = this.Remove.bind(this);
        this.Update = this.Update.bind(this);
        this.UpdateSave = this.UpdateSave.bind(this);
        this.Xacnhan = this.Xacnhan.bind(this);
        this.state = {
            producter: [],
            ten_hienthi: "",
            seconds: 0,
            nguoidung: 0,
            address: "",
            hinhanh_max: 0,
            insertphien: [],
            mssp_moi: 0,
            value_datebd:"",
            value_datekt:"",
            thoigian_header:"",
            btn_update: 0,
            alert_thongso: 0,
            khoangthoigian:0,
        };
        
        this.Save = this.Save.bind(this);

    }
    scriptTangGiam() {
        $('.btn-number').click(function (e) {
            e.preventDefault();

            var fieldName = $(this).attr('data-field');
            var type = $(this).attr('data-type');
            var input = $("input[name='" + fieldName + "']");
            var currentVal = parseInt(input.val());
            if (!isNaN(currentVal)) {
                if (type === 'minus') {

                    if (currentVal > input.attr('min')) {
                        input.val(currentVal - 1).change();
                    }
                    if (parseInt(input.val()) == input.attr('min')) {
                        $(this).attr('disabled', true);
                    }

                } else if (type == 'plus') {

                    if (currentVal < input.attr('max')) {
                        input.val(currentVal + 1).change();
                    }
                    if (parseInt(input.val()) == input.attr('max')) {
                        $(this).attr('disabled', true);
                    }

                }
            } else {
                input.val(0);
            }
        });
        $('.input-number').focusin(function () {
            $(this).data('oldValue', $(this).val());
        });
        $('.input-number').change(function () {

            var minValue = parseInt($(this).attr('min'));
            var maxValue = parseInt($(this).attr('max'));
            var valueCurrent = parseInt($(this).val());

            var name = $(this).attr('name');
            if (valueCurrent >= minValue) {
                $(".btn-number[data-type='minus'][data-field='" + name + "']").removeAttr('disabled')
            } else {
                alert('Sorry, the minimum value was reached');
                $(this).val($(this).data('oldValue'));
            }
            if (valueCurrent <= maxValue) {
                $(".btn-number[data-type='plus'][data-field='" + name + "']").removeAttr('disabled')
            } else {
                alert('Sorry, the maximum value was reached');
                $(this).val($(this).data('oldValue'));
            }


        });
        $(".input-number").keydown(function (e) {
            // Allow: backspace, delete, tab, escape, enter and .
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
                // Allow: Ctrl+A
                (e.keyCode == 65 && e.ctrlKey === true) ||
                // Allow: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                // let it happen, don't do anything
                return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });
        // end nut tang giam

    }
    scriptHieuungBtn() {
        $("#qlsp_btn_sanpham").click(function (event) {
            $("#qlsp_sanpham").show();
            $("#qlsp_themsp").hide();
            $("#qlsp_thongso").hide();
        });
        $("#qlsp_btn_themsp").click(function (event) {
            $("#qlsp_sanpham").hide();
            $("#qlsp_thongso").hide();
            $("#qlsp_themsp").show();
        });
        $("#qlsp_btn_thongso").click(function (event) {
            $("#qlsp_sanpham").hide();
            $("#qlsp_themsp").hide();
            $("#qlsp_thongso").show();
        });
    }
    scriptAnh() {
        $("#btn_img1").change(function () {
            var str = "C:/fakepath/";
            str = str.length;
            if ($("#btn_img1").val() !== $("#btn_img2").val() && $("#btn_img1").val() !== $("#btn_img3").val() && $("#btn_img1").val() !== $("#btn_img4").val()) {
                var filename = $("#btn_img1").val();
                var temp = filename.substring(str);
                $("#img_add_1").attr('src', '/images/sanphammoi/' + temp);
                $('.alert_error_image1').html("");
            }
            else {
                $('.alert_error_image1').html("File ảnh này đã được sử dụng rồi");
                $("#img_add_1").attr('src', '');
            }
        })

        $("#btn_img2").change(function () {
            var str = "C:/fakepath/";
            str = str.length;
            if ($("#btn_img2").val() !== $("#btn_img1").val() && $("#btn_img2").val() !== $("#btn_img3").val() && $("#btn_img2").val() !== $("#btn_img4").val()) {
                var filename = $("#btn_img2").val();
                var temp = filename.substring(str);
                $("#img_add_2").attr('src', '/images/sanphammoi/' + temp);
                $('.alert_error_image2').html("");
            }
            else {
                $('.alert_error_image2').html("existed");
                $("#img_add_2").attr('src', '');
            }
        })

        $("#btn_img3").change(function () {
            var str = "C:/fakepath/";
            str = str.length;
            if ($("#btn_img3").val() !== $("#btn_img1").val() && $("#btn_img3").val() !== $("#btn_img2").val() && $("#btn_img3").val() !== $("#btn_img4").val()) {
                var filename = $("#btn_img3").val();
                var temp = filename.substring(str);
                $("#img_add_3").attr('src', '/images/sanphammoi/' + temp);
                $('.alert_error_image3').html("");
            }
            else {
                $('.alert_error_image3').html("existed");
                $("#img_add_3").attr('src', '');
            }
        })

        $("#btn_img4").change(() => {
            var str = "C:/fakepath/";
            str = str.length;
            if ($("#btn_img4").val() !== $("#btn_img1").val() && $("#btn_img4").val() !== $("#btn_img2").val() && $("#btn_img4").val() !== $("#btn_img3").val()) {
                var filename = $("#btn_img4").val();
                var temp = filename.substring(str);
                $("#img_add_4").attr('src', '/images/sanphammoi/' + temp);
                $('.alert_error_image4').html("");
            }
            else {
                $('.alert_error_image4').html("existed");
                $("#img_add_4").attr('src', '');
            }
        })
    }
    Save() {
        var body = {
            tensanpham: $("#qlsp_tensp").val(),
            gia: $("#giadau").val(),
            mota: $("#comment").val(),
            img1: $("#img_add_1").attr('src'),
            img2: $("#img_add_2").attr('src'),
            img3: $("#img_add_3").attr('src'),
            img4: $("#img_add_4").attr('src'),
            mlsp: $("#sel1 option:selected").attr('name'),
            max_hinh_sql: this.state.hinhanh_max
        }
        if (body.gia > 0 && body.tensanpham !== "" && body.mota !== null && body.img1 !== "" && body.img2 !== "" && body.img3 !== "" && body.img4 !== "") {
            // lấy mã hình cao nhất
            axios({
                method: 'post',
                url: "/serverQuanly/Themsanpham",
                data: stringify(body),
            })
            //Lấy mssp mới thêm vào database
            axios.get('/serverQuanly/info/mssp')
                .then(res => {
                    this.setState({ mssp_moi: res.data })
                    var info_mssp = {
                        mssp: res.data,
                        img1: $("#img_add_1").attr('src'),
                        img2: $("#img_add_2").attr('src'),
                        img3: $("#img_add_3").attr('src'),
                        img4: $("#img_add_4").attr('src'),
                    }
                    // Thêm ảnh hình vào database
                    axios({
                        method: 'post',
                        url: "/serverQuanly/Themsanpham/Hinh",
                        data: stringify(info_mssp),
                    })
                        .then(res => {
                            // lấy anh bỏ vào folder and lấy mã anh thấp nhất trong số hình mới thêm vào
                            this.setState({ mssp_moi: res.data });
                            var info_floder = {
                                mssp: res.data,
                                img1: $("#img_add_1").attr('src'),
                                img2: $("#img_add_2").attr('src'),
                                img3: $("#img_add_3").attr('src'),
                                img4: $("#img_add_4").attr('src'),
                            }
                            axios({
                                method: 'post',
                                url: "/serverQuanly/Themsanpham/Folder",
                                data: stringify(info_floder),
                            })
                                .then((res) => {
                                    var body_updateHinh_index =
                                    {
                                        mssp: this.state.mssp_moi,
                                        mahinh: res.data
                                    }
                                    axios({
                                        method: 'post',
                                        url: "/serverQuanly/Themsanpham/updateHinh",
                                        data: stringify(body_updateHinh_index),
                                    })
                                        .then((res) => {
                                            if (res.data === 1) {
                                                $("#qlsp_tensp").val("");
                                                $("#giadau").val(0);
                                                $("#comment").val("");
                                                $("#img_add_1").attr({ 'src': '' });
                                                $("#img_add_2").attr({ 'src': '' });
                                                $("#img_add_3").attr({ 'src': '' });
                                                $("#img_add_4").attr({ 'src': '' });

                                            }
                                        })
                                })
                        })
                })

        }
        else {
            alert("Vui lòng nhập đẩy đủ thông tin");
        }
    }
    Remove(mssp) {
        axios.put('/serverQuanly/remmoveProduct', { mssp: mssp })
    }
    Update(mssp) {
        this.setState({ btn_update: 1 })
    }
    UpdateSave(mssp) {
        this.setState({ btn_update: 0 })
        var body = {
            mssp: mssp,
            ten_sp: $('#ql_updateTen').val(),
            gia_sp: $('#ql_updateGia').val(),
            mota: $('#ql_updateMota').val()
        }
        axios.put('/serverQuanly/updateProduct', body)
    }
    Duyet(mssp) {
        var thoigian_bd = $('input[date_bd=' + mssp + ']').val();
        var thoigian_kt = $('input[date_kt=' + mssp + ']').val();
        var tempDate_bd = thoigian_bd.substring(0, 10);
        var tempTime_bd = thoigian_bd.substring(11, 16);
        var tempDate_kt = thoigian_kt.substring(0, 10);
        var tempTime_kt = thoigian_kt.substring(11, 16);
        thoigian_bd = tempDate_bd + " " + tempTime_bd + ":00";
        thoigian_kt = tempDate_kt + " " + tempTime_kt + ":00";
        var body = {
            masp: mssp,
            thoigian_bd: thoigian_bd,
            thoigian_kt: thoigian_kt,
            giathapnhat: $(".gia" + mssp).text(),
        }
        axios({
            method: 'post',
            url: "/serverQuanly/Duyet",
            data: stringify(body),
        })
            .then(res => {
                axios.get('/serverQuanly/Duyet/UpdateSanpham/' + mssp)
            })
            .then((res) => {
                return 1;
            })
    }

    Xacnhan() {
        alert(this.state.khoangthoigian);
        var body = {
            ketthucphien: $('#ketthucphien').val(),
            motphiendau: $('#motphiendau').val(),
            phantramdau: $('#phantramdau').val()
        }
        axios.put('/serverQuanly/UpdateThongso', body)
            .then((res) => {
                if (res.data === 1) {
                    this.setState({ alert_thongso: 1 });
                }
            });
    }
    tick() {
        this.setState(prevState => ({
            seconds: prevState.seconds + 1
        }));
        axios.get('/users/login')
            .then(res => {
                if (!res.data.id) {
                    window.location.href = "/";
                }
                if (res.data.id) {
                    if (res.data.nguoidung !== "1") {
                        window.location.href = "/";
                    }
                    this.setState({ nguoidung: res.data.nguoidung });
                    axios.get('/serverQuanly')
                        .then(res => {
                            this.setState({ producter: res.data.loaisp, insertphien: res.data.phien,khoangthoigian:res.data.thongso[1].giatri })
                            $('#motphiendau option[value=' + res.data.thongso[1].giatri + '] ').attr('selected', 'selected');
                            $('#ketthucphien option[value=' + res.data.thongso[0].giatri + '] ').attr('selected', 'selected');
                            $('#phantramdau option[value=' + res.data.thongso[2].giatri + ']').attr('selected', 'selected');
                        })
                }
                this.setState({ thoigian_header: monent().format('MMMM Do YYYY, h:mm:ss a') });
            })
            .catch(err => console.log("Error"));
    }
    AlertThonso(){
        if(this.state.alert_thongso===1)
        {
            this.setState({alert_thongso:0})
        }
    }
    componentDidMount() {
        this.scriptAnh();
        this.scriptHieuungBtn();
        setInterval(()=>this.AlertThonso(),5000);
        this.interval = setInterval(() => this.tick(), 1000);
        this.scriptTangGiam(); 

        function zeroPad(num, places) {
            var zero = places - num.toString().length + 1;
            return Array(+(zero > 0 && zero)).join("0") + num;
        } 
        var khoangthoigian = 7;
        var date = new Date();
        date.setMonth(date.getMonth() + 1);
        var thoigian_bd = zeroPad(monent().hours(), 2) + ":" + zeroPad(monent().minutes(), 2);
        var thoigian_kt = zeroPad(monent().add(khoangthoigian, 'hours').hours(), 2) + ":" + zeroPad(monent().add(khoangthoigian, 'hours').minutes(), 2);
        var thoigianBD = date.getFullYear() + "-" + zeroPad(date.getMonth(), 2) + "-" + zeroPad(monent().dates(), 2) + 'T' + thoigian_bd;
        var thoigianKT = monent().add(khoangthoigian, 'hours').years() + "-" + zeroPad(monent().add(khoangthoigian, 'hours').month() + 1, 2) + "-" + zeroPad(monent().add(khoangthoigian, 'hours').dates(), 2) + 'T' + thoigian_kt;
        var thoigian_header = monent().format('MMMM Do YYYY, h:mm:ss a');
        this.setState({value_datebd:thoigianBD,value_datekt:thoigianKT,thoigian_header:thoigian_header});
    }
    render() {
        let elementThongso;
        if (this.state.alert_thongso === 1) {
            elementThongso = (
                <div class="alert alert-success">
                    <strong>Success!</strong>Chúc mừng bạn update thành công.
                </div>
            )
        }
        var elementSelect = this.state.producter.map((sp, index) => {
            return <option key={index} name={sp.mlsp} className="luachon">{sp.ten_loai} </option>
        })
        var elementPhien = this.state.insertphien.map((sp, index) => {
            return <tr className="qlsp_table_noidung" key={index}>
                <td>{index}</td>
                <td><img className="qlsp_anhIndex" src={"/images/sanpham/" + sp.hinhanh + ".jpg"} /></td>
                {/* ten sp */}
                {this.state.btn_update == 0 ?
                    <td>{sp.ten_sp}</td> : <td><input className='quanly_tensp' id="ql_updateTen" type='text' defaultValue={sp.ten_sp} /></td>
                }
                {/* giá */}
                {this.state.btn_update == 0 ?
                    <td className={"gia" + sp.mssp}>{sp.gia}</td> : <td><input className='quanly_giasp' id="ql_updateGia" type='number' defaultValue={sp.gia} /></td>
                }
                {/* Mô tả */}
                <td><a data-toggle="modal" data-target="#modalMota">Link</a></td>
                <div className="modal fade" id="modalMota" role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                                <h4 className="modal-title">Mô tả</h4>
                            </div>
                            <div className="modal-body">
                                {this.state.btn_update == 0 ? <textarea className="form-control" rows={5} value={sp.dacta} /> :
                                    <textarea className="form-control" rows={5} id="ql_updateMota" defaultValue={sp.dacta} />
                                }
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">Ok</button>
                            </div>
                        </div>

                    </div>
                </div>
                {/* end mo ta */}
                <td>{sp.ten_loai}</td>
                <td><input type="datetime-local" date_bd={sp.mssp} defaultValue={this.state.value_datebd} className="thoigianBD" />
                </td>
                <td><input type="datetime-local" date_kt={sp.mssp} defaultValue={this.state.value_datekt} className="thoigianKT" />
                </td>
                {/* Duyệt */}
                {this.state.btn_update == 0 ? <td><button className="text-success" onClick={() => { this.Duyet(sp.mssp) }}>Duyệt</button></td> :
                    <td><button className="text-danger" disabled onClick={() => { this.Duyet(sp.mssp) }}>Duyệt</button></td>
                }

                <td>
                    {this.state.btn_update == 0 ? <a onClick={() => { this.Update(sp.mssp) }}><span className="glyphicon glyphicon-edit text-info" /></a> :
                        <a onClick={() => { this.UpdateSave(sp.mssp) }}><span className="glyphicon glyphicon-save text-info" /></a>
                    }
                    <a onClick={() => { this.Remove(sp.mssp) }}><span className="glyphicon glyphicon-remove text-danger" /></a>
                </td>
            </tr>
        })
        return (
            <div >
                <div>
                    {/* noi dung */}
                    <div className="col-md-9" id="content">
                        <div className="panel panel-default">
                            <div className="panel-heading daugia_panle">Đấu giá của tôi</div>
                            <div className="panel-body">
                                <div className="col-md-12">
                                    <div className="qlsp_header">
                                        <a className="navbar-brand" href="#">
                                            <span className="w3-tag w3-jumbo w3-red">T</span>
                                            <span className="w3-tag w3-jumbo">E</span>
                                            <span className="w3-tag w3-jumbo w3-yellow">A</span>
                                            <span className="w3-tag w3-jumbo">M</span>
                                            <p style={{ fontSize: '8pt' }}>Luôn đồng hành với người dùng</p>
                                        </a>
                                        <div className="qlsp_nutbam">
                                            <p style={{ marginLeft: 410 }}>{this.state.thoigian_header}</p>
                                            <button className="qlsp_btn btn btn-success" id="qlsp_btn_thongso"><span className="glyphicon glyphicon-cd" />Thông số</button>
                                            <button className="qlsp_btn btn btn-info" id="qlsp_btn_sanpham"><span className="glyphicon glyphicon-qrcode" /> Sản phẩm</button>
                                            <button className="qlsp_btn btn btn-warning" id="qlsp_btn_themsp"><span className="glyphicon glyphicon-plus" />Thêm sản phẩm mới</button>
                                        </div>
                                    </div>
                                    {/* Quan lý thông số */}
                                    <div className="qlsp_noidung" id="qlsp_thongso" hidden="true">
                                    {elementThongso}
                                        <h3><strong>CÀI ĐẶT THÔNG SỐ</strong></h3>
                                        <div>
                                            <h5>1.Thời gian chờ khi kết thúc phiên(Endding)</h5>
                                            <label >Thời gian (s):</label>
                                            <select id="ketthucphien" className="form-control">
                                                <option value='5'>5</option>
                                                <option value='10'>10</option>
                                                <option value='15'>15</option>
                                                <option value='20'>20</option>
                                            </select>
                                        </div>
                                        <div>
                                            <h5>2.Khoảng thời gian mặc định của một phiên đấu</h5>
                                            <label >Thời gian (h):</label>
                                            <select className="form-control" id="motphiendau">
                                                <option value='3'>3</option>
                                                <option value='7'>7</option>
                                                <option value='12'>12</option>
                                                <option value='24'>24</option>
                                            </select>
                                        </div>
                                        <div>
                                            <h5>3.Phần trăm giá đấu</h5>
                                            <label >Phần trăm (%):</label>
                                            <select className="form-control" id="phantramdau">
                                                <option value='2'>2</option>
                                                <option value='4'>4</option>
                                                <option value='7'>7</option>
                                                <option value='10'>10</option>
                                            </select>
                                        </div>
                                        <button className="btn btn-danger btn_xacnhan" onClick={() => { this.Xacnhan() }}>Xác nhận</button>
                                    </div>
                                    {/* San phẩm */}
                                    <div className="qlsp_noidung" id="qlsp_sanpham" hidden="true">
                                        <table className="table table-striped">
                                            <thead>
                                                <tr className="qlsp_table_header">
                                                    <th>STT</th>
                                                    <th>Ảnh</th>
                                                    <th>Tên sản phẩm</th>
                                                    <th>Giá(K)</th>
                                                    <th>Mô tả</th>
                                                    <th>Danh mục</th>
                                                    <th>Thời gian đấu</th>
                                                    <th>Thời gian kết thúc</th>
                                                    <th>TT duyệt</th>
                                                    <th>Thao tác</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {elementPhien}
                                            </tbody>
                                        </table>
                                    </div>
                                    {/* thêm Sản phầm */}
                                    <div className="qlsp_noidung" id="qlsp_themsp">
                                        <div className="qlsp_left">
                                            <div className="qlsp_image1"><img id="img_add_1" src="" /><span className="alert_error_image1" /></div>
                                            <input type="file" name="qlsp" accept='.jpg' id="btn_img1" multiple />
                                            <br />
                                            <div className="qlsp_imageChild">
                                                <ul>
                                                    <li>
                                                        <div className="imageChild" id="img2">
                                                            <img id="img_add_2" src="" />
                                                            <span className="alert_error_image2" />
                                                        </div>
                                                        <input type="file" name="qlsp" accept=".jpg" id="btn_img2" />
                                                    </li>
                                                    <li>
                                                        <div className="imageChild" id="img3">
                                                            <img id="img_add_3" src="" />
                                                            <span className="alert_error_image3" />
                                                        </div>
                                                        <input type="file" name="qlsp" accept=".jpg" id="btn_img3" />
                                                    </li>
                                                    <li>
                                                        <div className="imageChild" id="img4">
                                                            <img id="img_add_4" src="" />
                                                            <span className="alert_error_image4" />
                                                        </div>
                                                        <input type="file" name="qlsp" accept=".jpg" id="btn_img4" />
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="qlsp_right">
                                            <h3><strong>SẢN PHẨM MỚI</strong></h3>
                                            <ul>
                                                <li className="select_danhmuc">
                                                    <label htmlFor="sel1">Loại sản phẩm:</label>
                                                    <select className="form-control danhmuc" id="sel1">
                                                        {elementSelect}
                                                    </select>
                                                </li>
                                                <li>
                                                    <label>Tên sản phẩm :</label>
                                                    <br />
                                                    <input type="text" id="qlsp_tensp" />
                                                </li>
                                                <li>
                                                    <label>Giá:(K)</label>
                                                    <br />
                                                    <div className="qlsp_btn_tanggiam">
                                                        <div className="input-group">
                                                            <span className="input-group-btn">
                                                                <button type="button" className="btn btn-default btn-number" disabled="disabled" data-type="minus" data-field="quant[1]">
                                                                    <span className="glyphicon glyphicon-minus" />
                                                                </button>
                                                            </span>
                                                            <input type="text" name="quant[1]" className="form-control input-number qlsp_tiendau" id="giadau" placeholder='0' min={0} max={10000000} />
                                                            <span className="input-group-btn">
                                                                <button type="button" className="btn btn-default btn-number qlsp_btn_plus" data-type="plus" data-field="quant[1]">
                                                                    <span className="glyphicon glyphicon-plus" />
                                                                </button>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </li>
                                                <label htmlFor="comment">Mô tả:</label>
                                                <textarea className="form-control mota" rows={5} id="comment" defaultValue={""} />
                                            </ul>
                                        </div>
                                        <button className="btn btn-danger" id="save" onClick={this.Save}>Save</button>
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
export default pageQuanly;
