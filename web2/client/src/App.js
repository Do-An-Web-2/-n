import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Home from './components/index'; 
import Logout from './components/logout';
import Register from './components/register';
import PageProduct from './components/pageProduct';
import PageDetail from './components/pageDetail';
import PageDaugia from './components/pageDaugia';
import PageQuanly from './components/PageQuanly';
import PageShoppingcart from './components/pageShoppingcart';
import Header from './components/header';
import Producter from './components/producter';
import Footer from './components/footer';
import PageThongtin from './components/pageThongtin';
class App extends Component {
  render() {
    return (
      <Router>
        <div>
              <Header/>
              <div className="row producter_index">
              <Producter/>
              <Switch>
                  <Route exact path='/'component={Home}/>
                  <Route  path='/logout'component={Logout}/>
                  <Route  path='/register' component={Register}/>
                  <Route  path='/Product/:id' component={PageProduct}/>
                  <Route  path='/Detail/phien=:phien/id=:id' component={PageDetail}/>
                  <Route  path='/Daugiacuatoi' component={PageDaugia}/>
                  <Route exact path='/Quanly' component={PageQuanly}/>
                  <Route  path='/Giohang' component={PageShoppingcart}/>
                  <Route path='/Thongtin' component={PageThongtin}/>
                  </Switch>
              </div>    
              <Footer/>
            </div>
         </Router>
    );
  }
}

export default App;
