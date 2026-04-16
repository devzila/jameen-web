export function processPrivileges(role, keys) {
  return getRolesValueFromKeys(role, keys)
}

function getRolesValueFromKeys(roles, keys) {
  return keys.reduce((acc, key) => {
    return acc && acc[key] !== undefined ? acc[key] : false
  }, roles)
}
