# GPSJr

GPSJr e um projeto de rastreamento IoT inspirado nos conceitos arquiteturais do Traccar, com backend em Node.js, MySQL como banco de dados e frontend estatico em HTML, CSS e JavaScript para publicacao via GitHub Pages.

## Objetivo do MVP

- Receber posicoes de dispositivos pelo protocolo HTTP estilo OsmAnd.
- Normalizar e salvar posicoes em MySQL.
- Expor API REST para dispositivos, posicoes e eventos.
- Enviar atualizacoes em tempo real por WebSocket.
- Fornecer um painel web leve em pt-BR com mapa OpenStreetMap/Leaflet.

## Stack

- Node.js + TypeScript
- Fastify
- MySQL 8
- WebSocket
- Docker Compose
- HTML, CSS e JavaScript
- Leaflet/OpenStreetMap
- GitHub Pages para o frontend

## Estrutura

```text
backend/       API, WebSocket e ingestao de posicoes
database/      schema SQL inicial
frontend/      painel estatico para GitHub Pages
.github/       workflows de CI e Pages
```

## Rodando localmente

1. Copie as variaveis de ambiente:

```bash
cp .env.example .env
```

2. Suba o MySQL:

```bash
docker compose up -d
```

3. Instale e rode o backend:

```bash
cd backend
npm install
npm run dev
```

4. Abra o frontend:

```bash
cd ../frontend
python -m http.server 5173
```

## Ingestao OsmAnd HTTP

Exemplo de envio de posicao:

```text
GET /api/ingest/osmand?id=demo-001&lat=-23.55052&lon=-46.63331&speed=32&bearing=180&altitude=760&timestamp=2026-06-27T19:00:00Z&token=troque-este-token
```

## Licenca

Apache-2.0.

