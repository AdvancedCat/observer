const fs = require('fs')
const { promisify } = require('util')
const path = require('path')
const Table = require('cli-table')
const fileSize = require('filesize')
const gzipSize = require('gzip-size')
require('colors')

const readFileAsync = promisify(fs.readFile)
const resolveRoot = (file) => path.join(__dirname, '../' + (file || ''))
const pkg = require(resolveRoot('package.json'))
const NAME = pkg.name
const VERSION = pkg.version

async function printBundleSizes() {
    const table = new Table({
        head: [
            'Browser'.cyan + ' (gzip)'.green,
            'Browser min'.cyan + ' (gzip)'.green,
            'ESM'.cyan + ' (gzip)'.green,
        ],
    })

    const fileNames = ['index.js', 'index.min.js', 'index.esm.js']

    const row = []

    for (let fileName of fileNames) {
        const sizes = await getFileSize(resolveRoot('dist/' + fileName))
        row.push(`${sizes.fileSize} / ${sizes.gzipSize.green}`)
    }

    table.push(row)

    console.log(`\n${NAME} - ${VERSION}`.cyan)
    console.log(table.toString())
}

async function getFileSize(file) {
    const data = await readFileAsync(file, 'utf-8')

    return {
        fileSize: fileSize(Buffer.byteLength(data)),
        gzipSize: fileSize(await gzipSize(data)),
    }
}

printBundleSizes().catch((err) => {
    console.error(err)
    process.exit(1)
})
