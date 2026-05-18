pipeline {
    agent any

    environment {
        // Render Deploy Hook URL (Keep this secure using Jenkins Credentials)
        RENDER_HOOK = credentials('RENDER_DEPLOY_HOOK')
    }

    stages {
        stage('1. Fetch Source Code') {
            steps {
                echo 'Fetching source code from GitHub...'
                checkout scm
            }
        }

        stage('2. Code Quality Analysis') {
            steps {
                echo 'Running Code Quality Analysis via SonarQube (SonarCloud)...'
                withCredentials([string(credentialsId: 'SONAR_TOKEN', variable: 'SONAR_KEY')]) {
                    bat """
                        docker run --rm -v "%cd%:/usr/src" sonarsource/sonar-scanner-cli \
                        -Dsonar.projectKey=chanchal-2512_todolist \
                        -Dsonar.organization=chanchal-2512 \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=https://sonarcloud.io \
                        -Dsonar.token=%SONAR_KEY%
                    """
                }
            }
        }

        stage('3. Vulnerability Scanning') {
            steps {
                echo 'Scanning dependencies for vulnerabilities with Trivy...'
                // Scans the workspace directory and outputs results to a text artifact
                bat 'docker run --rm -v "%cd%:/apps" aquasec/trivy fs /apps > trivy-report.txt'
            }
        }

        stage('4. Build Docker Image') {
            steps {
                echo 'Building local Docker image...'
                // Verifies the application container builds successfully without errors
                bat 'docker build -t todo-app:local .'
            }
        }

        stage('5. Deploy to Render') {
            steps {
                echo 'Triggering live deployment on Render...'
                // Invokes Render's deploy hook URL to pull down the newest repository state
                bat 'curl -X POST "%RENDER_HOOK%"'
            }
        }
    }

    post {
        always {
            echo 'Archiving security scan artifacts...'
            archiveArtifacts artifacts: 'trivy-report.txt', allowEmptyArchive: true
        }
        success {
            echo 'Pipeline executed perfectly!'
        }
        failure {
            echo 'Pipeline failed. Check stage logs above for debugging.'
        }
    }
}