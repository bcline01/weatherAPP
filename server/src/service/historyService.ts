// TODO: Define a City class with name and id properties
class City {
name: string;
id: string;

constructor(name: string, id: string) {
  this.name = name;
  this.id = id;
}
}
// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    return await fs.readFile('db/searchHistory.json', {
      flag: 'a+',
      encoding: 'utf8',
    });
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    return await fs.writeFile('db/searchHistory.json', JSON.stringify(cities, null, '\t'));
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    return await this.read().then((cities) => {
      let parsedCitites: City[];
      try {
        parsedCitites = [].concat(JSON.parse(cities));
      } catch (error) {
        parsedCitites = [];
      }
      return parsedCitites;
    });
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(name: string, id: string) {
    if (!name) {
      throw new Error('City cannot be blank');
    }
    const newCity: City = {
      name: name,
      id: id,
    };
    return await this.getCities()
      .then((cities) => {
        return [...cities, newCity];
      })
      .then((cities) => {
        return this.write(cities);
      })
      .then(() => {
        return newCity;
      });
  }

  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    return await this.getCities()
    .then((cities) => {
return cities.filter((city) => city.id !== id);
    })
    .then((cities) => {
      return this.write(cities);
    });
  }}


export default new HistoryService();
