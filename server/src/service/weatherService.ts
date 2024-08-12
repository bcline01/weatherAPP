import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
  name: string;
  country: string;
  state: string;
}
// TODO: Define a class for the Weather object
class Weather {
  temperature: number;
  wind: string;
  humidity: number;
  description: string;
  icon: string;
  date: string;

  constructor(temperature: number, wind: string, humidity: number, description: string, icon: string, date:string) {
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
  // TODO: Define the baseURL, API key, and city name properties
   baseURL: string;
   apiKey: string;
   cityName: string;


  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
    this.cityName = '';
  }
  // TODO: Create fetchLocationData method
  async fetchLocationData(_query: string): Promise<any> {
    const url = `${this.baseURL}?q=${this.cityName}&appid=${this.apiKey}`; 

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: 400`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching location data:', error);
      throw error; 
    }
  }


  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    try {
      const lat = locationData.lat
      const lon = locationData.lon
      const newCoordinate: Coordinates = {
        locationData.name,
        locationData.country,
        locationData.state,
        lat , lon 
      }
      return {this.locationData}
      
    } catch (error) {
      console.error(`location was not found`)
      this.cityName = `location was not found`
      // return { lat, lon }
    }
  }

  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `q=${this.cityName}&limit=1&appid=${this.apiKey}`
  }

  // TODO: Create buildWeatherQuery method
  private async buildWeatherQuery(coordinates: Coordinates): Promise<string> {
    const { lat, lon } = coordinates;
    return `${lat},${lon}`;
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    if (!this.cityName) {
      throw new Error("City name is undefined");
    }
    const geocodeQuery = this.buildGeocodeQuery();
    return this.fetchLocationData(geocodeQuery).then((data) => this.destructureLocationData(data));
  }
  
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<Weather> {
    const query = await this.buildWeatherQuery(coordinates);
    const response = await fetch(`${this.baseURL}/data/2.5/weather?${query}&appid=${this.apiKey}`);
    const data = await response.json();
    return data;
  }
  
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    const { temp, wind, humidity, description, icon } = response;
    const date = new Date().toISOString();
    return new Weather(temp, wind, humidity, description, icon, date);
  }
  
  // TODO: Complete buildForecastArray method
  private buildForecastArray(_currentWeather: Weather, weatherData: any[]): Weather[] {
    const forecastArray: Weather[] = [];
    weatherData.forEach((weather: any) => {
      const { temp, wind, humidity, description, icon } = weather;
      const date = new Date(weather.dt * 1000).toISOString();
      forecastArray.push(new Weather(temp, wind, humidity, description, icon, date));
    });
    return forecastArray;
  }

  // TODO: Complete getWeatherForCity method
async getWeatherForCity(_city: string) {
    const locationData = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(locationData);
    // const currentWeather = this.parseCurrentWeather(weatherData);
    // const forecastArray = this.buildForecastArray(currentWeather, weatherData.list || []);
    // return { currentWeather, forecastArray };
  }
}

export default new WeatherService();
