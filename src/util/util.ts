import fs from 'fs';
import Jimp = require('jimp');
import * as axios from 'axios';
import * as request from 'request';

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file or an arraybuffer
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: any): Promise<string>{
    return new Promise( async resolve => {
        const photo = await Jimp.read(inputURL);
        const outpath = '/tmp/filtered.'+Math.floor(Math.random() * 2000)+'.jpg';
        await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(__dirname+outpath, (img)=>{
            resolve(__dirname+outpath);
        });
    });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files:Array<string>){
    for( let file of files) {
        fs.unlinkSync(file);
    }
}

/**
 * checks if the value provided is
 * empty when null, undefined, of empty length
 * or an object without item.
 * 
 * @param val: any 
 * @returns boolean
 */
export function empty(val: any) {
    const type: string = typeof val;

    if (type == "undefined" || type == "null") {
        return true;
    }
    if (type == "string" || type == "array") {
        return val.length < 0
    }
    if (type == "object") {
        return Object.keys(val).length < 0;
    }
    
    return false;
}
