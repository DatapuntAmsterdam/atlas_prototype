#!groovy

def tryStep(String message, Closure block, Closure tearDown = null) {
    try {
        block()
    }
    catch (Throwable t) {
        //slackSend message: "${env.JOB_NAME}: ${message} failure ${env.BUILD_URL}", channel: '#ci-channel', color: 'danger'

        throw t
    }
    finally {
        if (tearDown) {
            tearDown()
        }
    }
}


node {
    stage("Checkout") {
        checkout scm
    }

    stage("Build image") {
        tryStep "build", {
            withCredentials([[$class: 'StringBinding', credentialsId: 'PASSWORD_EMPLOYEE', variable: 'PASSWORD_EMPLOYEE'],
                             [$class: 'StringBinding', credentialsId: 'PASSWORD_EMPLOYEE_PLUS', variable: 'PASSWORD_EMPLOYEE_PLUS']]) {
                if (!PASSWORD_EMPLOYEE?.trim()) {
                    error("PASSWORD_EMPLOYEE missing")
                }
                if (!PASSWORD_EMPLOYEE_PLUS?.trim()) {
                    error("PASSWORD_EMPLOYEE_PLUS missing")
                }
                def image = docker.build("build.datapunt.amsterdam.nl:5000/atlas/app:${env.BUILD_NUMBER}",
                    "--shm-size 1G " +
                    "--build-arg BUILD_ENV=acc --build-arg PASSWORD_EMPLOYEE=${PASSWORD_EMPLOYEE} " +
                    "--build-arg PASSWORD_EMPLOYEE_PLUS=${PASSWORD_EMPLOYEE_PLUS} .")
                image.push()
            }
        }
    }
}


String BRANCH = "${env.BRANCH_NAME}"

if (BRANCH == "master") {

    node {
        stage('Push acceptance image') {
            tryStep "image tagging", {
                def image = docker.image("build.datapunt.amsterdam.nl:5000/atlas/app:${env.BUILD_NUMBER}")
                image.pull()
                image.push("acceptance")
            }
        }
    }

    node {
        stage("Deploy to ACC") {
            tryStep "deployment", {
                build job: 'Subtask_Openstack_Playbook',
                    parameters: [
                        [$class: 'StringParameterValue', name: 'INVENTORY', value: 'acceptance'],
                        [$class: 'StringParameterValue', name: 'PLAYBOOK', value: 'deploy-client.yml'],
                    ]
            }
        }
    }

    node {
        stage('Build and Push preproduction image') {
            tryStep "image tagging", {
                withCredentials([[$class: 'StringBinding', credentialsId: 'PASSWORD_EMPLOYEE', variable: 'PASSWORD_EMPLOYEE'],
                                 [$class: 'StringBinding', credentialsId: 'PASSWORD_EMPLOYEE_PLUS', variable: 'PASSWORD_EMPLOYEE_PLUS']]) {
                    if (!PASSWORD_EMPLOYEE?.trim()) {
                        error("PASSWORD_EMPLOYEE missing")
                    }
                    if (!PASSWORD_EMPLOYEE_PLUS?.trim()) {
                        error("PASSWORD_EMPLOYEE_PLUS missing")
                    }
                    def image = docker.build("build.datapunt.amsterdam.nl:5000/atlas/app:${env.BUILD_NUMBER}-preproduction",
                        "--shm-size 1G " +
                        "--build-arg PASSWORD_EMPLOYEE=${PASSWORD_EMPLOYEE} " +
                        "--build-arg PASSWORD_EMPLOYEE_PLUS=${PASSWORD_EMPLOYEE_PLUS} .")

                    image.push("preproduction")
                    image.push()
                }
            }
        }
    }

    node {
        stage("Deploy to PRE-Production") {
            tryStep "deployment", {
                build job: 'Subtask_Openstack_Playbook',
                    parameters: [
                        [$class: 'StringParameterValue', name: 'INVENTORY', value: 'acceptance'],
                        [$class: 'StringParameterValue', name: 'PLAYBOOK', value: 'deploy-client-pre.yml'],
                    ]
            }
        }
    }

    stage('Waiting for approval') {
        //slackSend channel: '#ci-channel', color: 'warning', message: 'City Data is waiting for Production Release - please confirm'
        input "Deploy to Production?"
    }

    node {
        stage('Push production image') {
            tryStep "image tagging", {
                def image = docker.image("build.datapunt.amsterdam.nl:5000/atlas/app:${env.BUILD_NUMBER}-preproduction")
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
                    ]
            }
        }
    }
}  else {
    node {
        stage('Test') {
            tryStep "Test", {
                sh "docker-compose up --build test-lint"
            }
        }
    }
    
    node {
        stage('Deploy on Bakkie') {
            tryStep "building bakkie", {
                sh "scripts/bakkie.sh ${env.BRANCH_NAME}"
            }
        }
    }

}

