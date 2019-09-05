const github = require("@actions/github");
const process = require("process");
const yaml = require("js-yaml").safeLoad;

const octokit = new github.GitHub(process.env.GITHUB_TOKEN);

const config_file_path = ".github/labels.yml";

async function run() {
  const payload = github.context.payload;
  const action = payload.action;
  const issue = payload.issue;
  const repository = payload.repository;

  if (action == "labeled") {
    label_name = payload.label.name;
    config = await fetchConfig(repository.owner.login, repository.name);

    config.labeler.forEach(function(setting) {
      if (setting.on_label == label_name) {
        octokit.issues({
          owner: setting.create_issue.at.owner,
          repo: setting.create_issue.at.repo,
          title: setting.create_issue.title,
          body: setting.create_issue.body
        });
      }
    });
  } else if (action == "closed") {
    labels = issue.labels;
    config = await fetchConfig(repository.owner.login, repository.name);
    config.closer.forEach(function(setting) {
      if (hasLabel(labels, setting.on_label_parent)) {
        child_issues = octokit.issues.list({
          owner: repository.owner,
          repo: repository.name,
          labels: `child_of_${setting.on_label_parent}`
        });
        child_issues.forEach(function(child_issue) {
          octokit.issues.createComment({
            owner: repository.owner,
            repo: repository.name,
            issue_number: child_issue.number,
            body: setting.body
          });

          octokit.issues.update({
            owner: repository.owner,
            repo: repository.name,
            issue_number: child_issue.number,
            state: "closed"
          });
        });
      }
    });
  } else {
    console.log(`Wanted a "labeled" or "closed" event, but got "${action}"`);
  }
}

async function fetchConfig(owner, repo) {
  const response = await octokit.repos.getContents({
    owner: owner,
    repo: repo,
    path: config_file_path,
    ref: github.context.sha
  });

  config_contents = Buffer.from(response.data.content, "base64").toString();
  return yaml(config_contents);
}

function hasLabel(labels, label) {
  return labels.indexOf(label) > -1;
}

run();
