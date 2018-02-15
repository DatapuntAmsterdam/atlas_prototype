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
