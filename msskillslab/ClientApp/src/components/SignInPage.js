import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class SignInPage extends Component {
    static displayName = SignInPage.name;
    static contextTypes = {
        router: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            email: undefined, password: undefined, signInFailed: false, signInComplete: false, id: undefined,
            signingIn: false, errorMessage: null
        };
        this.signIn = this.signIn.bind(this);
        this.registerNewUser = this.registerNewUser.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    async signIn(event) {

        let payloadBody = JSON.stringify({
            'email': this.state.email,
            'password': this.state.password
        });

        fetch('Authentication/signin',
            {
                method: 'POST',
                body: payloadBody,
                headers: {
                    'Content-Type': "application/json; charset=UTF-8"
                }
            }).then(response => {
                if (response.status !== 200) {
                    this.state.signingIn = false;
                    this.signInFailed = true;
                    this.setState(this.state);
                }
                return response.json();
            }).then(json => {
                if (json.success) {
                    if (json.data.signInComplete) {
                        let path = '/account/view/' + json.data.userId;
                        this.context.router.history.push(path);
                    }
                } else {
                    if (json.errorCode) {
                        this.state.signInFailed = true;
                        this.state.errorMessage = json.message;
                    }
                }
                this.state.signingIn = false;
                this.setState(this.state);
            });

        this.state.signingIn = true;
        this.setState(this.state);
    }

    async registerNewUser(event) {
        this.context.router.history.push('/account/new');
    }

    async handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    render() {
        let tryAgain;

        if (this.state.signInFailed) {
            tryAgain = <p>{this.state.errorMessage}</p>;
        }

        if (this.state.signingIn) {
            return <p>Loading...</p>
        }

        return (
            <div>
                <h1>Welcome To Banking Inc.</h1>

                <p>Please Sign Into Your Account</p>

                {tryAgain}

                <form onSubmit={this.signIn} >
                    <label>
                        Email:
                        <input name="email" type="email" value={this.state.email} onChange={this.handleChange} />
                    </label>
                    <br />
                    <label>
                        Password:
                        <input name="password" type="password" value={this.state.password} onChange={this.handleChange} />
                    </label>
                    <br />
                    <input type="submit" value="Submit" />
                </form>
                <br />
                <button name='newUser' onClick={this.registerNewUser}>New? Click Here To Create a New Account!</button>
            </div>
        );
    }
}