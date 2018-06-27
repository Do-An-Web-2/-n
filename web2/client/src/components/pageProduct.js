import React, { Component } from 'react';
import axios from 'axios';
import Clock from './clock';
class pageProduct extends Component {
  
  constructor(props) {
    super(props);
    this.state = { producter: [],
       ten_hienthi: "" ,
        arraySanpham:[],
        loaihang:[],
        itemHang:"",
        nguoidung:0,
        seconds: 0,
        user_id:0,
      };
  }
  tick() 
  {
    this.setState(prevState => ({
      seconds: prevState.seconds + 1
    }));
    axios.get('/serverProduct/'+this.props.match.params.id)
            .then(res => {
              this.setState({ arraySanpham: res.data.sanpham,producter:res.data.loaisp,loaihang:res.data.ten_loaisp})
              this.setState({itemHang:this.state.loaihang[0].ten_loai});
              this.setState({ user_id:res.data.user_id,ten_hienthi: res.data.ten_hienthi,nguoidung:res.data.nguoidung });
            }) 
  }
  componentDidMount() {
    this.interval = setInterval(() => this.tick(),1000);   
  }

  render() {
    var elements = this.state.arraySanpham.map((sp, index) => {
      return <div className="col-sm-6 col-md-3 sanpham" key={index} > 
        <div className="thumbnail">
          <img src={"/images/sanpham/" + sp.hinhanh + ".jpg"} key={index} alt="Generic placeholder thumbnail" />
        </div>
        <div className="caption">
          <p><span className="thoigian"><Clock deadLine={sp.thoigiandau} masp={sp.mssp}/></span>
            <span className="giatien">{sp.gia_thapnhat}K</span>
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
            {/* <HeaderNotImage ten_hienthi={this.state.ten_hienthi} nguoidung={this.state.nguoidung} user_id={this.state.user_id}/> */}
          {/* end Header*/}
            {/* <div className="row producter_index"> */}
              {/* producter */}
              {/* <Producter loaisp={this.state.producter}/> */}
              {/* end producter */}
              {/* noi dung */}
              <div className="col-md-9" id="content">
                <div className="panel panel-default">
                  <div className="panel-heading daugia_panle">{this.state.itemHang}</div>
                  <div className="panel-body">
                    <div className="row">
                      {elements}
                    </div>
                  </div>
                </div>
              </div>
              {/* end noi dung */}
            {/* </div> */}
            {/* footer */}
            {/* <Footer/> */}
        </div>
      </div>
    );
  }
}

export default pageProduct;
