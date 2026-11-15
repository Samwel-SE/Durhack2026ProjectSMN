import xml.etree.ElementTree as ET

tree = ET.parse("encrypted-image.svg")
root = tree.getroot()

for elem in root.iter():
    tag = elem.tag.split('}')[-1]
    attrs = dict(elem.attrib)
    text = (elem.text or '').strip()[:20]
    print(f"<{tag}> {attrs} text={text!r}")   