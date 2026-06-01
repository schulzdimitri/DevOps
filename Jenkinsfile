pipeline {
    agent any 

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '5', artifactNumToKeepStr: '5'))
        timestamps()
        ansiColor('xterm')
        disableConcurrentBuilds()
    }

    environment {
        NOME_PIPELINE = 'S07 — Testes Automatizados PETSTORE'
        EMAIL_DESTINO = credentials('EMAIL_DESTINO_VAR')
        EMAIL_REMETENTE = credentials('EMAIL_REMETENTE_VAR')
        EMAIL_SENHA = credentials('EMAIL_SENHA_VAR')
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

        stage('Install Dependencies') {
            steps {
                echo 'Instalando dependências npm...'
                sh 'npm ci'
                sh 'npm install nodemailer' 
            }
        }

        stage('Run Postman Tests') {
            steps {
                echo 'Executando testes Postman com Newman...'
                sh 'npm test'
            }
        }

        stage('Notificação de Usuários') {
            steps {
                echo 'Enviando e-mail com script Node.js...'
                sh 'node script-email.js'
            }
        }
    }
    
    post {
        success {
            echo 'O pipeline concluido com SUCESSO!'
            archiveArtifacts artifacts: 'newman/**/*.html, package.json, postman/*.json', allowEmptyArchive: true
        }
        failure {
            echo 'O pipeline FALHOU! Verifique os logs acima.'
        }
        unstable {
            echo 'O pipeline está INSTÁVEL - alguns testes falharam.'
        }
        always {
            echo "Pipeline : ${env.NOME_PIPELINE}"
            echo "Build    : #${BUILD_NUMBER}"
            echo "Resultado: ${currentBuild.currentResult}"
            echo "Duração  : ${currentBuild.durationString}"
        }
    }
}