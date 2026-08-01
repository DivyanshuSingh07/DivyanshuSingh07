const { Jimp } = require("jimp");
const fs = require("fs");
const path = require("path");


// ======================================================
// Configuration
// ======================================================

const CONFIG = {

    input: path.join(
        __dirname,
        "../assets/profile.png"
    ),

    output: path.join(
        __dirname,
        "../assets/face.txt"
    ),


    // ASCII width
    width: 90,


    // Terminal characters are taller than wide
    // Lower values = more vertical face shape
    aspectRatio: 0.45,


    // Image adjustments

    blur: 0,

    contrast: 0.05,

    brightness: 0,


    // Applied during ASCII conversion

    gamma: 0.8,


    invert: false,


    // Bright -> Dark mapping
    charset:
        "@%#*+=-:. "

};



// ======================================================
// Console Helpers
// ======================================================


function divider() {

    console.log(
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    );

}



function header() {

    console.clear();

    divider();

    console.log(
        "          ASCII Portrait Generator"
    );

    divider();

    console.log("");

}



function success(image) {


    console.log("");

    divider();

    console.log("");

    console.log(
        "✔ face.txt generated successfully"
    );

    console.log("");

    console.log(
        `Resolution : ${image.bitmap.width} x ${image.bitmap.height}`
    );


    console.log(
        `Characters : ${CONFIG.charset.length}`
    );


    console.log(
        `Saved      : ${CONFIG.output}`
    );


    console.log("");

    divider();

}



function fail(error) {

    console.log("");

    console.error(
        "ERROR:"
    );


    console.error(error.message);


    console.log("");

}



// ======================================================
// Character Mapping
// ======================================================


function brightnessToCharacter(value) {


    const chars =
        CONFIG.charset;


    let normalized =
        value / 255;



    /*
        Gamma correction

        < 1  = reveals darker details
        > 1  = increases shadows
    */

    normalized =
        Math.pow(
            normalized,
            CONFIG.gamma
        );



    const index =
        Math.floor(
            normalized *
            (chars.length - 1)
        );



    return chars[index];

}





// ======================================================
// Image Preparation
// ======================================================


async function prepareImage() {


    console.log(
        "✔ Reading image..."
    );


    const image =
        await Jimp.read(
            CONFIG.input
        );



    /*
        Resize

        ASCII characters are not square.
        Height correction keeps faces proportional.
    */


    const newHeight =
        Math.round(

            image.bitmap.height *

            (
                CONFIG.width /
                image.bitmap.width
            )

            *

            CONFIG.aspectRatio

        );



    console.log(
        "✔ Resizing..."
    );


    image.resize({

        w: CONFIG.width,

        h: newHeight

    });




    // ----------------------------------------------
    // Blur
    // ----------------------------------------------


    if(CONFIG.blur > 0) {

        console.log(
            "✔ Applying blur..."
        );


        image.blur(
            CONFIG.blur
        );

    }





    // ----------------------------------------------
    // Grayscale
    // ----------------------------------------------


    console.log(
        "✔ Converting grayscale..."
    );


    image.greyscale();





    // ----------------------------------------------
    // Contrast
    // ----------------------------------------------


    console.log(
        "✔ Adjusting contrast..."
    );


    image.contrast(
        CONFIG.contrast
    );





    // ----------------------------------------------
    // Brightness
    // ----------------------------------------------


    if(CONFIG.brightness !== 0) {


        console.log(
            "✔ Adjusting brightness..."
        );


        image.brightness(
            CONFIG.brightness
        );

    }





    // ----------------------------------------------
    // Pixel Analysis
    // ----------------------------------------------


    const data =
        image.bitmap.data;



    let total = 0;



    let min = 255;

    let max = 0;



    for(
        let i = 0;
        i < data.length;
        i += 4
    ) {


        const value =
            data[i];


        total += value;



        if(value < min)
            min = value;



        if(value > max)
            max = value;


    }



    const average =
        total /
        (data.length / 4);



    console.log("");

    console.log(
        "Image Statistics"
    );

    console.log(
        "----------------"
    );


    console.log(
        `Minimum Brightness : ${min}`
    );


    console.log(
        `Maximum Brightness : ${max}`
    );


    console.log(
        `Average Brightness : ${average.toFixed(2)}`
    );


    console.log("");



    return image;


}

// ======================================================
// ASCII Generation
// ======================================================


function generateAscii(image) {


    console.log(
        "✔ Generating ASCII..."
    );


    const width =
        image.bitmap.width;


    const height =
        image.bitmap.height;


    const data =
        image.bitmap.data;



    const lines = [];



    for(
        let y = 0;
        y < height;
        y++
    ) {


        let line = "";



        for(
            let x = 0;
            x < width;
            x++
        ) {



            const index =
                (
                    y * width +
                    x
                ) * 4;



            let brightness =
                data[index];



            //----------------------------------
            // Invert image if required
            //----------------------------------


            if(CONFIG.invert) {


                brightness =
                    255 - brightness;


            }



            //----------------------------------
            // Convert brightness to character
            //----------------------------------


            const character =
                brightnessToCharacter(
                    brightness
                );



            line += character;



        }



        lines.push(line);



    }



    return lines.join("\n");


}





// ======================================================
// Save ASCII
// ======================================================


function saveAscii(ascii) {


    console.log(
        "✔ Saving face.txt..."
    );



    fs.writeFileSync(

        CONFIG.output,

        ascii,

        "utf8"

    );


}





// ======================================================
// Main
// ======================================================


async function main() {


    try {



        header();




        //----------------------------------
        // Check input image
        //----------------------------------


        if(
            !fs.existsSync(
                CONFIG.input
            )
        ) {


            throw new Error(

                `Image not found:\n${CONFIG.input}`

            );


        }





        //----------------------------------
        // Process image
        //----------------------------------


        const image =
            await prepareImage();





        //----------------------------------
        // Generate ASCII
        //----------------------------------


        const ascii =
            generateAscii(image);





        //----------------------------------
        // Save result
        //----------------------------------


        saveAscii(ascii);





        //----------------------------------
        // Finish
        //----------------------------------


        success(image);



    }


    catch(error) {


        fail(error);


        process.exit(1);


    }


}





// ======================================================
// Start Program
// ======================================================


main();