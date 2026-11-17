import http.server, socketserver, os, re

os.chdir(r'C:\KNOCKSSTUDiOS\VORTEX_7')

class RangeHandler(http.server.SimpleHTTPRequestHandler):
    def send_head(self):
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            return super().send_head()
        if not os.path.exists(path):
            self.send_error(404, 'Not found')
            return None
        ctype = self.guess_type(path)
        f = open(path, 'rb')
        fs = os.fstat(f.fileno())
        size = fs.st_size
        range_header = self.headers.get('Range')
        if range_header:
            m = re.match(r'bytes=(\d+)-(\d*)', range_header)
            if m:
                start = int(m.group(1))
                end = int(m.group(2)) if m.group(2) else size - 1
                end = min(end, size - 1)
                length = end - start + 1
                self.send_response(206)
                self.send_header('Content-Type', ctype)
                self.send_header('Accept-Ranges', 'bytes')
                self.send_header('Content-Range', f'bytes {start}-{end}/{size}')
                self.send_header('Content-Length', str(length))
                self.end_headers()
                f.seek(start)
                self.wfile.write(f.read(length))
                f.close()
                return None
        self.send_response(200)
        self.send_header('Content-Type', ctype)
        self.send_header('Accept-Ranges', 'bytes')
        self.send_header('Content-Length', str(size))
        self.end_headers()
        return f
    def log_message(self, format, *args):
        pass

with socketserver.ThreadingTCPServer(('127.0.0.1', 8765), RangeHandler) as httpd:
    httpd.serve_forever()
