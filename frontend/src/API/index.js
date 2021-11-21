import axios from "axios";

const endpoint = "http://localhost:5000";
export const apiURLs = {
  dataset: {
    create: "/datasets/",
    getFeatures: (datasetID) => `/datasets/${datasetID}/col_details`,
    getDatasetPreview: (datasetID) => `/datasets/${datasetID}/preview`,
    performAggregation: (datasetID) =>
      `/datasets/${datasetID}/perform_aggregation`,
      performAutoimputation: (datasetID) =>
      `/datasets/${datasetID}/auto_impute`,
    getDatasetDetails: (datasetID) => `/datasets/${datasetID}`,
    singleColImputation:(datasetID)=> `/datasets/${datasetID}/impute_advanced`,
  },

  misc: {
    checkDbConn: "/misc/checkDBConn",
    previewDataFromDb: "/misc/previewDataFromDb",
  },
  savedModels: {
    getModels: "/saved_model/",
    modelDetails: (model_id) => `/saved_model/${model_id}`,
    infer: (model_id) => `/saved_model/${model_id}/infer`,
  },
  user:{
    register:"/auth/register",
    login:"/auth/login"
  }
};

const addTokenToConfig = (config) => {
  // let user = JSON.parse(localStorage.getItem('user'));
  // const Token=user.auth_token;
  // console.log(user)

  let redux_store = JSON.parse(localStorage.getItem('persist:root'));
  let user=JSON.parse(redux_store.user)
  const Token=user["auth_token"];
  if (Token) config.headers["Authorization"] = "Bearer " + Token;

  return config;
};

const jsonAPI = axios.create({
  baseURL: endpoint,
  headers: {
    "Content-Type": "application/json",
  },
});

const formDataAPI = axios.create({
  baseURL: endpoint,
  headers: {
    "Content-Type": "application/json",
  },
});
const getRequestAPI = axios.create({
  baseURL: endpoint,
});
getRequestAPI.interceptors.request.use(addTokenToConfig, function (error) {
  return Promise.reject(error);
});

const authDataAPI = axios.create({
  baseURL: endpoint,
  headers: {
    "Content-Type": "application/json",
  },
});

jsonAPI.interceptors.request.use(addTokenToConfig, function (error) {
  return Promise.reject(error);
});

formDataAPI.interceptors.request.use(addTokenToConfig, function (error) {
  return Promise.reject(error);
});

const API = {
  json: jsonAPI,
  formData: formDataAPI,
  getRequest:getRequestAPI,
  authData: authDataAPI
};
export default API;
