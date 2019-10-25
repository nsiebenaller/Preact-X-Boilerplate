import axios from 'axios'
import {IS_DEV} from '../index.js'
import {
  convertDateFields,
  getMockData,
  downloadFile
} from '../helpers.js'
import { loadMockData } from '@Helpers'
import API from '../API.js';

const prettyLabels = {
  before: "Before Compliance Run",
  after: "After Compliance Run",
  failed: "Apps Failed Compliance",
  expedited: "Expedited Review"
}


export const runBeforeAfterReport = async (reportObj) => {
  let resp
  if(IS_DEV) {
    const mockData = await loadMockData(IS_DEV)
    resp = await getMockData(mockData.beforeAfterReport, 500)
  }
  else {
    resp = await API.post('/eBRAP/Services/api/reports/ba_report', reportObj)
  }
  const {data} = resp
  const formatted = Object.keys(data).reduce((acc, curr) => {
    const tmp = data[curr].map(obj => ({...obj, display: prettyLabels[curr]}))
    acc = acc.concat(tmp)
    return acc
  }, [])
  return formatted
}
export const downloadBeforeAfterReport = async (reportObj) => {
  let resp
  if(IS_DEV) {
    downloadFile("!@#DSDZFESFF", 'ba_report.txt')
  }
  else {
    resp = await axios({
      url: '/eBRAP/Services/api/download_ba_report',
      method: 'POST',
      responseType: 'blob',
      data: reportObj
    })
    downloadFile(resp.data, 'ba_report.xlsx')
  }
  return true
}

export const runCompLogReport = async (reportObj) => {
  let resp
  if(IS_DEV) {
    const mockData = await loadMockData(IS_DEV)
    resp = await getMockData(mockData.compLogReport, 500)
  }
  else {
    resp = await API.post('/eBRAP/Services/api/run_comp_log_report', reportObj)
  }
  return resp.data
}
export const downloadCompLogReport = async (reportObj) => {
  let resp
  if(IS_DEV) {
    const url = window.URL.createObjectURL(new Blob(["!@#DSDZFESFF"]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'compliance_log.txt')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  else {
    resp = await axios({
      url: '/eBRAP/Services/api/download_comp_log_report',
      method: 'POST',
      responseType: 'blob',
      data: reportObj
    })
    const url = window.URL.createObjectURL(new Blob([resp.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'compliance_log.xlsx')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  return true
}

export const doQueryRunner = async (request) => {
  let resp
  if(IS_DEV) {
    console.log("DO QUERY RUNNER")
  }
  else {
    resp = await axios({
      url: '/eBRAP/Services/api/reports/query_runner',
      method: 'POST',
      responseType: 'blob',
      data: request
    })
  }
  return resp
}

export const getSystemReport = async () => {
  let resp
  if(IS_DEV) {
    resp = await getMockData({
      freeSpaceMB: 1200,
      totalSpaceMB: 20000,
      authUsers: 12,
      activeSessions: 15
    }, 500)
  }
  else {
    resp = await API.get("/eBRAP/Services/api/reports/system")
  }
  return resp
}

export const getFO = async () => {
  let resp
  if(IS_DEV) {
    const mockData = await loadMockData(IS_DEV)
    resp = await getMockData(mockData.getFundingOpps, 100)
  }
  else {
    resp = await API.get('/eBRAP/Services/api/get_FO')
  }
  resp.data.unshift({
        "value": "All",
        "label": "All"
      })
  return resp.data
}

export const getOrganizations = async (orgTypes) => {
  let orgs
  let resp
  if(IS_DEV) {
    const mockData = await loadMockData(IS_DEV)
    resp = await getMockData(mockData.organizationData, 100)
    orgs = resp.data.organizations
  }
  else {
    orgs = await getAllOrgs([], 1, orgTypes)
  }
  return orgs
}

async function getAllOrgs(orgs = [], offset = 1, orgTypes) {
  const limit = 10000
  const resp = await API.post(`/eBRAP/Services/api/organizations/limit/${limit}/offset/${offset}/`, orgTypes )
  if(resp.data.length === limit) {
    getAllOrgs(orgs.concat(resp.data), (offset*limit)-offset, orgTypes)
  }
  return orgs.concat(resp.data)
}
