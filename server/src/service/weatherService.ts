import dayjs from 'dayjs';
import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}
// TODO: Define a class for the Weather object
class Weather {
  city: string;
  tempF: number;
  windSpeed: string;
  humidity: number;
  icon: string;
  iconDescription: string;
  date: string;

  constructor(city: string, tempF: number, windSpeed: string, humidity: number, icon: string, iconDescription: string, date: string) {
    this.city = city;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.date = date;
  }
}
// TODO: Complete the WeatherService class
class WeatherService {
//   static getWeatherForCity(cityName: any) {
//     console.log('cityName: ' + cityName);
//     throw new Error('Method not implemented.');
//   }
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL = process.env.API_BASE_URL || '';
  private apiKey = process.env.API_KEY || '';  
  private cityName: string;

  constructor(cityName: string) {
    this.cityName = cityName || '';
    // console.log('API Base URL:', this.baseURL);
    // console.log('API Key:', this.apiKey);
  }

  public setCityName(cityName: string): void {
    this.cityName = cityName;
  }

  public getCityName(): string {
    return this.cityName;
  }

  // TODO: Create fetchLocationData method
  async fetchLocationData(cityName: string): Promise<any> {
    const url = `${this.baseURL}/data/2.5/weather?q=${cityName}&units=imperial&appid=${this.apiKey}`;
    // console.log('URL:', url);
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: 400`);
      }

      const data = await response.json();
      // console.log(data);

      return data;
      
    } catch (error) {
      console.error('Error fetching location data:', error);
      throw error;
    }
  }

  private destructureLocationData(response: any): Coordinates {
    const { coord: { lat, lon } } = response;
    // console.log(`Latitude: ${lat}, Longitude: ${lon}`);
    return { lat, lon };
  } 

  private buildWeatherQuery(lat: number, lon: number): string {
    const baseURL = process.env.API_BASE_URL || '';
    const apiKey = process.env.API_KEY || '';
    return `${baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const { lat, lon } = coordinates;
    const url = this.buildWeatherQuery(lat, lon);
    const response = await fetch(url);
    // console.log(response);
    if (!response.ok) {
      throw new Error(`Error fetching weather data`);
    }
    const data = await response.json();
    return data;
  }

  

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    // const weather = response;
    console.log(response);
    const date = dayjs.unix(response.dt).format('MM/DD/YYYY');
    return new Weather(this.getCityName(), response.main.temp, response.wind.speed, response.main.humidity, response.weather[0].icon,response.weather[0].description, date);
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(_currentWeather: Weather, weatherData: any[]): Weather[] {
    // console.log(currentWeather);
    // console.log(weatherData);
    
    const forecastArray: Weather[] = [];
    weatherData.forEach((weather: any) => {
      // const { temp, wind, humidity, description, icon } = weather;
      const date = new Date(weather.dt * 1000).toISOString();
      if(weather.dt_txt.includes('12:00:00')) {
      forecastArray.push(new Weather(this.getCityName(), weather.main.temp, weather.wind.speed, weather.main.humidity, weather.weather[0].icon, weather.weather[0].description, date))};
    });
    return forecastArray;
  }

  // TODO: Complete getWeatherForCity method
  static async getWeatherForCity(city: string): Promise<Weather[]> {
    // console.log(city);
    const weatherService = new WeatherService(city);
    const locationData = await weatherService.fetchLocationData(city);
    const coordinates = weatherService.destructureLocationData(locationData);
    const weatherData = await weatherService.fetchWeatherData(coordinates);
    const currentWeather = weatherService.parseCurrentWeather(weatherData.list[0]);
    const forecast = weatherService.buildForecastArray(currentWeather, weatherData.list);
    return [currentWeather, ...forecast];
  }
}

export default WeatherService;