import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import PropTypes from 'prop-types'

export default function ConfirmationPopup({ sure_callback, message, visible, hide_show, button }) {
  const handleAfterConfirmation = async () => {
    sure_callback()
  }
  console.log(button)
  return (
    <div>
      {button}
      <Modal show={visible} onHide={hide_show}>
        <Modal.Header closeButton>
          <Modal.Title>{message?.header}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message?.body}</Modal.Body>
        <Modal.Footer>
          <Button className="custom_grey_button" onClick={hide_show}>
            Cancel
          </Button>
          <Button className="custom_red_button" onClick={handleAfterConfirmation}>
            {message?.button_name || 'Sure'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
ConfirmationPopup.propTypes = {
  message: PropTypes.object,
  sure_callback: PropTypes.func,
  visible: PropTypes.bool,
  button: PropTypes.element,
  hide_show: PropTypes.func,
}
