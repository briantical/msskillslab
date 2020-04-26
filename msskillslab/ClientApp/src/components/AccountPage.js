import React, { Component } from 'react';

export class AccountPage extends Component {
    static displayName = AccountPage.name;

    constructor(props) {
        super(props);
        let id = props.match.params.id;
        this.state = { name: undefined, accountId: undefined, currentBalance: 0, balanceToAdd: 0, error: false, userId: id, userInfoLoaded: false };
        this.handleChange = this.handleChange.bind(this);
        this.addBalance = this.addBalance.bind(this);
        this.populateUserInformation = this.populateUserInformation.bind(this);
    }

    componentWillMount() {
        this.populateUserInformation();
    }

    async populateUserInformation() {
        let path = 'User/' + this.state.userId + '/getaccounts';
        let syncResponse = await fetch(path)
            .then(response => {
                console.log(response);
                if (response.status !== 200) {
                    console.log(response.body);
                    this.state.error = true;
                    this.setState(this.state);
                }
                return response.json();
            }).then(json => {
                console.log(json);
                if (json.success) {
                    let data = json.data;
                    this.state.accountId = data.accounts[0]._id;
                    this.state.name = data.name;
                    this.state.userInfoLoaded = true;
                } else {
                    this.state.error = false;
                }

                this.setState(this.state);
            });
    }

    async addBalance(event) {
        let path = 'ManageAccount/' + this.state.accountId + '/deposit';
        let payloadbody = JSON.stringify({
            deposit: this.state.balanceToAdd,
            currentDeposit: this.state.currentBalance,
            accountId: this.state.accountId
        });

        let syncResponse = await fetch(path, {
            method: 'POST',
            body: payloadbody,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=UTF-8'
            }
        }).then(response => {
            if (response.status !== 200) {
                this.state.error = true;
                this.setState(this.state);
            }
            return response.json();
        }).then(json => {
            if (json.success) {
                this.state.currentBalance = json.data.newBalance;
                this.setState(this.state);
            }
            else {
                this.state.error = false;
                this.setState(this.state);
            }
        });
    }

    async handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    render() {
        if (this.state.userInfoLoaded)
            return (
                <div>
                    <h1>Welcome {this.state.name}!</h1>

                    <br />
                    <p>AccountId: {this.state.accountId} Balance: {this.state.currentBalance}</p>

                    <br />
                    <p>Submit a value to deposit</p>
                    <input name="balanceToAdd" type="number" value={this.state.balanceToAdd} onChange={this.handleChange} />
                    <br />
                    <br />
                    <button className="btn btn-primary" onClick={this.addBalance}>Add</button>

                </div >
            );

        return null;
    }
}