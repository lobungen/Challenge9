import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  name: string;
  lat: number;
  lon: number;
  state: string;
  country: string;
}

// TODO: Define a class for the Weather object
class Weather {
  cityName: string;
  date: string;
  description: string;
  feelsLike: number;
  humidity: number;
  icon: string;
  temp: number;
  windSpeed: number;

  constructor(
    cityName: string,
    date: string,
    description: string,
    feelsLike: number,
    humidity: number,
    icon: string,
    temp: number,
    windSpeed: number
  ) {
    this.cityName = cityName;
    this.date = date;
    this.description = description;
    this.feelsLike = feelsLike;
    this.humidity = humidity;
    this.icon = icon;
    this.temp = temp;
    this.windSpeed = windSpeed;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL?: string;

  private apiKey?: string;
  private cityName?: string;
  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';

    this.apiKey = process.env.API_KEY || '';
    this.cityName = '';
  }
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const response = await fetch(query);
    const locationData = await response.json();
    console.log("location data", locationData[0]);
    const location = this.destructureLocationData(locationData[0]);
    return location;
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { name, lat, lon, state, country } = locationData;
    const coordinates: Coordinates = {
      name: name,
      lat: lat,
      lon: lon,
      state: state,
      country: country,
    };
    console.log('Coordinates:', coordinates);
    return coordinates;
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    // http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid={API key}
    console.log(this.cityName);
    const query = `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&limit=5&appid=${this.apiKey}`;
    console.log(query);
    return query;
  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    // api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
    const query = `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
    return query;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const query = this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData(query);
    console.log('Location Data:', locationData);
    return locationData;
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const query = this.buildWeatherQuery(coordinates);
    const response = await fetch(query);
    const weatherData = await response.json();
    console.log(weatherData);
    return weatherData;
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    console.log('Response:', response);
    const { name } = response.city;
    const { dt, weather, main, wind } = response.list[0];
    const { description, icon } = weather[0];
    const { feels_like, humidity, temp } = main;
    const { speed } = wind;
    const currentWeather = new Weather(
      name,
      dt,
      description,
      feels_like,
      humidity,
      icon,
      temp,
      speed
    );
    return currentWeather;
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    // console.log('Weather Data:', weatherData, currentWeather);
    let dt1 = weatherData[0].dt_txt.split(' ')[0];
    const forecastArray = weatherData.map((data: any) => {
      const dt2 = data.dt_txt.split(' ')[0];
      if (dt1 !== dt2) {
        const { weather, main, wind } = data;
        const { description, icon } = weather[0];
        const { feels_like, humidity, temp } = main;
        const { speed } = wind;
        dt1 = dt2;
        const forecast = new Weather(
          currentWeather.cityName,
          dt2,
          description,
          feels_like,
          humidity,
          icon,
          temp,
          speed
        );
        return forecast;
      }
    });
    console.log('Forecast Array:', forecastArray);
    return forecastArray;
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    console.log('City:', city);
    this.cityName = city;
    const locationData = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(locationData);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecastArray = this.buildForecastArray(currentWeather, weatherData.list);
    return { currentWeather, forecastArray };
  }
}

export default new WeatherService();
