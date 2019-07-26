var NodeGit = require("nodegit");

var pathToRepo = require("path").resolve("../elementry-electron");

var getMostRecentCommit = function(repository) {
  return repository.getBranchCommit("master");
};

var getCommitMessage = function(commit) {
  return commit.message();
};

// var signature = Signature.create(name, email, time, offset);
NodeGit.Repository.open(pathToRepo)
  .then(getMostRecentCommit)
  .then(getCommitMessage)
  .then(function(message) {
    console.log(message);
  });
