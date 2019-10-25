import axios from 'axios'
import { IS_DEV } from '../index.js'
import {
  convertDateFields,
  getMockData,
  downloadFile
} from '../helpers.js'
import { loadMockData } from '@Helpers';
import API from '../API.js';

/**
 * Bundle Object
 * @type {Bundle}
 * @param {Number}            id
 * @param {String}            type
 * @param {Date}              startDate
 * @param {Date}              endDate
 * @param {String}            label
 * @param {Boolean}           isFinal
 * @param {Array<Document>}   documents
 */
/**
 * Document Object
 * @type {Document}
 * @param {Number}  id
 * @param {String}  name
 * @param {String}  type
 * @param {Date}    submittedOn
 * @param {Boolean} isRevised
 * @param {String}  revisionType
 * @param {Boolean} limitedDistribution
 */

/**
 * Retrieves Bundles & Documents associated with an Application
 * @param  {Number}  appPkgID   Application Package ID
 */
export const getSubmittedDocuments = async (appPkgID) => {
  let resp
  if(IS_DEV) {
    const mockData = await loadMockData(IS_DEV)
    resp = await getMockData(mockData.techSubmittedDocuments, 500)
  }
  else {
    resp = await API.get('/eBRAP/Services/api/technical_reports/submitted_documents', { params: { appPkgId: appPkgID } } )
  }
  return resp.data
}

/**
 * Updates a Bundle and/or Document
 * @param  {Number}     bundleID                  Bundle ID of the Bundle to update (may be null)
 * @param  {Number}     documentID                Document ID of the document to update (may be null)
 * @param  {Date}       startDate                 New Start Date to assign to the Bundle (do not update if null)
 * @param  {Date}       endDate                   New End Date to assign to the Bundle (do not update if null)
 * @param  {String}     name                      New Name to assign to the Document (do not update if null)
 * @param  {String}     label                     New Label to assign to the Document (do not update if null)
 * @param  {Boolean}    isFinal                   New Final Boolean to assign to the Bundle (do not update if null)
 * @param  {Boolean}    limitedDistribution       New LD Boolean to assign to the Document (do not update if null)
 *
 */
export const updateSubmittedDocuments = async (request) => {
  let resp
  if(IS_DEV) {
    resp = await getMockData({success: true}, 100)
  }
  else {
    resp = await API.post('/eBRAP/Services/api/technical_reports/submitted_documents/update', request)
  }
  return resp.data
}

/**
 * Gets Technical Report Labels for a given User
 * @param {Number} userID   User ID of the User to get tech report labels from
 */
export const getTechReportLabels = async (userID) => {
  let resp
  if(IS_DEV) {
    const mockData = await loadMockData(IS_DEV)
    resp = await getMockData(mockData.techLabels, 100)
  }
  else {
    resp = await API.get('/eBRAP/Services/api/technical_reports/labels', { params: { userId: userID } })
  }
  return resp.data
}

/**
 * Validate Technical Report Bundle & Documents
 * @param {Number}  appPkgId    Application Package ID to attach the Bundle to
 * @param {Bundle}  bundle      Bundle with Documents to validate
 */
export const validateBundle = async (request) => {
  let resp
  if(IS_DEV) {
    //resp = await getMockData({ success: true, messages: [] }, 1000)
    //resp = await getMockData({ success: false, messages: ['DATE_RANGE_CONFLICT'] }, 1000)
    //resp = await getMockData({ success: false, messages: ['REPORT_EXISTS', 'DD882', 'Semi-Annual Report'] }, 1000)
    //resp = await getMockData({ success: false, messages: ['DATE_OVERLAP'] }, 1000)
    //resp = await getMockData({ success: false, messages: ['FILE_MISSING'] }, 1000)
    resp = await getMockData({ success: false, messages: ['REPORT_EXISTS', 'DD882', 'Semi-Annual Report', 'DATE_RANGE_CONFLICT'] }, 1000)
  }
  else {
    resp = await API.post('/eBRAP/Services/api/technical_reports/validate', request)
  }
  return resp.data
}

/**
 * Create a new Bundle or Return an existing Bundle
 * @param {Bundle} bundle  Bundle with no Documents to create or return
 */
export const createTechReportBundle = async (request) => {
  let resp
  if(IS_DEV) {
    resp = await getMockData({ bundleID: 56 }, 1000)
  }
  else {
    resp = await API.post('/eBRAP/Services/api/technical_reports/bundle', request)
  }
  return resp.data
}

/**
 * Gets Technical Report File Types
 */
export const getTechReportFileTypes = async () => {
  let resp
  if(IS_DEV) {
    const mockData = await loadMockData(IS_DEV)
    resp = await getMockData(mockData.techFileTypes, 1000)
  }
  else {
    resp = await API.get('/eBRAP/Services/api/technical_reports/doc_types')
    resp.data = resp.data.docTypesMapByReportType
  }
  return resp.data
}

/**
 * Uploads a Technical Report File
 * @param   {Number}  bundleId              ID of the Bundle to associate this file with
 * @param   {File}    file                  File data
 * @param   {Number}  type                  Type of the file (ID of the LOV with type 'TECH_RPT_FILE_TYPE')
 * @param   {String}  revisedReason         Revision Reason {REVISED, ADMIN_CORRECTION, (null)}
 * @param   {Boolean} limitedDistribution   Whether the document is limited distribution
 */
export const uploadTechnicalReportFile = async (request) => {
  let resp
  if(IS_DEV) {
    resp = await getMockData({ success: true }, 1000)
  }
  else {
    const data = new FormData()
    data.append("bundleId", request.bundleId)
    data.append("file", request.file)
    data.append("type", request.type)
    data.append("revisedReason", request.revisedReason || '')
    data.append("limitedDistribution", request.limitedDistribution)

    resp = await API.post('/eBRAP/Services/api/technical_reports/upload', data)
  }
  return resp.data
}
