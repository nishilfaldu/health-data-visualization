export function processCountiesData(countiesData: any[]): any[] {
  return countiesData.map(d => ({
    cnty_fips: +d.cnty_fips,
    display_name: d.display_name
      .replaceAll("\"", "")
      .replaceAll("(", "")
      .replaceAll(")", ""),
    poverty_perc: +d.poverty_perc,
    median_household_income: +d.median_household_income,
    education_less_than_high_school_percent: +d.education_less_than_high_school_percent,
    air_quality: +d.air_quality,
    park_access: +d.park_access,
    percent_inactive: +d.percent_inactive,
    percent_smoking: +d.percent_smoking,
    elderly_percentage: +d.elderly_percentage,
    number_of_hospitals: +d.number_of_hospitals,
    number_of_primary_care_physicians: +d.number_of_primary_care_physicians,
    percent_no_heath_insurance: +d.percent_no_heath_insurance,
    percent_high_blood_pressure: +d.percent_high_blood_pressure,
    percent_coronary_heart_disease: +d.percent_coronary_heart_disease,
    percent_stroke: +d.percent_stroke,
    percent_high_cholesterol: +d.percent_high_cholesterol,
  }));
}

export function filterOutInvalidData(countiesData: any[]): any[] {
  return countiesData.filter(d => {
    for (const key in d) {
      if (d[key] === -1) {
        return false; // Filter out rows with any field containing "-1"
      }
    }

    return true; // Keep rows without any field containing "-1"
  });
}


export const attributesAvailable = [
  "cnty_fips",
  "display_name",
  "poverty_perc",
  "median_household_income",
  "education_less_than_high_school_percent",
  "air_quality",
  "park_access",
  "percent_inactive",
  "percent_smoking",
  "urban_rural_status",
  "elderly_percentage",
  "number_of_hospitals",
  "number_of_primary_care_physicians",
  "percent_no_heath_insurance",
  "percent_high_blood_pressure",
  "percent_coronary_heart_disease",
  "percent_stroke",
  "percent_high_cholesterol",
];


export const attributesInfo = {
  poverty_perc: {
    label: "Poverty (%)",
    color: "#57B8FF",
  },
  median_household_income: {
    label: "Median Household Income ($)",
    color: "#FF7557",
  },
  education_less_than_high_school_percent: {
    label: "Education Less Than High School (%)",
    color: "#A0FF57",
  },
  air_quality: {
    label: "Air Quality",
    color: "#FF57C6",
  },
  park_access: {
    label: "Park Access",
    color: "#FFC657",
  },
  percent_inactive: {
    label: "Inactive (%)",
    color: "#57FFD2",
  },
  percent_smoking: {
    label: "Smoking (%)",
    color: "#E157FF",
  },
  urban_rural_status: {
    label: "Urban/Rural Status",
    color: "#57FF7E",
  },
  elderly_percentage: {
    label: "Elderly (%)",
    color: "#FF5793",
  },
  number_of_hospitals: {
    label: "Number of Hospitals",
    color: "#5757FF",
  },
  number_of_primary_care_physicians: {
    label: "Number of Primary Care Physicians",
    color: "#FFA957",
  },
  percent_no_heath_insurance: {
    label: "No Health Insurance (%)",
    color: "#A457FF",
  },
  percent_high_blood_pressure: {
    label: "High Blood Pressure (%)",
    color: "#FF57A4",
  },
  percent_coronary_heart_disease: {
    label: "Coronary Heart Disease (%)",
    color: "#57FF97",
  },
  percent_stroke: {
    label: "Stroke (%)",
    color: "#FF57D1",
  },
  percent_high_cholesterol: {
    label: "High Cholesterol (%)",
    color: "#5793FF",
  },
};


export const attributesInfoArray = [
  {
    value: "poverty_perc",
    label: "Poverty (%)",
    color: "#57B8FF",
  },
  {
    value: "median_household_income",
    label: "Median Household Income ($)",
    color: "#FF7557",
  },
  {
    value: "education_less_than_high_school_percent",
    label: "Education Less Than High School (%)",
    color: "#A0FF57",
  },
  {
    value: "air_quality",
    label: "Air Quality",
    color: "#FF57C6",
  },
  {
    value: "park_access",
    label: "Park Access",
    color: "#FFC657",
  },
  {
    value: "percent_inactive",
    label: "Inactive (%)",
    color: "#57FFD2",
  },
  {
    value: "percent_smoking",
    label: "Smoking (%)",
    color: "#E157FF",
  },
  {
    value: "urban_rural_status",
    label: "Urban/Rural Status",
    color: "#57FF7E",
  },
  {
    value: "elderly_percentage",
    label: "Elderly (%)",
    color: "#FF5793",
  },
  {
    value: "number_of_hospitals",
    label: "Number of Hospitals",
    color: "#5757FF",
  },
  {
    value: "number_of_primary_care_physicians",
    label: "Number of Primary Care Physicians",
    color: "#FFA957",
  },
  {
    value: "percent_no_heath_insurance",
    label: "No Health Insurance (%)",
    color: "#A457FF",
  },
  {
    value: "percent_high_blood_pressure",
    label: "High Blood Pressure (%)",
    color: "#FF57A4",
  },
  {
    value: "percent_coronary_heart_disease",
    label: "Coronary Heart Disease (%)",
    color: "#57FF97",
  },
  {
    value: "percent_stroke",
    label: "Stroke (%)",
    color: "#FF57D1",
  },
  {
    value: "percent_high_cholesterol",
    label: "High Cholesterol (%)",
    color: "#5793FF",
  },
];

