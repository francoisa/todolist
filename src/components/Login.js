import React, { Component } from 'react';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

export class LoginApp extends Component {
  renderWelcomeMessage() {
    const { msg } = this.props
    return (<div>
      {msg}
      </div>);
  }

  renderInput() {
    let user, pwd;
    return (<div>
      <input
        type="text"
        className="form-control"
        ref={ node => user = node }
        placeholder="username"/>
      <br/>
      <input
        type="password"
        className="form-control"
        ref={ node => pwd = node }
        placeholder="password"/>
      <br/>
      <Button onClick={() => this.props.onLogin(user.value, pwd.value) }>Log in</Button>
    </div>)
  }

  render () {
    return (
      <Grid>
        <Row>
          <Col xs={4} md={4}>
            {this.renderWelcomeMessage()}
          </Col>
        </Row>
        <Row>
          <Col xs={4} md={4}>
            {this.renderInput()}
          </Col>
        </Row>
      </Grid>
    );
  }
};
