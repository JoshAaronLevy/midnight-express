const path = require('path')
const execa = require('execa')
const minimist = require('minimist')
const semver = require('semver')
const LRU = require('lru-cache')
const getPackageJson = require('./getPackageJson')
const { executeCommand } = require('./executeCommand')

const metadataCache = new LRU({
  max: 200,
  maxAge: 1000 * 60 * 30 // 30 min.
})

const SUPPORTED_PACKAGE_MANAGERS = ['npm']
const PACKAGE_MANAGER_CONFIG = {
  npm: {
    install: ['install', '--loglevel', 'error'],
    add: ['install', '--loglevel', 'error'],
    upgrade: ['update', '--loglevel', 'error'],
    remove: ['uninstall', '--loglevel', 'error']
  }
}

class PackageManager {
  constructor ({ context, forcePackageManager } = {}) {
    this.context = context

    this.bin = forcePackageManager

    if (!SUPPORTED_PACKAGE_MANAGERS.includes(this.bin)) {
      PACKAGE_MANAGER_CONFIG[this.bin] = PACKAGE_MANAGER_CONFIG.npm
    }
  }

  // Any command that implemented registry-related feature should support
  // `-r` / `--registry` option
  async getRegistry () {
    if (this._registry) {
      return this._registry
    }

    const args = minimist(process.argv, {
      alias: {
        r: 'registry'
      }
    })

    if (args.registry) {
      this._registry = args.registry
    } else {
      const { stdout } = await execa(this.bin, ['config', 'get', 'registry'])
      this._registry = stdout
    }

    return this._registry
  }

  async addRegistryToArgs (args) {
    const registry = await this.getRegistry()
    args.push(`--registry=${registry}`)

    return args
  }

  async getMetadata (packageName, { field = '' } = {}) {
    const registry = await this.getRegistry()

    const metadataKey = `${this.bin}-${registry}-${packageName}`
    let metadata = metadataCache.get(metadataKey)

    if (metadata) {
      return metadata
    }

    const args = await this.addRegistryToArgs(['info', packageName, field, '--json'])
    const { stdout } = await execa(this.bin, args)

    metadata = JSON.parse(stdout)
    if (this.bin === 'yarn') {
      // `yarn info` outputs messages in the form of `{"type": "inspect", data: {}}`
      metadata = metadata.data
    }

    metadataCache.set(metadataKey, metadata)
    return metadata
  }

  async getRemoteVersion (packageName, versionRange = 'latest') {
    const metadata = await this.getMetadata(packageName)
    if (Object.keys(metadata['dist-tags']).includes(versionRange)) {
      return metadata['dist-tags'][versionRange]
    }
    const versions = Array.isArray(metadata.versions) ? metadata.versions : Object.keys(metadata.versions)
    return semver.maxSatisfying(versions, versionRange)
  }

  getInstalledVersion (packageName) {
    // for first level deps, read package.json directly is way faster than `npm list`
    try {
      const packageJson = getPackageJson(
        path.resolve(this.context, 'node_modules', packageName)
      )
      return packageJson.version
    } catch (e) {
      return 'N/A'
    }
  }

  async install () {
    const args = await this.addRegistryToArgs(PACKAGE_MANAGER_CONFIG[this.bin].install)
    return executeCommand(this.bin, args, this.context)
  }

  async add (packageName, isDev = true) {
    const args = await this.addRegistryToArgs([
      ...PACKAGE_MANAGER_CONFIG[this.bin].add,
      packageName,
      ...(isDev ? ['-D'] : [])
    ])
    return executeCommand(this.bin, args, this.context)
  }

  async upgrade (packageName) {

    const args = await this.addRegistryToArgs([
      ...PACKAGE_MANAGER_CONFIG[this.bin].add,
      packageName
    ])
    return executeCommand(this.bin, args, this.context)
  }

  async remove (packageName) {
    const args = [
      ...PACKAGE_MANAGER_CONFIG[this.bin].remove,
      packageName
    ]
    return executeCommand(this.bin, args, this.context)
  }
}

module.exports = PackageManager