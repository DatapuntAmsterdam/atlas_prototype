import { spawn } from 'child_process';

const httpServer = spawn('http-server', ['./dist']);

httpServer.stdout.on('data', (buffer) => {
  if (!buffer.toString('utf8').includes('Available on:')) {
    return;
  }
  const cypress = spawn('cypress', ['run', '--env', [
    `PASSWORD_EMPLOYEE=${process.env.PASSWORD_EMPLOYEE}`,
    `PASSWORD_EMPLOYEE_PLUS=${process.env.PASSWORD_EMPLOYEE_PLUS}`,
    `USERNAME_EMPLOYEE=${process.env.USERNAME_EMPLOYEE}`,
    `USERNAME_EMPLOYEE_PLUS=${process.env.USERNAME_EMPLOYEE_PLUS}`
  ].join(',')], { env: { ...process.env, FORCE_COLOR: true } });
  cypress.stdout.on('data', (buffer) => console.log(buffer.toString('utf8')));
  cypress.stderr.on('data', (buffer) => console.log(buffer.toString('utf8')));
  cypress.on('close', (code) => {
    httpServer.kill();
    process.exit(code);
  });
});
