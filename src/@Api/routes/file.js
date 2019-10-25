import axios from 'axios'
import {IS_DEV} from '../index.js'
import {
  convertDateFields,
  getMockData,
  downloadFile
} from '../helpers.js'
import { loadMockData } from '@Helpers'
import API from '../API.js';

export const uploadSingleFile = async (request) => {
  let resp
  if(IS_DEV) {
    resp = await getMockData({success: true}, 500)
  }
  else {
    const data = new FormData()
    data.append('appPkgId', request.appPkgId)
    data.append('relatedToId', request.relatedToId)
    data.append('relatedToTypeSysCode', request.relatedToTypeSysCode)
    data.append('fileTypeId', request.fileTypeId)
    data.append('documentTypeCritId', request.documentTypeCritId)
    data.append('file', request.file)
    data.append('uploadedBy', request.uploadedBy)
    data.append('fileDescription', request.fileDescription)
    resp = await API.post('/eBRAP/Services/api/files/upload', data)
  }
  return resp.data
}
export const validate425File = async (logno, fileData) => {
  let resp
  if(IS_DEV) {
    //resp = await getMockData({status: "appNoAward", fileID: "123"}, 500)
    //resp = await getMockData({status: "noMatch", fileID: "123"}, 500)
    //resp = await getMockData({status: "bothNoAward", fileID: "123"}, 500)
    //resp = await getMockData({status: "formNoAward", fileID: "123"}, 500)
    resp = await getMockData({status: "noPostAward", fileID: "123"}, 500)
  }
  else {
    const data = new FormData()
    data.append('logNo', logno)
    data.append('file', fileData)
    resp = await API.post('/eBRAP/Services/api/files/validate/SF-425', data)
  }
  return resp.data
}

/*DEPRECATED*/
export const uploadAppFile = async (logno, type, desc, fileData) => {
  let resp
  if(IS_DEV) {
    resp = await getMockData({success: true}, 500)
  }
  else {
    const data = new FormData()
    data.append('logno', logno)
    data.append('type', type)
    data.append('desc', desc)
    data.append('file', fileData)
    resp = await API.post('/eBRAP/Services/api/applications/files/upload', data)
  }
  return resp.data
}

export const deleteAppFile = async (fileID) => {
  let resp
  if(IS_DEV) {
    resp = await getMockData({success: true}, 500)
  }
  else {
    resp = await API.delete('/eBRAP/Services/api/files/delete/'+fileID)
  }
  return resp.data
}
export const getFiles = async (req) => {
  let resp
  if(IS_DEV) {
    const mockData = await loadMockData(IS_DEV)
    resp = await getMockData(mockData.files, 500)
  }
  else {
    resp = await API.post('/eBRAP/Services/api/files', req)
  }
  return resp.data
}
export const downloadOrgFile = async (filename, fileID) => {
  let resp
  if(IS_DEV) {
    downloadFile("!@#DSDZFESFF", filename)
  }
  else {
    resp = await axios({
      url: '/eBRAP/Services/api/files/download/'+fileID,
      method: 'GET',
      responseType: 'blob',
    })
    downloadFile(resp.data, filename)
  }
  return true
}
