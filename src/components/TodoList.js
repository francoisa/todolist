import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Nav, NavItem, Modal, Form, Grid, Row, Col, Button, ListGroup, ListGroupItem, FormGroup } from 'react-bootstrap';
import { editItem, addItem, delItem, listItems } from '../actions/todolist'
import { logout } from '../actions/user'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

class TodoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addItem: true,
      showEdit: false,
      editId: 0,
      editContent: "",
      editStat: "complete",
      editItem: false
    };
    this.statClass = {
      open: "info",
      "in progress": "success",
      complete: "danger"
    };
  }

  componentWillMount() {
    this.props.initTodoList(this.props.user);
  }

  onEditItem(username, id, content, status) {
    this.setState({showEdit: true, editId: id, editContent: content, editStat: status});
  }
  closeEdit() {
    this.setState({showEdit: false});
  }
  submitEdit(username, itemId, itemContent, stat) {
    this.closeEdit();
    this.props.onEditItem(username, itemId, itemContent, stat);
  }
  changeStatus(e) {
    this.setState({editStat: e.target.value});
  }
  listItems() {
    const { todolist } = this.props;
    const { username } = this.props.user;
    let itemId, itemContent, stat;
    if (todolist && todolist.length > 0) {
      let list = [];
      list = todolist.map((item, i) => {
        return <ListGroupItem key={i} bsStyle={this.statClass[item.status]}>
                <Button bsSize="xs" onClick={() => this.props.onDelItem(username, item.rowid) }>
                  Del
                </Button>
                &nbsp;|&nbsp;
                <Button bsSize="xs" onClick={() => this.onEditItem(username, item.rowid, item.content, item.status) }>
                  Edit
                </Button>
                &nbsp;&nbsp;[{item.status}]&nbsp;{item.content}
               </ListGroupItem>
      })
      itemContent = this.state.editContent;
      return (<Row>
                Todo List:
                <ListGroup>{list}</ListGroup>
                <Modal show={this.state.showEdit} onHide={() => this.closeEdit()}>
                  <Modal.Header closeButton>
                    <Modal.Title>Edit</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                  <Form inline>
                    <FormGroup bsSize="small">
                      <input
                        type="hidden"
                        value={this.state.editId}
                        ref={ node => itemId = node }
                        />
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={this.state.editContent}
                        ref={ node => itemContent = node }
                        placeholder="enter text"
                        onChange={(e) => this.editItem(e.target.value)}
                        />
                        &nbsp;
                      <label>Status:</label>
                      <select
                        ref={ node => stat = node }
                        value={this.state.editStat}
                        name="status"
                        onChange={(e) => this.changeStatus(e)}>
                        <option>open</option>
                        <option>in progress</option>
                        <option>complete</option>
                      </select>
                      &nbsp;
                      <Button
                        bsSize="xs"
                        bsStyle="primary"
                        disabled={this.state.editItem}
                        onClick={() => this.submitEdit(username, itemId.value, itemContent.value, stat.value) }
                        >
                        Submit
                      </Button>
                    </FormGroup>
                  </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button onClick={() => this.closeEdit()}>Close</Button>
                  </Modal.Footer>
                </Modal>
              </Row>);
    }
    else {
      return (<Row>Your list is empty</Row>);
    }
  }

  hasItem(item) {
    if (item && item !== '') {
      this.setState({addItem: false});
    }
    else {
      this.setState({addItem: true});
    }
  }

  editItem(item) {
    if (item && item !== '') {
      this.setState({editItem: false});
    }
    else {
      this.setState({editItem: true});
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
        &nbsp;
        <Button
          bsSize="xs"
          bsStyle="primary"
          disabled={this.state.addItem}
          onClick={() => this.props.onAddItem(username, item.value, stat.value) }>
          Add
        </Button>
    </FormGroup>
    </Form>)
  }

  render () {
    return (
      <Grid>
        <Row>
          <Col xs={8} md={8}>
            <Nav bsStyle="pills" pullRight={true} activeKey={1}>
                <NavItem
                  eventKey={1}
                  onClick={() => this.props.onLogout()}>
                  Logout
              </NavItem>
            </Nav>
          </Col>
        </Row>
        <Row>&nbsp;</Row>
        <Row>
          <Col xs={8} md={8}>
            {this.addItem()}
          </Col>
        </Row>
        <Row>&nbsp;</Row>
        <Row>
          <Col xs={8} md={8}>
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
  onLogout() { dispatch(logout()) },
  initTodoList(user) { dispatch(listItems(user))},
  onAddItem(user, item, stat) { dispatch(addItem(user, item, stat))},
  onEditItem(user, id, item, stat) { dispatch(editItem(user, id, item, stat))},
  onDelItem(user, id) { dispatch(delItem(user, id)) }
})

export const TodoListApp = connect(mapStateToProps, mapDispatchToProps)(TodoList)
