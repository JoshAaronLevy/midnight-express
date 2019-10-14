const execa = require('execa');
const ora = require('ora');
const chalk = require('chalk');

module.exports = async (folder) => {
	const {stdout} = await execa('git', ['init'], {cwd: folder});
  await npmInit(folder);
	// const spinner = ora(`Installing packages`).start()
  await installExpress(folder);
  await installCors(folder);
  await installBodyParser(folder);
  await installNodemon(folder);
	// spinner.succeed(`Packages installed!`);
	return {stdout}
};

const npmInit = async (folder) => {
	const {stdout} = await execa('npm', ['init', '-y'], {cwd: folder});
	return {stdout}
};

const installExpress = async (folder) => {
	// const spinner = ora(`Installing express`).start()
	const {stdout} = await execa('npm', ['install', 'express'], {cwd: folder});
	// spinner.succeed(`express successfully installed!`);
	// console.log(stdout)
	return {stdout}
};

const installCors = async (folder) => {
	// const spinner = ora(`Installing cors`).start()
	const {stdout} = await execa('npm', ['install', 'cors'], {cwd: folder});
	// spinner.succeed(`cors successfully installed!`);
	// console.log(stdout)
	return {stdout}
};

const installBodyParser = async (folder) => {
	// const spinner = ora(`Installing body-parser`).start()
	const {stdout} = await execa('npm', ['install', 'body-parser'], {cwd: folder});
	// spinner.succeed(`body-parser successfully installed!`);
	// console.log(stdout)
	return {stdout}
};

const installNodemon = async (folder) => {
	// const spinner = ora(`Installing nodemon`).start()
	const {stdout} = await execa('npm', ['install', 'nodemon'], {cwd: folder});
	// spinner.succeed(`nodemon successfully installed!`);
	return {stdout}
};
