import fs from 'fs';
import readline from 'readline';

let csvFiles = -1;
let result = new Array();

function readCSVFiles(directoryName) {
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
                    readLines(directoryName + '/' + file);
                    fileCount++;
                }
            } catch (error) {
                console.error(error);
            }
        });

        csvFiles = fileCount;
    })
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
        PrintQuery();
}

function readLines(file) {
    var rs = fs.createReadStream(file);

    const rl = readline.createInterface({
        input: rs,
        output: process.stdout,
        terminal: false
    });

    var allobjects = new Array();
    var index = 0;

    rl.on('line', (line) => {
        if (line.includes('year')) { //Skip the first line of all the csv files
            return;
        }

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

async function PrintQuery() {
    let totalObjects = 0;

    for (let file = 0; file < result.length; file++) {
        for (let dataobject = 0; dataobject < result[file].length; dataobject++) {
            let obj = result[file][dataobject];

            let query = 'INSERT INTO public.socio_economic (source, year, country_code, area1_code, area2_code, area3_code, gid, indicator, '
            
            if (obj.sample_size != null)
                query += 'sample_size, ';

            query += 'value) VALUES ('
            
            query += SurroundWith(obj.source) + ", " + SurroundWith(obj.year) + ", " + SurroundWith(obj.country_code) + ", " + SurroundWith(obj.area1_code) + ", " + SurroundWith(obj.area2_code) + ", " + SurroundWith(obj.area3_code) + ", " + 
            SurroundWith(obj.Gid) + ", " + SurroundWith(obj.indicator) + ", ";

            if (obj.sample_size != null)
                query += SurroundWith(obj.sample_size) + ", ";
            
            query += SurroundWith(obj.value) + ");";

            console.log(query);
            totalObjects++;
        }
    }
}

function SurroundWith(theString) {
    return "'" + theString + "'";
}

class DataObject {
    //source, country_code, area1_code and area2_code are hardcoded for now
    source = "SCB";
    year;
    country_code = "SWE";
    area1_code = "SWE.13_1";
    area2_code = "SWE.13.19_1";
    area3_code = null;


    constructor(year, area3, indicator) {
        this.year = year;
        this.area3_code = area3;
        this.Gid = area3;
        this.indicator = indicator;
        this.sample_size = null;
        this.value = null;
    }
}

function csvToArray(csv) {
    const lines = csv.split('\n')
    const res = []
    const headers = lines[0].split(',')
  
    for (let i = 1; i < lines.length; i++) {        
        if (!lines[i])
            continue
        const obj = []
        const currentline = lines[i].split(',')
  
        for (let j = 0; j < headers.length; j++) {
            obj.push(currentline[j])
        }
        res.push(obj)
    }
    return res
}

// readCSVFiles(process.cwd() + "/csv files"); //Used for generating insertion statements from the csv files in csv files folder
export default csvToArray;