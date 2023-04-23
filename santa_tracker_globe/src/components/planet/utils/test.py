import csv
from PIL import Image
import numpy as np

def load_height_map(image_path='../../../assets/textures/nomalmap.png', max_height=8848, output_file_path='output_file.npy'):
    img = Image.open(image_path).convert('L')
    width, height = img.size
    elevation_values = []

    for y in range(height):  # Corrected loop range
        for x in range(width):  # Corrected loop range
            pixel_value = img.getpixel((x, y))
            elevation_values.append((pixel_value / 255))  # Normalize the height value (0-1) and scale by max_height

    # Convert the elevation values to a NumPy array
    elevation_data = np.array(elevation_values, dtype=np.float32)

    # Save the preprocessed data to a binary file using the NumPy format
    if output_file_path is not None:
        np.save(output_file_path, elevation_data)  # Save the elevation data to the output file
        print(f"Saved elevation data to {output_file_path}")

    print(width, height)

load_height_map()