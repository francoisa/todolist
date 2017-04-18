import React, { Component } from 'react';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

export class TodoListApp extends Component {
  listItems() {
    const { msg } = this.props
    return (<div>
      <ul>
      <li>item 1</li>
      <li>item 2</li>
      </ul>
      </div>);
  }

  addItem() {
    let item;
    return (<div>
      <input
        type="text"
        className="form-control"
        ref={ node => item = node }
        placeholder="enter text"/>
      <Button onClick={() => this.props.addItem(item.value) }>Add</Button>
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
