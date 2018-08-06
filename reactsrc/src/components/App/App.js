import React, {Component} from 'react';
import Footer from '../Footer/Footer_Bar';
import Navbar from "../Navbar/Navigationbar";
import axios from "axios/index";

class App extends Component {

    componentWillMount() {
        axios.get('/api/users/verify',{
            credentials:'include',
            withCredentials: true
        })
            .then(res => {
                console.log(res.data);
            });
    }


    render() {
        return (
            <div>
                <div id="navbar">
                    <Navbar/>
                </div>
                <div id="content"></div>

                <div id="footer">
                    <Footer/>
                </div>
            </div>
        );
    }
}

export default App;
