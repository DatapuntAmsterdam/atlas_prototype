pipeline {
  agent any
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
        sh 'docker ps'
      }
    }
    stage('Test') {
      failFast true
      parallel {
        stage('Linting') {
          steps {
            sh "docker-compose up --build --exit-code-from test-lint test-lint"
            // echo 'Skip'
          }
        }
        stage('Unit') {
          steps {
            sh "docker-compose up --build --exit-code-from test-unit test-unit"
            // echo 'Skip'
          }
        }
        stage('Visual E2E') {
          steps {
            sh "docker-compose up --build --exit-code-from test-e2e-visual test-e2e-visual"
            // echo 'Skip'
          }
        }
        stage('Functional E2E') {
          steps {
            // sh "docker-compose up --build --exit-code-from test-e2e-functional test-e2e-functional"
            // sh 'echo "Failing"; exit 1;'
            echo 'Skip'
          }
        }
        stage('Aria E2E') {
          steps {
            echo 'Skip'
            // sh "docker-compose up --build --exit-code-from test-e2e-aria test-e2e-aria"
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
    stage('Deploy Bakkie') {
      when { not { branch 'master' } }
      steps {
        sh "scripts/bakkie.sh ${env.BRANCH_NAME}"
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
      sh 'docker-compose down'
    }

    success {
      echo 'This will run only if successful'
    }

    failure {
      echo 'This will run only if failed'
      slackSend(channel: 'ci-channel', color: 'danger', message: "${env.JOB_NAME}: ${message} failure ${env.BUILD_URL}")
    }

    unstable {
      echo 'This will run only if the run was marked as unstable'
    }
  }
}
