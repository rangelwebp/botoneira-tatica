# Botoneira Tática — v1

Ferramenta de análise tática de partidas de futebol. O analista assiste ao
vídeo (link do YouTube ou arquivo local) e marca "recortes" clicando nos
botões da botoneira; no fim, exporta um arquivo `.json` que qualquer pessoa
importa na página `/ver` pra abrir o dashboard com a timeline e as
estatísticas — sem backend, sem login, sem banco de dados.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000

## Estrutura

```
app/
  analisar/page.tsx   → tela do analista (gravar a análise)
  ver/page.tsx        → tela do treinador (importar e visualizar)
lib/
  types.ts             → tipos compartilhados
  matchTime.ts          → cálculo de minuto real de jogo + helpers
  useYouTubePlayer.ts   → adaptador do player do YouTube (IFrame API)
  useLocalVideo.ts       → adaptador do <video> local
components/
  VideoSourcePicker.tsx → escolha YouTube ou arquivo local
  PlayerBox.tsx           → moldura do player (mesma pros dois modos)
  Transport.tsx           → play/pause, barra de tempo, minuto de jogo
  MarcosRow.tsx            → botões de Início 1ºT / Intervalo / Início 2ºT / Fim
  Botonera.tsx               → grade de botões por categoria
  Timeline.tsx                → lista cronológica dos recortes
  FichaPartida.tsx              → painel lateral com os dados da partida
data/
  botonera.json          → configuração dos botões — edite aqui sem mexer em código
```

## Ficha da Partida

Painel lateral (ícone "Ficha da partida" acima do vídeo) com os dados de
contexto: nosso time, adversário, data, competição, treinador do adversário,
placar, mandante/visitante, analista responsável e observações. Pode ser
preenchido a qualquer momento — não trava o início da análise.

Esses dados vão dentro do `.json` exportado como `partida` (tipo `PartidaInfo`
em `lib/types.ts`) e são o que gera o título automático mostrado no topo da
tela do analista e no cabeçalho do dashboard em `/ver`
(`lib/partida.ts` → `tituloPartida()`), no formato:

```
Nosso Time 2×1 Adversário X — Campeonato Y, 05/08 · fora de casa
```

## Como o modo YouTube e o modo local convivem

Os dois hooks (`useYouTubePlayer` e `useLocalVideo`) implementam a mesma
interface `VideoAdapter` (`lib/types.ts`): `currentTime`, `duration`,
`playing`, `seekTo()`, `togglePlay()`. A botoneira, a timeline e o cálculo de
minuto de jogo só conversam com essa interface — nunca sabem se por trás tem
YouTube ou um arquivo local. Trocar de fonte não duplica nenhuma lógica.

## Editando a botoneira

Abra `data/botonera.json`. Cada grupo tem `nome`, `tom` (cor: green, teal,
purple, amber, red ou gray) e a lista de `acoes`. Adicionar, remover ou
renomear um botão é só editar esse arquivo — não precisa tocar em nenhum
componente.

## Compartilhando uma análise

- **Vídeo do YouTube**: o `.json` já guarda o ID do vídeo, então quem importa
  em `/ver` nem precisa selecionar nada — o player carrega sozinho.
- **Vídeo local**: quem importa em `/ver` precisa também selecionar o arquivo
  de vídeo correspondente (mandado à parte, por WeTransfer/Drive/pendrive).
  Sem isso, o dashboard ainda mostra a timeline e as estatísticas, só não
  toca o vídeo.
- **Link único de compartilhamento**: ainda não está implementado nesta v1.
  A ideia (sem precisar de backend) é o analista hospedar o `.json` exportado
  num link público (Google Drive, GitHub Gist) e a página `/ver` aceitar um
  parâmetro `?data=URL_DO_ARQUIVO` que carrega automaticamente. Fica como
  próximo passo.

## Próximos passos (v2)

- Corte automático dos trechos marcados com `ffmpeg.wasm`, gerando um único
  vídeo de "melhores momentos" — pensado especificamente pra quem usa vídeo
  local, pra não precisar mandar a partida inteira.
- Carregamento automático via `?data=` (link único de compartilhamento).
- Atalhos de teclado pra marcar recortes sem tirar a mão do teclado.
