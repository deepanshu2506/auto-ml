import axios from "axios";
import { userActions } from "../actions";
import { history, store } from "../helpers";

const endpoint = "http://localhost:5000";
export const apiURLs = {
  dataset: {
    create: "/datasets/",
    getFeatures: (datasetID) => `/datasets/${datasetID}/col_details`,
    getDatasetPreview: (datasetID) => `/datasets/${datasetID}/preview`,
    performAggregation: (datasetID) =>
      `/datasets/${datasetID}/perform_aggregation`,
    performAutoimputation: (datasetID) => `/datasets/${datasetID}/auto_impute`,
    performAutovisualization: (datasetID) =>
      `/datasets/${datasetID}/visualization`,
    getDatasetDetails: (datasetID) => `/datasets/${datasetID}`,
    deleteDataset: (datasetID) => `/datasets/${datasetID}`,
    singleColImputation: (datasetID) =>
      `/datasets/${datasetID}/impute_advanced`,
    modelSelection: (datasetID) => `/dataset/model_selection/${datasetID}`,
    colDescription: (datasetID) => `datasets/${datasetID}/col_description`,
  },
  modelSelectionJob: {
    getJobs: "/datasets/model_selection_jobs",
  },
  visualize: {
    performAutoVisualization: (datasetID) =>
      `/visualization/${datasetID}/auto_visualize`,
    performAdvanceVisualization: (datasetID) =>
      `/visualization/${datasetID}/advance_visualize`,
    getCorrelation: (datasetID) => `/visualization/${datasetID}/correlate`,
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
  modelSelectionJob: {
    jobDetails: (model_selection_job_id) =>
      `/dataset/model_selection/${model_selection_job_id}`,
    exportModel: (model_selection_job_id, model_id) =>
      `/dataset/model_selection/${model_selection_job_id}/export/${model_id}`,
  },
  user: {
    register: "/auth/register",
    login: "/auth/login",
  },
};

const addTokenToConfig = (config) => {
  // let user = JSON.parse(localStorage.getItem('user'));
  // const Token=user.auth_token;

  let redux_store = JSON.parse(localStorage.getItem("persist:root"));
  let user = JSON.parse(redux_store.user);
  const Token = user["auth_token"];
  if (Token) config.headers["Authorization"] = "Bearer " + Token;

  return config;
};

const successResponseInterceptor = (response) => response;

const failureResponseInterceptor = (error) => {
  if (error.response.status === 401) {
    store.dispatch(userActions.logout());
    history.push("/login");
  }
  return error;
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

jsonAPI.interceptors.response.use(
  successResponseInterceptor,
  failureResponseInterceptor
);
formDataAPI.interceptors.response.use(
  successResponseInterceptor,
  failureResponseInterceptor
);

const API = {
  json: jsonAPI,
  formData: formDataAPI,
  getRequest: getRequestAPI,
  authData: authDataAPI,
};
export default API;
