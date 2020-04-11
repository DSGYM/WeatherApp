const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 8000;

app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(express.static("website"));

data = [];

app.post("/weather", function(req, res) {
  const newData = req.body;
  const newEntry = {
    timestamp: newData.timestamp,
    min: newData.min,
    max: newData.max,
    mood: newData.feelings,
    city: newData.city
  };
  data.push(newEntry);
  console.log(data);
});

app.get("/all", function(req, res) {
  res.send(data);
});

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
