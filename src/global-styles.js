import { StyleSheet } from "react-native";
import {
  responsiveFontSize,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import fonts from "./assets/fonts";

const padding = () => {
  const sizes = [
    1,
    1.5,
    2,
    2.5,
    2.7,
    2.9,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59,
    60,
    61,
    62,
    63,
    64,
    65,
    66,
    67,
    68,
    69,
    70,
    71,
    72,
    73,
    74,
    75,
    76,
    77,
    78,
    79,
    80,
    81,
    82,
    83,
    84,
    85,
    86,
    87,
    88,
    89,
    90,
    91,
    92,
    93,
    94,
    95,
    96,
    97,
    98,
    99,
    100,
    101,
    102,
    103,
  ];
  return sizes.reduce((pre, size) => {
    const value = responsiveWidth(size);
    pre[`pt-${size}`] = { paddingTop: value };
    pre[`pb-${size}`] = { paddingBottom: value };
    pre[`pl-${size}`] = { paddingLeft: value };
    pre[`pr-${size}`] = { paddingRight: value };
    pre[`p-${size}`] = { padding: value };
    pre[`px-${size}`] = { paddingLeft: value, paddingRight: value };
    pre[`py-${size}`] = { paddingTop: value, paddingBottom: value };

    return pre;
  }, {});
};

const margin = () => {
  const sizes = [
    0.5,
    1,
    1.5,
    2,
    2.3,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59,
    60,
    61,
    62,
    63,
    64,
    65,
    66,
    67,
    68,
    69,
    70,
    71,
    72,
    73,
    74,
    75,
    76,
    77,
    78,
    79,
    80,
    81,
    82,
    83,
    84,
    85,
    86,
    87,
    88,
    89,
    90,
    91,
    92,
    93,
    94,
    95,
    96,
    97,
    98,
    99,
    100,
    101,
    102,
    103,
  ];

  return sizes.reduce((pre, size) => {
    const value = responsiveWidth(size);
    pre[`mt-${size}`] = { marginTop: value };
    pre[`mb-${size}`] = { marginBottom: value };
    pre[`ml-${size}`] = { marginLeft: value };
    pre[`mr-${size}`] = { marginRight: value };
    pre[`m-${size}`] = { margin: value };
    pre[`mx-${size}`] = { marginLeft: value, marginRight: value };
    pre[`my-${size}`] = { marginTop: value, marginBottom: value };

    return pre;
  }, {});
};

const width = () => {
  const sizes = [
    1,
    1.5,
    2,
    2.5,
    3,
    3.5,
    4,
    4.5,
    5,
    5.1,
    5.2,
    5.3,
    6,
    6.2,
    6.3,
    6.4,
    6.5,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59,
    60,
    61,
    62,
    63,
    64,
    65,
    66,
    67,
    68,
    69,
    70,
    71,
    72,
    73,
    74,
    75,
    76,
    77,
    78,
    79,
    80,
    81,
    82,
    83,
    84,
    85,
    86,
    87,
    88,
    89,
    90,
    91,
    92,
    93,
    94,
    95,
    96,
    97,
    98,
    99,
    100,
    101,
    102,
    103,
  ];

  const base = sizes.reduce((pre, size) => {
    pre[`w-${size}`] = { width: responsiveWidth(size) };
    return pre;
  }, {});

  return { ...base, "w-full": { width: "100%" } };
};

const height = () => {
  const sizes = [
    1,
    1.5,
    2,
    2.5,
    3,
    3.5,
    4,
    4.5,
    5,
    5.5,
    6,
    6.2,
    6.3,
    6.5,
    6.7,
    6.8,
    6.9,
    7,
    7.1,
    7.2,
    7.3,
    7.4,
    7.5,
    7.6,
    7.7,
    7.8,
    7.9,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59,
    60,
    61,
    62,
    63,
    64,
    65,
    66,
    67,
    68,
    69,
    70,
    71,
    72,
    73,
    74,
    75,
    76,
    77,
    78,
    79,
    80,
    81,
    82,
    83,
    84,
    85,
    86,
    87,
    88,
    89,
    90,
    91,
    92,
    93,
    94,
    95,
    96,
    97,
    98,
    99,
    100,
    101,
    102,
    103,
  ];

  const base = sizes.reduce((pre, size) => {
    pre[`h-${size}`] = { height: responsiveWidth(size) };
    return pre;
  }, {});

  return { ...base, "h-full": { height: "100%" } };
};

const colors = {
  pm: "#050A30",
  pm1: "#3A417B",
  gray: "#8D8C92",
  lightGray: "#EFEFEF",
  gray1: "#D2E4FC",
  gray2: "#ACAEBE",
  black: "#000000",
  white: "#FFFFFF",
  red: "#FF0000",
  green: "#008000",
  disabled: "rgba(255,255,255,0.5)",
  tabIcon: "#bfbfbf",
  authText: "#75788D",
  "39": "#393D57",
  "22": "#222741",
  "3D": "#3D3D3D",
  F0: "#F0F0F0",
  "9F": "#9F9F9F",
  F8: "#F8F8F8",
  skyBlue: "#D2E4FC",
  EF: "#EFEFEF",
  danger: "#D33415",
  DE: "#DEDEDE",
  DD: "#DDDDE1",
};

const backgroundColor = () => {
  return Object.keys(colors).reduce((pre, key) => {
    pre[`bg-${key}`] = { backgroundColor: colors[key] };
    return pre;
  }, {});
};

const borderColor = () => {
  return Object.keys(colors).reduce((pre, key) => {
    pre[`border-${key}`] = { borderColor: colors[key] };
    return pre;
  }, {});
};

const textAlign = () => {
  return {
    "text-left": { textAlign: "left" },
    "text-center": { textAlign: "center" },
    "text-right": { textAlign: "right" },
    "text-justify": { textAlign: "justify" },
  };
};

const textColor = () => {
  return Object.keys(colors).reduce((pre, key) => {
    pre[`text-${key}`] = { color: colors[key] };
    return pre;
  }, {});
};

const flex = () => {
  return {
    flex: { display: "flex", flexDirection: "row" },
    "flex-column": { display: "flex", flexDirection: "column" },
    "flex-row": { display: "flex", flexDirection: "row" },
    "flex-1": { flex: 1 },
    "flex-grow": { flexGrow: 1 },
    "align-center": { alignItems: "center" },
    "justify-center": { justifyContent: "center" },
    "justify-between": { justifyContent: "space-between" },
    "justify-evenly": { justifyContent: "space-evenly" },
    "justify-end": { justifyContent: "flex-end" },
    "align-end": { alignItems: "flex-end" },

    "center": { alignSelf: "center" },
    "align-self-end": { alignSelf: "flex-end" },
    "shadow-3": {
      shadowColor: "rgba(0,0,0,0.3)",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
    },
    "shadow-5": {
      shadowColor: "rgba(0,0,0,0.6)",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    "shadow-8": {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
  };
};

const textSize = () => {
  return {
    "text-x": {
      fontSize: responsiveFontSize(0.4),
      lineHeight: responsiveFontSize(0.4 * 1.4),
      fontFamily: fonts.regular,
    },
    "text-xs": {
      fontSize: responsiveFontSize(0.5),
      lineHeight: responsiveFontSize(0.5 * 1.4),
      fontFamily: fonts.regular,
    },
    "text-sm": {
      fontSize: responsiveFontSize(1),
      lineHeight: responsiveFontSize(1 * 1.4),
      fontFamily: fonts.regular,
    },
    "text-base-xs": {
      fontSize: responsiveFontSize(1.5),
      lineHeight: responsiveFontSize(1.5 * 1.4),
      fontFamily: fonts.regular,
    },
    "text-base-sm": {
      fontSize: responsiveFontSize(1.85),
      lineHeight: responsiveFontSize(1.85 * 1.4),
      fontFamily: fonts.regular,
    },
    "text-8": {
      fontSize: responsiveFontSize(1.25),
      lineHeight: responsiveFontSize(1.25 * 1.4),
      fontFamily: fonts.regular,
    },
    "text-10": {
      fontSize: responsiveFontSize(1.35),
      lineHeight: responsiveFontSize(1.35 * 1.4),
      fontFamily: fonts.regular,
    },
    "text-11": {
      fontSize: responsiveFontSize(1.4),
      lineHeight: responsiveFontSize(1.4 * 1.4),
      fontFamily: fonts.regular,
    },
    "text-12": {
      fontSize: responsiveFontSize(1.6),
      lineHeight: responsiveFontSize(1.6 * 1.4),
      fontFamily: fonts.regular,
    },
    "text-13": {
      fontSize: responsiveFontSize(1.75),
      lineHeight: responsiveFontSize(1.75 * 1.4),
      fontFamily: fonts.regular,
    },
    "text-14": {
      fontSize: responsiveFontSize(1.9),
      lineHeight: responsiveFontSize(1.9 * 1.4),
      fontFamily: fonts.regular,
    },
    "text-16": {
      fontSize: responsiveFontSize(2.1),
      lineHeight: responsiveFontSize(2.1 * 1.4),
      fontFamily: fonts.regular,
    },
    "text-18": {
      fontSize: responsiveFontSize(2.3),
      lineHeight: responsiveFontSize(2.3 * 1.4),
      fontFamily: fonts.regular,
    },
    "text-base": {
      fontSize: responsiveFontSize(2),
      lineHeight: responsiveFontSize(2 * 1.4),
      fontFamily: fonts.regular,
    },
    "text-base-med": {
      fontSize: responsiveFontSize(2.5),
      lineHeight: responsiveFontSize(2.5 * 1.4),
      fontFamily: fonts.regular,
    },
    "text-lg": {
      fontSize: responsiveFontSize(3),
      lineHeight: responsiveFontSize(3 * 1.4),
      fontFamily: fonts.regular,
    },
    "text-20": {
      fontSize: responsiveFontSize(2.75),
      lineHeight: responsiveFontSize(2.75 * 1.4),
      fontFamily: fonts.regular,
    },
    "text-24": {
      fontSize: responsiveFontSize(3.25),
      lineHeight: responsiveFontSize(3.25 * 1.4),
      fontFamily: fonts.regular,
    },
    "text-26": {
      fontSize: responsiveFontSize(3.5),
      lineHeight: responsiveFontSize(3.5 * 1.4),
      fontFamily: fonts.regular,
    },
    "text-28": {
      fontSize: responsiveFontSize(3.7),
      lineHeight: responsiveFontSize(3.7 * 1.4),
      fontFamily: fonts.regular,
    },
    "text-xl": {
      fontSize: responsiveFontSize(4),
      lineHeight: responsiveFontSize(4 * 1.4),
      fontFamily: fonts.regular,
    },
    "text-32": {
      fontSize: responsiveFontSize(4.3),
      lineHeight: responsiveFontSize(4 * 1.4),
      fontFamily: fonts.regular,
    },
    "text-36": {
      fontSize: responsiveFontSize(4.9),
      lineHeight: responsiveFontSize(4.5 * 1.4),
      fontFamily: fonts.regular,
    },
  };
};

const borderRadius = () => {
  const sizes = [
    0,
    1,
    1.5,
    2,
    2.5,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    12,
    14,
    16,
    18,
    20,
    22,
    24,
    26,
  ];

  return sizes.reduce((pre, size) => {
    pre[`rounded-${size}`] = { borderRadius: responsiveWidth(size) };
    pre[`rounded-tl-${size}`] = { borderTopLeftRadius: responsiveWidth(size) };
    pre[`rounded-bl-${size}`] = {
      borderBottomLeftRadius: responsiveWidth(size),
    };
    pre[`rounded-tr-${size}`] = { borderTopRightRadius: responsiveWidth(size) };
    pre[`rounded-br-${size}`] = {
      borderBottomRightRadius: responsiveWidth(size),
    };
    return pre;
  }, {});
};

const border = () => {
  const sizes = [0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const base = sizes.reduce((pre, size) => {
    pre[`bor-${size}`] = { borderWidth: responsiveWidth(size / 5) };
    pre[`bor-t-${size}`] = { borderTopWidth: responsiveWidth(size / 5) };
    pre[`bor-b-${size}`] = { borderBottomWidth: responsiveWidth(size / 5) };
    pre[`bor-l-${size}`] = { borderLeftWidth: responsiveWidth(size / 5) };
    pre[`bor-r-${size}`] = { borderRightWidth: responsiveWidth(size / 5) };
    return pre;
  }, {});

  return { ...base };
};

export const globalStyles = StyleSheet.create({
  ...flex(),
  ...width(),
  ...height(),

  ...margin(),
  ...padding(),

  ...border(),
  ...borderColor(),
  ...borderRadius(),

  ...backgroundColor(),

  ...textSize(),
  ...textColor(),
  ...textAlign(),
});

export const className = (str) => {
  const items = str.split(" ");

  return items.reduce((pre, item) => {
    return { ...pre, ...globalStyles[item] };
  }, {});
};
