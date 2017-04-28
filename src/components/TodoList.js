import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import { addItem } from '../actions/todolist'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

class TodoList extends Component {
  listItems() {
    const { todolist } = this.props;
    let list = [];
    if (todolist && todolist.items) {
      list = todolist.items.map((item, i) => {
        return <li key={i}>
                <Button className="xs" onClick={() => this.props.onDelItem(item.id) }>Del</Button>
                &nbsp;&nbsp;{item.name}
               </li>
      })
    }
    return (<ul>{list}</ul>);
  }

  addItem() {
    let item;
    return (<div>
      <input
        type="text"
        className="form-control"
        ref={ node => item = node }
        placeholder="enter text"/>
      <Button onClick={() => this.props.onAddItem(item.value) }>Add</Button>
    </div>)
  }

  render () {
    return (
      <Grid>
        <Row>
          <Col xs={4} md={4}>
            {this.addItem()}
          </Col>
        </Row>
        <Row>
          <Col xs={4} md={4}>
            {this.listItems()}
          </Col>
        </Row>
      </Grid>
    );
  }
};

const mapStateToProps = state => ({
  todolist: state.todolist
})

const mapDispatchToProps = dispatch => ({
  onAddItem(item) { dispatch(addItem(item))}
})

export const TodoListApp = connect(mapStateToProps, mapDispatchToProps)(TodoList)
