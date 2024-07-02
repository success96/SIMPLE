const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();


const PORT = process.env.PORT || 3000;
const WEATHERSTACK_API_KEY = process.env.WEATHERSTACK_API_KEY;

//Initialise express middleware
app.use(express.json({extended: false}));

//create a basic express route
app.get("/", (req, res)=>{
  res.json({message: "HOME"})
});



app.get('/api/hello', async (req, res) => {
  const visitorName = req.query.visitor_name || 'Visitor';
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress; //LagiosIPaddress:"41.203.78.171";

  try {
    const locationResponse = await axios.get(`https://ipapi.co/${clientIp}/json/`);
    //console.log(locationResponse.data);

    const locationData = locationResponse.data;
    const city = locationData.city || 'your city';
    
    // You can use a weather API like OpenWeatherMap to get the temperature
    // const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=YOUR_OPENWEATHERMAP_API_KEY`);
    // const temperature = weatherResponse.data.main.temp;

    // Use Weatherstack API to get the temperature
    const weatherResponse = await axios.get(`http://api.weatherstack.com/current?access_key=${WEATHERSTACK_API_KEY}&query=${city}`);
    const temperature = weatherResponse.data.current.temperature;

    res.json({
      client_ip: clientIp,
      location: city,
      greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celcius in ${city}`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
