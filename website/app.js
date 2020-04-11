// Set up variables for functions

const url = "http://api.openweathermap.org/data/2.5/weather?q=";
const key = "&APPID=e0886e368adf40ee129cb4a110994553";
const city = document.getElementById("zip");
const feelings = document.getElementById("feelings");
const section = document.getElementById("weather");

const convert = kelvin => {
  // Convert Kelvin to celsius
  const result = kelvin - 273.15;
  return result;
};

const getData = async (url, city, key) => {
  const request = await fetch(url + city + key);
  const result = [];

  try {
    const data = await request.json();
    result.push(Math.round(convert(data["main"].temp_min), 0)); // Only keep min and max degree in celsius
    result.push(Math.round(convert(data["main"].temp_max), 0));
    return result;
  } catch (error) {
    console.log("error", error);
  }
};

const getAll = async url => {
  const request = await fetch(url);

  try {
    const data = await request.json();
    return data;
  } catch (error) {
    console.log("error", error);
  }
};

const postData = async (url, data) => {
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  try {
    const newData = await response.json();
  } catch (error) {
    console.log("error", error);
  }
};

const updateUI = async () => {
  const alldata = await fetch("/all");

  try {
    const history = document.getElementById("history");
    if (history !== null) {
      history.remove();
    }
    const data = await alldata.json();
    console.log(data.length);
    const elem = document.createElement("div");
    elem.className = "container holder entry";
    elem.id = "history";

    const date_div = document.createElement("div");
    date_div.id = "date";
    const temp_div = document.createElement("div");
    temp_div.id = "temp";
    const content_div = document.createElement("div");
    content_div.id = "content";

    const header = document.createElement("h4");
    const index = data.length - 1; // because of 0 index last element is -1
    header.innerHTML = `You searched ${data.length} times! Most recent entry`;
    date_div.innerHTML = data[index].timestamp;
    temp_div.innerHTML = `Temperature between ${data[index].min} and ${data[index].max}`;
    content_div.innerHTML = `Selected city/zipcode was ${data[index].city} with mood: ${data[index].mood}`;
    elem.append(header);
    elem.append(date_div);
    elem.append(temp_div);
    elem.append(content_div);

    section.append(elem);
  } catch (error) {
    console.log("error", error);
  }
};

document.getElementById("generate").addEventListener("click", () => {
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var timestamp = date + " " + time; // All code for creating a timestamp
  const cityval = city.value;
  const feelings_val = feelings.value;
  const receiveddata = getData(url, cityval, key);
  receiveddata.then(function(data) {
    postData("/weather", {
      timestamp: timestamp,
      min: data[0],
      max: data[1],
      feelings: feelings_val,
      city: cityval
    }).then(updateUI());
  });
});
