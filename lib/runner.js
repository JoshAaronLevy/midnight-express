const execa = require('execa');

module.exports = async (folder) => {
	const {stdout} = await execa('git', ['init'], {cwd: folder});
	console.log(stdout);
	//=> 'unicorns'
};