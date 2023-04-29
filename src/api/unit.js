import client from '../client'

export const getUnits = () => client.get('/v1/admin/users')
export const getUnit = (id) => client.get(`/v1/admin/units/${id}`)
