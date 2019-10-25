import {IS_DEV} from '../index.js'
import {
  convertDateFields,
  getMockData
} from '../helpers.js'
import { loadMockData } from '@Helpers';
import API from '../API.js';


export const runCompliance = async (request) => {
  //console.log("REQUEST", request)
  let resp
  if(IS_DEV) {
    resp = await getMockData({success: true}, 100)
  }
  else {
    /**
      request
      {
        lognos: [],
        fundingOpportunities: [],
        action: preapp|fullapp,
        override: [] notes,files,data
      }
    **/
    resp = await API.post('/eBRAP/Services/api/compliance/run', request)
  }
  return resp.data
}
export const concatFiles = async (request) => {
  //console.log("REQUEST", request)
  let resp
  if(IS_DEV) {
    resp = await getMockData({success: true}, 100)
  }
  else {
    /**
      REQUEST
      {
        lognos: [],
        fundingOpportunities: [],
        action: preapp|fullapp
      }
    **/
    resp = await API.post('/eBRAP/Services/api/compliance/concatenate', request)
  }
  return resp.data
}
export const deleteCompliance = async (lognos, action) => {
  let resp
  if(IS_DEV) {
    resp = await getMockData({success: true}, 100)
  }
  else {
    const body = {
      lognos: lognos,
      action: action
    }
    resp = await API.delete('/eBRAP/Services/api/compliance/delete', body)
  }
  return resp.data
}

export async function getComplianceApplications(logNo) {
  let resp;
  if(IS_DEV) {
    const mockData = await loadMockData(IS_DEV);
    resp = await getMockData(mockData.complianceApplications, 500);
  }
  else {
    resp = await API.get('/eBRAP/Services/api/compliance/applications', { params: { logNo: logNo } });
  }
  return resp.data;
}

export async function deletePreAppCompliance(appPkgId) {
  let resp;
  if(IS_DEV) {
    resp = await getMockData({ success: true }, 500);
  }
  else {
    resp = await API.get('/eBRAP/Services/api/compliance/delete/pre_app', { params: { appPkgId: appPkgId } });
  }
  return resp.data;
}

export async function deleteFullAppCompliance(appPkgId) {
  let resp;
  if(IS_DEV) {
    resp = await getMockData({ success: true }, 500);
  }
  else {
    resp = await API.get('/eBRAP/Services/api/compliance/delete/full_app', { params: { appPkgId: appPkgId } });
  }
  return resp.data;
}
