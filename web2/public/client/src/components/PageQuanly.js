import React, { Component } from 'react';
import axios from 'axios';
import $ from 'jquery';
import { stringify } from 'querystring'
class pageQuanly extends Component {

    constructor(props) {
        super(props);
        this.Duyet=this.Duyet.bind(this);
        this.state = {
            producter: [],
            ten_hienthi: "",
            seconds: 0,
            nguoidung: 0,
            address: "",
            hinhanh_max: 0,
            insertphien:[],
        };
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
        });
        $("#qlsp_btn_themsp").click(function (event) {
            $("#qlsp_sanpham").hide();
            $("#qlsp_themsp").show();
        });

    }
    scriptAnh() {
        $("#btn_img1").change(() => {
            var str = "C:/fakepath/";
            str = str.length;
            var filename = $("#btn_img1").val();
            var temp = filename.substring(str);
            $("#img_add_1").attr('src', '/images/sanphammoi/' + temp);
        })

        $("#btn_img2").change(() => {
            var str = "C:/fakepath/";
            str = str.length;
            var filename = $("#btn_img2").val();
            var temp = filename.substring(str);
            $("#img_add_2").attr('src', '/images/sanphammoi/' + temp);
        })

        $("#btn_img3").change(() => {
            var str = "C:/fakepath/";
            str = str.length;
            var filename = $("#btn_img3").val();
            var temp = filename.substring(str);
            $("#img_add_3").attr('src', '/images/sanphammoi/' + temp);
        })

        $("#btn_img4").change(() => {
            var str = "C:/fakepath/";
            str = str.length;
            var filename = $("#btn_img4").val();
            var temp = filename.substring(str);
            $("#img_add_4").attr('src', '/images/sanphammoi/' + temp);
        })
    }
    Save() {
        $("#save").click(() => {
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
            alert(body.img1);
            if (body.gia > 0 && body.tensanpham !== "" && body.mota !== null && body.img1 !== "" && body.img2 !== "" && body.img3 !== "" && body.img4 !== "") {
                // lấy mã hình cao nhất
                axios.get('/serverQuanly/info')
                    .then(res => {
                        var info = {
                            tensanpham: $("#qlsp_tensp").val(),
                            gia: $("#giadau").val(),
                            mota: $("#comment").val(),
                            img1: $("#img_add_1").attr('src'),
                            img2: $("#img_add_2").attr('src'),
                            img3: $("#img_add_3").attr('src'),
                            img4: $("#img_add_4").attr('src'),
                            mlsp: $("#sel1 option:selected").attr('name'),
                            max_hinh_sql: res.data
                        }
                        axios({
                            method: 'post',
                            url: "/serverQuanly/Themsanpham",
                            data: stringify(info),
                        })
                        //Lấy mssp mới thêm vào database
                        axios.get('/serverQuanly/info/mssp')
                        .then(res=>{
                            var info_mssp={
                                mssp:res.data,
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
                            .then(res=>{
                                // lấy anh bỏ vào folder
                                var info_floder={
                                    mssp:res.data,
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
                            })
                        })
                    })
            }
            else 
            {
                alert("Vui lòng nhập đẩy đủ thông tin");
            }
        })
    }

    Duyet(mssp)
    {
        
        var body={
            masp:mssp,
            thoigian_bd:$(".thoigian_bd"+mssp).val(),
            thoigian_kt:$(".thoigian_kt"+mssp).val(),
            giathapnhat:$(".gia"+mssp).text(),
        }
        axios({
            method: 'post',
            url: "/serverQuanly/Duyet",
            data: stringify(body),
        })
        .then(res=>{
            axios.get('/serverQuanly/Duyet/UpdateSanpham/'+mssp)
        })
    }
    tick() {
        this.setState(prevState => ({
            seconds: prevState.seconds + 1
        }));
        axios.get('/users/login')
            .then(res => {
                if (!res.data.id) {
                    window.location.href = "/login";
                }
                if (res.data.id) {
                    if (res.data.nguoidung !== "1") {
                        window.location.href = "/";
                    }
                    this.setState({ ten_hienthi: res.data.ten_hienthi, nguoidung: res.data.nguoidung });
                    axios.get('/serverQuanly')
                        .then(res => {
                            this.setState({ producter: res.data.loaisp,insertphien:res.data.phien })
                        })
                }

            })
            .catch(err => console.log("Error"));
    }
    componentDidMount() {
        this.scriptAnh();
        this.scriptHieuungBtn();
        this.interval = setInterval(() => this.tick(), 1000);
        this.scriptTangGiam();
        this.Save();
    }

    render() {
        var elementSelect = this.state.producter.map((sp, index) => {
            return <option key={index} name={sp.mlsp} class="luachon">{sp.ten_loai} </option>
        })
        var elementPhien=this.state.insertphien.map((sp,index)=>{
            return <tr className="qlsp_table_noidung">
            <td>{index}</td>
            <td><img className="qlsp_anhIndex" src={"/images/sanpham/"+sp.hinhanh+".jpg"} /></td>
            <td>{sp.ten_sp}</td>
            <td className={"gia"+sp.mssp}>{sp.gia}</td>
            <td>{sp.ten_loai}</td>
            <td><input type="text" className={"thoigian_bd"+sp.mssp} value='2018-06-21 14:45:00'/></td>
            <td><input type="text"className={"thoigian_kt"+sp.mssp} value='2018-06-21 15:45:00'/></td>
            <td><button className="text-success" onClick={()=>{this.Duyet(sp.mssp)}}>Duyệt</button></td>
            <td>
                <a href="#"><span className="glyphicon glyphicon-edit text-info" /></a>
                <a href="#"><span className="glyphicon glyphicon-remove text-danger" /></a>
            </td>
        </tr>
        })
        return (
            <div >
                <div>
                    {/* Header */}
                    {/* <HeaderNotImage ten_hienthi={this.state.ten_hienthi} nguoidung={this.state.nguoidung} /> */}
                    {/* end Header*/}
                    {/* <div className="row producter_index"> */}
                        {/* producter */}
                        {/* <Producter loaisp={this.state.producter} /> */}
                        {/* end producter */}
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
                                                <p style={{ marginLeft: 260 }}>20/10/2018 15:20:31</p>
                                                <button className="qlsp_btn btn btn-info" id="qlsp_btn_sanpham"><span className="glyphicon glyphicon-qrcode" /> Sản phẩm</button>
                                                <button className="qlsp_btn btn btn-warning" id="qlsp_btn_themsp"><span className="glyphicon glyphicon-plus" />Thêm sản phẩm mới</button>
                                            </div>
                                        </div>
                                        <div className="qlsp_noidung" id="qlsp_sanpham" hidden="true">
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr className="qlsp_table_header">
                                                        <th>STT</th>
                                                        <th>Ảnh</th>
                                                        <th>Tên sản phẩm</th>
                                                        <th>Giá(K)</th>
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
                                        <div className="qlsp_noidung" id="qlsp_themsp">
                                            <div className="qlsp_left">
                                                <div className="qlsp_image1"><img id="img_add_1" src="" /></div>
                                                <input type="file" name="qlsp" accept="image/*" id="btn_img1" />
                                                <br />
                                                <div className="qlsp_imageChild">
                                                    <ul>
                                                        <li>
                                                            <div className="imageChild" id="img2">
                                                                <img id="img_add_2" src="" />
                                                            </div>
                                                            <input type="file" name="qlsp" accept="image/*" id="btn_img2" />
                                                        </li>
                                                        <li>
                                                            <div className="imageChild" id="img3">
                                                                <img id="img_add_3" src="" />
                                                            </div>
                                                            <input type="file" name="qlsp" accept="image/*" id="btn_img3" />
                                                        </li>
                                                        <li>
                                                            <div className="imageChild" id="img4">
                                                                <img id="img_add_4" src="" />
                                                            </div>
                                                            <input type="file" name="qlsp" accept="image/*" id="btn_img4" />
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
                                                                <input type="text" name="quant[1]" className="form-control input-number qlsp_tiendau" id="giadau" min={0} max={100} />
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
                                            <button className="btn btn-danger" id="save">Save</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* end noi dung */}
                    {/* </div> */}
                    {/* footer */}
                    {/* <Footer /> */}
                </div>
            </div>
        );
    }
}
export default pageQuanly;
