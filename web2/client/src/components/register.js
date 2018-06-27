import React, { Component } from 'react';
import axios from 'axios'
import { stringify } from 'querystring';
import $ from 'jquery';
import Recaptcha from 'react-recaptcha';
class Register extends Component {
  constructor(props) {
    super(props);
    this.Dangky = this.Dangky.bind(this);
    this.veryfyCallback=this.veryfyCallback.bind(this);
    this.state = { capcha:"",
      checkLogin: 1 }
  }
  veryfyCallback(response)
  {
    this.setState({capcha:response})
  }
  componentDidMount() {
    axios.get('/users/login')
      .then(res => {
        if (res.data.id) {
          window.location.href = "/";
        }
      })
      .catch(err => console.log("Error"));
  }

  Dangky() {
    var body = {
      username: this.refs.username.value,
      fullname: this.refs.fullname.value,
      email: this.refs.email.value,
      password: this.refs.password.value,
    }
      axios({
        method: 'post',
        url: "/users/register",
        data:stringify(body),
    }).then((res)=>{
      if(res.data===1)
      {
      window.location.href="/login";
      }
      else{
        this.setState({checkLogin:0})
        this.refs.password.value="";
      }
    }); 
  }
  render() {
    let Massage;
    if (this.state.checkLogin == 0) {
      Massage = (
        <div class="alert alert-danger">
          <strong>(?)</strong> Vui lòng điền đẩy đủ thông tin và xác nhận.
      </div>
      )
    }
    if (this.state.checkLogin == -1) {
      Massage = (
        <div class="alert alert-danger">
          <strong>(?)</strong> Username này đã tồn tại.Vui lòng chọn tên khác!
      </div>
      )
    }
    return (
      <div className="login">
        {Massage}
        <div className="container">
          <div className="card card-container">
            {/* <img class="profile-img-card" src="//lh3.googleusercontent.com/-6V8xOA6M7BA/AAAAAAAAAAI/AAAAAAAAAAA/rzlHcD0KYwo/photo.jpg?sz=120" alt="" /> */}
            <img alt="ds" id="profile-img" className="profile-img-card" src="/images/icons/register.png" />
            <p id="profile-name" className="profile-name-card" />
            <form className="form-signin" >
              <span id="reauth-email" className="reauth-email" />
              <input type="text" id="username" className="form-control input_nhap" placeholder="UserName" ref="username" />
              <input type="text" id="fullname" className="form-control input_nhap" placeholder="Fullname" ref="fullname" />
              <input type="email" id="email" className="form-control input_nhap" placeholder="Email" ref="email" />
              <input type="password" id="password" className="form-control input_nhap" placeholder="Password" ref="password" />
              <Recaptcha
                sitekey="6LcCA2AUAAAAAM9ALQkNDYV8HTQ9CaoFGe9NXFgM"
                render='explicit'
                verifyCallback={this.veryfyCallback}
              />
            </form>{/* /form */}
            <button className="btn btn-lg btn-primary btn-block btn-signin" onClick={this.Dangky} >Create My Account</button>

          </div>
        </div>
      </div>
    );
  }
}

export default Register;
