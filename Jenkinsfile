pipeline {
  agent any
  stages {
    stage('Test') {
      parallel {
        stage('Linting') {
          steps {
            sh "docker-compose up --build test-lint"
          }
        }
        stage('Unit') {
          steps {
            sh "docker-compose up --build test-unit"
          }
        }
        stage('Visual E2E') {
          steps {
            sh "docker-compose up --build test-e2e-visual"
          }
        }
        stage('Functional E2E') {
          steps {
            // sh "docker-compose up --build test-e2e-functional"
            sh 'echo "Failing"; exit 1;'
          }
        }
        stage('Aria E2E') {
          steps {
            sh "docker-compose up --build test-e2e-aria"
          }
        }
      }
    }
    stage('Stage2') {
      steps {
        echo 'foo'
      }
    }
    stage('Deploy on Bakkie') {
        when { not { branch 'master' } }

        steps {
          echo "Bakkie deploy"
            // sh "scripts/bakkie.sh ${env.BRANCH_NAME}"
        }
    }
    stage('Master only') {
      when { branch 'master' }
        steps {
          echo "Master stage echo"
        }
    }

    stage('Waiting for approval') {
        //slackSend channel: '#ci-channel', color: 'warning', message: 'City Data is waiting for Production Release - please confirm'
        input "Deploy to Production?"
    }
  }
  post {
    always {
      echo 'This will always run'

    }

    success {
      echo 'This will run only if successful'

    }

    failure {
      echo 'This will run only if failed'

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
