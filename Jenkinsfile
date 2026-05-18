pipeline {
    agent any

    environment {
        // Safe binding for your automated Render Deploy Webhook
        RENDER_HOOK = credentials('RENDER_DEPLOY_HOOK')
    }

    stages {
        stage('1. Fetch Source Code') {
            steps {
                echo 'Pulling source tree configuration from SCM repository...'
                checkout scm
            }
        }

        stage('2. Code Quality Analysis') {
            steps {
                echo 'Executing code metrics checks via SonarQube Container...'
                withCredentials([string(credentialsId: 'SONAR_TOKEN', variable: 'SONAR_KEY')]) {
                    bat """
                        docker run --rm -v "%cd%:/usr/src" sonarsource/sonar-scanner-cli \
                        -Dsonar.projectKey=YOUR_NEW_PROJECT_KEY \
                        -Dsonar.organization=YOUR_ORGANIZATION_KEY \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=https://sonarcloud.io \
                        -Dsonar.token=%SONAR_KEY%
                    """
                }
            }
        }

        stage('3. Vulnerability Scanning') {
            steps {
                echo 'Running deep dependency filesystem scans via Trivy...'
                bat 'docker run --rm -v "%cd%:/apps" aquasec/trivy fs /apps > trivy-report.txt'
            }
        }

        stage('4. Build Docker Image') {
            steps {
                echo 'Compiling local container build to verify image assembly...'
                bat 'docker build -t native-todo-app:local .'
            }
        }

        stage('5. Deploy to Render') {
            steps {
                echo 'Calling Render webhook endpoint to pull new target deployment branch...'
                bat 'curl -X POST "%RENDER_HOOK%"'
            }
        }
    }

    post {
        always {
            echo 'Publishing workspace security scan logs...'
            archiveArtifacts artifacts: 'trivy-report.txt', allowEmptyArchive: true
        }
    }
}