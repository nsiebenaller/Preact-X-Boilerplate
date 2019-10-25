import axios from 'axios'
import {IS_DEV} from '../index.js'
import {
  convertDateFields,
  getMockData
} from '../helpers.js'
import { loadMockData } from '@Helpers'
import API from '../API.js';

export const getMechanisms = async (foID, subType) => {
  let resp
  if(IS_DEV) {
    const mockData = await loadMockData(IS_DEV)
    resp = await getMockData(mockData.mechanismData, 100)
  }
  else {
    resp = await API.get('/eBRAP/Services/api/mechanisms', {params: {foID: foID, subType: subType}})
  }
  return resp.data
}
