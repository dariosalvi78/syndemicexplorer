import fs from 'fs';
import readline from 'readline';

function readCSVFiles(directoryName, skipByteCount) {
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
                    readLines(directoryName + '/' + file, skipByteCount);
            } catch (error) {
                console.error(error);
            }
        });
    }
)}

function readLines(file, skipByteCount) {
    var rs = fs.createReadStream(file, {start: skipByteCount});

    const rl = readline.createInterface({
        input: rs,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', (line) => {
        line = line.split(';');

        var obj = new DataObject(line[0], line[1], line[2]);

        if (line.length == 5) {
            obj.sample_size = line[3];
            obj.value = line[4];
        }
        else
            obj.value = line[3];

        console.log(obj);
    });
}

class DataObject {
    constructor(year, area3, indicator) {
        this.year = year;
        this.area3 = area3;
        this.indicator = indicator;
    }
}

readCSVFiles(process.cwd() + "/csv files", 35);