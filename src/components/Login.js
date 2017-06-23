import React, { Component } from 'react';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { login } from '../actions/user'

export class Login extends Component {
  renderWelcomeMessage() {
    const { message } = this.props.user
    return (<div>
      {message}
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

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = dispatch => ({
  onLogin(user, pwd) { dispatch(login(user, pwd))}
})

export const LoginApp = connect(mapStateToProps, mapDispatchToProps)(Login)
