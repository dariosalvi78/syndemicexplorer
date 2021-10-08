import fs from 'fs';

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
                    console.log(file);
            } catch (error) {
                console.error(error);
            }
        });
    }
)}

readCSVFiles(process.cwd() + "/csv files")