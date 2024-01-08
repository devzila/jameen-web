import React, { useState } from 'react'
import useFetch from 'use-http'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button, Modal } from 'react-bootstrap'
import PropTypes from 'prop-types'

function Delete({ unitid }) {
  const { propertyId } = useParams()
  const { del, response } = useFetch()
  const [visible, setVisible] = useState(false)
  const navigate = useNavigate()

  const handleDelete = async () => {
    const apiResponse = await del(`/v1/admin/premises/properties/${propertyId}/units/${unitid.id}`)
    if (apiResponse.ok) {
      toast('Unit deleted successfully')
      navigate(`/properties/${propertyId}/units`)
    } else {
      toast(response.data?.message)
    }
    setVisible(false)
  }

  return (
    <div>
      <button
        style={{
          backgroundColor: 'white',
          marginLeft: '4px',
          width: '90%',
          border: 'none',
          color: '#00bfcc',
        }}
        type="button"
        className="btn btn-tertiary "
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
          <Button variant="secondary" onClick={() => setVisible(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
Delete.propTypes = {
  unitid: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
}

export default Delete
