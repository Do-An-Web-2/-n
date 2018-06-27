import React, { Component } from 'react';
import axios from 'axios';
class Producter extends Component {
    constructor(props) {
        super(props);
        this.state={
            loaisp:[]
        }
    }
    componentWillMount(){
        axios.get('/serverProduct')
        .then((res)=>{
            this.setState({loaisp:res.data})
        })
       }
    render() {
        var elements=this.state.loaisp.map((temp,index)=>{
            return <a href={"/Product/"+temp.mlsp} className="list-group-item" key={index}>{temp.ten_loai}</a>
        })
        return (
            <div className="col-md-3">
            <div className="list-group producter">
            <a href="#" className="list-group-item disabled daugia_panle">DANH MỤC</a>
            {elements}
            </div>
          </div>
        );
    }
}
export default Producter;
