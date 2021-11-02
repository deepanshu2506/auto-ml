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

jsonAPI.interceptors.request.use(addTokenToConfig, function (error) {
  return Promise.reject(error);
});

formDataAPI.interceptors.request.use(addTokenToConfig, function (error) {
  return Promise.reject(error);
});

const API = {
  json: jsonAPI,
  formData: formDataAPI,
};
export default API;
