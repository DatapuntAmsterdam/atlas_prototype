#!groovy

def tryStep(String message, Closure block, Closure tearDown = null) {
    try {
        block();
    }
    catch (Throwable t) {
        slackSend message: "${env.JOB_NAME}: ${message} failure ${env.BUILD_URL}", channel: '#ci-channel', color: 'danger'

        throw t;
    }
    finally {
        if (tearDown) {
            tearDown();
        }
    }
}
String BUILD_NUMBER = "${env.BUILD_NUMBER}"
node {

    stage("Checkout") {
        checkout scm
    }

    stage ("Test") {
        tryStep "Test",  {
                sh "docker-compose -p atlas -f .jenkins/docker-compose.yml build"
                sh "docker-compose -p atlas -f .jenkins/docker-compose.yml run --rm -u root atlas npm test"
        }
    }

    stage("Build develop image") {
        tryStep "build", {
            def image = docker.build( "build.datapunt.amsterdam.nl:5000/atlas/app:${env.BUILD_NUMBER} --build-arg BUILD_NUMBER=$UILD_NUMBER")
            image.push()
            image.push("acceptance")
        }
    }
}

String BRANCH = "${env.BRANCH_NAME}"

if (BRANCH == "master") {

node {
    stage("Deploy to ACC") {
        tryStep "deployment", {
            build job: 'Subtask_Openstack_Playbook',
                    parameters: [
                            [$class: 'StringParameterValue', name: 'INVENTORY', value: 'acceptance'],
                            [$class: 'StringParameterValue', name: 'PLAYBOOK', value: 'deploy-client.yml'],
                            [$class: 'StringParameterValue', name: 'BRANCH', value: 'master'],
                    ]
        }
    }
}


stage('Waiting for approval') {
    slackSend channel: '#ci-channel', color: 'warning', message: 'Atlas is waiting for Production Release - please confirm'
    input "Deploy to Production?"
}



node {
    stage('Push production image') {
        tryStep "image tagging", {
            def image = docker.image("build.datapunt.amsterdam.nl:5000/atlas/app:${env.BUILD_NUMBER}")
            image.pull()

            image.push("production")
            image.push("latest")
        }
    }
}

node {
    stage("Deploy") {
        tryStep "deployment", {
            build job: 'Subtask_Openstack_Playbook',
                    parameters: [
                            [$class: 'StringParameterValue', name: 'INVENTORY', value: 'production'],
                            [$class: 'StringParameterValue', name: 'PLAYBOOK', value: 'deploy-client.yml'],
                            [$class: 'StringParameterValue', name: 'BRANCH', value: 'master'],
                    ]
        }
    }
}
}
