workflow "Test and deploy to heroku" {
  on = "push"
  resolves = ["Test", "Deploy to heroku"]
}

action "Build" {
  uses = "actions/docker/cli@master"
  args = "build -f Dockerfile -t ci-$GITHUB_SHA:latest ."
}

action "Install" {
  uses = "actions/docker/cli@master"
  needs = ["Build"]
  args = "run ci-$GITHUB_SHA:latest npm install"
}

action "Lint" {
  uses = "actions/docker/cli@master"
  needs = ["Install"]
  args = "run ci-$GITHUB_SHA:latest npm run lint"
}

action "Test" {
  uses = "actions/docker/cli@master"
  needs = ["Install"]
  args = "run ci-$GITHUB_SHA:latest npm test"
  secrets = ["LDAP_PASSWORD", "JWT_SECRET", "JUMPCLOUD_API_KEY", "LDAP_USERNAME", "LDAP_ORG_ID"]
}

action "On master" {
  uses = "actions/bin/filter@master"
  needs = ["Lint", "Test"]
  args = "branch master"
}

action "Login to Heroku" {
  uses = "actions/heroku@master"
  needs = ["On master"]
  args = "container:login"
  secrets = ["HEROKU_API_KEY"]
}

action "Push to heroku" {
  uses = "actions/heroku@master"
  needs = ["Login to Heroku"]
  args = ["container:push", "web"]
  secrets = ["HEROKU_APP", "HEROKU_API_KEY"]
  env = {
    NODE_ENV = "production"
  }
}

action "Add env variables to Heroku" {
  uses = "actions/heroku@master"
  needs = ["Push to heroku"]
  args = ["config:set", "NODE_ENV=production"]
  secrets = [
    "HEROKU_APP",
    "HEROKU_API_KEY",
    "JUMPCLOUD_API_KEY",
    "JWT_SECRET",
    "LDAP_ORG_ID",
    "LDAP_USERNAME",
    "LDAP_PASSWORD",
  ]
}

action "Deploy to heroku" {
  uses = "actions/heroku@master"
  needs = ["Add env variables to Heroku"]
  args = ["container:release", "web"]
  secrets = ["HEROKU_APP", "HEROKU_API_KEY"]
}
