const execa = require('execa');

module.exports = async (basePath) => {
	const {stdout} = await execa('git', ['init'], {cwd: basePath});
  await installExpress(basePath);
  await installCors(basePath);
  await installBodyParser(basePath);
  await installNodemon(basePath);
	return {stdout}
};

const installExpress = async (basePath) => {
	// const spinner = ora(`Installing express`).start()
	const {stdout} = await execa('npm', ['install', 'express'], {cwd: basePath});
	// spinner.succeed(`express successfully installed!`);
	console.log(stdout)
	return {stdout}
};

const installCors = async (basePath) => {
	// const spinner = ora(`Installing cors`).start()
	const {stdout} = await execa('npm', ['install', 'cors'], {cwd: basePath});
	// spinner.succeed(`cors successfully installed!`);
	console.log(stdout)
	return {stdout}
};

const installBodyParser = async (basePath) => {
	// const spinner = ora(`Installing body-parser`).start()
	const {stdout} = await execa('npm', ['install', 'body-parser'], {cwd: basePath});
	// spinner.succeed(`body-parser successfully installed!`);
	console.log(stdout)
	return {stdout}
};

const installNodemon = async (basePath) => {
	// const spinner = ora(`Installing nodemon`).start()
	const {stdout} = await execa('npm', ['install', 'nodemon'], {cwd: basePath});
	// spinner.succeed(`nodemon successfully installed!`);
	console.log(stdout)
	return {stdout}
};
