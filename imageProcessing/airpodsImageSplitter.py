import glob
import os
import PIL.Image
import numpy as np

# Air Pods 1-2
top = 131
bottom = 1069

leftFront = 168
rightFront = 1057

leftBack = 902
rightBack = 1791

# Air Pods Pro
topPro = 76
bottomPro = 1014

leftFrontPro = 111
rightFrontPro = 1000

leftBackPro = 1012
rightBackPro = 1901

def process_file(path, xbox=True):
    image = PIL.Image.open(path)

    back = image.crop((leftFrontPro, topPro, rightFrontPro, bottomPro))
    front = image.crop((leftBackPro, topPro, rightBackPro, bottomPro))

    dir_path = os.path.dirname(os.path.realpath(path))
    name = Path(path).stem
    front.save(f'{dir_path}\\processed\\{name}_front.png')
    back.save(f'{dir_path}\\processed\\{name}_back.png')


from pathlib import Path

#for path in Path('../images/Airpods 1-2').rglob('*.png'):
# for path in Path('../images/Airpods Pro').rglob('*.png'):
process_file('../images/Airpods 1-2/highlights.png')
process_file('../images/Airpods Pro/highlights.png')
