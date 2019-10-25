import axios from 'axios'
import {IS_DEV} from '../index.js'
import {
  convertDateFields,
  getMockData
} from '../helpers.js'
import { loadMockData } from '@Helpers'
import API from '../API.js';

export const getFundingOpportunities = async (fiscalYear) => {
  let resp
  if(IS_DEV) {
    const mockData = await loadMockData(IS_DEV)
    resp = await getMockData(mockData.fundingOppsData, 100)
    resp.data = resp.data.filter(fo => fo.fy === fiscalYear)
  }
  else {
    resp = await API.get('/eBRAP/Services/api/funding_opportunities', {params: {fy: fiscalYear}})
  }
  return resp.data
}
