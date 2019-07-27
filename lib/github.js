const Octokit = require("@octokit/rest");
const pkg = require("../package.json");
const _ = require("lodash");
const CLI = require("clui");
const Spinner = CLI.Spinner;
const chalk = require("chalk");
const inquirer = require("./inquirer");
const Configstore = require("configstore");

const conf = new Configstore(pkg.name);

module.exports = {
  getInstance: () => {
    return global.octokit;
  },
  getStoredGithubToken: () => {
    return conf.get("github.token");
  },
  setGithubCredentials: async () => {
    const credentials = await inquirer.askGithubCredentials();
    const result = _.extend(
      {
        type: "basic"
      },
      credentials
    );

    global.octokit = Octokit({
      auth: result
    });
  },
  registerNewToken: async () => {
    const status = new Spinner("Authenticating you, please wait");
    status.start();
    try {
      const response = await global.octokit.oauthAuthorizations.createAuthorization(
        {
          scopes: ["user", "public_repo", "repo", "repo:status"],
          note: "nodegit, the cl tool for initializing git repos"
        }
      );
      const token = response.data.token;
      if (token) {
        conf.set("github.token", token);
        return token;
      } else {
        throw new Error("Missing token in github response");
      }
    } catch (err) {
      throw err;
    } finally {
      status.stop();
    }
  }
};
