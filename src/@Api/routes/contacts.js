import { IS_DEV } from '../index.js'
import { getMockData } from '../helpers.js'
import { loadMockData } from '@Helpers'
import API from '../API.js';

/**
 * Updates selected contact's email
 * @param  {Number} appPkgId       ID of contact to update
 * @param  {String} contactType     Type of contact to update
 * @param  {String} email           New Email of selected contact
 */
export async function updateContactEmail(request) {
  let resp
  if(IS_DEV) {
    resp = await getMockData({ success: true }, 1000)
  }
  else {
    resp = await API.post('/eBRAP/Services/api/contacts/update', request)
  }
  return resp
}
