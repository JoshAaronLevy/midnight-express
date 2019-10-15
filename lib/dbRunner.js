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
