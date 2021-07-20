require("dotenv").config();
const requests = require("requests");
const http = require("http");
const fs = require("fs");

const indexFile = fs.readFileSync("./index.html", "utf-8");

const replaceVal = (originalValue, apiValue) => {
  let temperature = originalValue.replace("{%city%}", apiValue.name);
  temperature = temperature.replace("{%visibility%}", apiValue.visibility);
  temperature = temperature.replace("{%temp%}", apiValue.main.temp);
  temperature = temperature.replace("{%tempstatus%}", apiValue.weather[0].main);
  temperature = temperature.replace("{%country%}", apiValue.sys.country);
  temperature = temperature.replace("{%wind_speed%}", apiValue.wind.speed);
  temperature = temperature.replace("{%tempMin%}", apiValue.main.temp_min);
  temperature = temperature.replace("{%tempMax%}", apiValue.main.temp_max);
  temperature = temperature.replace("{%pressure%}", apiValue.main.pressure);
  temperature = temperature.replace("{%humidity%}", apiValue.main.humidity);
  temperature = temperature.replace("{%feels_like%}", apiValue.main.feels_like);
  temperature = temperature.replace("{%description%}", apiValue.weather[0].main
  );

  return temperature;
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
server.listen(PORT, "127.0.0.1", () => {
  console.log("Listening on port", PORT);
});
