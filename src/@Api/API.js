import axios from 'axios';


export default {
  get: callAPI("get"),
  post: callAPI("post"),
  put: callAPI("put"),
  patch: callAPI("patch"),
  delete: callAPI("delete"),
}

function callAPI(method) {
  return async function(url, opts) {
    try {
      return await axios[method](url, opts);
    }
    catch(error) {
      if(isUnauthorized(error)) console.log("UNAUTHORIZED!");
      else return error.response;
    }
  }
}


function isUnauthorized(error) {
  if(error && error.response && error.response.status === 401) {
    window.location.href = "/eBRAP/Login.htm";
    return true;
  }
  return false;
}
