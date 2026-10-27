# To-Do DevOps (FE + BE + DB)

Tech stack: HTML/JS + Nginx 1.27 (FE), Node.js 20 + Express 4.21 (BE), PostgreSQL 16 (DB), Nginx 1.27 (load balancer), Docker Compose, GitHub Actions, Docker Hub.

## Jalankan lokal
    docker compose up -d --build
    buka http://localhost:9090

Refresh beberapa kali: teks "Dilayani backend container" akan berganti-ganti = load balancing jalan.

## Hentikan
    docker compose down        (tambah -v untuk hapus data DB)
