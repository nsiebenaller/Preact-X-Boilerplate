import axios from 'axios'
import {IS_DEV} from '../index.js'
import {
  convertDateFields,
  getMockData
} from '../helpers.js'
import { loadMockData } from '@Helpers';
import API from '../API.js';

export const getUser = async () => {
  let resp
  const userID = (window.userID)
  if(IS_DEV) {
    const mockData = await loadMockData(IS_DEV)
    resp = await getMockData(mockData.users, 100)
  }
  else {
    resp = await API.get(`/eBRAP/Services/api/get_user/id/${userID}/`)
  }
  const user = { ...resp.data, id: userID }
  return user
}


//TODO: LOCK STATUS AND ACTIVE STATUS BOOL

export const findUsers = async (reqObj) => {
  let resp
  if(IS_DEV) {
    const mockData = await loadMockData(IS_DEV)
    resp = await getMockData(mockData.findUsersData, 100)
  }
  else {
    resp = await API.post('/eBRAP/Services/api/users/find', reqObj)
  }
  return resp.data
}

export const editUser = async (userObj) => {
  let resp
  if(IS_DEV) {
    resp = await getMockData({success: true}, 500)
  }
  else {
    resp = await API.put('/eBRAP/Services/api/users/edit', userObj)
  }
  return resp.data
}

export const unlockUsers = async (reqObj) => {
  let resp
  if(IS_DEV) {
    resp = await getMockData({success: true}, 500)
  }
  else {
    resp = await API.put('/eBRAP/Services/api/users/unlock', reqObj)
  }
  return resp.data
}

export const createUser = async (reqObj) => {
  let resp
  if(IS_DEV) {
    resp = await getMockData({success: true}, 500)
  }
  else {
    resp = await API.post('/eBRAP/Services/api/users/create', reqObj)
  }
  return resp.data
}
