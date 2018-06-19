import React, { Component } from 'react';
import axios from 'axios';
import Clock from './clock';
import Header from './header';
import Producter from './producter';
import Footer from './footer';
class Home extends Component {
  
  constructor(props) {
    super(props);
    this.state = { producter: [], ten_hienthi: "" , arraySanpham:[]};
  }
  componentDidMount() {
  
    axios.get('/users/login')
      .then(res => {
        if (!res.data.id) {
          window.location.href = "/login";
        }
        if (res.data.id) {
          this.setState({ ten_hienthi: res.data.ten_hienthi });
          axios.get('/home/')
            .then(res => {
              this.setState({ arraySanpham: res.data.sanpham,producter:res.data.loaisp })
            })
        }
      })
      .catch(err => console.log("Error"));
  }

  render() {
    var elements = this.state.arraySanpham.map((sp, index) => {
      return <div className="col-sm-6 col-md-3 sanpham" key={index}>
        <div className="thumbnail">
          <img src={"/images/sanpham/" + sp.hinhanh + ".jpg"} key={index} alt="Generic placeholder thumbnail" />
        </div>
        <div className="caption">
          <p><span className="thoigian"><Clock deadLine={sp.thoigiandau} masp={sp.mssp}/></span>
            <span className="giatien">{sp.gia/1000}K</span>
          </p>
          <p>
            <a href={"/Detail/phien="+sp.ms_phien+"/id="+sp.mssp} className="btn" role="button">Đấu giá ngay</a>
          </p>
        </div>
      </div>
    });
    return (

      <div >
        <div>
          {/* Header */}
            <Header ten_hienthi={this.state.ten_hienthi}/>
          {/* end Header*/}
            <div className="row producter_index">
              {/* producter */}
              <Producter loaisp={this.state.producter}/>
              {/* end producter */}
              {/* noi dung */}
              <div className="col-md-9" id="content">
                <div className="panel panel-default">
                  <div className="panel-heading daugia_panle">TRANG CHỦ</div>
                  <div className="panel-body">
                    <div className="row">
                      {elements}
                    </div>
                  </div>
                </div>
              </div>
              {/* end noi dung */}
            </div>
            {/* footer */}
            // quan ly
            <Footer/>
        </div>
      </div>
    );
  }
}

export default Home;
