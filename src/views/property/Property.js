import React from 'react'
import { useParams } from 'react-router-dom'

export default function Property() {
  const { propertyId } = useParams()

  return <div>Property Show for id: {propertyId} </div>
}
