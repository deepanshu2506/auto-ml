export const dummyModel = {
  epochs: 50,
  target_col: "price_range",
  state: "completed",
  created_at: "Tue, 02 Nov 2021 18:36:01 -0000",
  name: "mobile_phones_price_predictor_v3",
  num_classes: 4,
  type: 2,
  id: "618185160744f40fe52b0d0f",
  classes: [0, 1, 2, 3],
  feature_importance: {
    battery_power: 1.9776661396026611,
    blue: 0.02519541233778,
    clock_speed: 0.05488143116235733,
    dual_sim: 0.13396018743515015,
    fc: 0.10198740661144257,
    four_g: 0.09727659821510315,
    int_memory: 0.14363525807857513,
    m_dep: 0.05473833903670311,
    mobile_wt: 0.0996774211525917,
    n_cores: 0.48205113410949707,
    pc: 0.11716917157173157,
    px_height: 1.9548497200012207,
    px_width: 1.4489498138427734,
    ram: 3.9912943840026855,
    sc_h: 0.16864362359046936,
    sc_w: 0.09139572829008102,
    talk_time: 0.09995970875024796,
    three_g: 0.015725132077932358,
    touch_screen: 0.19195829331874847,
    wifi: 0.11098329722881317,
  },
  features: [
    {
      name: "battery_power",
      dataType: "NUMBER",
      type: "continous",
      allowed_Values: [],
    },
    {
      name: "blue",
      dataType: "NUMBER",
      type: "discrete",
      allowed_Values: ["0", "1"],
    },
    {
      name: "clock_speed",
      dataType: "NUMBER",
      type: "discrete",
      allowed_Values: [
        "2.2",
        "0.5",
        "2.5",
        "1.2",
        "1.7",
        "0.6",
        "2.9",
        "2.8",
        "2.1",
        "1.0",
        "0.9",
        "1.1",
        "2.6",
        "1.4",
        "1.6",
        "2.7",
        "1.3",
        "2.3",
        "2.0",
        "1.8",
        "3.0",
        "1.5",
        "1.9",
        "2.4",
        "0.8",
        "0.7",
      ],
    },
    {
      name: "dual_sim",
      dataType: "NUMBER",
      type: "discrete",
      allowed_Values: ["0", "1"],
    },
    {
      name: "fc",
      dataType: "NUMBER",
      type: "discrete",
      allowed_Values: [
        "1",
        "0",
        "2",
        "13",
        "3",
        "4",
        "5",
        "7",
        "11",
        "12",
        "16",
        "6",
        "15",
        "8",
        "9",
        "10",
        "18",
        "17",
        "14",
        "19",
      ],
    },
    {
      name: "four_g",
      dataType: "NUMBER",
      type: "discrete",
      allowed_Values: ["0", "1"],
    },
    {
      name: "int_memory",
      dataType: "NUMBER",
      type: "discrete",
      allowed_Values: [
        "7",
        "53",
        "41",
        "10",
        "44",
        "22",
        "24",
        "9",
        "33",
        "17",
        "52",
        "46",
        "13",
        "23",
        "49",
        "19",
        "39",
        "47",
        "38",
        "8",
        "57",
        "51",
        "21",
        "5",
        "60",
        "61",
        "6",
        "11",
        "50",
        "34",
        "20",
        "27",
        "42",
        "40",
        "64",
        "14",
        "63",
        "43",
        "16",
        "48",
        "12",
        "55",
        "36",
        "30",
        "45",
        "29",
        "58",
        "25",
        "3",
        "54",
        "15",
        "37",
        "31",
        "32",
        "4",
        "18",
        "2",
        "56",
        "26",
        "35",
        "59",
        "28",
        "62",
      ],
    },
    {
      name: "m_dep",
      dataType: "NUMBER",
      type: "discrete",
      allowed_Values: [
        "0.6",
        "0.7",
        "0.9",
        "0.8",
        "0.1",
        "0.5",
        "1.0",
        "0.3",
        "0.4",
        "0.2",
      ],
    },
    {
      name: "mobile_wt",
      dataType: "NUMBER",
      type: "continous",
      allowed_Values: [],
    },
    {
      name: "n_cores",
      dataType: "NUMBER",
      type: "discrete",
      allowed_Values: ["2", "3", "5", "6", "1", "8", "4", "7"],
    },
    {
      name: "pc",
      dataType: "NUMBER",
      type: "discrete",
      allowed_Values: [
        "2",
        "6",
        "9",
        "14",
        "7",
        "10",
        "0",
        "15",
        "1",
        "18",
        "17",
        "11",
        "16",
        "4",
        "20",
        "13",
        "3",
        "19",
        "8",
        "5",
        "12",
      ],
    },
    {
      name: "px_height",
      dataType: "NUMBER",
      type: "continous",
      allowed_Values: [],
    },
    {
      name: "px_width",
      dataType: "NUMBER",
      type: "continous",
      allowed_Values: [],
    },
    {
      name: "ram",
      dataType: "NUMBER",
      type: "continous",
      allowed_Values: [],
    },
    {
      name: "sc_h",
      dataType: "NUMBER",
      type: "discrete",
      allowed_Values: [
        "9",
        "17",
        "11",
        "16",
        "8",
        "13",
        "19",
        "5",
        "14",
        "18",
        "7",
        "10",
        "12",
        "6",
        "15",
      ],
    },
    {
      name: "sc_w",
      dataType: "NUMBER",
      type: "discrete",
      allowed_Values: [
        "7",
        "3",
        "2",
        "8",
        "1",
        "10",
        "9",
        "0",
        "15",
        "13",
        "5",
        "11",
        "4",
        "12",
        "6",
        "17",
        "14",
        "16",
        "18",
      ],
    },
    {
      name: "talk_time",
      dataType: "NUMBER",
      type: "discrete",
      allowed_Values: [
        "19",
        "7",
        "9",
        "11",
        "15",
        "10",
        "18",
        "5",
        "20",
        "12",
        "13",
        "2",
        "4",
        "3",
        "16",
        "6",
        "14",
        "17",
        "8",
      ],
    },
    {
      name: "three_g",
      dataType: "NUMBER",
      type: "discrete",
      allowed_Values: ["0", "1"],
    },
    {
      name: "touch_screen",
      dataType: "NUMBER",
      type: "discrete",
      allowed_Values: ["0", "1"],
    },
    {
      name: "wifi",
      dataType: "NUMBER",
      type: "discrete",
      allowed_Values: ["1", "0"],
    },
  ],
  dataset_id: "614c588d40cb753d0eb7d935",
  model_selection_job_id: "616a89a06cc4ba2f6bc66d10",
  architecture: [
    [1, 264, 2, 0, 0, 0, 0, 0],
    [5, 0, 0, 0, 0, 0, 0, 0.6],
    [1, 4, 3, 0, 0, 0, 0, 0],
  ],
  param_count: 18748,
  metrics: {
    accuracy: 0.9150000214576721,
    precision: 0.9150000214576721,
    recall: 0.9150000214576721,
    error: 0.16908468306064606,
  },
};
