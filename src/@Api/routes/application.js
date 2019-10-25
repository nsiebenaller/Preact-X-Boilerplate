import {IS_DEV} from '../index.js'
import {
  convertDateFields,
  getMockData,
  downloadFile,
} from '../helpers.js'
import { loadMockData } from '@Helpers'
import API from '../API.js'

function getPrincipalInvestigator(data) {
  const pi = data.principalInvestigators.find((pi) => pi.type === 'POSTAWARD_PI') !== undefined ?
    data.principalInvestigators.find((pi) => pi.type === 'POSTAWARD_PI') :
      (data.principalInvestigators.find((pi) => pi.type === 'FULLAPP_PI') !== undefined ?
        data.principalInvestigators.find((pi) => pi.type === 'FULLAPP_PI') :
          (data.principalInvestigators.find((pi) => pi.type === 'PREAPP_PI') !== undefined ?
            data.principalInvestigators.find((pi) => pi.type === 'PREAPP_PI') : {firstName: '', lastName: ''}))
  return pi.firstName+" "+pi.lastName
}

function getTitle(app) {
  return (app.titles.length > 0) ? app.titles[0] : ''
}

export const getOrgApps = async (fiscalYear = null, org = null, userID = null) => {
  let resp
  if(IS_DEV) {
    resp = await getMockData([], 100)
    let applications = resp.data.applications
    if(fiscalYear) {
      applications = resp.data.applications.filter(app => app.fy === fiscalYear)
    }
    if(org) {
      const orgMap = ["", "Zero Inc.", "My Special Org","Temp Org"]
      const selOrgname = orgMap[org]
      applications = resp.data.applications.filter(app => app.org === selOrgname)
    }
    return convertDateFields(applications, ["preDueDate", "fullDueDate"])
  }
  else {
    resp = await API.get('/eBRAP/Services/api/applications', {params: {fy: fiscalYear, orgId: org, userID: userID}})

    if(resp.data.applications === resp.data.limit) {
      console.log("application list incomplete - ask for more apps")
    }
    const newApps = convertDateFields(resp.data.applications, ["preAppDueDate", "fullAppDueDate"])
    const setApps = newApps.map((app) => { return({ ...app, piFullname: getPrincipalInvestigator(app), title: getTitle(app) }) })
    return setApps
  }
}

export const getAppsByOrgIDs = async (orgIDs = [], fy = null, limit = 1000, offset = 0) => {
  let resp
  if(IS_DEV) {
    const mockData = await loadMockData(IS_DEV);
    resp = await getMockData(mockData.apps, 100)
    const newApps = convertDateFields(resp.data.applications, ["preAppDueDate", "fullAppDueDate"])
    const setApps = newApps.map((app) => { return({ ...app, piFullname: getPrincipalInvestigator(app), title: getTitle(app) }) })
    return setApps
  }
  else {
    const request = {
      fy: fy,
      orgIds: orgIDs,
      limit: limit,
      offset: offset
    }
    resp = await API.post('/eBRAP/Services/api/applications/multipleOrgs', request)
    if(resp.data.applications === resp.data.limit) {
      console.log("application list incomplete - ask for more apps")
    }
    const newApps = convertDateFields(resp.data.applications, ["preAppDueDate", "fullAppDueDate"])
    const setApps = newApps.map((app) => { return({ ...app, piFullname: getPrincipalInvestigator(app), title: getTitle(app) }) })
    return setApps
  }
}

export const findAppsByLogno = async (logno) => {
  let resp
  if(IS_DEV) {
    const mockData = await loadMockData(IS_DEV)
    resp = await getMockData(mockData.findApps, 100)
  }
  else {
    resp = await API.get('/eBRAP/Services/api/applications/find', {params: {logNo: logno}})
  }
  return resp.data
}
export const getAppInfo = async (id) => {
  let resp
  if(IS_DEV) {
    const mockData = await loadMockData(IS_DEV)
    resp = await getMockData(mockData.appInfo[id], 100)
    if(!resp.data) {
      return mockData.appInfo[1]
    }
  }
  else {
    resp = await API.get('/eBRAP/Services/api/applications/info/', {params: {appPkgId: id}})
  }
  return resp.data
}

export const getAppsLike = async (logno = null, awardNumber = null) => {
  let resp
  if(IS_DEV) {

    resp = await getMockData([], 100)
    if(logno) {
      resp = resp.data.filter(app => app.logno.includes(logno))
    }
    if(awardNumber) {
      resp = resp.data.filter(app => app.awardNumber.includes(awardNumber))
    }
  }
  else {
    resp = await API.get('/eBRAP/Services/api/get_apps_like', {params: {logno: logno, awardNumber: awardNumber}})
  }
  let updated = convertDateFields(resp.data, ["preDueDate", "fullDueDate"])
  return updated
}

export const updateApplication = async (appObj) => {
  let resp
  if(IS_DEV) {
    resp = await getMockData({success: true}, 500)
  }
  else {
    resp = await API.put('/eBRAP/Services/api/applications/update', appObj)
  }
  return resp.data
}

export const deleteApp = async (appID, appType) => {
  let resp
  if(IS_DEV) {
    resp = await getMockData({success: true}, 500)
  }
  else {
    resp = await API.delete('/eBRAP/api/applications/delete', {params: {id: appID, appType: appType}})
  }
  return resp.data
}
