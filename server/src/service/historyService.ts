import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

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
    const history = await fs.promises.readFile('db/db.json', 'utf-8');
    return JSON.parse(history);
   }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
   private async write(cities: City[]) {
    await fs.promises.writeFile('db/db.json', JSON.stringify(cities));
   }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
   async getCities() {
    return await this.read().then((cities) => {
      let parsedCities: City[];

        try {
        parsedCities = [].concat(JSON.parse(cities));
      } catch (err) {
        parsedCities = [];
      }

      return parsedCities;
    });
   }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
   async addCity(city: string) {
    const history = await this.read();
    const newCity = new City(city, uuidv4());
    history.push(newCity);
    await this.write(history);
   }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
   async removeCity(id: string) {
    const history = await this.read();
    const updatedHistory = history.filter((city: City) => city.id !== id);
    await this.write(updatedHistory);
   }
}

export default new HistoryService();
