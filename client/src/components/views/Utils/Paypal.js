import React from 'react';
import PaypalExpressBtn from 'react-paypal-express-checkout';
 
export default class Paypal extends React.Component {
    render() {
        const onSuccess = (payment) => {
            // Congratulation, it came here means everything's fine!
            		console.log("The payment was succeeded!", payment);
                    
                    // 결제 성공했을때
                    this.props.onSuccess(payment) //상위컴퍼넌트에서 처리 Cartpage
            		// You can bind the "payment" object's value to your state or props or whatever here, please see below for sample returned data
        }
 
        const onCancel = (data) => {
            // User pressed "cancel" or close Paypal's popup!
            console.log('The payment was cancelled!', data);
            // You can bind the "data" object's value to your state or props or whatever here, please see below for sample returned data
        }
 
        const onError = (err) => {
            // The main Paypal's script cannot be loaded or somethings block the loading of that script!
            console.log("Error!", err);
            // Because the Paypal's main script is loaded asynchronously from "https://www.paypalobjects.com/api/checkout.js"
            // => sometimes it may take about 0.5 second for everything to get set, or for the button to appear
        }
 
        let env = 'sandbox'; // you can set here to 'production' for production
        let currency = 'USD'; // or you can set this value from your props or state
        let total = this.props.total; // same as above, this is the total amount (based on currency) to be paid by using Paypal express checkout
        // Document on Paypal's currency code: https://developer.paypal.com/docs/classic/api/currency_codes/
 
        const client = {
            sandbox:    'AXYyik1AU2I7u34iEoelbkke773lshHRxfhRfZ_6JtD-sIPACeMqTg7xQM1UiP9yxHR-8qHcSm-dg8lY',
            production: 'YOUR-PRODUCTION-APP-ID',
        }
        // In order to get production's app-ID, you will have to send your app to Paypal for approval first
        // For sandbox app-ID (after logging into your developer account, please locate the "REST API apps" section, click "Create App"):
        //   => https://developer.paypal.com/docs/classic/lifecycle/sb_credentials/
        // For production app-ID:
        //   => https://developer.paypal.com/docs/classic/lifecycle/goingLive/
 
        // NB. You can also have many Paypal express checkout buttons on page, just pass in the correct amount and they will work!
        return (
            <PaypalExpressBtn 
                env={env} 
                client={client} 
                currency={currency} 
                total={total} 
                onError={onError} 
                onSuccess={onSuccess} 
                onCancel={onCancel} 
                style={{
                    size:'large',
                    color:'blue',
                    shape:'rect',
                    lavbel:'checkout'
                }}
                />
        );
    }
}