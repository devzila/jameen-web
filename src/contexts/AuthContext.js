import { createContext } from 'react'
import { loadMetaData } from './../services/MetaDataLoader'
export const AuthContext = createContext('')
export const initialAuthState = {
  isAutheticated: localStorage.getItem('token') !== null,
  user: JSON.parse(localStorage.getItem('user')),
  token: localStorage.getItem('token'),
}

export const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('user', JSON.stringify(action.payload.object))
      localStorage.setItem('token', action.payload.token)
      loadMetaData()
      return {
        ...state,
        isAutheticated: true,
        user: action.payload.user,
        token: action.payload.token,
      }
    case 'LOGOUT':
      localStorage.clear()
      return { ...state, isAutheticated: false, user: null, token: null }
    default:
      return state
  }
}
