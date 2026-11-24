param(
    [string]$ProjectRoot = $PSScriptRoot,
    [switch]$NoBrowser
)

$ErrorActionPreference = 'Stop'
$ProjectRoot = (Resolve-Path -LiteralPath $ProjectRoot).ProviderPath
if (-not (Test-Path -LiteralPath (Join-Path $ProjectRoot 'index.html') -PathType Leaf)) {
    throw "BUS ROUTE index.html was not found in $ProjectRoot."
}

$python = Get-Command python.exe -All -CommandType Application -ErrorAction SilentlyContinue |
    Where-Object { $_.Source -notlike '*\Microsoft\WindowsApps\*' } |
    Select-Object -First 1 -ExpandProperty Source
if (-not $python) {
    $python = 'D:\VS CODE\save\tools\Python314\python.exe'
}
if (-not (Test-Path -LiteralPath $python -PathType Leaf)) {
    throw 'Python was not found. Add the installed python.exe to PATH and reopen Zed.'
}

$serverCode = @'
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from threading import Thread
import errno
import sys
import webbrowser

class LocalServer(ThreadingHTTPServer):
    allow_reuse_address = False

def open_browser(url):
    if not webbrowser.open(url, new=2):
        print('Open this address in your browser: ' + url, flush=True)

root, browser_mode = sys.argv[1:]
handler = partial(SimpleHTTPRequestHandler, directory=root)

for port in (5500, 5501, 0):
    try:
        server = LocalServer(('127.0.0.1', port), handler)
        break
    except OSError as error:
        if error.errno != errno.EADDRINUSE and getattr(error, 'winerror', None) != 10048:
            sys.exit(f'Cannot start BUS ROUTE: {error}')
else:
    sys.exit('No local port is available.')

with server:
    url = f'http://localhost:{server.server_port}/'
    print(f'BUS ROUTE is serving {root}', flush=True)
    print(f'{url}  (Ctrl+C to stop)', flush=True)
    if browser_mode == 'open':
        Thread(target=open_browser, args=(url,), daemon=True).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
'@

$browserMode = if ($NoBrowser) { 'skip' } else { 'open' }
& $python -u -c $serverCode $ProjectRoot $browserMode
exit $LASTEXITCODE
