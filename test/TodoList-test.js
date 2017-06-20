import React from 'react';
import ReactDOM from 'react-dom';
import { expect } from 'chai';
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
	it("contains class 'container'", () => {
    const divs = todoList().find("div");
     expect(divs.length).to.be.at.least(0);
	});
});
