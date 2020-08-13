pipeline {
  agent any
  options {
    timeout(time: 5, unit: 'DAYS')
  }

  environment {
    COMMIT_HASH = GIT_COMMIT.substring(0, 8)
    PROJECT_PREFIX = "${BRANCH_NAME}_${COMMIT_HASH}_${BUILD_NUMBER}_"

    IMAGE_FRONTEND_BASE = 'docker-registry.data.amsterdam.nl/atlas/app'
    IMAGE_FRONTEND_BUILD = "${IMAGE_FRONTEND_BASE}:${BUILD_NUMBER}"
    IMAGE_FRONTEND_ACCEPTANCE = "${IMAGE_FRONTEND_BASE}:acceptance"
    IMAGE_FRONTEND_PRODUCTION = "${IMAGE_FRONTEND_BASE}:production"
    IMAGE_FRONTEND_LATEST = "${IMAGE_FRONTEND_BASE}:latest"

    PRODUCTION_BRANCH = 'master'
    ACCEPTANCE_BRANCH = 'develop'
  }

  stages {
    stage('Build and push Docker image') {
      options {
        timeout(time: 30, unit: 'MINUTES')
      }
      steps {
        script {
          sh "docker build -t ${IMAGE_FRONTEND_BUILD} --shm-size 1G ."
        }

        sh "docker push ${IMAGE_FRONTEND_BUILD}"

        script {
          // Tag and push the image for production and latest if on production branch.
          if (BRANCH_NAME == PRODUCTION_BRANCH) {
            sh "docker tag ${IMAGE_FRONTEND_BUILD} ${IMAGE_FRONTEND_PRODUCTION}"
            sh "docker tag ${IMAGE_FRONTEND_BUILD} ${IMAGE_FRONTEND_LATEST}"
            sh "docker push ${IMAGE_FRONTEND_PRODUCTION}"
            sh "docker push ${IMAGE_FRONTEND_LATEST}"
          }
        }

        script {
          // Tag and push the image for acceptance and latest if on acceptance branch.
          if (BRANCH_NAME == ACCEPTANCE_BRANCH) {
            sh "docker tag ${IMAGE_FRONTEND_BUILD} ${IMAGE_FRONTEND_ACCEPTANCE}"
            sh "docker push ${IMAGE_FRONTEND_ACCEPTANCE}"
          }
        }
      }
    }

    stage('Deploy to acceptance') {
      when { branch ACCEPTANCE_BRANCH }
      options {
        timeout(time: 5, unit: 'MINUTES')
      }
      steps {
        build job: 'Subtask_Openstack_Playbook', parameters: [
          [$class: 'StringParameterValue', name: 'INVENTORY', value: 'acceptance'],
          [$class: 'StringParameterValue', name: 'PLAYBOOK', value: 'deploy-client.yml']
        ]
      }
    }

    stage('Deploy to pre-production') {
      when { branch PRODUCTION_BRANCH }
      options {
        timeout(time: 5, unit: 'MINUTES')
      }
      steps {
        build job: 'Subtask_Openstack_Playbook', parameters: [
          [$class: 'StringParameterValue', name: 'INVENTORY', value: 'production'],
          [$class: 'StringParameterValue', name: 'PLAYBOOK', value: 'deploy-client-pre.yml']
        ]
      }
    }

    stage('Production deployment approval') {
      when { branch PRODUCTION_BRANCH }
      steps {
        script {
          input 'Deploy to Production?'
          echo 'Okay, moving on'
        }
      }
    }

    stage('Deploy to production') {
      when { branch PRODUCTION_BRANCH }
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
