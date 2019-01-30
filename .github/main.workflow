workflow "Test and deploy to heroku" {
  on = "push"
}

action "Build" {
  uses = "actions/npm@master"
  args = "install"
}

action "Lint" {
  needs = "Build"
  uses = "actions/npm@master"
  args = "run lint"
}

action "Test" {
  needs = "Build"
  uses = "actions/npm@master"
  args = "test"
}

action "git.master" {
  uses = "actions/bin/filter@master"
  needs = ["Build", "Lint", "Test"]
  args = "branch master"
}

action "heroku.login" {
  uses = "actions/heroku@master"
  needs = ["git.master"]
  args = "container:login"
  secrets = ["HEROKU_API_KEY"]
}

action "heroku.push" {
  uses = "actions/heroku@master"
  needs = "heroku.login"
  args = ["container:push", "web"]
  secrets = [
    "HEROKU_API_KEY",
    "HEROKU_APP",
  ]
  env = {
    RACK_ENV = "production"
  }
}

action "heroku.envs" {
  uses = "actions/heroku@master"
  needs = "heroku.push"
  args = [
    "config:set",
    "RACK_ENV=$RACK_ENV",
    "MY_SECRET=$MY_SECRET",
  ]
  secrets = [
    "HEROKU_API_KEY",
    "HEROKU_APP",
    "MY_SECRET",
  ]
  env = {
    NODE_ENV = "production"
  }
}

action "heroku.deploy" {
  uses = "actions/heroku@master"
  needs = ["heroku.envs", "heroku.push"]
  args = ["container:release", "web"]
  secrets = [
    "HEROKU_API_KEY",
    "HEROKU_APP",
    "MY_SECRET",
  ]
  env = {
    NODE_ENV = "production"
  }
}
