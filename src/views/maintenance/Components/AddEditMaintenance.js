import React, { useState } from 'react'
import PropTypes from 'prop-types'
import CommonModal from 'src/views/shared/CommonModal'
import MaintenanceForm from './MaintenanceForm'

export default function AddEditMaintenance({ type, id, refreshData, api_endpoint }) {
  const [visible, setVisible] = useState(false)

  function handleClose() {
    setVisible(false)
  }

  return (
    <CommonModal
      data={[{ header: 'Maintenance Requests', size: 'xl' }]}
      component={
        <button
          type="button"
          className={`'btn s-3' ${type == 'edit' ? 'tooltip_button' : 'custom_theme_button'}`}
          data-mdb-ripple-init
          onClick={() => setVisible(!visible)}
        >
          {type == 'edit' ? 'Edit' : 'Create Request'}
        </button>
      }
      visible={visible}
      body={
        <MaintenanceForm
          handleClose={handleClose}
          data_array={[type, id]}
          refreshData={refreshData}
          api_endpoint={api_endpoint}
        />
      }
      handleClose={handleClose}
    />
  )
}

AddEditMaintenance.propTypes = {
  type: PropTypes.string,
  id: PropTypes.number,
  refreshData: PropTypes.func,
  api_endpoint: PropTypes.func,
}
