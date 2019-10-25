
export const loadMockData = async (IS_DEV) => {
  const mockData = {};
  if(IS_DEV) {
    // Applications
    mockData.apps = await import('../@MockData/Applications/getOrgApps.json').then(mod => mod.default);
    mockData.appInfo = await import('../@MockData/Applications/appInfo.json').then(mod => mod.default);
    mockData.findApps = await import('../@MockData/Applications/findApps.json').then(mod => mod.default);
    // Compliance
    mockData.beforeAfterReport = await import('../@MockData/Compliance/beforeAfterReport.json').then(mod => mod.default);
    mockData.compLogReport = await import('../@MockData/Compliance/compLogReport.json').then(mod => mod.default);
    mockData.complianceApplications = await import('../@MockData/Compliance/complianceApplications.json').then(mod => mod.default);
    // Files
    mockData.files = await import('../@MockData/Files/files.json').then(mod => mod.default);
    // Funding Opportunities
    mockData.fundingOpps = await import('../@MockData/FundingOpps/fundingOpps.json').then(mod => mod.default);
    mockData.fundingOppsData = await import('../@MockData/FundingOpps/fundingOppsData.json').then(mod => mod.default);
    // LOVS
    mockData.lovList = await import('../@MockData/LOVs/lovList.json').then(mod => mod.default);
    mockData.lovOrgFileTypes = await import('../@MockData/LOVs/lovOrgFileTypes.json').then(mod => mod.default);
    mockData.postAwardFileTypes = await import('../@MockData/LOVs/postAwardFileType.json').then(mod => mod.default);
    mockData.complianceRoles = await import('../@MockData/LOVs/complianceRoles.json').then(mod => mod.default);
    mockData.organizationRoles = await import('../@MockData/LOVs/organizationRoles.json').then(mod => mod.default);
    mockData.systemRoles = await import('../@MockData/LOVs/systemRoles.json').then(mod => mod.default);
    // Mechanisms
    mockData.mechanismData = await import('../@MockData/Mechanisms/mechanismData.json').then(mod => mod.default);
    // Organizations
    mockData.organizationData = await import('../@MockData/Organizations/organizationData.json').then(mod => mod.default);
    // Programs
    mockData.programs = await import('../@MockData/Programs/programs.json').then(mod => mod.default);
    // TechnicalReports
    mockData.techFileTypes = await import('../@MockData/TechnicalReports/fileTypes.json').then(mod => mod.default);
    mockData.techLabels = await import('../@MockData/TechnicalReports/labels.json').then(mod => mod.default);
    mockData.techSubmittedDocuments = await import('../@MockData/TechnicalReports/submittedDocuments.json').then(mod => mod.default);
    // Users
    mockData.users = await import('../@MockData/Users/getUser.json').then(mod => mod.default);
    mockData.findUsersData = await import('../@MockData/Users/findUsers.json').then(mod => mod.default);
  }
  return mockData;
}

export const formFiscalYearList = (startingYear = (new Date()).getFullYear()) => {
  const oldestYear = 2000
  const yearList = []
  const yearDiff = startingYear - oldestYear
  for(let i = 0; i < yearDiff; i++) {
    yearList.push({
      value: startingYear - i,
      label: (startingYear - i).toString()
    })
  }
  return yearList
}


export const formOptions = (array, property = null, includeAllOpt = false) => {
  const arr = (!property) ?
    ( array.filter(unique).map((x) => ({value: x, label: x})) ) :
    ( getUnique(array, property).map((x) => ({value: x, label: x})) )
  if(includeAllOpt) {
    arr.unshift({value: "All", label: "All"})
  }
  return arr
}

const unique = (val, idx, self) => self.indexOf(val) === idx
export const getUnique = (arr, prop) => {
  if(!prop) return arr.filter(unique)
  return arr.map(a => a[prop]).filter(unique)
}

export function getUniqueArray(array, propertyName) {
   return array.filter((e, i) => array.findIndex(a => a[propertyName] === e[propertyName]) === i);
}


export const downloadFile = (data, filename) => {
  if (navigator.appVersion.toString().indexOf('.NET') > 0) {
    window.navigator.msSaveBlob(data, filename);
  }
  else {
    const url = window.URL.createObjectURL(new Blob([data], { type: "application/vnd.ms-excel" }))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
