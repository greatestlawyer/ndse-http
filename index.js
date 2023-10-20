const http = require("http");
const readline = require("readline");
require("dotenv").config();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const apiKey = process.env.ACCESS_API_KEY;

function getWether() {
  rl.question("Введите город: ", (city) => {
    const url = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${city}`;
    http
      .get(url, (response) => {
        const { statusCode } = response;

        if (statusCode !== 200) {
          console.log("Error: ", statusCode);
          return;
        }

        response.setEncoding("utf8");
        let rowDate = "";
        response.on("data", (chunk) => (rowDate += chunk));
        response.on("end", () => {
          let parseData = JSON.parse(rowDate);
          console.log("Location: ", parseData.location);
          console.log("Current: ", parseData.current);
          rl.question("Узнать еще? (y/n): ", (playAgain) => {
            if (playAgain.toLowerCase() === "y") {
              getWether();
            } else {
              rl.close();
            }
          });
        });
      })
      .on("error", (err) => console.log("Error ", err));
  });
}

getWether();
