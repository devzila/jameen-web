export function processPrivileges(role, keys) {
  if (role?.is_admin) {
    return true
  } else {
    return getValueByPath(role, keys)
  }
}

function getValueByPath(roles, keys) {
  return keys.reduce((item, key) => {
    if (item && key in item) {
      return item[key]
    }
    return false
  }, roles)
}
