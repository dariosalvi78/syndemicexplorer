import fs from 'fs';
import readline from 'readline';

let csvFiles = -1;
let result = new Array();

function readCSVFiles(directoryName, skipByteCount) {
    let allObjectsInFiles = new Array();

    fs.readdir(directoryName, (err, filenames) => {
        if (err) {
            console.error(err);
            return;
        }

        let fileCount = 0;
        filenames.forEach(file => {
            try {
                var extension = GetFileExtension(file);

                if (extension === 'csv') {
                    readLines(directoryName + '/' + file, skipByteCount);
                    fileCount++;
                }
            } catch (error) {
                console.error(error);
            }
        });

        csvFiles = fileCount;
    })

    return allObjectsInFiles;
}

function GetFileExtension(file) {
    var splitFileName = file.split('.');

    if (splitFileName.length > 1)
        return splitFileName[splitFileName.length - 1];
    
    return "null";
}

function StoreObjectsAndRunWhenFinished(objectCollection) {
    result.push(objectCollection);

    if (result.length == csvFiles) //All the files have been read
        StoreDataInDB();
}

function readLines(file, skipByteCount) {
    var rs = fs.createReadStream(file, {start: skipByteCount});

    const rl = readline.createInterface({
        input: rs,
        output: process.stdout,
        terminal: false
    });

    var allobjects = new Array();
    var index = 0;

    rl.on('line', (line) => {
        line = line.split(';');

        var obj = new DataObject(line[0], line[1], line[2]);

        if (line.length == 5) {
            obj.sample_size = line[3];
            obj.value = line[4];
        }
        else
            obj.value = line[3];

        allobjects[index] = obj;
        index++;
    });

    //All the lines in the file have been read and therefore the data is stored
    rl.on('close', () => {
        StoreObjectsAndRunWhenFinished(allobjects);
    })
}

function StoreDataInDB() {
    let createQuery = "CREATE TABLE demographics (source TEXT, year INTEGER, country_code TEXT, area1_code TEXT, area2_code TEXT, area3_code TEXT, Gid TEXT, indicator TEXT, sample_size INTEGER, value INTEGER);"

    let query = "";

    for (let file = 0; file < result.length; file++) {
        for (let dataobject = 0; dataobject < result[file].length; dataobject++) {
            let nbr = 1 + dataobject;
            query += "INSERT INTO ??? VALUES (" + nbr + ", " + JSON.stringify(result[file][dataobject]) + ");" + "\n";
        }
    }

    const client = new Pool({
        user: "syndemic",
          host: "localhost",
          database: "syndemic",
          password: "syndemic",
          port: 5432,
        })

    console.log(createQuery);
    console.log(query);
}

class DataObject {
    //source, country_code, area1_code and area2_code are hardcoded for now
    source = "SCB";
    year;
    country_code = "SWE";
    area1_code = "SWE.13_1";
    area2_code = "SWE.13.19_1";

    constructor(year, area3, indicator) {
        this.year = year;
        this.area3_code = area3;
        this.Gid = area3;
        this.indicator = indicator;
    }
}

readCSVFiles(process.cwd() + "/csv files", 35);