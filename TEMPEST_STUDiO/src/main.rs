use std::net::TcpListener;
use std::io::Write;

fn main() {
    let listener = TcpListener::bind("127.0.0.1:4000").unwrap();
    println!("[+] TEMPEST_STUDiO Engine active on port 4000");
    for stream in listener.incoming() {
        match stream {
            Ok(mut stream) => {
                stream.write_all(b"HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\n\r\nTEMPEST_STUDiO v3.0 ACTIVE").unwrap();
            }
            Err(_) => {}
        }
    }
}
