const logger = require("../utils/logger");

class ExampleUsecase {
  constructor(exampleRepo) {
    this.exampleRepo = exampleRepo;
  }

  async login(username, password) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.exampleRepo.login(username, password);
        resolve(response);
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  }
}

module.exports = (exampleRepo) => {
  return new ExampleUsecase(exampleRepo);
};
