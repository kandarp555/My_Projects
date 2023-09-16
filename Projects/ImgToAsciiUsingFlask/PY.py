from http.client import ResponseNotReady
from flask import Flask, render_template_string,render_template, request, jsonify,Response
from PIL import Image, ImageOps
import os
app = Flask(__name__)

app.config['UPLOAD_FOLDER'] = 'Imgtoascii/uploads'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def image_to_ascii(image, color_support=True, invert_colors=False):
    width = 80
    aspect_ratio = float(image.size[1]) / float(image.size[0])
    height = int(aspect_ratio * width)
    image = image.resize((width, height))

    if not color_support:
        image = image.convert('L')

    if invert_colors:
        image = ImageOps.invert(image)

    ascii_chars = ['@', '#', 'S', '%', '?', '*', '+', ';', ':', ',', '.', ' ']

    if color_support:
        pixel_range = 256 * 3 // len(ascii_chars)  # Triple the range for color images
    else:
        pixel_range = 256 // len(ascii_chars)

    ascii_art = ''
    for y in range(height):
        for x in range(width):
            if color_support:
                r, g, b = image.getpixel((x, y))
                pixel_value = int(0.5*(1.9*r+g+b))
            else:
                pixel_value = image.getpixel((x, y))

            char_index = pixel_value // pixel_range

            if char_index >= len(ascii_chars):
                char_index = len(ascii_chars) - 1

            ascii_char = ascii_chars[char_index]
            ascii_art += ascii_char

        ascii_art += '\n'

    return ascii_art

@app.route('/')
def index():
    return render_template('structure.html')

@app.route('/convert', methods=['POST'])
def convert():
    if request.method == 'POST':
        file = request.files['image']
        color_support = 'color_support' in request.form
        invert_colors = 'invert_colors' in request.form

        if not file:
            return render_template('structure2.html', message='Please upload an image.')

        if file and allowed_file(file.filename):
            image = Image.open(file)
            ascii_art = image_to_ascii(image, color_support=color_support, invert_colors=invert_colors)
        

            return render_template('structure2.html', ascii_art=ascii_art)
@app.route('/save', methods=['POST'])
def save_ascii_art():
    if request.method == 'POST':
        ascii_art = request.form.get('ascii_art', '')

        if ascii_art:
            # Get the ASCII art and other necessary data
            color_support = 'color_support' in request.form
            invert_colors = 'invert_colors' in request.form
            image_data = request.form.get('image_data', '')

            # Render the entire HTML page as a string
            page_template = '''
            <!DOCTYPE html>
            <html>
            <head>
                <title>Image to ASCII Result</title>
                <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f0f0f0;
        }

        .ascii-art-container {
            max-width: 80%; /* You can adjust the width as needed */
            margin: 0 auto;
            border: 20px solid #ddd;
            padding: 20px;
            background-color: #fff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            white-space: pre-wrap;
            font-family: 'Courier New', monospace;
            font-size: 8px;
            line-height: 0.75;
        }
    </style>
            </head>
            <body>
                <h1>Converted ASCII Art</h1>
                <pre class="ascii-art-container">{{ ascii_art }}</pre>
            </body>
            </html>
            '''

            rendered_page = render_template_string(page_template, ascii_art=ascii_art, image_data=image_data)

            # Return the rendered page as a response
            response = Response(rendered_page, content_type='text/html')
            response.headers["Content-Disposition"] = "attachment; filename=output.html"

            return response

    return render_template('structure2.html',error = "Convert image to save")

if __name__ == '__main__':
    app.run(debug=True)
