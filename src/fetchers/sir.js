// this should extract cumulative cases in intensive care, per week

// code was extracted from Chrome, needs to be readpated for axios:
// probably not all parameters are needed, we should see which ones are really required
fetch("https://portal.icuregswe.org/siri/api/reports/GenerateHighChart", {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "en-GB,en;q=0.9,es;q=0.8,it;q=0.7",
    "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
    "contenttype": "application/x-www-form-urlencoded",
    "sec-ch-ua": "\"Google Chrome\";v=\"93\", \" Not;A Brand\";v=\"99\", \"Chromium\";v=\"93\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin"
  },
  "referrer": "https://portal.icuregswe.org/siri/en/report/corona.kumulativ",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "highChartUrl=/api/reports/GenerateHighChart&tableUrl=/api/reports/GenerateExcel&chartWidth=900&language=en&reportName=corona.kumulativ&startdat=2020-09-28&stopdat=2021-09-28&sasong%5B0%5D=2020",
  "method": "POST",
  "mode": "cors",
  "credentials": "omit"
});

// see inside DetailedTable -> Rows

