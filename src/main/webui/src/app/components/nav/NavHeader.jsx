/**
 * Copyright (C) 2023 Red Hat, Inc. (https://github.com/Commonjava/indy-ui-service)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, {useState, useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {LinkContainer} from 'react-router-bootstrap';
import {IndyRest} from '#utils/RestClient';
import {Utils} from '#utils/AppUtils';

const {authRes} = IndyRest;


// eslint-disable-next-line max-lines-per-function
export default function NavHeader(){
  const [state, setState] = useState({
    isUserloggedIn: false,
    userInfo: {}
  });

  useEffect(()=>{
    const fetchUserInfo = async () => {
      const res = await authRes.getUserInfo();
      if (res.success){
        setState({
          isUserloggedIn: true,
          userInfo: res.result
        });
      }else{
        res.text().then(data => {
          Utils.logMessage(`Failed to get user info. Error reason: ${res.status}->${data}`);
        });
      }
    };

    fetchUserInfo();
  }, []);
  return (
    <Navbar expand="lg" bg="body-tertiary" fixed="top">
      <Container fluid>
        <LinkContainer to=""><Navbar.Brand>Indy</Navbar.Brand></LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {
              [
                {type: "remote", desc: "Remote Repositories"},
                {type: "hosted", desc: "Hosted Repositories"},
                {type: "group", desc: "Groups"}
              ].map(o =><NavDropdown key={`nav-dropdown-${o.type}`} title={o.desc} id={`nav-${o.type}-dropdown"`}>
                      {
                        ["maven", "generic-http", "npm"].map(pkgType =><LinkContainer key={`link-${pkgType}`} to={`/${o.type}/${pkgType}`}>
                        <NavDropdown.Item>{pkgType}</NavDropdown.Item>
                          </LinkContainer>)
                      }
                    </NavDropdown>)
            }
            <Nav.Link href="/q/swagger-ui/">REST API</Nav.Link>
            <NavDropdown title="More" id="nav-dropdown-addons">
              <LinkContainer to="/nfc">
                <NavDropdown.Item>Not-Found Cache</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/cache/delete">
                <NavDropdown.Item>Delete Cache</NavDropdown.Item>
              </LinkContainer>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/api/diag/bundle">Diagnostics Bundle</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          { state.isUserloggedIn &&
            <Nav className="ms-auto">
              <NavDropdown title={state.userInfo.userName} id="nav-dropdown-login">
                <NavDropdown.Item href="/logout">Log Out</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          }
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
