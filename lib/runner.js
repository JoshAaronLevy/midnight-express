const execa = require('execa');
const ora = require('ora');

module.exports = async (basePath) => {
	installExpress(basePath);
};

const installExpress = function(basePath) {
	const spinner = ora(`Installing express`).start();
	const p = execa('npm', ['install', 'express'], {cwd: basePath})
		.then(() => {
			spinner.succeed(`express installed successfully!`);
			return installCors(basePath);
		}).catch((p) => {
			spinner.fail(`Could not install express. Please check the error details below:\n`);
			console.log(p.all);
		});
		return p
};

const installCors = function(basePath) {
	const spinner = ora(`Installing cors`).start();
	const p = execa('npm', ['install', 'cors'], {cwd: basePath})
		.then(() => {
			spinner.succeed(`cors installed successfully!`);
			return installBodyParser(basePath);
		}).catch((p) => {
			spinner.fail(`Could not install cors. Please check the error details below:\n`);
			console.log(p.all);
		});
		return p
};

const installBodyParser = function(basePath) {
	const spinner = ora(`Installing body-parser`).start();
	const p = execa('npm', ['install', 'body-parser'], {cwd: basePath})
		.then(() => {
			spinner.succeed(`body-parser installed successfully!`);
			return installNodemon(basePath);
		}).catch((p) => {
			spinner.fail(`Could not install body-parser. Please check the error details below:\n`);
			console.log(p.all);
		});
		return p
};

const installNodemon = function(basePath) {
	const spinner = ora(`Installing nodemon`).start();
	const p = execa('npm', ['install', 'nodemon'], {cwd: basePath})
		.then(() => {
			return spinner.succeed(`nodemon installed successfully!`);
		}).catch((p) => {
			spinner.fail(`Could not install nodemon. Please check the error details below:\n`);
			console.log(p.all);
		});
		return p
};
