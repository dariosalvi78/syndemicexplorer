import fs from 'fs';
import readline from 'readline';

function readCSVFiles(directoryName) {
    fs.readdir(directoryName, (err, filenames) => {
        if (err) {
            console.error(err);
            return;
        }

        filenames.forEach(file => {
            try {
                var splitFileName = file.split('.');
                var extension = splitFileName[splitFileName.length - 1];

                if (extension === 'csv')
                    readLines(directoryName + '/' + file);
            } catch (error) {
                console.error(error);
            }
        });
    }
)}

function readLines(file) {
    const rl = readline.createInterface({
        input: fs.createReadStream(file),
        output: process.stdout,
        terminal: false
    });

    rl.on('line', (line) => {
        console.log(line);
    });
}

readCSVFiles(process.cwd() + "/csv files");