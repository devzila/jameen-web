import React from 'react'
import PropTypes from 'prop-types'
import CIcon from '@coreui/icons-react'

export default function RoundedNavbar({ props: { icon, header } }) {
  return (
    <div className="d-flex justify-content-center ">
      <h3 className="text-center bg-white rounded-5 shadow-sm p-2 px-5 theme_color">
        <CIcon icon={icon} size="xl" className="mx-2" />
        {header}
      </h3>
    </div>
  )
}

RoundedNavbar.propTypes = {
  props: PropTypes.shape({
    icon: PropTypes.object,
    header: PropTypes.string,
  }).isRequired,
}
