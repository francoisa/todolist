import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Form, Grid, Row, Col, Button, ListGroup, ListGroupItem, FormGroup } from 'react-bootstrap';
import { addItem, delItem, listItems } from '../actions/todolist'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

class TodoList extends Component {
  constructor(props) {
    super(props);
    this.state = { item: true };
  }

  componentWillMount() {
    this.props.initTodoList(this.props.user);
  }
  
  listItems() {
    const { todolist } = this.props;
    const { username } = this.props.user;
    if (todolist && todolist.length > 0) {
      let list = [];
      list = todolist.map((item, i) => {
        return <ListGroupItem key={i}>
                <Button bsSize="xs" onClick={() => this.props.onDelItem(username, item.rowid) }>Del</Button>
                &nbsp;&nbsp;{item.content}
               </ListGroupItem>
      })
      return (<Row>Todo List:<ListGroup>{list}</ListGroup></Row>);
    }
    else {
      return (<Row>Your list is empty</Row>);
    }
  }

  hasItem(item) {
    if (item && item !== '') {
      this.setState({item: false});
    }
    else {
      this.setState({item: true});
    }
  }

  addItem() {
    let item, stat;
    const { username } = this.props.user;
    return (<Form inline>
      <FormGroup bsSize="small">
      <input
        type="text"
        className="form-control"
        ref={ node => item = node }
        placeholder="enter text"
        onChange={(e) => this.hasItem(e.target.value)}/>
        &nbsp;
        <label>Status:</label>
        <select
          ref={ node => stat = node }
          name="status">
          <option>open</option>
          <option>in progress</option>
          <option>complete</option>
        </select>
      <Button
        bsSize="xs"
        bsStyle="primary"
        disabled={this.state.item}
        onClick={() => this.props.onAddItem(username, item.value, stat.value) }>
        Add
      </Button>
    </FormGroup>
    </Form>)
  }

  render () {
    return (
      <Grid>
        <Row>&nbsp;</Row>
        <Row>
          <Col xs={8} md={8}>
            {this.addItem()}
          </Col>
        </Row>
        <Row>&nbsp;</Row>
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
  todolist: state.todolist.items,
  user: state.user.user
})

const mapDispatchToProps = dispatch => ({
  initTodoList(user) { dispatch(listItems(user))},
  onAddItem(user, item, stat) { dispatch(addItem(user, item, stat))},
  onDelItem(user, id) { dispatch(delItem(user, id)) }
})

export const TodoListApp = connect(mapStateToProps, mapDispatchToProps)(TodoList)
