import json
from PIL import Image

def load_height_map(image_path='../../../assets/textures/nomalmap.png', max_height=8848, output_file_path="'output_file.json'"):
    img = Image.open(image_path).convert('L')
    width, height = img.size
    data = list(img.getdata())

    height_map = []
    for i in range(height):
        row = []
        for j in range(width):
            index = i * width + j
            value = data[index] / 255.0 * max_height
            row.append(value)
        height_map.append(row)

    if output_file_path is not None:
        with open(output_file_path, 'w') as f:
            json.dump(height_map, f)

    return height_map

load_height_map()