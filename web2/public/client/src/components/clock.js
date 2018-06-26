import React, { Component } from 'react';
import axios from 'axios';
class Clock extends Component {
  constructor(props) {
    super(props)
    this.state = { hours: "", minutes: "", seconds: "", time: "", status: false,masp:"", timeWait:5000 };
    console.log(this.props);
  }
  zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
  }
  currentTime() {
    var now = new Date();
    var thoigiandau = new Date(this.state.time);
    var time = (thoigiandau.getTime() - now.getTime()-this.state.timeWait) / 1000;
    //thời gian sau khi trừ thời gian của hệ thống
    var hour = Math.floor(time / 3600);
    var minute = Math.floor(Math.floor(time % 3600) / 60);
    var second = Math.floor(Math.floor(time % 3600) % 60);
    if (time < 0) {
      this.setState({ status: true })
      // axios.get('/UpdatePhien/trangthai/'+this.state.masp);
      return time;
    }
    else {
      this.setState({ hours: hour, minutes: minute, seconds: second });
    }
  }
  showTime(status) {
    if (status === true) {
      return <label>Endding...</label>
    }
    if (status === false) {
      return <label>{this.zeroPad(this.state.hours,2)}:{this.zeroPad(this.state.minutes,2)}:{this.zeroPad(this.state.seconds,2)}</label>
    }
  }
  componentWillMount() {
    // gán lấy thời gian từ index về để xử lý
    this.setState({ time: this.props.deadLine,masp:this.props.masp });
  }
  componentDidMount() {
    setInterval(() => this.currentTime(), 1000)
  }
  render() {
    return (
      <span className="thoigian">{this.showTime(this.state.status)}</span>
    )
  }
}
export default Clock;
