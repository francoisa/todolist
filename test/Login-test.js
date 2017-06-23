import React from 'react';
import ReactDOM from 'react-dom';
import { expect } from 'chai';
import { Row, FormGroup } from 'react-bootstrap';
import { mount, render } from 'enzyme';
import { Login } from '../src/components/Login';

const ReactShallowRenderer  = require('react-test-renderer/shallow');
const shallow = new ReactShallowRenderer();

describe('The Login component', () => {
  let user;
  let mountedLogin;
  const login = () => {
    let nop = () => {};
    user = { message: "Please login" };
    if (!mountedLogin) {
      mountedLogin = mount(
        <Login user={user}
        />
      );
    }
    return mountedLogin;
  }

	it("contains component 'Row'", () => {
    expect(login().find(Row).length).to.be.at.least(1);
	});

  it("contains component 'input'", () => {
    expect(login().find('input')).to.have.length(2);
	});

  it ("has a 'user' property", () => {
    expect(login().props().user).to.exist;
  });
});
