function previewImage() {
    const fileInput = document.getElementById('image-input');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = function() {
            const imagePreview = document.getElementById('preview-image');
            imagePreview.src = reader.result;
        };
        reader.readAsDataURL(file);
    }
}

function imageToAscii(image, colorSupport, invertColors) {
    const width = 80;
    const aspectRatio = image.height / image.width;
    const height = Math.round(aspectRatio * width);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, width, height);

    const imageData = context.getImageData(0, 0, width, height).data;

    const asciiChars = ['@', '#', 'S', '%', '?', '*', '+', ';', ':', ',', '.', ' '];
    const pixelRange = colorSupport ? 256 * 3 / asciiChars.length : 256 / asciiChars.length;

    let asciiArt = '';
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const pixelOffset = (y * width + x) * 4;
            const r = imageData[pixelOffset];
            const g = imageData[pixelOffset + 1];
            const b = imageData[pixelOffset + 2];

            let pixelValue;
            if (colorSupport && invertColors) {
                // Calculate average pixel value and invert it
                pixelValue = 255 - ((r + g + b) / 3);
            } else if (colorSupport) {
                // Calculate average pixel value
                pixelValue = (r + g + b) / 3;
            } else if (invertColors) {
                // Invert pixel value
                pixelValue = 255 - imageData[pixelOffset];
            } else {
                // Use the red channel for grayscale representation
                pixelValue = r;
            }

            const charIndex = Math.floor(pixelValue / pixelRange);
            const asciiChar = asciiChars[charIndex];
            asciiArt += asciiChar;
        }
        asciiArt += '\n';
    }

    return asciiArt;
}

function convertImageToAscii() {
    const colorSupport = document.getElementById('color-support').checked;
    const invertColors = document.getElementById('invert-colors').checked;

    const fileInput = document.getElementById('image-input');

    if (!fileInput.files || !fileInput.files[0]) {
        alert('Please upload an image.');
        return;
    }

    const reader = new FileReader();
    reader.onloadend = function() {
        const image = new Image();
        image.onload = function() {
            const asciiArt = imageToAscii(image, colorSupport, invertColors);

            // Create a dynamic output.html with the ASCII art as a query parameter
            const outputHTML = `
            <!DOCTYPE html>
<html>

<head>
    <title>Converted ASCII Art</title>
    <link rel="stylesheet" href="style.css" />
</head>

<body>
    <h1>Converted ASCII Art</h1>
    <div id="ascii-art-container">
        <pre id="ascii-art">${asciiArt}</pre>
        <a id="download-link" class="save-btn" style="display: none;">Click here to download ASCII art</a>
        <input type="button" value="Go Back" id="back-btn" class="go-back-btn" onclick="goBack()" />
        <!-- Add id="save-btn" to the Save ASCII Art button -->
        <input type="button" value="Save ASCII Art" id="save-btn" class="save-btn" />
    </div>
    <script src="js.js"></script>
</body>

</html>
`;

            // Open the dynamic output.html in a new window/tab
            const newWindow = window.open('output.html');
            newWindow.document.write(outputHTML);
            newWindow.document.close();
        };
        image.src = reader.result;
    };
    reader.readAsDataURL(fileInput.files[0]);
}

document.addEventListener('DOMContentLoaded', function() {
    // document.getElementById('image-input').addEventListener('change', previewImage);
    document.getElementById('save-btn').addEventListener('click', saveAsciiArt);
    document.getElementById('back-btn').addEventListener('click', goBack);
    const asciiArtParam = new URLSearchParams(window.location.search).get('ascii');
    if (asciiArtParam) {
        const asciiArt = decodeURIComponent(asciiArtParam);
        const asciiArtElement = document.getElementById('ascii-art');
        asciiArtElement.textContent = asciiArt;

        const downloadLink = document.getElementById('download-link');
        downloadLink.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(asciiArt);
        downloadLink.download = 'ascii_output.txt';
        downloadLink.style.display = 'block';
    }
});


function saveAsciiArt() {
    const asciiArt = document.getElementById('ascii-art').textContent;
    const blob = new Blob([asciiArt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    // Create a temporary link to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Asciiimage.txt';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function goBack() {
    window.close();
}