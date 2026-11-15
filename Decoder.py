import xml.etree.ElementTree as ET
import math
from collections import defaultdict

colours_dictionary = {
    "#e70606": 'a',
    "#f78b10": 'b',
    "#d4e022": 'c',
    "#10f7d8": 'd',
    "#f710bd": 'e',
    "#3a10f7": 'f',
    "#3d0404": 'g',
    "#0b6e1c": 'h',
    "#ae23ca": 'i',
    "#3e3a72": 'j',
    "#ce4a4a": 'k',
    "#1b5964": 'l',
    "#ca3c9b": 'm',
    "#724706": 'n',
    "#ac4408": 'o',
    "#e710bc": 'p',
    "#7c2138": 'q',
    "#041f05": 'r',
    "#bbdf3c": 's',
    "#e9a33a": 't',
    "#b354ae": 'u',
    "#dee48a": 'v',
    "#32a797": 'w',
    "#8a1c1c": 'x',
    "#80919b": 'y',
    "#1b041a": 'z'
}

def normalise_hex(hex_str):
    hex_str = hex_str.strip().lower()
    if not hex_str.startswith('#'):
        hex_str = '#' + hex_str
    if len(hex_str) == 4:
        hex_str = '#' + hex_str[1]*2 + hex_str[2]*2 + hex_str[3]*2
    return hex_str

tree = ET.parse("encrypted-image.svg")
root = tree.getroot()

# Group lines by stroke colour, collect angles
colour_angles = defaultdict(list)

for elem in root.iter():
    tag = elem.tag.split('}')[-1]
    if tag != 'line':
        continue

    stroke = elem.get('stroke', '')
    if not stroke:
        continue

    hex_colour = normalise_hex(stroke)

    # Skip near-black background
    r, g, b = int(hex_colour[1:3],16), int(hex_colour[3:5],16), int(hex_colour[5:7],16)
    if (r + g + b) / 3 < 30:
        continue

    x1, y1 = float(elem.get('x1')), float(elem.get('y1'))
    x2, y2 = float(elem.get('x2')), float(elem.get('y2'))

    # Angle in degrees (0° = horizontal right, 90° = vertical down)
    angle = math.degrees(math.atan2(y2 - y1, x2 - x1))

    colour_angles[hex_colour].append(angle)

# Compute average angle per colour group
results = []
for hex_colour, angles in colour_angles.items():
    avg_angle = sum(angles) / len(angles)
    letter = colours_dictionary.get(hex_colour, '?')
    results.append((avg_angle, letter, hex_colour, len(angles)))

# Sort by angle → this gives the word order
results.sort(key=lambda r: r[0])

decoded = ''.join(r[1] for r in results)
print(f"Decoded: {decoded}\n")

print(f"{'Pos':<5} {'Letter':<7} {'Avg Angle':<12} {'Lines':<7} {'Colour'}")
print("─" * 45)
for i, (angle, letter, colour, count) in enumerate(results, 1):
    print(f"{i:<5} {letter:<7} {angle:<12.2f} {count:<7} {colour}")   