require("dotenv").config();
const requests = require("requests");
const http = require("http");
const fs = require("fs");

const indexFile = fs.readFileSync("./index.html", "utf-8");

const replaceVal = (originalValue, apiValue) => {
  let temp = originalValue.replace("{%city%}", apiValue.name);
  temp = temp.replace("{%visibility%}", apiValue.visibility);
  temp = temp.replace("{%temp%}", apiValue.main.temp);
  temp = temp.replace("{%tempstatus%}", apiValue.weather[0].main);
  temp = temp.replace("{%country%}", apiValue.sys.country);
  temp = temp.replace("{%wind_speed%}", apiValue.wind.speed);
  temp = temp.replace("{%tempMin%}", apiValue.main.temp_min);
  temp = temp.replace("{%tempMax%}", apiValue.main.temp_max);
  temp = temp.replace("{%pressure%}", apiValue.main.pressure);
  temp = temp.replace("{%humidity%}", apiValue.main.humidity);
  temp = temp.replace("{%feels_like%}", apiValue.main.feels_like);
  temp = temp.replace("{%description%}", apiValue.weather[0].main
  );

  return temp;
};

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      `http://api.openweathermap.org/data/2.5/weather?q=Delhi&units=metric&appid=${process.env.API_KEY}`
    )
      .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
        const realTimeData = arrData
          .map((val) => replaceVal(indexFile, val))
          .join("");
        res.write(realTimeData);
      })
      .on("end", (err) => {
        if (err)
          return console.log("connection closed due to errors", err.message);
        res.end();
      });
  } else {
    res.end("File not found");
  }
});

PORT = `${process.env.PORT}` || 8000;
server.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
