import { createContext } from 'react'
import { loadMetaData } from './../services/MetaDataLoader'

export const AuthContext = createContext('')

export const initialAuthState = {
  isAutheticated: localStorage.getItem('token') !== null,
  user: JSON.parse(localStorage.getItem('user')),
  company: JSON.parse(localStorage.getItem('company')),
  token: localStorage.getItem('token'),
  roles: JSON.parse(localStorage.getItem('user'))?.role,
}

export const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('user', JSON.stringify(action.payload.object))
      localStorage.setItem('company', JSON.stringify(action.payload.object?.company || null))
      localStorage.setItem('token', action.payload.token)
      loadMetaData()

      return {
        ...state,
        isAutheticated: true,
        user: action.payload.object,
        company: action.payload.object?.company || null,
        token: action.payload.token,
        roles: action.payload.object.role,
      }
    case 'UPDATE_USER':
      localStorage.setItem('user', JSON.stringify(action.payload))
      return {
        ...state,
        user: action.payload,
        roles: action.payload?.role,
      }
    case 'LOGOUT':
      localStorage.clear()
      return { ...state, isAutheticated: false, user: null, company: null, token: null, roles: {} }
    default:
      return state
  }
}
