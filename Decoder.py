
import xml.etree.ElementTree as ET
import math
import os
from collections import defaultdict
from getpass import getpass
from pathlib import Path

from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.exceptions import InvalidTag


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

    # Hexadecimal digits
    "#a1a31a": '0',
    "#3ca0a3": '1',
    "#adade0": '2',
    "#9e3c898c": '3',
    "#4c00ff": '4',
    "#7c637c6b": '5',
    "#8a614688": '6',
    "#884c71" : '7',
    "#4fbebe": '8',
    "#818136": '9'
}


def normalise_hex(hex_str):

    hex_str = hex_str.strip().lower()

    if not hex_str.startswith('#'):
        hex_str = '#' + hex_str

    if len(hex_str) == 4:
        hex_str = '#' + ''.join(
            c * 2 for c in hex_str[1:]
        )

    return hex_str


def decrypt_svg(filename):

    # Read SVG
    tree = ET.parse(filename)
    root = tree.getroot()

    # Read encryption metadata
    salt_hex = root.get("data-salt")
    iv_hex = root.get("data-iv")

    if not salt_hex or not iv_hex:
        raise ValueError("SVG is missing encryption metadata.")

    salt = bytes.fromhex(salt_hex)
    iv = bytes.fromhex(iv_hex)

    if len(salt) != 16 or len(iv) != 12:
        raise ValueError("Invalid salt or IV length.")

    # Group lines by angle
    angle_groups = defaultdict(list)

    for elem in root.iter():

        tag = elem.tag.split('}')[-1]

        if tag != 'line':
            continue

        stroke = elem.get('stroke', '')

        if not stroke:
            continue

        hex_colour = normalise_hex(stroke)

        if hex_colour not in colours_dictionary:
            continue

        x1 = float(elem.get('x1'))
        y1 = float(elem.get('y1'))
        x2 = float(elem.get('x2'))
        y2 = float(elem.get('y2'))

        angle = math.degrees(
            math.atan2(y2 - y1, x2 - x1)
        ) % 360

        # All lines for one character share the same angle.
        angle_key = round(angle, 4)

        angle_groups[angle_key].append(hex_colour)

    if not angle_groups:
        raise ValueError("No encrypted lines found in SVG.")

    # Recover each character using its angle group
    results = []

    for angle, colours in angle_groups.items():

        # Find the most common colour in this angle group
        colour_counts = defaultdict(int)

        for colour in colours:
            colour_counts[colour] += 1

        most_common_colour = max(
            colour_counts,
            key=colour_counts.get
        )

        character = colours_dictionary[most_common_colour]

        results.append((angle, character, most_common_colour))

    # Sort characters by angle
    results.sort(key=lambda item: item[0])

    encrypted_hex = ''.join(
        item[1] for item in results
    )

    print("\nRecovered hexadecimal:")
    print(encrypted_hex)

    if len(encrypted_hex) % 2 != 0:
        raise ValueError("Invalid hexadecimal length.")

    # Convert hexadecimal into bytes
    encrypted_data = bytes.fromhex(encrypted_hex)

    # Ask for password
    password = getpass("\nEnter decryption password: ")

    # Derive AES-256 key
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=310000
    )

    key = kdf.derive(password.encode("utf-8"))

    # Decrypt using AES-256-GCM
    aes = AESGCM(key)

    try:

        decrypted_data = aes.decrypt(
            iv,
            encrypted_data,
            None
        )

        decoded_message = decrypted_data.decode("utf-8")

        print("Message has been decrypted")

        print("\nOriginal message:")
        print(decoded_message)

        

        return decoded_message

    except InvalidTag:

        print("\nDECRYPTION FAILED")
        print("Incorrect password or corrupted SVG.")

        return None


if __name__ == "__main__":

    filename = "encrypted-image.svg"

    if not os.path.isfile(filename):
        print("\nFile not found:", filename)

    else:

        try:
            decrypt_svg(filename)

        except Exception as error:
            print("\nDecoder error:", error)
