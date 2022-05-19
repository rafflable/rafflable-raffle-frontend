import React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';

export class NotificationDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      modalClass: '',
    };
  }

  toggle = (e, str) => {
    this.setState({
      modal: !this.state.modal,
      modalClass: str,
    });
  };

  render() {
    return (
      <div>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.state.modalClass}>
          <ModalHeader toggle={this.toggle}>{this.props.title}</ModalHeader>
          <ModalBody>{this.props.notification}</ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle} className="text-uppercase">
              Dismiss
            </Button>
          </ModalFooter>
        </Modal>
        {React.cloneElement(this.props.children, {
          onClick: this.toggle,
        })}
      </div>
    );
  }
}

export class PageDialog extends React.Component {
  constructor(props) {
    super(props);
  }

  toggle = (e, str) => {
    this.props.setOpen(!this.props.isOpen);
  };

  render() {
    return (
      <div>
        <Modal isOpen={this.props.isOpen} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>{this.props.title}</ModalHeader>
          {this.props.children}
        </Modal>
      </div>
    );
  }
}
