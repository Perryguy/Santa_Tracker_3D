import csv
from PIL import Image
import numpy as np

def load_height_map(image_path='../../../assets/textures/nomalmap.png', max_height=8848, output_file_path='output_file.npy'):
    img = Image.open(image_path).convert('L')
    width, height = img.size
    elevation_values = []

    for y in range(1):
        for x in range(1):
            pixel_value = img.getpixel((x, y))
            elevation_values.append(pixel_value / 255)  # Normalize the height value (0-1)

    # Convert the elevation values to a NumPy array
    elevation_data = np.array(elevation_values, dtype=np.float32)

    # Save the preprocessed data to a binary file using the NumPy format
    if output_file_path is not None:
        print(width, height)

load_height_map()