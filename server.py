import http.server
import socketserver
import json
import urllib.parse

PORT = 8000

# Global state to hold the current verse
current_verse_data = {
    "bookName": "Psalms",
    "chapter": 119,
    "verseNum": 105,
    "verseText": "God's word is a lamp to my feet and a light to my path."
}

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/current_verse':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            # Prevent caching so the display always gets the latest verse
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.end_headers()
            self.wfile.write(json.dumps(current_verse_data).encode('utf-8'))
        else:
            # Serve regular files (HTML, CSS, JS, etc.)
            super().do_GET()
            
    def do_POST(self):
        global current_verse_data
        if self.path == '/set_verse':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            try:
                new_data = json.loads(post_data.decode('utf-8'))
                current_verse_data.update(new_data)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success"}).encode('utf-8'))
            except Exception as e:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode('utf-8'))
        else:
            self.send_error(404, "Not Found")

# Prevent Address already in use error
socketserver.TCPServer.allow_reuse_address = True

with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
    print(f"Serving at port {PORT}")
    httpd.serve_forever()
