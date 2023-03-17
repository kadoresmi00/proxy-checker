const proxy_check = require("proxy-check");
const fs = require("fs");
const fetch = require("node-fetch");
const url = require("url");
const HttpsProxyAgent = require("https-proxy-agent");

const proxyAll = fs.readFileSync("proxy.txt", "utf8").split(/\r?\n/);

const authxx = false;
const allTxtFile = true;

for (const proxy of proxyAll) {
  let host = proxy.split(":")[0];
  let port = proxy.split(":")[1];
  let proxyAuth = proxy.split(":")[2] + ":" + proxy.split(":")[3];
  if (authxx == true) {
    var proxyx = new HttpsProxyAgent(
      "http://" + proxyAuth + "@" + host + ":" + port
    );
  } else {
    var proxyx = new HttpsProxyAgent("http://" + host + ":" + port);
  }
  fetch("https://ipinfo.io/json", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    agent: proxyx,
  })
    .then((res) => res.json())
    .then((json) => {
      console.log(`# ${proxy} is alive!`);
      if (json.country === undefined) return;
      if (authxx === true) {
        if (allTxtFile === true) {
          fs.appendFileSync(
            "./data/all.txt",
            `${host}:${port}:${proxyAuth}|${json.country}\n`,
            { encoding: "utf8" }
          );
        } else {
          fs.appendFileSync(
            "./data/" + json.country + ".txt",
            `${host}:${port}:${proxyAuth}\n`,
            { encoding: "utf8" }
          );
        }
      } else {
        if (allTxtFile === true) {
          fs.appendFileSync("./data/all.txt", `${host}:${port}|${json.country}\n`, {
            encoding: "utf8",
          });
        } else {
          fs.appendFileSync(
            "./data/" + json.country + ".txt",
            `${host}:${port}\n`,
            { encoding: "utf8" }
          );
        }
      }
    })
    .catch((err) => {
      console.log(`# ${proxy} is dead!`);
    });
}
