pipeline {
  agent any
  options {
    timeout(time: 1, unit: 'HOURS')
  }
  environment {
    IMAGE_BASE = "build.datapunt.amsterdam.nl:5000/atlas/app"
    IMAGE_BUILD = "${IMAGE_BASE}:${env.BUILD_NUMBER}"
    IMAGE_ACCEPTANCE = "${IMAGE_BASE}:acceptance"
    IMAGE_PRODUCTION = "${IMAGE_BASE}:production"
    IMAGE_LATEST = "${IMAGE_BASE}:latest"
  }
  stages {
    stage('Cleanup') {
      steps {
        // TODO remove
        sh 'docker ps'
        sh 'docker-compose down'
        sh 'docker-compose stop storybook'
        sh 'docker ps'
        // sh "echo 'Failing'; exit 1;"
      }
    }
    stage('Deploy Bakkie') {
      when { not { branch 'master' } }
      steps {
        sh "scripts/bakkie.sh ${env.BRANCH_NAME}"
      }
    }
    stage('Test') {
      failFast true
      parallel {
        stage('Linting') {
          steps {
            sh 'docker-compose up --build --exit-code-from test-lint test-lint'
            // echo 'Skip'
          }
        }
        stage('Unit') {
          steps {
            sh 'docker-compose up --build --exit-code-from test-unit test-unit'
            // echo 'Skip'
          }
        }
        stage('Visual E2E') {
          steps {
            // sh 'docker-compose up --build --exit-code-from test-e2e-visual test-e2e-visual'
            echo 'Skip'
          }
        }
        stage('Functional E2E') {
          environment {
            USERNAME_EMPLOYEE      = 'atlas.employee@amsterdam.nl'
            USERNAME_EMPLOYEE_PLUS = 'atlas.employee.plus@amsterdam.nl'
            PASSWORD_EMPLOYEE      = credentials('PASSWORD_EMPLOYEE')
            PASSWORD_EMPLOYEE_PLUS = credentials('PASSWORD_EMPLOYEE_PLUS')
          }
          steps {
            sh 'docker-compose up --build --exit-code-from test-e2e-functional test-e2e-functional'
            // echo 'Skip'
          }
        }
        stage('Aria E2E') {
          steps {
            sh 'docker-compose up --build --exit-code-from test-e2e-aria test-e2e-aria'
            // echo 'Skip'
          }
        }
      }
    }
    stage('Build A') {
      steps {
        sh "docker build -t ${IMAGE_BUILD} " +
          "--shm-size 1G " +
          "--build-arg BUILD_ENV=acc " +
          "."
      }
    }
    stage('Deploy A (Master only)') {
      when { branch 'master' }
      steps {
        sh "docker tag ${IMAGE_BUILD} ${IMAGE_ACCEPTANCE}"
        sh "docker push ${IMAGE_BUILD}"
        sh "docker push ${IMAGE_ACCEPTANCE}"
        build job: 'Subtask_Openstack_Playbook', parameters: [
          [$class: 'StringParameterValue', name: 'INVENTORY', value: 'acceptance'],
          [$class: 'StringParameterValue', name: 'PLAYBOOK', value: 'deploy-client.yml']
        ]
      }
    }
    stage('Build P (Master only)') {
      when { branch 'master' }
      steps {
        // NOTE BUILD_ENV intentionaly not set
        sh "docker build -t ${IMAGE_PRODUCTION} " +
            "--shm-size 1G " +
            "."
      }
    }
    stage('Deploy pre P (Master only)') {
      when { branch 'master' }
      steps {
        sh "docker tag ${IMAGE_PRODUCTION} ${IMAGE_LATEST}"
        sh "docker push ${IMAGE_PRODUCTION}"
        sh "docker push ${IMAGE_LATEST}"
        build job: 'Subtask_Openstack_Playbook', parameters: [
          [$class: 'StringParameterValue', name: 'INVENTORY', value: 'acceptance'],
          [$class: 'StringParameterValue', name: 'PLAYBOOK', value: 'deploy-client-pre.yml']
        ]
      }
    }
    stage('Waiting for approval (Master only)') {
      when {
        beforeAgent true
        branch 'master'
      }
      options {
        timeout(time:5, unit:'DAYS')
      }
      input {
        message "Deploy to production?"
        ok "Yes, deploy"
      }
      steps {
        echo "Okay, moving on"
      }
    }
    stage('Deploy P (Master only)') {
      when { branch 'master' }
      steps {
        build job: 'Subtask_Openstack_Playbook', parameters: [
          [$class: 'StringParameterValue', name: 'INVENTORY', value: 'production'],
          [$class: 'StringParameterValue', name: 'PLAYBOOK', value: 'deploy-client.yml']
        ]
      }
    }
  }
  post {
    always {
      echo 'This will always run'
      sh 'docker-compose down -v'
    }

    success {
      echo 'This will run only if successful'
    }

    failure {
      echo 'This will run only if failed'
      // slackSend(
      //   channel: 'ci-channel',
      //   color: 'danger',
      //   message: "${env.JOB_NAME}: failure ${env.BUILD_URL}"
      // )
    }

    unstable {
      echo 'This will run only if the run was marked as unstable'
    }
  }
}
