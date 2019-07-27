const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");
const files = require("./lib/files");
const inquirer = require("./lib/inquirer");
const github = require("./lib/github");
const repo = require("./lib/repo");

clear();
console.log(
  chalk.yellow(
    figlet.textSync("A journey begins", { horizontalLayout: "full" })
  )
);

// if (files.directoryExists(".git")) {
//   console.log(chalk.red(" A git repo"));
//   process.exit();
// }

const getGithubToken = async () => {
  let token = github.getStoredGithubToken();
  if (token) return token;

  await github.setGithubCredentials();
  token = await github.registerNewToken();
  return token;
};

const run = async () => {
  // const credentials = await inquirer.askGithubCredentials();
  // console.log(credentials);
  try {
    let token = getGithubToken();
    await console.log(token);

    github.githubAuth(token);

    const url = await repo.createRemoteRepo();

    const done = await repo.setupRepo();

    if (done) {
      console.log(chalk.green("all done"));
    }
  } catch (err) {
    if (err) {
      console.log(err);
    }
  }
};

run();
