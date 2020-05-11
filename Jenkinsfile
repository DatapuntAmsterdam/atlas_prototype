pipeline {
  agent any
  options {
    timeout(time: 5, unit: 'DAYS')
  }

  environment {
    COMMIT_HASH = GIT_COMMIT.substring(0, 8)
    PROJECT_PREFIX = "${BRANCH_NAME}_${COMMIT_HASH}_${BUILD_NUMBER}_"

    IMAGE_FRONTEND_BASE = "docker-registry.data.amsterdam.nl/atlas/app"
    IMAGE_FRONTEND_BUILD = "${IMAGE_FRONTEND_BASE}:${BUILD_NUMBER}"
    IMAGE_FRONTEND_ACCEPTANCE = "${IMAGE_FRONTEND_BASE}:acceptance"
    IMAGE_FRONTEND_PRODUCTION = "${IMAGE_FRONTEND_BASE}:production"
    IMAGE_FRONTEND_LATEST = "${IMAGE_FRONTEND_BASE}:latest"
  }

  stages {

    // stage('Check API\'s health') {
    //   options {
    //     timeout(time: 2, unit: 'MINUTES')
    //   }
    //   environment {
    //     PROJECT                = "${PROJECT_PREFIX}e2e-api-health"
    //     USERNAME_EMPLOYEE_PLUS = 'atlas.employee.plus@amsterdam.nl'
    //     PASSWORD_EMPLOYEE_PLUS = credentials('PASSWORD_EMPLOYEE_PLUS')
    //   }
    //   steps {
    //     sh "docker-compose -p ${PROJECT} up --build --exit-code-from test-health-checks test-health-checks"
    //   }
    //   post {
    //     always {
    //       sh "docker-compose -p ${PROJECT} down -v || true"
    //     }
    //   }
    // }

    stage('Unit tests') {
      options {
        timeout(time: 30, unit: 'MINUTES')
      }
      environment {
        PROJECT = "${PROJECT_PREFIX}unit"
      }
      steps {
        sh "docker-compose -p ${PROJECT} up --build --exit-code-from test-unit test-unit"
      }
      post {
        always {
          sh "docker-compose -p ${PROJECT} down -v || true"
        }
      }
    }

    // stage('Run tests') {
      //parallel {
        // stage('E2E tests') {
        //   options {
        //     timeout(time: 60, unit: 'MINUTES')
        //   }
        //   environment {
        //     PROJECT                = "${PROJECT_PREFIX}e2e"
        //     USERNAME_EMPLOYEE      = 'atlas.employee@amsterdam.nl'
        //     USERNAME_EMPLOYEE_PLUS = 'atlas.employee.plus@amsterdam.nl'
        //     PASSWORD_EMPLOYEE      = credentials('PASSWORD_EMPLOYEE')
        //     PASSWORD_EMPLOYEE_PLUS = credentials('PASSWORD_EMPLOYEE_PLUS')
        //   }
        //   steps {
        //     sh "docker-compose -p ${PROJECT} up --build --exit-code-from start start"
        //   }
        //   post {
        //     always {
        //        sh "docker-compose -p ${PROJECT} down -v || true"
        //     }
        //   }
        // }

        // stage('E2E tests (Aria)') {
        //   options {
        //     timeout(time: 30, unit: 'MINUTES')
        //   }
        //   environment {
        //     PROJECT = "${PROJECT_PREFIX}e2e-aria"
        //   }
        //   steps {
        //     // sh "docker-compose -p ${PROJECT} up --build --exit-code-from test-e2e-aria test-e2e-aria"
        //     sh "echo \"Skipped aria test!\"" // TODO refactor, reactivate
        //   }
        //   post {
        //     always {
        //       sh "docker-compose -p ${PROJECT} down -v || true"
        //     }
        //   }
        // }
      //}
    // }

    stage('Build A') {
      when { expression { BRANCH_NAME ==~ /(master|develop)/ } }
      options {
        timeout(time: 30, unit: 'MINUTES')
      }
      steps {
        // Frontend
        sh "docker build -t ${IMAGE_FRONTEND_BUILD} " +
          "--shm-size 1G " +
          "--build-arg NODE_ENV=acceptance " +
          "."
        sh "docker push ${IMAGE_FRONTEND_BUILD}"
      }
    }

    stage('Deploy A (Master & Develop)') {
      when { expression { BRANCH_NAME ==~ /(master|develop)/ } }
      options {
        timeout(time: 5, unit: 'MINUTES')
      }
      steps {
        // Frontend
        sh "docker pull ${IMAGE_FRONTEND_BUILD}"
        sh "docker tag ${IMAGE_FRONTEND_BUILD} ${IMAGE_FRONTEND_ACCEPTANCE}"
        sh "docker push ${IMAGE_FRONTEND_ACCEPTANCE}"
        build job: 'Subtask_Openstack_Playbook', parameters: [
          [$class: 'StringParameterValue', name: 'INVENTORY', value: 'acceptance'],
          [$class: 'StringParameterValue', name: 'PLAYBOOK', value: 'deploy-client.yml']
        ]
      }
    }

    stage('Build P (Master)') {
      when { expression { BRANCH_NAME ==~ /(master|develop)/ } }
      options {
        timeout(time: 30, unit: 'MINUTES')
      }
      steps {
        // NOTE NODE_ENV intentionaly not set (using Dockerfile default)
        // Frontend
        sh "docker build -t ${IMAGE_FRONTEND_PRODUCTION} " +
            "--shm-size 1G " +
            "."
        sh "docker tag ${IMAGE_FRONTEND_PRODUCTION} ${IMAGE_FRONTEND_LATEST}"
        sh "docker push ${IMAGE_FRONTEND_PRODUCTION}"
        sh "docker push ${IMAGE_FRONTEND_LATEST}"
      }
    }

    stage('Deploy pre P (Master & Develop)') {
      when { expression { BRANCH_NAME ==~ /(master|develop)/ } }
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
