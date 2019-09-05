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
        octokit.issues.create({
          owner: setting.create_issue.at.owner,
          repo: setting.create_issue.at.repo,
          title: setting.create_issue.title,
          body: setting.create_issue.body
        });
      }
    });
  } else if (action == "closed") {
    labels = issue.labels.map(function(label) {
      return label.name;
    });
    config = await fetchConfig(repository.owner.login, repository.name);
    console.log(`Closed issues had ${labels.toString()}`);
    config.closer.forEach(async function(setting) {
      console.log(`Using ${setting.on_label_parent}`);
      if (hasLabel(labels, setting.on_label_parent)) {
        try {
          child_issues = await octokit.issues.listForRepo({
            owner: repository.owner.login,
            repo: repository.name,
            labels: `child_of_${setting.on_label_parent}`
          }).data;
          if (child_issues.data.length > 0) {
            console.log(`Found ${child_issues.length} child_issues`);
            child_issues.forEach(async function(child_issue) {
              await octokit.issues.createComment({
                owner: repository.owner.login,
                repo: repository.name,
                issue_number: child_issue.number,
                body: setting.body
              });

              await octokit.issues.update({
                owner: repository.owner.login,
                repo: repository.name,
                issue_number: child_issue.number,
                state: "closed"
              });
            });
          }
        } catch (e) {
          console.error(e);
        }
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
