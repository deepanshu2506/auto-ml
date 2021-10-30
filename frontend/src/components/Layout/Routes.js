// import Avatar from "react-avatar";
import DatasetInfoScreen from "../Screens/DatasetsInfo/Screen";
import InputDatasetScreen from "../Screens/inputDataset/Screen";
import ListDatasetScreen from "../Screens/listDatasets/Screen";
import LoginScreen from "../Screens/login/Screen";
import SignupScreen from "../Screens/signup/Screen";

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
    path: "/datasets",
    auth: true,
    exact: true,
    // Icon: () => <Avatar src="/teams-icon.png" round={true} size={35} />,
    component: ListDatasetScreen,
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
