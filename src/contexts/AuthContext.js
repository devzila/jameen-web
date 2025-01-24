import { createContext } from 'react'
import { loadMetaData } from './../services/MetaDataLoader'

export const AuthContext = createContext('')

export const initialAuthState = {
  isAutheticated: localStorage.getItem('token') !== null,
  user: JSON.parse(localStorage.getItem('user')),
  token: localStorage.getItem('token'),
  roles: JSON.parse(localStorage.getItem('user'))?.role,
}

export const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('user', JSON.stringify(action.payload.object))
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('token', action.payload.object.role)
      loadMetaData()

      return {
        ...state,
        isAutheticated: true,
        user: action.payload.object,
        token: action.payload.token,
        roles: action.payload.object.role,
      }
    case 'LOGOUT':
      localStorage.clear()
      return { ...state, isAutheticated: false, user: null, token: null, roles: {} }
    default:
      return state
  }
}
