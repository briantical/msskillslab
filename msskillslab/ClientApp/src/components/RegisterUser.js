import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class RegisterUser extends Component {
    static displayName = RegisterUser.name;
    static contextTypes = {
        router: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            username: undefined, password: undefined, name: undefined,
            email: undefined, phone: undefined, accountCreated: false, error: false, creatingUser: false,
            id: undefined
        };
        this.handleChange = this.handleChange.bind(this);
        this.insertRecord = this.insertRecord.bind(this);
    }

    async insertRecord(event) {
        fetch('User/adduser',
            {
                method: 'POST',
                body: JSON.stringify({
                    'username': this.state.username,
                    'email': this.state.email,
                    'password': this.state.password,
                    'name': this.state.name,
                    'phone': this.state.phone
                }),
                headers: {
                    'Content-Type': "application/json; charset=UTF-8"
                }
            }).then(response => {
                console.log(response);
                if (response.status !== 200) {
                    this.state.error = true;
                    this.setState(this.state);
                }
                return response.json();
            }).then(json => {
                console.log(json);
                if (json.success) {
                    let path = '/account/view/' + json.data.id;
                    this.context.router.history.push(path);
                } else {
                    this.state.error = true;
                    this.setState(this.state);
                }
            });
        this.state.creatingUser = true;
        this.setState(this.state);
    }

    async handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    render() {

        let failure;

        if (this.state.error) {
            failure = <p color="red">An error occurred. Please submit the form again.</p>;
        }

        if (this.state.creatingUser) {
            return <p>Loading...</p>;
        }

        return (
            <div>
                <h1>Welcome To Banking Inc.</h1>

                <p>Please Fill Out The Information Below</p>

                {failure}

                <form onSubmit={this.insertRecord} >
                    <label>
                        Name:
                        <input name="name" type="text" value={this.state.name} onChange={this.handleChange} />
                    </label>
                    <br />
                    <label>
                        Email:
                        <input name="email" type="email" value={this.state.email} onChange={this.handleChange} />
                    </label>
                    <br />
                    <label>
                        Phone:
                        <input name="phone" type="text" value={this.state.phone} onChange={this.handleChange} />
                    </label>
                    <br />
                    <label>
                        Username:
                        <input name="username" type="text" value={this.state.username} onChange={this.handleChange} />
                    </label>
                    <br />
                    <label>
                        Password:
                        <input name="password" type="password" value={this.state.password} onChange={this.handleChange} />
                    </label>
                    <br />
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}