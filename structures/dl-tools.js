const snekfetch = require('snekfetch');
const path = require('path');
const fs = require('fs-extra');
const archiver = require('archiver');
const Transfer = require('transfer-sh');

var exports = module.exports = {};

function getFilename(cd) {
    let filename = cd.split(';');
    filename = filename[filename.length - 1];
    filename = filename.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)[1];
    filename = filename.replace(/UTF-8''/, '');
    // remove quotes
    filename = filename.replace(/"/g, '');
    // decode html
    filename = decodeURI(filename);

    return filename;
}

function downloadImage(filepath, url) {
    return new Promise((resolve, reject) => {
        snekfetch.get(url)
            .then(r => {
                let cd = r.headers['content-disposition'];
                let filename = getFilename(cd);

                let dir = path.dirname(filepath);
                
                // make sure the dir exists
                fs.ensureDir(dir)
                    .then(() => {
                        // write the image to file
                        fs.writeFile(path.join(filepath, filename), r.body, (err) => {
                            if (err) return reject(err);

                            resolve(path.join(filepath, filename));
                        })
                    })
                    .catch(err => {
                        return reject(err);
                    })
            });
    })
}

exports.download = function({filepath, urls, maxSimulDownloads}) {
    return new Promise((resolve, reject) => {
        let runningDownloads = 0,
            startedDownloads = 0,
            finishedDownloads = 0,
            finished = [];

        function next() {
            runningDownloads--;
            finishedDownloads++;

            if (finishedDownloads == urls.length) {
                resolve(finished);
            } else {
                // Make sure that we are running at the maximum capacity.
                queue();
            }
        }

        function queue() {
            while (startedDownloads < urls.length && runningDownloads < maxSimulDownloads) {
                runningDownloads++;
                downloadImage(filepath, urls[startedDownloads++])
                    .then((filepath, filename) => {
                        finished.push(filepath);
                        next();
                    });
            }
        }

        queue();
    })
}

exports.zip = function({files, zlibLevel, outputPath}) {
    return new Promise((resolve, reject) => {
        let output = fs.createWriteStream(outputPath);

        let archive = archiver('zip', {
            zlib: { level: zlibLevel } // Sets the compression level.
        });

        // listen for all archive data to be written
        output.on('close', function() {
            console.log(archive.pointer() + ' total bytes');
            console.log('archiver has been finalized and the output file descriptor has closed.');
            resolve(archive.pointer());
        });

        // good practice to catch this error explicitly
        archive.on('error', function(err) {
            reject(err);
        });

        // pipe archive data to the file
        archive.pipe(output);

        // append files
        for (let i = 0; i < files.length; ++i) {
            archive.append(fs.createReadStream(files[i]), { name: path.basename(files[i]) });
        }

        // finalize the archive (ie we are done appending files but streams have to finish yet)
        archive.finalize();
    })
}

exports.upload = function(file) {
    return new Promise((resolve, reject) => {
        // UPLOAD IMAGE
        new Transfer(file)
            .upload()
            .then(link => {
                    resolve(link);
            })
            .catch(err => reject(err));
    })
}

exports.delete = function(files) {
    return new Promise((resolve, reject) => {
        let i = files.length;
        files.forEach(function(path) {
            fs.remove(path)
                .then(() => {
                    i--;
                    // finished
                    if (i <= 0) resolve();
                })
                .catch(err => {
                    reject(err);
                });
        })
    })
}