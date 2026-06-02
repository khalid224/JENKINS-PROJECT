pipeline {
    agent any

    tools {
        nodejs 'node20'
    }

    environment {
        // Docker Hub credentials (set in Jenkins credentials store)
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')
        DOCKER_IMAGE_NAME      = 'khalid24/tx-men-wear-frontend'
        DOCKER_REGISTRY        = 'docker.io'
        CONTAINER_NAME         = 'tx-men-wear-frontend'
        FRONTEND_PORT          = '3000'
        HEALTH_CHECK_URL       = "http://localhost:${FRONTEND_PORT}"
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
        timestamps()
    }

    stages {
        // ─── STAGE 1: Checkout ──────────────────────────────────────────
        stage('Checkout Code') {
            steps {
                echo '📥 Checking out source code…'
                checkout scm
                script {
                    env.GIT_COMMIT_SHORT = sh(
                        script: 'git rev-parse --short HEAD',
                        returnStdout: true
                    ).trim()
                    echo "Git commit: ${env.GIT_COMMIT_SHORT}"
                }
            }
        }

        // ─── STAGE 2: Install Dependencies ──────────────────────────────
        stage('Install Dependencies') {
            options { timeout(time: 10, unit: 'MINUTES') }
            steps {
                dir('frontend') {
                    echo '📦 Installing npm dependencies…'
                    sh 'npm install'
                }
            }
        }

        // ─── STAGE 3: Lint & Build ──────────────────────────────────────
        stage('Lint & Build Frontend') {
            options { timeout(time: 10, unit: 'MINUTES') }
            parallel {
                stage('Lint') {
                    steps {
                        dir('frontend') {
                            echo '🔍 Running ESLint…'
                            sh 'npm run lint -- --max-warnings 0 || true'
                        }
                    }
                }
                stage('Type Check & Build') {
                    steps {
                        dir('frontend') {
                            echo '⚙️  Building production bundle…'
                            sh 'npm run build'
                        }
                    }
                }
            }
        }

        // ─── STAGE 4: Build Docker Image ────────────────────────────────
        stage('Build Docker Image') {
            options { timeout(time: 10, unit: 'MINUTES') }
            steps {
                dir('frontend') {
                    echo '🐳 Building Docker image…'
                    sh """
                        docker build \
                          --label "build.number=${BUILD_NUMBER}" \
                          --label "build.commit=${env.GIT_COMMIT_SHORT}" \
                          --label "build.date=\$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
                          -t ${DOCKER_IMAGE_NAME}:build-${BUILD_NUMBER} \
                          .
                    """
                }
            }
        }

        // ─── STAGE 5: Tag Docker Image ───────────────────────────────────
        stage('Tag Docker Image') {
            steps {
                echo '🏷️  Tagging Docker image…'
                sh """
                    # Tag with commit hash
                    docker tag ${DOCKER_IMAGE_NAME}:build-${BUILD_NUMBER} \
                               ${DOCKER_IMAGE_NAME}:${env.GIT_COMMIT_SHORT}

                    # Tag as latest
                    docker tag ${DOCKER_IMAGE_NAME}:build-${BUILD_NUMBER} \
                               ${DOCKER_IMAGE_NAME}:latest
                """
            }
        }

        // ─── STAGE 6: Docker Hub Login ──────────────────────────────────
        stage('Docker Hub Login') {
            steps {
                echo '🔐 Logging in to Docker Hub…'
                sh """
                    echo \${DOCKER_HUB_CREDENTIALS_PSW} | \
                    docker login ${DOCKER_REGISTRY} \
                      -u \${DOCKER_HUB_CREDENTIALS_USR} \
                      --password-stdin
                """
            }
        }

        // ─── STAGE 7: Push Docker Image ─────────────────────────────────
        stage('Push Docker Image') {
            options { timeout(time: 10, unit: 'MINUTES') }
            steps {
                echo '🚀 Pushing Docker image to Docker Hub…'
                retry(3) {
                    sh """
                        docker push ${DOCKER_IMAGE_NAME}:build-${BUILD_NUMBER}
                        docker push ${DOCKER_IMAGE_NAME}:${env.GIT_COMMIT_SHORT}
                        docker push ${DOCKER_IMAGE_NAME}:latest
                    """
                }
            }
        }

        // ─── STAGE 8: Deploy Container ──────────────────────────────────
        stage('Deploy Container') {
            options { timeout(time: 5, unit: 'MINUTES') }
            steps {
                echo '📦 Deploying container…'
                sh """
                    # Stop and remove existing container if running
                    docker stop ${CONTAINER_NAME} 2>/dev/null || true
                    docker rm   ${CONTAINER_NAME} 2>/dev/null || true

                    # Run the new container
                    docker run -d \
                      --name ${CONTAINER_NAME} \
                      --restart unless-stopped \
                      -p ${FRONTEND_PORT}:80 \
                      --label "deployed.build=${BUILD_NUMBER}" \
                      --label "deployed.commit=${env.GIT_COMMIT_SHORT}" \
                      ${DOCKER_IMAGE_NAME}:latest

                    echo "✅ Container started on port ${FRONTEND_PORT}"
                """
            }
        }

        // ─── STAGE 9: Health Check ──────────────────────────────────────
        stage('Health Check') {
            options { timeout(time: 3, unit: 'MINUTES') }
            steps {
                echo '🏥 Running health check…'
                sh """
                    # Wait for container to be ready
                    sleep 10

                    # Retry health check up to 5 times
                    for i in 1 2 3 4 5; do
                        STATUS=\$(curl -s -o /dev/null -w "%{http_code}" ${HEALTH_CHECK_URL} || echo "000")
                        echo "Attempt \$i — HTTP Status: \$STATUS"
                        if [ "\$STATUS" = "200" ]; then
                            echo "✅ Health check passed!"
                            exit 0
                        fi
                        sleep 5
                    done

                    echo "❌ Health check failed after 5 attempts"
                    exit 1
                """
            }
        }
    }

    post {
        always {
            echo '🧹 Cleaning up Docker login credentials…'
            sh 'docker logout ${DOCKER_REGISTRY} || true'
        }

        success {
            echo """
            ╔══════════════════════════════════════════╗
            ║  ✅ TX Men Wear deployed successfully!   ║
            ║  Build:  #${BUILD_NUMBER}                 ║
            ║  Commit: ${env.GIT_COMMIT_SHORT}          ║
            ║  URL:    ${HEALTH_CHECK_URL}              ║
            ╚══════════════════════════════════════════╝
            """
        }

        failure {
            echo '❌ Pipeline failed. Check logs above for details.'
            // Optionally: send Slack/email notification here
        }

        cleanup {
            echo '🧼 Cleaning Jenkins workspace…'
            cleanWs(
                cleanWhenNotBuilt: false,
                deleteDirs: true,
                disableDeferredWipeout: true,
                notFailBuild: true,
                patterns: [
                    [pattern: 'frontend/node_modules/**', type: 'INCLUDE'],
                    [pattern: 'frontend/dist/**', type: 'INCLUDE']
                ]
            )
        }
    }
}
