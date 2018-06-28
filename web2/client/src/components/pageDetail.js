import React, { Component } from 'react';
import axios from 'axios';
import $ from 'jquery';
import { stringify } from 'querystring';
import Clock1 from './clockDetail';
class pageDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arraySanpham: [],
      slideIndex: 1,
      arrayHinh: [],
      imageIndex: 0,
      tempTen: [],
      tensp: "",
      ms_phien: "",
      taikhoan: "",
      check: "",
      giadau_min: 1,
      phieuthang: "",
      tinhtrang_duocDauTiep: "",//Nếu mà ms_tìnhtrang là 1 thì người đó đã đấu với giá cao nhất rồi nên k cần đấu tiếp Ngược lại thì được phép đau
      seconds: 0,
      giadau_hientai: "",
      userWin: "",
      tempDathang: 0,
      tempThanhcong: 0,
      tempHetgio: 0,
      ketqua: 0,
      nguoidung: 0,
      user_id: 0,
    };
    this.Daugia = this.Daugia.bind(this);
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
  scriptHieuUngBtn() {
    $("#giaohang1").click(function (event) {
      $("#hoantra").attr({
        class: 'collapse out',
      });
      $("#tien").attr({
        class: 'collapse out',
      });
    });

    $("#hoantra1").click(function (event) {
      $("#giaohang").attr({
        class: 'collapse out',
      });
      $("#tien").attr({
        class: 'collapse out',
      });
    });

    $("#tien1").click(function (event) {
      $("#hoantra").attr({
        class: 'collapse out',
      });
      $("#giaohang").attr({
        class: 'collapse out',
      });
    });

    $("#chitiet1").click(function (event) {
      $("#FAQ").attr({
        class: 'collapse out'
      });
    });

    $("#FAQ1").click(function (event) {
      $("#chitiet").attr({
        class: 'collapse out'
      });
    });
  }
  plusSlides(num) {
    var dots = document.getElementsByClassName("demo");
    var pageImage_max = Number(this.state.imageIndex) + 3;
    var pageImage_min = Number(this.state.imageIndex);
    var num_file = '/image/sanpham/'.length + 1;
    var num_duoifile = '.jpg'.length;
    var string_image = $(".imagesProduct").attr('src');
    var str = string_image.substr(num_file);
    var result = (Number(str.split('.', 1)) + num);
    if (result < pageImage_min) {
      result = pageImage_max;
    }
    if (result > pageImage_max) {
      result = pageImage_min;
    }
    $('.imagesProduct').attr({
      'src': '/images/sanpham/' + result + '.jpg'
    })
    for (var i = 0; i < 4; i++) {
      dots[i].classList.remove("active");
    }
    for (var i = 0; i < 4; i++) {
      if (dots[i].getAttribute('src') === $('.imagesProduct').attr('src')) {
        dots[i].className += " active";
      }
    }
  }
  currentSlide(ms_hinh, index) {
    var dots = document.getElementsByClassName("demo");
    $('.imagesProduct').attr({
      'src': '/images/sanpham/' + ms_hinh + '.jpg'
    })

    for (var i = 0; i < 4; i++) {
      dots[i].classList.remove("active");
    }
    dots[index].className += " active";
  }
  Daugia() {
    // Check user có trong phếu đấu chưa nếu rồi trà về 1 chưa trả về 0
    axios.get('/Detail/checkUserInPhien/phien=' + this.state.ms_phien + '/id=' + this.state.user_id)
      .then((res) => {
        if (res.data === 0) {
          // Insert 1 phiếu đấu
          var body = {
            giadau: this.refs.giadau.value,
            taikhoan: this.state.user_id,
            ms_phien: this.state.ms_phien,
            status: 0
          }
          axios({
            method: 'post',
            url: "/Detail/Daugiangay",
            data: stringify(body),
          })
            .then((res) => {
              // Sau khi đấu giá cần phải update lại giá hiện tại và mã phiếu thắng trong phien_daugia
              var body_updatePhien = {
                phien: res.data.phieudau[0].ms_phien,
                phieu: res.data.phieudau[0].ms_phieu,
                giadau: res.data.phieudau[0].giadau,
              }
              axios({
                method: 'put',
                url: "/Detail/Daugiangay",
                data: stringify(body_updatePhien),
              })
            })
          this.setState({ tempThanhcong: 1 });
        }
        if (res.data === 1) {
          // Update phieu đấu
          var date=new Date();
          var body = {
            giadau: this.refs.giadau.value,
            taikhoan: this.state.user_id,
            ms_phien: this.state.ms_phien,
            status: 1
          }
          axios({
            method: 'post',
            url: "/Detail/Daugiangay",
            data: stringify(body),
          })
            .then((res) => {
              var body_updatePhien = {
                phien: res.data.phieudau[0].ms_phien,
                phieu: res.data.phieudau[0].ms_phieu,
                giadau: res.data.phieudau[0].giadau,
              }
              axios({
                method: 'put',
                url: "/Detail/Daugiangay",
                data: stringify(body_updatePhien),
              })
            })
          this.setState({ tempThanhcong: 1 });
        }
        if (res.data === -1) {
          this.setState({ tempDathang: 1 })
        }
        if (res.data === 2) {
          this.setState({ tempHetgio: 1 })
        }
      })
      .catch(err => console.log("Error"));
  }
  tick() {
    this.setState(prevState => ({
      seconds: prevState.seconds + 1
    }));
    axios.get('/serverDetail/phien=' + this.props.match.params.phien + '/id=' + this.props.match.params.id)
      .then(res => {
        this.setState({
          arraySanpham: res.data.sanpham,
          arrayHinh: res.data.hinh,
          imageIndex: res.data.sanpham[0].hinhanh,
          tempTen: res.data.sanpham,
          ms_phien: res.data.sanpham[0].ms_phien,
          giadau_hientai: res.data.sanpham[0].gia_hientai,
          ketqua: res.data.ketqua,
          user_id: res.data.user_id,
        })
        if (res.data.userWin[0]) {
          this.setState({
            userWin: res.data.userWin[0].ten_hienthi
          })
        }
        if (!res.data.userWin[0]) {
          this.setState({
            userWin: ""
          })
        }
        // Gán giá trị nếu đầu zô mà input giá đấu không có 
        if (!this.refs.giadau.value) {
          if (res.data.giadau[0].max === null) {
            this.setState({ giadau_min: 1 });
            this.refs.giadau.value = 1;
          }
          if (res.data.giadau[0].max !== null) {
            this.setState({ giadau_min: Math.ceil(res.data.giadau[0].max + res.data.giadau[0].max*0.04) });
            this.refs.giadau.value = Math.ceil(res.data.giadau[0].max + res.data.giadau[0].max*0.04);
          }
        }
        // K gán khi giá trị tồn tại
        if (this.refs.giadau.value) {
          // Nếu giá trị thẻ input giá đấu mà nhỏ hơn hoặc bằng thì mới gán .Trường hợp còn lại thì cho người dùng nhập
          if (this.refs.giadau.value <= res.data.giadau[0].max) {
            // Nếu phiếu đấu chưa tổn tại
            if (res.data.giadau[0].max === null) {
              this.setState({ giadau_min: 1 });
              this.refs.giadau.value = 1;
            }
            //Nếu phiếu đâu tồn tại
            if (res.data.giadau[0].max != null) {
              this.setState({ giadau_min: Math.ceil(res.data.giadau[0].max + res.data.giadau[0].max*0.04) });
              this.refs.giadau.value = Math.ceil(res.data.giadau[0].max + res.data.giadau[0].max*0.04);
            }
          }
        }
        this.setState({ tensp: this.state.tempTen[0].ten_sp });
      })
  }
  autoThongbao() {
    if (this.state.tempDathang === 1) {
      this.setState({ tempDathang: 0 })
    }
    if (this.state.tempThanhcong === 1) { 
      this.setState({ tempThanhcong: 0 })
    }
    if (this.state.tempHetgio === 1) {
      this.setState({ tempHetgio: 0 })
    }
  }
  componentDidMount() {
    setInterval(() => this.autoThongbao(),1000*5)
    this.interval = setInterval(() => this.tick(), 1000);
    this.scriptHieuUngBtn();
    this.scriptTangGiam();
  }
  render() {
    let Message, MessageEnd, Daugiangay;
    if (this.state.user_id !== 0) {
      Daugiangay = (
        <div><button className="btn_daugia" onClick={this.Daugia}>Đấu giá ngay</button></div>
      )
    }
    if (this.state.user_id === 0) {
      Daugiangay = (
        <div>
        <button className="btn_daugia" data-toggle="modal" data-target=".login-register-form">
        <span className="glyphicon glyphicon-user" />Đấu giá ngay
        </button>
        </div>
      )
    }

    if (this.state.tempDathang === 1) {
      Message = (
        <div className="alert alert-danger daucaonhat">
          Bạn đang là người có giá đấu cao nhất.
        </div>
      )
    }
    if (this.state.tempThanhcong === 1) {
      Message = (
        <div className="alert alert-success daucaonhat">
          Giá thầu của bạn đã được chấp nhận.
        </div>
      )
    }
    if (this.state.tempHetgio === 1) {
      Message = (
        <div className="alert alert-info dathang">
          Phiên đấu giá đã kết thúc.
        </div>
      )
    }
    if (this.state.ketqua === 1) {
      MessageEnd = (
        <div className="alert alert-success f_alertEnd">
          <h3>Chúc mừng !</h3>
          <p>Bạn đã thắng phiên đấu giá</p>
          <p>Sản phẩm sẽ được chuyển về giỏ hàng trong ít phút.</p>
          <a href='/' className="btn btn-warning col-md-4 col-md-offset-2">Phiên đấu giá khác</a>
          <a href='/Giohang' className="btn btn-warning col-md-3 col-md-offset-1 ">Giỏ hàng</a>
        </div>
      )
    }
    var elementsHinh = this.state.arraySanpham.map((sp, index) => {
      return <div className="mySlides" key={index}>
        <img className='imagesProduct' src={"/images/sanpham/" + sp.hinhanh + ".jpg"} />
      </div>
    })
    var elementsHinh_chitiet = this.state.arrayHinh.map((sp, index) => {
      return <div className="column" key={index}>
        <img className="demo cursor" src={"/images/sanpham/" + sp.ms_hinh + ".jpg"} onClick={() => { this.currentSlide(sp.ms_hinh, index) }} alt="The Woods" />
      </div>
    })
    var elementsTime = this.state.arraySanpham.map((sp, index) => {
      return <div className="time_dau" key={index}><Clock1 deadLine={sp.thoigiandau} masp={sp.mssp} /></div>
    })
    var elementsThongtin = this.state.arraySanpham.map((sp, index) => {
      return <p id="chitiet" className="collapse in" key={index}>{sp.dacta}</p>
    })
    return (
      <div >
        <div>
            {/* noi dung */}
            <div className="col-md-9" id="content">
              <div className="panel panel-default">
                <div className="panel-heading daugia_panle">{this.state.tensp}</div>
                <div className="panel-body">
                  <div className="header_detail">
                    <div className="image_detail">
                      {elementsHinh}
                      <a className="prev" onClick={() => { this.plusSlides(-1) }} >❮</a>
                      <a className="next" onClick={() => { this.plusSlides(+1) }} >❯</a>
                      <div className="caption-container">
                        <p id="caption" />
                      </div>
                      <div className="row">
                        {elementsHinh_chitiet}
                      </div>
                    </div>
                    <div className="info_detail">
                      <div className="info_left">
                        <span className="giahientai">Giá hiện tại:</span>
                        <div className="tienhientai"><span>{this.state.giadau_hientai}</span>K</div>
                        <div className="daugiangay">Đấu giá ngay:</div>
                        <div className="btn_tanggiam">
                          <div className="input-group">
                            <span className="input-group-btn">
                              <button type="button" className="btn btn-default btn-number" disabled="disabled" data-type="minus" data-field="quant[1]">
                                <span className="glyphicon glyphicon-minus" />
                              </button>
                            </span>
                            <input type="text" name="quant[1]" className="form-control input-number f_tiendau" ref="giadau" min={this.state.giadau_min} max={100000000000000} />
                            <span className="input-group-btn">
                              <button type="button" className="btn btn-default btn-number" data-type="plus" data-field="quant[1]">
                                <span className="glyphicon glyphicon-plus" />
                              </button>
                            </span>
                          </div>
                        </div>
                        {/* Đấu giá ngay */}
                        {Daugiangay}
                        <div className="nguoithang">Người thắng hiện tại &nbsp;<span className="glyphicon glyphicon-user" />
                        </div>
                        <div className="user_thang">{this.state.userWin}</div>
                      </div>
                      <div className="info_right">
                        <span className="thoigiandau">Thời gian đấu:</span>
                        {elementsTime}
                        <div className="dichvu">10% phí dịch vụ</div>
                        {Message}
                      </div>
                    </div>
                    {MessageEnd}
                  </div>
                  <div className="footer_detail">
                    <div className="chinhsach">
                      <a href="#view return condition">
                        <lable data-toggle="collapse" data-target="#hoantra" id="hoantra1" className="chinhsach1"><span className="glyphicon glyphicon-refresh" />Đổi trả sản phẩm</lable>
                      </a>
                      <a href="#view return condition">
                        <lable data-toggle="collapse" data-target="#giaohang" id="giaohang1" className="chinhsach1"><span className="glyphicon glyphicon-cd" />Giao hàng</lable>
                      </a>
                      <a href="#view return condition">
                        <lable data-toggle="collapse" data-target="#tien" id="tien1" className="chinhsach1"><span className="glyphicon glyphicon-usd" />Thanh toán</lable>
                      </a>
                    </div>
                    <div id="hoantra" className="collapse">
                      chính sách hoàn trả trong 14 ngày áp dụng cho tất cả sản phẩm, cho phép bạn an tâm mua các thiết bị điện tử, quần áo, giày dép và hơn thế nữa. Chú ý: Tất cả sản phẩm phải được hoàn trả trong tình trạng ban đầu. Khi đáp ứng được điều kiện hoàn trả, bạn sẽ được hoàn lại đầy đủ số tiền không bao gồm 10% phí dịch vụ. Người mua hàng sẽ chịu trách nhiệm cho phí vận chuyển hàng trả lại.
                    </div>
                      <div id="giaohang" className="collapse">
                        Bạn sẽ nhận được kiện hàng trong vòng 1-3 ngày làm việc sau khi thanh toán thành công. Với mỗi hoá đơn, không kể số lượng sản phẩm bao gồm trong hoá đơn, bạn chỉ cần thanh toán 1 lần phí vận chuyển và 10% phí dịch vụ để đảm bảo kiện hàng của bạn được gửi nhanh chóng an toàn. Phí dịch vụ không áp dụng cho các sản phẩm khuyến mãi có giá cố định.
                    </div>
                      <div id="tien" className="collapse">
                        Chúng tôi cung cấp phương thức thanh toán thuận tiện và an toàn đối với những thanh toán trực tuyến bằng thẻ Visa hoặc Master
                    </div>
                      <div>
                        <ul className="nav nav-tabs">
                          <li className="active">
                            <a href="#view return condition" data-toggle="collapse" data-target="#chitiet" id="chitiet1">Chi tiết sản phẩm</a>
                          </li>
                          <li>
                            <a href="#view return condition" data-toggle="collapse" data-target="#FAQ" id="FAQ1">FAQ</a>
                          </li>
                        </ul>
                        <br />
                        {elementsThongtin}
                        <p id="FAQ" className="collapse">
                          Khi giá thầu của bạn cao hơn giá thầu tối thiểu, hệ thống sẽ tự động đấu giá cho bạn. Lưu ý chúng tôi sẽ không bao giờ đấu giá cao hơn giá bạn đã đưa ra.
                          Hệ thống được thiết kế để giữ tiền cho bạn và cung cấp cho bạn cơ hội thắng đấu giá cao nhất với mức giá thấp nhất.
                          Với phương thức này bạn sẽ quyết định được mức giá tối đa bạn sẵn sàng trả cho sản phẩm và vẫn có cơ hội để thắng với mức giá thấp hơn mức giá tối đa mà bạn đã đưa ra.
                          Dưới đây là 1 ví dụ:
                          Một người dùng khác (Tạm gọi là Người Dùng 1) đưa ra giá thầu là 200k VND
                          Giá thầu của bạn là 300k VND.
                          Thay vì đấu giá với giá là 300k VND, thuật toán của chúng tôi sẽ điều chỉnh giá thầu của bạn xuống còn 200k VND.
                          Người Dùng 1 đưa ra giá thầu là 250k VND
                          Hệ thống của chúng tôi sẽ tự động đấu giá với mức giá bằng 250K VND cho bạn, bởi bạn đã đăng ký giá thầu tối đa mà bạn muốn trả cho sản phẩm là 300K VND.
                          Bạn vẫn sẽ thắng thầu với mức giá 250k VND.
                          Người Dùng 1 lại đưa ra giá thầu mới là 300k VND, bằng với giá đầu lúc đầu của bạn. Trong trường hợp này, hệ thống sẽ tự động khớp giá thầu của Người Dùng 1 và bạn vẫn là người thắng thầu với mức giá 300k VND
                          Chiến lược tốt là đưa ra một giá thầu tối đa cao từ ban đầu, như vậy bạn sẽ có cơ hội thắng thầu cao hơn, đặc biệt khi người dùng khác khớp với giá thầu của bạn
                          Người Dùng 1 đưa ra giá thầu mới là 310k VND
                          Bạn đã bị đấu giá cao hơn và Người Dùng 1 đang giữ lợi thế thắng cuộc. Nếu bạn muốn đưa ra giá thầu mới để thắng thầu bạn sẽ cần phải đưa ra giá thầu cao hơn 310k VND
                          Như vậy bạn có thể thắng, Chilindo được thiết kế để bạn có thể thắng đấu giá với giá tốt nhất.
            </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* end noi dung */}
            </div>
          </div>
        // </div>
        );
      }
    }
    
    export default pageDetail;
