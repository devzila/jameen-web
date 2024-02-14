import React, { useState, useEffect } from 'react'
import useFetch from 'use-http'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'

export default function BillableItems() {
  const [billableItems, setBillableItems] = useState([])
  const { get } = useFetch()
  const { propertyId, unitTypeId } = useParams()

  useEffect(() => {
    fetchBillableItems()
  }, [propertyId, unitTypeId])
  console.log('Unit Type ID:', unitTypeId)

  async function fetchBillableItems() {
    try {
      const billableItemsData = await get(
        `/v1/admin/premises/properties/${propertyId}/unit_types/${unitTypeId}/billable_items`,
      )
      console.log(billableItemsData)
      if (billableItemsData && billableItemsData.data) {
        setBillableItems(billableItemsData.data)
      }
    } catch (error) {
      console.error('Error fetching billable items:', error)
    }
  }

  return (
    <>
      <h2>Billable Items</h2>
      <div className="row">
        {billableItems.map((item) => (
          <div key={item.id} className="col-md-6">
            <div className="card p-3 m-3" style={{ border: '0px' }}>
              <div className="list-group-item">
                <strong>{item.name}</strong>
                <hr style={{ color: '#C8C2C0' }} />
              </div>
              <div className="row">
                <div className="col-md-6 p-3 mt-0 fw-light" style={{ color: '#00bfcc' }}>
                  Description
                  <p className="fw-normal">{item.description}</p>
                </div>
                <div className="col-md-6 p-3 mt-0 fw-light" style={{ color: '#00bfcc' }}>
                  Billable Type
                  <p className="fw-normal">{item.billable_type}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 p-3 mt-0 fw-light" style={{ color: '#00bfcc' }}>
                  Monthly Amount
                  <p className="fw-normal">{item.monthly_amount}</p>
                </div>
                <div className="col-md-6 p-3 mt-0 fw-light" style={{ color: '#00bfcc' }}>
                  VAT Percent
                  <p className="fw-normal">{item.vat_percent}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 p-3 mt-0 fw-light" style={{ color: '#00bfcc' }}>
                  Created At
                  <p className="fw-normal">{item.created_at}</p>
                </div>
                <div className="col-md-6 p-3 mt-0 fw-light" style={{ color: '#00bfcc' }}>
                  Updated At
                  <p className="fw-normal">{item.updated_at}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

BillableItems.propTypes = {
  propertyId: PropTypes.string.isRequired,
  unitTypeId: PropTypes.string.isRequired,
}
