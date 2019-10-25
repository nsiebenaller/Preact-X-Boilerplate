// HELPERS //
export function convertDateFields(arr, dateCols) {
  const updated = arr.map((obj) => {
    const tmp = {}
    dateCols.forEach((col) => tmp[col] = new Date(obj[col]) )
    return Object.assign({}, obj, tmp)
  })
  return updated
}
export function getMockData(data, time) {
  return new Promise((res, rej) => {
    setTimeout(() => res({data: data}), time)
  })
}
// export function downloadFile(data, filename) {
//   const url = window.URL.createObjectURL(new Blob([data]))
//   const link = document.createElement('a')
//   link.href = url
//   link.setAttribute('download', filename)
//   document.body.appendChild(link)
//   link.click()
//   document.body.removeChild(link)
// }

export function downloadFile(data, filename) {
  const blob = new Blob([data]);
  if (typeof window.navigator.msSaveBlob !== 'undefined') {
      window.navigator.msSaveBlob(blob, filename);
  }
  else {
    const blobURL = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobURL;
    link.setAttribute('download', filename);
    if (typeof link.download === 'undefined')  link.setAttribute('target', '_blank');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobURL);
  }

}
