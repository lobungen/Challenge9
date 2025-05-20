import { Router, type Request, type Response } from 'express';
const router = Router();

 import HistoryService from '../../service/historyService.js';
 import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  try {
    const { cityName } = req.body;
    console.log(req.body, cityName);
    const weatherData = await WeatherService.getWeatherForCity(cityName);
    console.log('Weather Data:', weatherData);
    await HistoryService.addCity(cityName);
    //ensures saved data has proper casing regardless of input
    res.json(weatherData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
  // TODO: GET weather data from city name
  // TODO: save city to search history
});

// TODO: GET search history
router.get('/history', async (req: Request, res: Response) => {
  try {
    console.log('Fetching search history', req.body);
    const history = await HistoryService.getCities();
    res.json(history);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await HistoryService.removeCity(id);
    res.json({ message: 'City deleted from history' });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

export default router;
