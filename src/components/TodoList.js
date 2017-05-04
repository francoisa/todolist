import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Grid, Row, Col, Button, ListGroup, ListGroupItem, FormGroup } from 'react-bootstrap';
import { addItem, delItem } from '../actions/todolist'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

class TodoList extends Component {
  listItems() {
    const { todolist } = this.props;
    const { username } = this.props.user;
    let list = [];
    if (todolist) {
      list = todolist.map((item, i) => {
        return <ListGroupItem key={i}>
                <Button bsSize="xs" onClick={() => this.props.onDelItem(username, item.rowid) }>Del</Button>
                &nbsp;&nbsp;{item.content}
               </ListGroupItem>
      })
    }
    return (<ListGroup>{list}</ListGroup>);
  }

  addItem() {
    let item, stat;
    const { username } = this.props.user;
    return (<form>
      <FormGroup bsSize="small">
      <input
        type="text"
        className="form-control"
        ref={ node => item = node }
        placeholder="enter text"/>
        <label>Status:</label>
        <select
          ref={ node => stat = node }
          name="status">
          <option>open</option>
          <option>in progress</option>
          <option>complete</option>
        </select>
      <Button bsSize="xs" onClick={() => this.props.onAddItem(username, item.value, stat.value) }>Add</Button>
    </FormGroup>
    </form>)
  }

  render () {
    return (
      <Grid>
        <Row>
          <Col xs={8} md={8}>
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
  todolist: state.user.itemList,
  user: state.user.user
})

const mapDispatchToProps = dispatch => ({
  onAddItem(item, stat) { dispatch(addItem(item, stat))},
  onDelItem(user, id) { dispatch(delItem(user, id)) }
})

export const TodoListApp = connect(mapStateToProps, mapDispatchToProps)(TodoList)
