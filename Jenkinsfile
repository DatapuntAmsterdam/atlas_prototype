pipeline {
  agent any
  stages {
    stage('Build') {

    }
    stage('Test') {
      failFast true
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
            // sh "docker-compose up --build test-e2e-visual"
            echo 'Skip'
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
            // echo 'Skip'
            sh "docker-compose up --build test-e2e-aria"
          }
        }
      }
    }
    stage('Build A') {
      steps {
        echo 'foo'
        sh '
          echo "multiline";
        '
      }
    }
    stage('Deploy on Bakkie') {
        when { not { branch 'master' } }

        steps {
          echo "Bakkie deploy"
            // sh "scripts/bakkie.sh ${env.BRANCH_NAME}"
        }
    }
    stage('Deploy A (Master only)') {
        when { branch 'master' }
        steps {
          echo "Deploying A"
        }
    }
    stage('Build P (Master only)') {
        when { branch 'master' }
        steps {
          echo "Master stage echo"
        }
    }
    stage('Waiting for approval (Master only)') {
        when { branch 'master' }
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
            echo "Deploying P"
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
