const scanner = require('sonarqube-scanner').default;

scanner(
  {
    serverUrl: 'http://localhost:9000',
    token: process.env.SONAR_TOKEN,
    options: {
      'sonar.projectKey': 'devflow',
      'sonar.projectName': 'DevFlow',
      'sonar.projectVersion': '1.0',
      'sonar.sources': 'src',
      'sonar.tests': 'src',
      'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
      'sonar.coverage.exclusions': '**/*.test.js,**/*.spec.js',
      'sonar.exclusions': 'node_modules/**,dist/**',
      'sonar.sourceEncoding': 'UTF-8'
    }
  },
  () => process.exit()
); 