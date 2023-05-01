import React, { useEffect } from 'react'
import useApi from '../../hooks/useApi'
import { getUnits } from './../../api/unit'

const Unit = () => {
  const getUnitsApi = useApi(getUnits)
  useEffect(() => {
    getUnitsApi.request()
  }, [])

  return (
    <>
      <div>
        <h1>Units</h1>
        {getUnitsApi.loading && <p>Posts are loading!</p>}
        {getUnitsApi.error && <p>{getUnitsApi.error}</p>}
        <ul>
          {getUnitsApi.data?.map((unit) => (
            <li key={unit.id}>{unit.name}</li>
          ))}
        </ul>
      </div>
    </>
  )
}
export default Unit
