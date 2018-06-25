import React, { Component } from 'react';
import axios from 'axios';
import Clock from './clock';
class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sp_luot: [],
      sp_gia:[],
      sp_thoigian:[],
      seconds: 0,
      user_id:0,
    };
  }
  tick() 
  {
    this.setState(prevState => ({
      seconds: prevState.seconds + 1
    }));
     axios.get('/home/')
            .then(res => {
              this.setState({ 
                sp_luot: res.data.sp_luot,
                sp_gia:res.data.sp_gia,
                sp_thoigian:res.data.sp_thoigian, 
                user_id:res.data.user_id, })
            })
     }
  componentWillMount() {
      this.interval = setInterval(() => this.tick(),1000);
    }
  render() {
    var elements_luot = this.state.sp_luot.map((sp, index) => {
      return <div className="col-sm-6 col-md-3 sanpham" key={index}>
        <div className="thumbnail">
          <img src={"/images/sanpham/" + sp.hinhanh + ".jpg"} key={index} alt="Generic placeholder thumbnail" />
        </div>
        <div className="caption">
          <p><span className="thoigian"><Clock deadLine={sp.thoigiandau} masp={sp.mssp} /></span>
            <span className="giatien">{sp.gia_thapnhat}K</span>
          </p>
          <p>
            <a href={"/Detail/phien=" + sp.ms_phien + "/id=" + sp.mssp} className="btn" role="button">Đấu giá ngay</a>
          </p>
        </div>
      </div>
    });

    var elements_gia = this.state.sp_gia.map((sp, index) => {
      return <div className="col-sm-6 col-md-3 sanpham" key={index}>
        <div className="thumbnail">
          <img src={"/images/sanpham/" + sp.hinhanh + ".jpg"} key={index} alt="Generic placeholder thumbnail" />
        </div>
        <div className="caption">
          <p><span className="thoigian"><Clock deadLine={sp.thoigiandau} masp={sp.mssp} /></span>
            <span className="giatien">{sp.gia_thapnhat}K</span>
          </p>
          <p>
            <a href={"/Detail/phien=" + sp.ms_phien + "/id=" + sp.mssp} className="btn" role="button">Đấu giá ngay</a>
          </p>
        </div>
      </div>
    });

    var elements_thoigian = this.state.sp_thoigian.map((sp, index) => {
      return <div className="col-sm-6 col-md-3 sanpham" key={index}>
        <div className="thumbnail">
          <img src={"/images/sanpham/" + sp.hinhanh + ".jpg"} key={index} alt="Generic placeholder thumbnail" />
        </div>
        <div className="caption">
          <p><span className="thoigian"><Clock deadLine={sp.thoigiandau} masp={sp.mssp} /></span>
            <span className="giatien">{sp.gia_thapnhat}K</span>
          </p>
          <p>
            <a href={"/Detail/phien=" + sp.ms_phien + "/id=" + sp.mssp} className="btn" role="button">Đấu giá ngay</a>
          </p>
        </div>
      </div>
    });
    return (

      <div >
        <div>
            {/* noi dung */}
            <div className="col-md-9" id="content">
              <div className="panel panel-default">
                <div className="panel-heading daugia_panle">TRANG CHỦ</div>
                <div className="panel-body">
                  <div className="row">
                  {/* Top 5 sản phẩm có lượt đấu nhiều nhất */}
                    <div className="top5">
                      <div className="daugia_top">TOP 5 sản phẩm có nhiều lượt ra giá nhất</div>
                      {elements_luot}
                    </div>
                    {/* Top 5 sản phẩm có giá đấu hiện tại cao nhất */}
                    <div className="top5">
                      <div className="daugia_top">TOP 5 sản phẩm có giá đấu cao nhất</div>
                      {elements_gia}
                    </div>
                    {/* Top 5 sản phẩm có thời gian gần kết thúc */}
                    <div className="top5">
                      <div className="daugia_top">TOP 5 sản phẩm có thời gian gần kết thúc</div>
                      {elements_thoigian}
                    </div>
                  </div>
                </div>
              </div>
            {/* </div> */}
            {/* end noi dung */}
          </div>
          {/* footer */}
          {/* <Footer /> */}
        </div>
      </div>
    );
  }
}

export default Home;
