pipeline {
  agent any
  environment {
    IMAGE_BASE = "build.datapunt.amsterdam.nl:5000/atlas/app"
  }
  stages {
    stage('Test') {
      failFast true
      parallel {
        stage('Linting') {
          steps {
            sh "docker-compose up --build test-lint"
            // echo 'Skip'
          }
        }
        stage('Unit') {
          steps {
            sh "docker-compose up --build test-unit"
            // echo 'Skip'
          }
        }
        stage('Visual E2E') {
          steps {
            sh "docker-compose up --build test-e2e-visual"
            // echo 'Skip'
          }
        }
        stage('Functional E2E') {
          steps {
            // sh "docker-compose up --build test-e2e-functional"
            // sh 'echo "Failing"; exit 1;'
            echo 'Skip'
          }
        }
        stage('Aria E2E') {
          steps {
            echo 'Skip'
            // sh "docker-compose up --build test-e2e-aria"
          }
        }
      }
    }
    stage('Build A') {
      steps {
        sh "docker build -t ${IMAGE_BASE}:${env.BUILD_NUMBER} " +
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
            sh "docker tag " +
              "${IMAGE_BASE}:${env.BUILD_NUMBER} " +
              "${IMAGE_BASE}:acceptance"
            sh "docker push ${IMAGE_BASE}:${env.BUILD_NUMBER}"
            sh "docker push ${IMAGE_BASE}:acceptance"
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
          sh "docker build -t ${IMAGE_BASE}:production " +
              "--shm-size 1G " +
              "."
          sh "docker push ${IMAGE_BASE}:production"
        }
    }
    stage('Deploy pre P (Master only)') {
        when { branch 'master' }
        steps {
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
      slackSend(channel: 'ci-channel', color: 'danger', message: '${env.JOB_NAME}: ${message} failure ${env.BUILD_URL}')
    }

    unstable {
      echo 'This will run only if the run was marked as unstable'
    }

    changed {
      echo 'This will run only if the state of the Pipeline has changed'
      echo 'For example, if the Pipeline was previously failing but is now successful'

    }

  }
}
