import { Router } from 'express';
const router = Router();

// import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';


// TODO: POST Request with city name to retrieve weather data
router.post('/', async(req, res) => {
try {
  console.log(req.body);
  const cityName = req.body.cityName;
  const weatherService = new WeatherService();
  const weatherData = await weatherService.getWeatherForCity(cityName);
  res.json(weatherData);
} catch (error) {
  res.status(400).json({error: 'Failed to retrieve weather data'});
}

  // TODO: GET weather data from city name
// WeatherService.getWeatherForCity(req.body.city).then((data) => {
//   res.json(data);
// });

  // TODO: save city to search history
// HistoryService.addCity(req.body.city, req.body.id).then((data) => { res.json(data);

// });

});

// TODO: GET search history
router.get('/history', async (_req, _res) => {
  // WeatherService.getWeatherForCity(req.body.city).then((data) => {
  //   res.json(data);
  // })
});

// * BONUS TODO: DELETE city from search history
// router.delete('/history/:id', async (req, res) => {});

export default router;
