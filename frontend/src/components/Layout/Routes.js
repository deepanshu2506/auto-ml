// import Avatar from "react-avatar";
import DatasetInfoScreen from "../Screens/DatasetsInfo/Screen";
import InputDatasetScreen from "../Screens/inputDataset/Screen";
import ListDatasetScreen from "../Screens/listDatasets/Screen";
import ModelInferenceScreen from "../Screens/ModelInference/Screen";
import AggregationScreen from "../Screens/PerformAggregation/Screen";
import AutoimputeScreen from "../Screens/PerformAutoimputation/Screen";
import SavedModelDetailsScreen from "../Screens/SavedModelDetails/Screen";
import SavedModelScreen from "../Screens/SavedModels/Screen";
import {LoginScreen} from "../Screens/login/Screen";
import {SignupScreen} from "../Screens/signup/Screen";

// const routes = [
//   {
//     title: "teams",
//     path: "/teams",
//     exact: true,
//     Icon: () => <Avatar src="/teams-icon.png" round={true} size={35} />,
//     component: TeamScreen,
//   },
// ];

const routes = [
  {
    sidebar: true,
    title: "Datasets",
    path: "/datasets/",
    auth: true,
    exact: true,
    // Icon: () => <Avatar src="/teams-icon.png" round={true} size={35} />,
    component: ListDatasetScreen,
  },
  {
    sidebar: false,
    auth: true,
    title: "Dataset Info",
    path: "/datasets/:datasetID/aggregation",
    exact: false,
    component: AggregationScreen,
  },
  {
    sidebar: false,
    auth: true,
    title: "Auto imputation",
    path: "/datasets/:datasetID/auto_impute",
    exact: false,
    component: AutoimputeScreen,
  },
  {
    sidebar: false,
    auth: true,
    title: "Dataset Info",
    path: "/datasets/:datasetID",
    exact: false,
    component: DatasetInfoScreen,
  },
  {
    sidebar: true,
    auth: true,
    title: "Create dataset",
    path: "/dataset/create",
    exact: true,
    component: InputDatasetScreen,
  },
  {
    sidebar: true,
    auth: true,
    title: "Saved Models",
    path: "/savedModels",
    exact: true,
    component: SavedModelScreen,
  },
  {
    sidebar: false,
    auth: true,
    title: "Model Inference",
    path: "/savedModels/:modelID/inference",
    exact: false,
    component: ModelInferenceScreen,
  },
  {
    sidebar: false,
    auth: true,
    title: "Saved Model Details",
    path: "/savedModels/:modelID",
    exact: false,
    component: SavedModelDetailsScreen,
  },

  {
    sidebar: false,
    auth: false,
    title: "Login",
    path: "/login",
    exact: true,
    component: LoginScreen,
  },
  {
    sidebar: false,
    title: "Sign Up",
    path: "/signup",
    auth: false,
    exact: true,
    component: SignupScreen,
  },
];

export default routes;
