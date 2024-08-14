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
  temperature: number;
  wind: string;
  humidity: number;
  description: string;
  icon: string;
  date: string;

  constructor(temperature: number, wind: string, humidity: number, description: string, icon: string, date: string) {
    this.temperature = temperature;
    this.wind = wind;
    this.humidity = humidity;
    this.description = description;
    this.icon = icon;
    this.date = date;
  }
}
// TODO: Complete the WeatherService class
class WeatherService {
  static getWeatherForCity(cityName: any) {
    throw new Error('Method not implemented.');
  }
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL = process.env.API_BASE_URL || '';
  private apiKey = process.env.API_KEY || '';  
  private cityName: string;

  constructor(cityName: string) {
    this.cityName = cityName || '';
    console.log('API Base URL:', this.baseURL);
    console.log('API Key:', this.apiKey);
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
    console.log('URL:', url);
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: 400`);
      }

      const data = await response.json();
      console.log(data);

      return data;
      
    } catch (error) {
      console.error('Error fetching location data:', error);
      throw error;
    }
  }

  private destructureLocationData(response: any): Coordinates {
    const { coord: { lat, lon } } = response;
    console.log(`Latitude: ${lat}, Longitude: ${lon}`);
    return { lat, lon };
  } 

  private buildWeatherQuery(lat: number, lon: number): string {
    const baseURL = process.env.API_BASE_URL || '';
    const apiKey = process.env.API_KEY || '';
    return `${baseURL}/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const { lat, lon } = coordinates;
    const url = this.buildWeatherQuery(lat, lon);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching weather data`);
    }
    const data = await response.json();
    return data;
  }

  

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    const { temp, wind, humidity, description, icon } = response;
    const date = dayjs.unix(response.dt).format('MM/DD/YYYY');
    return new Weather(temp, wind, humidity, description, icon, date);
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    console.log(currentWeather);
    
    const forecastArray: Weather[] = [];
    weatherData.forEach((weather: any) => {
      const { temp, wind, humidity, description, icon } = weather;
      const date = new Date(weather.dt * 1000).toISOString();
      forecastArray.push(new Weather(temp, wind, humidity, description, icon, date));
    });
    return forecastArray;
  }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<Weather[]> {
    console.log(city);
    const weatherService = new WeatherService(city);
    const locationData = await weatherService.fetchLocationData(city);
    const coordinates = weatherService.destructureLocationData(locationData);
    const weatherData = await weatherService.fetchWeatherData(coordinates);
    const currentWeather = weatherService.parseCurrentWeather(weatherData);
    const forecast = weatherService.buildForecastArray(currentWeather, weatherData.list);
    return [currentWeather, ...forecast];
  }
}

export default WeatherService;







