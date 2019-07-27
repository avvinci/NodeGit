const _ = require("lodash");
const fs = require("fs");
const git = require("simple-git")();
const CLI = require("clui");
const Spinner = CLI.Spinner;

const inquirer = require("./inquirer");
const gh = require("./github");

module.exports = {
  createRemoteRepo: async () => {
    const github = gh.getInstance();
    const answers = await inquirer.askRepoDetails();

    const data = {
      name: answers.name,
      description: "A repo using nodegit",
      private: answers.visibility === "private"
    };

    const status = new Spinner("Creating remote repo...");
    status.start();
    try {
      const response = await github.repos.create(data);
      return response.url.ssh_url;
    } catch (err) {
      throw err;
    } finally {
      status.stop();
    }
  }
};
