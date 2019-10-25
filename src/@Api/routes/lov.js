import axios from 'axios'
import {IS_DEV} from '../index.js'
import {
  convertDateFields,
  getMockData
} from '../helpers.js'
import { loadMockData } from '@Helpers'
import API from '../API.js';

export const createLOV = async (lovObj) => {
  let resp
  if(IS_DEV) {
    resp = await getMockData({success: true}, 500)
  }
  else {
    resp = await API.post('/eBRAP/Services/api/lov/create', lovObj)
  }
  return resp.data
}
export const updateLOV = async (lovObj) => {
  let resp
  if(IS_DEV) {
    resp = await getMockData({success: true}, 500)
  }
  else {
    resp = await API.put('/eBRAP/Services/api/lov/update', lovObj)
  }
  return resp.data
}
export const deleteLOV = async (id) => {
  let resp
  if(IS_DEV) {
    resp = await getMockData({success: true}, 500)
  }
  else {
    resp = await API.delete(`/eBRAP/Services/api/lov/delete/${id}`)
  }
  return resp.data
}

export const getLovList = async (type = null, returnDeleted = true) => {
  let resp
  if(IS_DEV) {
    const mockData = await loadMockData(IS_DEV)

    if(type === "ORGANIZATION_FILE_TYPE") {
      resp = await getMockData(mockData.lovOrgFileTypes, 500)
    }
    else if(type === "POST_AWARD_FILE_TYPE") {
      resp = await getMockData(mockData.postAwardFileTypes , 500)
    }
    else if(type === "COMPLIANCE_ROLE") {
      resp = await getMockData(mockData.complianceRoles , 500)
    }
    else if(type === "ORGANIZATION_ROLE") {
      resp = await getMockData(mockData.organizationRoles , 500)
    }
    else if(type === "SYSTEM_ROLE") {
      resp = await getMockData(mockData.systemRoles , 500)
    }
    else {
      resp = await getMockData(mockData.lovList, 500)
    }
  }
  else {
    resp = await API.get('/eBRAP/Services/api/lov', {params: {type: type, returnDeleted: returnDeleted}})
  }
  return resp.data
}
