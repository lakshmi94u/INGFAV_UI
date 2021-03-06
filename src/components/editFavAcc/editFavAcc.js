import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import Button from '@material-ui/core/Button';
// import config from '../../config.json'
import axios from 'axios';
// import './App.css';
// import LeftBar from '../left-bar/left-bar'
import { withRouter } from 'react-router-dom';


class AddFavAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: {},
            errors: {},
            accountData: {
                accountName: '',
                ibanNumber: '',
                customerId: localStorage.getItem("customerId"),
                accountName:sessionStorage.getItem("accountName"),
            }
        }
    }

    componentDidMount() {
        let accountData = JSON.parse(sessionStorage.getItem("favAccount"));   
        this.setState ({accountData})  
    }

    handleChange = (event) => {

        let fields = this.state.fields;
        fields[event.target.name] = event.target.value;
        this.setState({
            fields
        });


        console.log(event.target.name);
        const { accountData } = this.state;
        accountData[event.target.name] = event.target.value;
        this.setState({ accountData });
        console.log(this.state.accountData);
    }

    editAccount = (event) => {
        event.preventDefault();        
        if (this.validateForm()) {
            let fields = {};
            fields["accountName"] = "";
            fields["ibanNumber"] = "";
            this.setState({ fields: fields });
           
        }


        const { accountData } = this.state;
        console.log(accountData);
        axios.put(`http://192.168.1.100:9093/ingbank/favouriteAccount/`, accountData).then((response) => {

            console.log(response);

            console.log("sdfsdf")
            this.props.history.push('/favAccount')
        }).catch(function (err) {

            console.log(err);
        })
    }

    validateForm() {

        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        if (!fields["accountName"]) {
            formIsValid = false;
            errors["accountName"] = "*Please enter your Name.";
        }

        if (typeof fields["accountName"] !== "undefined") {
            if (!fields["accountName"].match(/^[a-zA-Z ]*$/)) {
                formIsValid = false;
                errors["accountName"] = "*Please enter alphabet characters only.";
            }
        }


        if (!fields["ibanNumber"]) {
            formIsValid = false;
            errors["ibanNumber"] = "*Please enter your Account no.";
        }

        if (typeof fields["ibanNumber"] !== "undefined") {
            if (!fields["ibanNumber"].match(/^[a-zA-Z]{2}[0-9]{20}$/)) {
                formIsValid = false;
                errors["ibanNumber"] = "*Please enter valid Account no.";
            }
        }
        
        this.setState({
            errors: errors
        });
        return formIsValid;


    }


    // handleBank = (event) => {
    //     event.preventDefault();       
    //     if (event.target.value.length === 20) {
    //         axios.post(`http://192.168.43.100:9093/ingbank/favouriteAccounts` + this.state.accountData.accountNumber)
    //             .then(response => {
    //                 console.log(response.data);
    //                 this.setState({ bank: response.data.bank });

    //             })
    //             .catch(error => {
    //                 console.log(error);
    //             });
    //     } else {
    //         console.log("sdvsdfsdff")
    //     }
    // };


    handleBank = (event) => {
        if (event.target.value.length === 20) {
            axios.get(`http://192.168.1.100:9094/ingbank/bank/` + this.state.accountData.ibanNumber)
                .then(response => {
                    console.log(response.data);
                    const {accountData} = this.state;
                    accountData.bankName=response.data.bankName;
                    this.setState({ accountData  });
                    console.log(response.data.bankName)

                })
                .catch(error => {
                    console.log(error);
                    // swal(error.response.data.message);
                });
        } else {
            console.log("sdvsdfsdff")
        }
    };

    deleteAccount = (event) => {
        event.preventDefault();
        var favouriteAccountId  =sessionStorage.getItem("favouriteAccountId")  

        axios.delete('http://192.168.1.100:9093/ingbank/favouriteAccounts/'+favouriteAccountId).then((response) => {

            console.log(response);

            console.log("sdfsdf")
            this.props.history.push('/favAccount')
        }).catch(function (err) {

            console.log(err);
        })
    }

    cancelAccount = (event) =>{
        event.preventDefault();
        this.props.history.push('/favAccount')
    }

    render() {
        return (
            <div className="tablesize">
                <form>
                    <div className="ben-details main-title"> Edit Favorite Account  </div>

                    <div className="container acc-container">
                        <div>
                            <div><label className="title-text">Account Name:</label></div>
                            <div><input type="text" name="accountName" value = {this.state.accountData.accountName}  className="text-boxx" required style={{ border: '1px solid blue', color: 'orange', width: '100%' }} onChange={this.handleChange} /></div>
                            <div className="accountName">{this.state.errors.accountName}</div>

                        </div>

                        <div onChange={this.handleBank}>
                            <div><label className="title-text">IBAN/Account Number:</label></div>
                            <div><input type="text" name="ibanNumber" value = {this.state.accountData.ibanNumber} className="text-boxx" onChange={this.handleChange} required style={{ border: '1px solid blue', color: 'orange', width: '100%' }} /></div>
                            <div className="ibanNumber">{this.state.errors.ibanNumber}</div>
                        </div>

                        <div>
                            <div><label className="title-text">Bank:</label></div>
                            <div><input type="text" name="bank" value={this.state.accountData.bankName} className="text-boxx" required onChange={this.handleChange} style={{ border: '1px solid blue', color: 'orange', width: '100%' }} disabled /></div>
                        </div>

                        <div>
                            <div><button className="btn btn-lg btn-primary " onClick={this.editAccount}>Save</button></div>
                            <div><button className="btn btn-lg btn-primary " onClick={this.deleteAccount}>Delete</button></div>

                            <div><button className="btn btn-lg btn-primary " onClick={this.cancelAccount}>Cancel</button></div>
                        </div>
                    </div>
                </form>

            </div>
        );
    }
}
export default withRouter(AddFavAccount);