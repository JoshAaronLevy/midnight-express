const execa = require('execa');
const chalk = require('chalk');

module.exports = async (folder) => {
	const {stdout} = await execa('git', ['init'], {cwd: folder});
  npmInit(folder);
  installExpress(folder);
  installCors(folder);
  installBodyParser(folder);
  installNodemon(folder);
	return {stdout}
	//=> 'unicorns'
};

const npmInit = async (folder) => {
	const {stdout} = await execa('npm', ['init', '-y'], {cwd: folder});
	return {stdout}
};

const installExpress = async (folder) => {
	const {stdout} = await execa('npm', ['install', 'express'], {cwd: folder});
	console.log(stdout)
	//=> 'unicorns'
};

const installCors = async (folder) => {
	const {stdout} = await execa('npm', ['install', 'cors'], {cwd: folder});
	console.log(stdout)
	//=> 'unicorns'
};

const installBodyParser = async (folder) => {
	const {stdout} = await execa('npm', ['install', 'body-parser'], {cwd: folder});
	console.log(stdout)
	//=> 'unicorns'
};

const installNodemon = async (folder) => {
	const {stdout} = await execa('npm', ['install', 'nodemon'], {cwd: folder});
	console.log(stdout)
	//=> 'unicorns'
};
