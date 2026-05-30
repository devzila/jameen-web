import React from 'react'
import { NavLink } from 'react-router-dom'

const FinanceNav = () => {
  return (
    <div className="container-fluid" style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
      <div className="body-box-new sectio new-settings-box" style={{ border: 'none' }}>
        <div className="new-settings-menu">
          <div className="menu-list">
            <div>
              <NavLink to="/finance/invoices">Invoice</NavLink>
            </div>
            <div>
              <NavLink to="/finance/credit-notes">Credit Note</NavLink>
            </div>
            <div>
              <NavLink to="/finance/payments"> Payment </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default FinanceNav
