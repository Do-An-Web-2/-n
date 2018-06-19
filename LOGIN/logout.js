import React, { Component } from 'react';
import axios from 'axios'
class Logout extends Component {
    
  constructor(props)
  {
      super(props);
  }
   componentDidMount(){
    axios.get('/users/logout')
    window.location.href='/login';
   }
   
  render() {
    return (
        <div></div>
    )
  }
}

export default Logout;
