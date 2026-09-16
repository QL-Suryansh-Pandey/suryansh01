pipeline {
	agent any

	parameters {
		string(name: 'BASE_URL', defaultValue: 'https://dev-nexonai.qkkalabs.com', description: 'Application under test')
	}

	environment {
		BASE_URL = "${params.BASE_URL}"
	}

	stages {
		stage('Install dependencies') {
			steps {
				sh 'npm ci'
			}
		}

		stage('Install Playwright browsers') {
			steps {
				sh 'npx playwright install --with-deps chromium'
			}
		}

		stage('Run tests') {
			steps {
				withCredentials([usernamePassword(credentialsId: 'login-test-user', usernameVariable: 'TEST_USERNAME', passwordVariable: 'TEST_PASSWORD')]) {
					sh 'npm test'
				}
			}
		}
	}

	post {
		always {
			archiveArtifacts artifacts: 'reports/**, test-results/**', allowEmptyArchive: true
		}
	}
}
