pipeline {
    agent any 

    options {
        timeout(time: 30, unit: 'MINUTES')
        ansiColor('xterm')
        buildDiscarder(logRotator(numToKeepStr: '5', artifactNumToKeepStr: '5'))
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        NOME_PIPELINE = 'S07 — Testes Automatizados PETSTORE'
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
            }
        }

        stage('Run Postman Tests') {
            steps {
                echo 'Executando testes Postman com Newman...'
                sh 'npm test'
                echo 'Gerando relatório de testes...'
                sh 'npm run report'
            }
        }
    }
    
    post {
        success {
            echo 'O pipeline concluido com SUCESSO!'
            archiveArtifacts artifacts: 'newman/**/*.html', allowEmptyArchive: true
        }
        failure {
            echo 'O pipeline FALHO! Verifique os logs acima.'
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