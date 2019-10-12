const execa = require('execa');

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
	//=> 'unicorns'
};

const installExpress = async (folder) => {
	const {stdout} = await execa('npm', ['install', 'express'], {cwd: folder});
	return {stdout}
	//=> 'unicorns'
};

const installCors = async (folder) => {
	const {stdout} = await execa('npm', ['install', 'cors'], {cwd: folder});
	return {stdout}
	//=> 'unicorns'
};

const installBodyParser = async (folder) => {
	const {stdout} = await execa('npm', ['install', 'body-parser'], {cwd: folder});
	return {stdout}
	//=> 'unicorns'
};

const installNodemon = async (folder) => {
	const {stdout} = await execa('npm', ['install', 'nodemon'], {cwd: folder});
	return {stdout}
	//=> 'unicorns'
};