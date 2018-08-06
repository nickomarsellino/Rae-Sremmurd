import React, {Component} from "react";
import axios from "axios/index";
import './Edit_Profile.css';
import {Container, Row, Col, Card, CardBody, Button} from 'mdbreact';
import MessageValidation from '../MessageValidationBox/MessageValidation'
import {Form, Image} from 'semantic-ui-react';
import FadeIn from 'react-fade-in';
import profile from '../../daniel.jpg';
import ReactDOM from "react-dom";


class Edit_Profile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isHidden: true,
            userId: "",
            username: "",
            email: "",
            phone: "",
            formMessage: "",
            formStatus: ""
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    getData() {
        axios.get('/api/users')
            .then(res => {
                this.setState({
                    userId: res.data._id,
                    username: res.data.username,
                    email: res.data.email,
                    phone: res.data.phone
                });
            });
    }

    componentDidMount() {
        this.getData();
    }

    handleInputChange(e) {
        const target = e.target;
        const name = target.name;

        this.setState({[name]: target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        const user = {
            username: this.state.username,
            email: this.state.email,
            phone: this.state.phone
        };

        axios({
            method: 'put',
            responseType: 'json',
            url: `/api/users`,
            data: user
        })
            .then((response) => {
                this.setState({
                    formStatus: 'success',
                    formMessage: response.data.msg
                });

                //Render Validation box message
                ReactDOM.render(<MessageValidation
                    form="success"
                    formStatus={this.state.formStatus}
                    formMessage={this.state.formMessage}
                />, document.getElementById('messageValidation'));

            })
            .catch((err) => {
                if (err.response) {
                    this.setState({
                        formStatus: 'Error',
                        formMessage: err.response.data.msg
                    });
                }
                else {
                    this.setState({
                        formStatus: 'Error',
                        formMessage: 'Something went wrong. ' + err
                    });
                }

                //Render Validation box message
                ReactDOM.render(<MessageValidation
                    form="danger"
                    formStatus={this.state.formStatus}
                    formMessage={this.state.formMessage}
                />, document.getElementById('messageValidation'));
            });
    }

    render() {
        return (
            <FadeIn>
                <div>
                    <Container className="col-lg-4 col-lg-offset-2">
                        <Card className="Card_Container">
                            <CardBody>
                                <center>
                                    <h1>Profile</h1>
                                    <Image src={profile} size='small' circular/>
                                </center>
                                <Row>
                                    <Col md="12">
                                        <Form onSubmit={this.handleSubmit}>
                                            <Form.Input required type="text" fluid label='Username'
                                                        placeholder={this.state.username}
                                                        value={this.state.username}
                                                        className={this.state.formStatus}
                                                        onChange={this.handleInputChange}
                                                        name="username"
                                            />

                                            <Form.Input required type="email" fluid label='Email'
                                                        placeholder={this.state.email}
                                                        value={this.state.email}
                                                        className={this.state.formStatus}
                                                        onChange={this.handleInputChange}
                                                        name="email"
                                            />

                                            <Form.Input required type="number" fluid label='Phone Number'
                                                        placeholder={this.state.phone}
                                                        value={this.state.phone}
                                                        className={this.state.formStatus}
                                                        onChange={this.handleInputChange}
                                                        name="phone"
                                            />
                                            <div id="messageValidation"></div>
                                            <Button id="Submit_Button" block size="lg" type="submit">Update
                                                Profile</Button>
                                        </Form>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Container>
                </div>
            </FadeIn>
        );
    }
}


export default Edit_Profile;
