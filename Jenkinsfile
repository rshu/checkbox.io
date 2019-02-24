pipeline {
    agent any

    options {
        retry(3)
    }

    tools {
        nodejs "NodeJS10"
    }

    stages {
        stage('Checkout environment') {
            steps {
                sh "npm config ls"
                sh "nodejs -v"
            }
        }

        stage('Build and Mocha Test checkbox.io') {
            steps{
                dir('/var/lib/jenkins/workspace/checkbox.io/server-side/site') {
                    echo "checkbox.io mocha test"
                    sh "pwd"
                    sh 'npm test'
                }
            }       
        }
    }
}

