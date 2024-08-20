import React, { useState } from 'react'
import useFetch from 'use-http'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button, Modal } from 'react-bootstrap'
import PropTypes from 'prop-types'

function Delete({ unitId, after_submit }) {
  const { propertyId } = useParams()
  const { del, response } = useFetch()
  const [visible, setVisible] = useState(false)

  const handleDelete = async () => {
    await del(`/v1/admin/premises/properties/${propertyId}/units/${unitId}`)
    if (response.ok) {
      console.log(response)
      toast('Unit deleted successfully')
    } else {
      toast.error(response.data?.message)
    }
    setVisible(false)
  }

  return (
    <div>
      <button
        type="button"
        className="btn custom_red_button"
        data-mdb-ripple-init
        onClick={() => setVisible(!visible)}
      >
        Delete
      </button>

      <Modal show={visible} onHide={() => setVisible(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Unit</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this unit?</Modal.Body>
        <Modal.Footer>
          <Button className="custom_grey_button" onClick={() => setVisible(false)}>
            Cancel
          </Button>
          <Button className="custom_red_button" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
Delete.propTypes = {
  unitId: PropTypes.string,

  after_submit: PropTypes.func,
}

export default Delete
