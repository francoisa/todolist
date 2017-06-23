import React from 'react';
import ReactDOM from 'react-dom';
import { expect } from 'chai';
import { Row, FormGroup } from 'react-bootstrap';
import { mount, render } from 'enzyme';
import { TodoList } from '../src/components/TodoList';

const ReactShallowRenderer  = require('react-test-renderer/shallow');
const shallow = new ReactShallowRenderer();

describe('The TodoList component', () => {
  let user;
  let mountedTodoList;
  const todoList = () => {
    let nop = () => {};
    user = { username: "afrancois" };
    if (!mountedTodoList) {
      mountedTodoList = mount(
        <TodoList initTodoList={nop} user={user}
        />
      );
    }
    return mountedTodoList;
  }

	it("contains component 'Row'", () => {
    const todo = todoList();
    expect(todo.find(Row).length).to.be.at.least(1);
	});

  it("contains component 'FormGroup'", () => {
    const todo = todoList();
    expect(todo.find(FormGroup)).to.have.length(1);
	});

  it ("has a 'user' property", () => {
    const todo = todoList();
    expect(todo.props().user).to.exist;
  });

  it ("has an 'initTodoList' property", () => {
    const todo = todoList();
    expect(todo.props().initTodoList).to.exist;
  });
});
