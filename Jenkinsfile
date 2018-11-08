pipeline {
  agent any
  options {
    timeout(time: 5, unit: 'DAYS')
  }

  environment {
    COMMIT_HASH = GIT_COMMIT.substring(0, 8)
    PROJECT_PREFIX = "${BRANCH_NAME}_${COMMIT_HASH}_${BUILD_NUMBER}_"
    IMAGE_BASE = "build.datapunt.amsterdam.nl:5000/atlas/app"
    IMAGE_BUILD = "${IMAGE_BASE}:${BUILD_NUMBER}"
    IMAGE_ACCEPTANCE = "${IMAGE_BASE}:acceptance"
    IMAGE_PRODUCTION = "${IMAGE_BASE}:production"
    IMAGE_LATEST = "${IMAGE_BASE}:latest"
  }

  stages {

    stage('Deploy feature branch (Bakkie)') {
      when { not { branch 'master' } }
      options {
        timeout(time: 5, unit: 'MINUTES')
      }
      steps {
        sh "scripts/bakkie.sh ${BRANCH_NAME}"
      }
    }

    stage('Check API\'s health') {
      options {
        timeout(time: 2, unit: 'MINUTES')
      }
      environment {
        PROJECT                = "${PROJECT_PREFIX}e2e-api-health"
        USERNAME_EMPLOYEE_PLUS = 'atlas.employee.plus@amsterdam.nl'
        PASSWORD_EMPLOYEE_PLUS = credentials('PASSWORD_EMPLOYEE_PLUS')
      }
      steps {
        sh "docker-compose -p ${PROJECT} up --build --exit-code-from test-health-checks test-health-checks"
      }
      post {
        always {
          sh "docker-compose -p ${PROJECT} down -v || true"
        }
      }
    }

    stage ('Run Tests') {
      parallel {
        stage('Unit tests') {
          options {
            timeout(time: 30, unit: 'MINUTES')
          }
          environment {
            PROJECT = "${PROJECT_PREFIX}unit"
          }
          steps {
            sh "docker-compose -p ${PROJECT} up --build --exit-code-from test-unit-integration test-unit-integration"
          }
          post {
            always {
              sh "docker-compose -p ${PROJECT} down -v || true"
            }
          }
        }

        // stage('Linting') {
        //   options {
        //     timeout(time: 30, unit: 'MINUTES')
        //   }
        //   environment {
        //     PROJECT = "${PROJECT_PREFIX}linting"
        //   }
        //   steps {
        //     sh "docker-compose -p ${PROJECT} up --build --exit-code-from test-lint test-lint"
        //   }
        //   post {
        //     always {
        //       sh "docker-compose -p ${PROJECT} down -v || true"
        //     }
        //   }
        // }

        stage('E2E tests') {
          options {
            timeout(time: 60, unit: 'MINUTES')
          }
          environment {
            PROJECT                = "${PROJECT_PREFIX}e2e"
            USERNAME_EMPLOYEE      = 'atlas.employee@amsterdam.nl'
            USERNAME_EMPLOYEE_PLUS = 'atlas.employee.plus@amsterdam.nl'
            PASSWORD_EMPLOYEE      = credentials('PASSWORD_EMPLOYEE')
            PASSWORD_EMPLOYEE_PLUS = credentials('PASSWORD_EMPLOYEE_PLUS')
          }
          steps {
            sh "docker-compose -p ${PROJECT} up --build --exit-code-from test-e2e test-e2e"
          }
          post {
            always {
              sh "docker-compose -p ${PROJECT} down -v || true"
            }
          }
        }

        stage('E2E tests (Aria)') {
          options {
            timeout(time: 30, unit: 'MINUTES')
          }
          environment {
            PROJECT = "${PROJECT_PREFIX}e2e-aria"
          }
          steps {
            sh "docker-compose -p ${PROJECT} up --build --exit-code-from test-e2e-aria test-e2e-aria"
          }
          post {
            always {
              sh "docker-compose -p ${PROJECT} down -v || true"
            }
          }
        }
      }
    }

    stage('Build A') {
      when { branch 'master' }
      options {
        timeout(time: 30, unit: 'MINUTES')
      }
      steps {
        sh "docker build -t ${IMAGE_BUILD} " +
          "--shm-size 1G " +
          "--build-arg BUILD_ENV=acc " +
          "."
        sh "docker push ${IMAGE_BUILD}"
      }
    }

    stage('Deploy A (Master)') {
      when { branch 'master' }
      options {
        timeout(time: 5, unit: 'MINUTES')
      }
      steps {
        sh "docker pull ${IMAGE_BUILD}"
        sh "docker tag ${IMAGE_BUILD} ${IMAGE_ACCEPTANCE}"
        sh "docker push ${IMAGE_ACCEPTANCE}"
        build job: 'Subtask_Openstack_Playbook', parameters: [
          [$class: 'StringParameterValue', name: 'INVENTORY', value: 'acceptance'],
          [$class: 'StringParameterValue', name: 'PLAYBOOK', value: 'deploy-client.yml']
        ]
      }
    }

    stage('Build P (Master)') {
      when { branch 'master' }
      options {
        timeout(time: 30, unit: 'MINUTES')
      }
      steps {
        // NOTE BUILD_ENV intentionaly not set (using Dockerfile default)
        sh "docker build -t ${IMAGE_PRODUCTION} " +
            "--shm-size 1G " +
            "."
        sh "docker tag ${IMAGE_PRODUCTION} ${IMAGE_LATEST}"
        sh "docker push ${IMAGE_PRODUCTION}"
        sh "docker push ${IMAGE_LATEST}"
      }
    }

    stage('Deploy pre P (Master)') {
      when { branch 'master' }
      options {
        timeout(time: 5, unit: 'MINUTES')
      }
      steps {
        build job: 'Subtask_Openstack_Playbook', parameters: [
          [$class: 'StringParameterValue', name: 'INVENTORY', value: 'acceptance'],
          [$class: 'StringParameterValue', name: 'PLAYBOOK', value: 'deploy-client-pre.yml']
        ]
      }
    }

    stage('Waiting for approval (Master)') {
      when { branch 'master' }
      steps {
        script {
          input "Deploy to Production?"
          echo "Okay, moving on"
        }
      }
    }

    stage('Deploy P (Master)') {
      when { branch 'master' }
      options {
        timeout(time: 5, unit: 'MINUTES')
      }
      steps {
        build job: 'Subtask_Openstack_Playbook', parameters: [
          [$class: 'StringParameterValue', name: 'INVENTORY', value: 'production'],
          [$class: 'StringParameterValue', name: 'PLAYBOOK', value: 'deploy-client.yml']
        ]
      }
    }
  }

  post {
    success {
      echo 'Pipeline success'
    }

    failure {
      echo 'Something went wrong while running pipeline'
      slackSend(
        channel: 'ci-channel',
        color: 'danger',
        message: "${JOB_NAME}: failure ${BUILD_URL}"
      )
    }
  }
}
