import React, { Component } from 'react';
class Footer extends Component {
    constructor(props) {
        super(props);
    }
    render() {

        return (
           <div>
                <div className="col-md-12" id="footer">
              <div className="col-md-8 col-md-offset-2" id="noidung_footer">
                <div className="theloai">
                  <ul>
                    <div className="col-md-4 logo">
                      <li className="footer_1">
                        <span className="w3-tag w3-jumbo w3-red">T</span>
                        <span className="w3-tag w3-jumbo">E</span>
                        <span className="w3-tag w3-jumbo w3-yellow">A</span>
                        <span className="w3-tag w3-jumbo">M</span>
                      </li>
                      <li><img src="/images/icons/Double-J-Design-Super-Mono-3d-Auction-hammer.ico" alt=""/>
                      </li>
                    </div>
                    <div className="col-md-4">
                      <li className="footer_1"><strong>THỂ LOẠI</strong></li>
                      <li><a>Cho Nàng</a></li>
                      <li><a>Cho Chàng</a></li>
                      <li><a>Gia đình &amp; Vườn</a></li>
                      <li><a>Đồ Chơi</a></li>
                      <li><a>Điện &amp; Phụ Tùng</a></li>
                      <li><a>Du lịch &amp; Thể Thao</a></li>
                      <li><a>Sức Khoẻ &amp; Sắc Đẹp</a></li>
                      <li><a>Ô tô &amp; Xe Máy</a></li>
                      <li><a>Công Cụ</a></li>
                    </div>
                    <div className="col-md-4">
                      <li className="footer_1"><strong>VỀ TEAM</strong></li>
                      <li><a>Về chúng tôi</a></li>
                      <li><a>Điều khoản sử dụng</a></li>
                      <li><a>Chính sách bảo mật</a></li>
                      <li><a>Thông tin công ty</a></li>
                    </div>
                    <div className="col-md-4">
                      <li className="footer_1"><strong>TRỢ GIÚP &amp; LIÊN HỆ</strong></li>
                      <li><a> Liên hệ</a></li>
                      <li><a>Thông tin giao hàng</a></li>
                      <li><a > Đăng ký</a></li>
                      <li><a>Trợ giúp</a></li>
                    </div>
                  </ul>
                </div>
              </div>
              {/* footerend @*/}
            </div>
            <div className="col-md-12 footer_2">
              <div>
                <div id="footer_d1"> Có câu hỏi? Chúng tôi muốn nghe từ bạn! Email cho chúng tôi:<a>support.vn@team.com</a></div>
                <div id="footer_d2">Copyright @ 2018 Team.com. All Rights Reserved</div>
              </div>
            </div>
               </div>
        );
    }
}
export default Footer;
