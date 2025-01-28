import axios from "axios";
import React, { useContext, useEffect } from "react";
import { Card, Row, Col, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthData } from "../ContextData";
const Login = () => {
    const router = useNavigate()
    const auth = useContext(AuthData);
    const { setName, name } = auth
 
    function testAPI() {                      // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
        console.log('Welcome!  Fetching your information.... ');
        FB.api('/me', function(response) {
          
          console.log('Successful login for: ' + response.name);
          document.getElementById('status').innerHTML =
            'Thanks for logging in, ' + response.name + '!';
        });
      }
      
      function statusChangeCallback(response) {  // Called with the results from FB.getLoginStatus().
        console.log('statusChangeCallback');
        console.log(response);                   // The current login status of the person.
        if (response.status === 'connected') {   // Logged into your webpage and Facebook.
          testAPI();  
        } else {                                 // Not logged into your webpage or we are unable to tell.
          document.getElementById('status').innerHTML = 'Please log ' +
            'into this webpage.';
        }
      }
    
        function login (){
FB.login(function(response) {
        if (response.authResponse) {
          console.log('Welcome!  Fetching your information.... ');
          FB.api('/me', function(response) {
            console.log('Good to see you, ' + response.name + '.');
            console.log(response);
          
            localStorage.setItem('name',response.name);
            localStorage.setItem('messangerId',response.id);
          });
          router('/foodmenu')
        } else {
          console.log('User cancelled login or did not fully authorize.');
        }
      });

        }
      

      function checkLoginState() {               // Called when a person is finished with the Login Button.
        FB.getLoginStatus(function(response) {   // See the onlogin handler
          statusChangeCallback(response);
        });
      }


         
    useEffect(() => {
   
        window.fbAsyncInit = function() {
          FB.init({
            appId      : '831737185629037',
            cookie     : true,                     // Enable cookies to allow the server to access the session.
            xfbml      : true,                     // Parse social plugins on this webpage.
            version    : 'v17.0'           // Use this Graph API version for this call.
          });
      
      
          FB.getLoginStatus(function(response) {   // Called after the JS SDK has been initialized.
            statusChangeCallback(response);        // Returns the login status.
          });
        };
       
    
  }, []);


    return (
        <>
            <Row className="mt-4">
                <Col md={4}>

                </Col>
                <Col md={4}>
                    <Card className="mt-4">
                        <Card.Body>
                            <Card.Title className="text-center">
                                SASI Delivery <br />
                                Login </Card.Title>
{/* 
                                <fb:login-button scope="public_profile,email" onlogin="checkLoginState();">
</fb:login-button> */}
<Button  onClick={()=>login()} >login</Button>
{/* <div id="status">
</div> */}

                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>

                </Col>
            </Row>

        </>
    )
}

export default Login;
