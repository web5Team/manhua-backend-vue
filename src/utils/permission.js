import store from '@/store'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters && store.getters.roles
    const permissionRoles = value

    const hasPermission = roles.some(role => {
      return permissionRoles.includes(role)
    })

    if (!hasPermission) {
      return false
    }
    return true
  } else {
    console.error(`need roles! Like v-permission="['admin','editor']"`)
    return false
  }
}

/*
* @param {Array} value
* @returns {Boolean}
*/
export function checkPermissionV2(value) {
  if (value && value instanceof Array && value.length > 0) {
    const all_permission = '*:*:*'
    const permissions = store.getters && store.getters.permisaction
    const hasPermissions = permissions.some(permission => {
      return all_permission === permission || value.includes(permission)
    })
    return hasPermissions
  } else {
    console.error(`请传入数组`)
    return false
  }
}
