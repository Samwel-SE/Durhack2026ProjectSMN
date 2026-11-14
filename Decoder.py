import xml.etree.ElementTree as ET
import re

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
    "#1b041a": 'z',
}

def get_position(elem):
    """Extract (cx, cy) from transform, x/y, or path data."""
    # Try transform="translate(x, y)"
    transform = elem.get('transform', '')
    m = re.search(r'translate\(\s*([\d.-]+)\s*[,]\s*([\d.-]+)', transform)
    if m:
        return float(m.group(1)), float(m.group(2))

    # Try x, y attributes
    x = elem.get('x')
    y = elem.get('y')
    if x is not None and y is not None:
        return float(x), float(y)

    # Fallback: parse path 'd' for first M command
    d = elem.get('d', '')
    m = re.search(r'M\s*([\d.-]+)\s*[,]\s*([\d.-]+)', d)
    if m:
        return float(m.group(1)), float(m.group(2))

    return 0.0, 0.0

def normalise_hex(hex_str):
    """Normalise to lowercase #rrggbb."""
    hex_str = hex_str.strip().lower()
    if not hex_str.startswith('#'):
        hex_str = '#' + hex_str
    # Handle #rgb shorthand
    if len(hex_str) == 4:
        hex_str = '#' + hex_str[1]*2 + hex_str[2]*2 + hex_str[3]*2
    return hex_str

tree = ET.parse("encryptedInfo.svg")
root = tree.getroot()

# SVG namespace
ns = {'svg': 'http://www.w3.org/2000/svg'}

results = []
for elem in root.iter():
    # Check fill attribute
    fill = elem.get('fill', '')
    if not fill:
        # Check style="fill:#xxxxxx"
        style = elem.get('style', '')
        m = re.search(r'fill\s*:\s*(#[0-9a-fA-F]{3,6})', style)
        if m:
            fill = m.group(1)
        else:
            continue

    hex_colour = normalise_hex(fill)

    # Skip background/none
    if hex_colour in ('#ffffff', '#000000', 'none'):
        continue

    letter = colours_dictionary.get(hex_colour)
    if letter is None:
        # Try case-insensitive match
        letter = colours_dictionary.get(hex_colour.lower())

    cx, cy = get_position(elem)
    results.append((cx, cy, letter or '?', hex_colour))

# Sort: group into rows by y, then left-to-right
row_tolerance = 30
results.sort(key=lambda r: (round(r[1] / row_tolerance), r[0]))

decoded = ''.join(r[2] for r in results)
print(f"Decoded: {decoded}\n")

print(f"{'Letter':<7} {'Pos':<14} {'Colour'}")
print("─" * 40)
for cx, cy, letter, colour in results:
    print(f"{letter:<7} ({cx:.0f},{cy:.0f}){'':<6} {colour}")   