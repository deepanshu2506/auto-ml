import axios from "axios";

const endpoint = "http://localhost:5000";
export const apiURLs = {
  dataset: {
    create: "/datasets/",
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
};

const addTokenToConfig = (config) => {
  const Token = localStorage.getItem("auth_token");
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
jsonAPI.interceptors.request.use(addTokenToConfig, function (error) {
  return Promise.reject(error);
});

formDataAPI.interceptors.request.use(addTokenToConfig, function (error) {
  return Promise.reject(error);
});

const API = {
  json: jsonAPI,
  formData: formDataAPI,
  getRequest:getRequestAPI
};
export default API;
