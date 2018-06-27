import React, { Component } from 'react';
import axios from 'axios';
import $ from 'jquery';
var numeral = require('numeral');
class pageShoppingcart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user_id: 0,
            seconds: 0,
            giohang: [],
            tongtien:"",
            btn_daugiangay:0
        };
        this.RemoveProduct = this.RemoveProduct.bind(this);
        this.Daugiangay=this.Daugiangay.bind(this);
    }
    Daugiangay()
    {
        axios.get('/serverGiohang')
            .then(res => {
                for(var i=0;i<res.data.giohang.length;i++)
                {
                    axios.get('/serverGiohang/Thanhtoan/'+res.data.giohang[i].ms_phien);
                }
            })
            .catch(err => console.log("Error"));
    }

    RemoveProduct(phien) {
        axios.get('/serverGiohang/RemoveProduct/' + phien);
    }
    tick() {
        this.setState(prevState => ({
            seconds: prevState.seconds + 1
        }));
        axios.get('/serverGiohang')
            .then(res => {
                if(res.data.giohang.length!==0)
                {
                    this.setState({btn_daugiangay:1});
                }
                if(res.data.giohang.length===0)
                {
                    this.setState({btn_daugiangay:0});
                }
                this.setState({ giohang: res.data.giohang,
                     user_id: res.data.user_id,
                     tongtien:res.data.tongtien })
            })
            .catch(err => console.log("Error"));
    }
    componentWillMount() {
        this.interval = setInterval(() => this.tick(), 1000);
    }

    render() {
        let elementNoidung,elementDaugiangay;
        if(this.state.btn_daugiangay!==0)
        {
            elementDaugiangay=(
            <button className="btn btn-warning cart_thanhtoan "  onClick={this.Daugiangay}><span className="glyphicon glyphicon-shopping-cart" />THANH TOÁN NGAY</button>
            )
        }
        if(this.state.btn_daugiangay===0)
        {
            elementDaugiangay=(
            <button className="btn btn-warning cart_thanhtoan " disabled onClick={this.Daugiangay}><span className="glyphicon glyphicon-shopping-cart" />THANH TOÁN NGAY</button>
            )
        }
        if (this.state.user_id === 0) {
            elementNoidung = (
                <div><p className="Giohang_khongsp">Hiện tại bạn không có sản phẩm nào trong giỏ hàng.</p>
                    <div className="cart_giaohang">
                        <span><img src="/images/icons/giaohang.png" />giao hàng 1-3 ngày | từ 29.000 ₫</span>
                    </div>
                </div>
            )
        }
        if (this.state.user_id !== 0) {
            var elementGiohang = this.state.giohang.map((sp, index) => {
                return <tr key={index}>
                    <td className="cart_chitiet"><img src={"/images/sanpham/" + sp.hinhanh + ".jpg"} />
                        {sp.ten_sp}
                        <span>{numeral(sp.gia_hientai*1000).format('0,0')}(₫) <a className="glyphicon glyphicon-remove text-danger" data-toggle="modal" data-target="#removeProduct" /></span>
                        <div class="modal fade" id="removeProduct" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class="modal-dialog" role="document">
                                <div class="modal-content">
                                    <div class="modal-body">
                                        <button type="button" class="close removeProduct_close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                        <div className="removeProduct">
                                            <h3>Lưu ý</h3>
                                            <p>Sản phẩm sẽ không hiển thị lại để bạn đấu giá trong thời gian tới.</p>
                                            <p>Vui lòng xác nhận bạn muốn xóa sản phẩm này khỏi giỏ hàng.</p>
                                            <div className="col-md-offset-6">
                                            <button type="button" class="col-md-5 btn removeProduct_btn  " data-dismiss="modal" onClick={()=>{this.RemoveProduct(sp.ms_phien)}}>Đồng ý</button>
                                            <button type="button" class="col-md-5 btn removeProduct_btn " data-dismiss="modal">Hủy</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            })
            elementNoidung = (
                <div>
                    <table className="table cart_table">
                        <thead>
                            <tr>
                                <th>
                                    Sản phẩm
                                <div className="cart_tungsp">Giá/Từng phần</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {elementGiohang}
                            <tr className="warning">
                                <td><strong>TỔNG TIỀN:</strong><span style={{ float: 'right', color: 'red', fontWeight: 'bold', fontSize: '15pt' }}>{this.state.tongtien}(đồng)</span></td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="cart_giaohang">
                        <span><img src="/images/icons/giaohang.png" />giao hàng 1-3 ngày | từ 29.000 ₫</span>
                        {elementDaugiangay}
                    </div>
                </div>
            )
        }
        return (
            <div >
                <div>
                    {/* noi dung */}
                    <div className="col-md-9" id="content">
                        <div className="panel panel-default">
                            <div className="panel-heading daugia_panle">GIỎ HÀNG</div>
                            <div className="panel-body">
                                <h2>Giỏ hàng đang chờ thanh toán</h2>
                                <div className="col-md-8">
                                    {elementNoidung}

                                </div>
                                <div className="cart_dieukhoan">
                                    <ul>
                                        <li><strong>Điều khoản hoàn trả của Chilindo là gì?</strong></li>
                                        <li>Nếu bạn không hài lòng với kiện hàng, bạn </li>
                                        <li>có thể hoàn lại trong vòng 14 ngày</li>
                                    </ul>
                                    <ul>
                                        <li><strong>Thay đổi đơn hàng?</strong></li>
                                        <li>Gọi cho chúng tôi theo số : </li>
                                        <li>support.vn@chilindo.com</li>
                                    </ul>
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

export default pageShoppingcart;
