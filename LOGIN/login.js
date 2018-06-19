import React, { Component } from 'react';
import axios from 'axios'
import { stringify } from 'querystring';
import $ from 'jquery';
import { ok } from 'assert';
class Login extends Component {
  constructor(props)
  { 
      super(props);
      this.Dangnhap=this.Dangnhap.bind(this);
      this.state={temp_remember:0,checkLogin:1}
  }
  
   componentDidMount(){
   axios.get('/users/login')
    .then(res=>{
      if(res.data.id)
      {
        window.location.href="/";
      }
      document.getElementById("username").value=res.data.username;
      document.getElementById("password").value=res.data.password;
    })
    .catch(err=>console.log("Error"));
   }
   checkRemember(){
      if($('.ghinho').prop('checked')===true)
      {
      return 1;
      }
      return 0;
   }
   
    Dangnhap()
    {
      var temp=0;
      var body= {
        username: this.refs.username.value,
        password: this.refs.password.value,
        status:this.checkRemember()
     }
      axios({
        method: 'post',
        url: "/users/login",
        data:stringify(body),
    }).then((res)=>{
      if(res.data===1)
      {
      window.location.href="/";
      }
      else{
        this.setState({checkLogin:0})
        this.refs.password.value="";
      }
    });
    }
  render() {
    let Massage;
     if(this.state.checkLogin==0)
     {
       Massage=(
        <div class="alert alert-danger">
        <strong>(?)</strong> Tài khoản không chính xác! Vui lòng kiểm tra lại.
      </div>
       )
     }
  
    return (
        <div className="login">
        {Massage}
        <div className="container">
        <div className="card card-container">
          {/* <img class="profile-img-card" src="//lh3.googleusercontent.com/-6V8xOA6M7BA/AAAAAAAAAAI/AAAAAAAAAAA/rzlHcD0KYwo/photo.jpg?sz=120" alt="" /> */}
          <img alt="ds" id="profile-img" className="profile-img-card" src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" />
          <p id="profile-name" className="profile-name-card" />
          <form className="form-signin">
            <span id="reauth-email" className="reauth-email" />
            <input type="text" id="username" className="form-control input_nhap" placeholder="Email address"  ref="username"/>
            <input type="password" id="password" className="form-control input_nhap" placeholder="Password"  ref="password" />
            <div id="remember" className="checkbox">
              <label>
                <input type="checkbox" className="ghinho" onClick={this.checkRemember} /> Remember me
              </label>
            </div>
            </form>{/* /form */}
            <button className="btn btn-lg btn-primary btn-block btn-signin" type="submit" onClick={this.Dangnhap}>Sign in</button>
          <a  className="forgot-password">
            Forgot the password?
          </a>
        </div>
      </div>
      </div>
    );
  }
}

export default Login;
