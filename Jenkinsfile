pipeline {
    agent { label 'agent' }

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '5', artifactNumToKeepStr: '5'))
        timestamps()
        ansiColor('xterm')
        disableConcurrentBuilds()
    }

    environment {
        NOME_PIPELINE = 'S07 — Testes Automatizados PETSTORE'
        EMAIL_DESTINO = "${env.EMAIL_DESTINO}"
        EMAIL_REMETENTE = "${env.EMAIL_REMETENTE}"
        EMAIL_SENHA = "${env.APP_PASSWORD}"
    }

    triggers {
        githubPush()
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Clonando repositório do GitHub...'
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[url: 'https://github.com/kafreitas07/Project_01_group_02_S07.git']]
                ])
            }
        }

        stage('Build') {
            steps {
                echo 'Instalando dependências npm...'
                sh 'npm ci'
                sh 'npm install nodemailer' 
            }
        }

        stage('Tests') {
            steps {
                echo 'Limpando relatórios antigos...'
                sh 'docker exec s07-newman rm -rf /etc/newman/newman || true'
                echo 'Executando testes Postman com Newman...'
                sh 'npm test'
                echo 'Copiando artefatos de teste...'
                sh 'docker cp s07-newman:/etc/newman/newman/. ./newman || true'
            }
        }

        stage('Test Coverage') {
            steps {
                echo 'Calculando cobertura de testes a partir do relatório Newman...'
                script {
                    def coverageStatus = sh(script: 'npm run coverage', returnStatus: true)
                    if (coverageStatus != 0) {
                        unstable('Cobertura de testes abaixo do limite de 90%.')
                    }
                }
            }
        }

        stage('Notification') {
            steps {
                echo 'Enviando e-mail...'
                script {
                    env.STATUS_PIPELINE = "${currentBuild.currentResult}"
                    env.DURACAO_PIPELINE = "${currentBuild.durationString}"
                    sh 'node ./jenkins/notification/script-email.js'
                }
            }
        }
    }
    
    post {
        success {
            echo 'O pipeline concluido com SUCESSO!'
        }
        failure {
            echo 'O pipeline FALHOU! Verifique os logs acima.'
        }
        unstable {
            echo 'O pipeline está INSTÁVEL - alguns testes ou a cobertura mínima falharam.'
        }
        always {
            archiveArtifacts artifacts: 'newman/**/*.html, newman/report.json, package.json, postman/*.json', allowEmptyArchive: true
            echo "Pipeline : ${env.NOME_PIPELINE}"
            echo "Build    : #${BUILD_NUMBER}"
            echo "Resultado: ${currentBuild.currentResult}"
            echo "Duração  : ${currentBuild.durationString}"
        }
    }
}