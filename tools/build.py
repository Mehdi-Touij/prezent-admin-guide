"""Build guide.css, guide.js and img/ from a single-file prototype HTML.

Usage:  python3 tools/build.py path/to/prototype.html
Then:   npx esbuild guide.js --minify --outfile=guide.min.js
        npx esbuild guide.css --minify --outfile=guide.min.css
(or just run tools/build.sh, which does all three)
"""
import base64, os, re, struct, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Resets Webflow/site defaults back to browser defaults so the guide looks the same inside Webflow.
RESET = (
    "h1{margin:.67em 0;font-size:2em;line-height:inherit;font-weight:bold}"
    "h2{margin:.83em 0;font-size:1.5em;line-height:inherit;font-weight:bold}"
    "h3{margin:1em 0;font-size:1.17em;line-height:inherit;font-weight:bold}"
    "h4{margin:1.33em 0;font-size:1em;line-height:inherit;font-weight:bold}"
    "p{margin:1em 0}ul,ol{margin:1em 0;padding-left:40px}li{margin-bottom:0}"
    "label{display:inline;margin-bottom:0;font-weight:inherit}"
    "img{display:inline;max-width:none;vertical-align:baseline}a{transition:none}"
    "input,input[type=checkbox],input[type=search],button{margin:revert;font:revert;color:revert;line-height:revert}"
    "input[type=search]{box-sizing:border-box}html{height:auto}body{min-height:0}h1.title{text-decoration:none}"
    "#admin-guide-root{min-height:100vh}"
)


def webp_size(data):
    """Pixel width/height from a WebP header (VP8, VP8L or VP8X)."""
    chunk = data[12:16]
    if chunk == b"VP8X":
        w = 1 + int.from_bytes(data[24:27], "little")
        h = 1 + int.from_bytes(data[27:30], "little")
    elif chunk == b"VP8L":
        b = int.from_bytes(data[21:25], "little")
        w, h = (b & 0x3FFF) + 1, ((b >> 14) & 0x3FFF) + 1
    elif chunk == b"VP8 ":
        w, h = struct.unpack("<HH", data[26:30])
        w, h = w & 0x3FFF, h & 0x3FFF
    else:
        raise ValueError("not a WebP image")
    return w, h


def main(src):
    html = open(src, encoding="utf-8").read()
    css = "\n".join(re.findall(r"<style[^>]*>(.*?)</style>", html, re.S))
    scripts = [s for s in re.findall(r"<script[^>]*>(.*?)</script>", html, re.S)]
    body = re.search(r"<body[^>]*>(.*?)</body>", html, re.S).group(1)
    shell = re.sub(r"<script[^>]*>.*?</script>", "", body, flags=re.S).strip()

    img_js = next(s for s in scripts if "const IMG" in s)
    app_js = next(s for s in scripts if "const PARTS" in s)

    os.makedirs(os.path.join(ROOT, "img"), exist_ok=True)
    keys, dims = [], {}
    for key, ext, b64 in re.findall(r'"([\w-]+)"\s*:\s*"data:image/(\w+);base64,([A-Za-z0-9+/=]+)"', img_js):
        data = base64.b64decode(b64)
        open(os.path.join(ROOT, "img", f"{key}.{ext}"), "wb").write(data)
        keys.append((key, ext))
        dims[key] = webp_size(data) if ext == "webp" else None

    # Images embedded in the page shell (e.g. the logo) become files too, so guide.js stays small.
    shell_imgs = []
    def save_shell_img(m):
        ext = {"jpeg": "jpg", "svg+xml": "svg"}.get(m.group(1), m.group(1))
        name = "logo" if not shell_imgs else f"shell-{len(shell_imgs)}"
        open(os.path.join(ROOT, "img", f"{name}.{ext}"), "wb").write(base64.b64decode(m.group(2)))
        shell_imgs.append(name)
        return "${BASE}img/" + f"{name}.{ext}"
    shell = re.sub(r"data:image/([\w+]+);base64,([A-Za-z0-9+/=]+)", save_shell_img, shell)

    img_map = ",\n".join(f'  "{k}": BASE + "img/{k}.{e}"' for k, e in keys)
    dim_map = ",".join(f'"{k}":[{w},{h}]' for k, (w, h) in dims.items() if dims[k])

    # Screenshots: lazy-load, decode off the main thread, and reserve their space.
    old_img = '<img src="${IMG[g.fig]}" alt="${esc(g.alt)}">'
    new_img = ('<img src="${IMG[g.fig]}" alt="${esc(g.alt)}" loading="lazy" decoding="async"'
               ' width="${(DIM[g.fig]||[])[0]||""}" height="${(DIM[g.fig]||[])[1]||""}">')
    if old_img not in app_js:
        sys.exit("build.py: screenshot <img> template changed; update old_img in tools/build.py")
    app_js = app_js.replace(old_img, new_img)

    js = f"""/* Prezent Vivo Admin Best Practices Guide. Built by tools/build.py; edit content here or in the prototype.
   Host page needs: <div id="admin-guide-root"></div>, guide.css and this script. */
(function () {{
const root = document.getElementById("admin-guide-root");
if (!root) return;
const BASE = new URL(".", document.currentScript.src).href;
root.innerHTML = `
{shell}
`;

const IMG = {{
{img_map}
}};
const DIM = {{{dim_map}}};
{app_js.strip()}
}})();
"""
    open(os.path.join(ROOT, "guide.css"), "w").write(
        "/* Prezent Vivo Admin Best Practices Guide. Built by tools/build.py.\n"
        "   The first line resets Webflow/site defaults back to browser defaults; the rest is the guide's own CSS. */\n"
        + RESET + "\n" + css.strip() + "\n")
    open(os.path.join(ROOT, "guide.js"), "w").write(js)
    print(f"guide.css, guide.js, {len(keys)} screenshots and {len(shell_imgs)} shell images written")


if __name__ == "__main__":
    main(sys.argv[1])
