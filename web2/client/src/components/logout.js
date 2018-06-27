import React, { Component } from 'react';
import axios from 'axios';
import $ from 'jquery';
class Logout extends Component {
    
  constructor(props)
  {
      super(props);
  }
  
   componentWillMount(){
    axios.get('/users/serverlogout').
    then((res)=>{
      if(res.data===1)
      {
        window.history.back();
      }
    })
   }
  render() {
    return (
        <div></div>
    )
  }
}

export default Logout;
