<p align="center">
  <img src="./assets/kalim-logo.png" alt="Logo Kalim" width="120" style="border-radius: 24px;" />
</p>

<h1 align="center">Kalim</h1>
<p align="center">
  <strong>Aplicativo Web / PWA Minimalista de Kalimba (Estilo Piano Tiles + Keylimba + Cifra Club)</strong>
</p>

---

## Sobre o Projeto

O **Kalim** nasceu para resolver uma das maiores dificuldades de quem aprende Kalimba por vídeos na internet: **localizar a tecla certa enquanto a música toca**.

Projetado para ocupar **100% da tela** com estética minimalista inspirada no *Keylimba* e no *Piano Tiles*, você pode apoiar o celular diretamente sobre a sua **Kalimba física de 17 teclas** (com ajuste de largura das colunas na tela) ou tocar na própria Kalimba virtual.

### Principais Recursos
- **Modo Tiles (`Esperar por Mim` e `Ritmo Contínuo`)**: As notas descem alinhadas diretamente com as 17 lâminas da Kalimba, com destaque visual nas teclas marcadas (`3`, `6`, `2°`, `5°`, `1°°`).
- **Biblioteca Persistente**: Mais de 20 músicas clássicas inclusas (*Avatar's Love*, *Studio Ghibli*, *Zelda*, *Minecraft*, *Undertale*, etc.) e banco de dados local (`IndexedDB` + `LocalStorage`).
- **Modo Cifra & KTab Vertical**: Alternância com 1 clique entre Cifra simplificada e KTab vertical, com auto-rolagem e mini-mapa interativo no rodapé.
- **Criador de Músicas + Importador MIDI (`.mid`)**: Crie músicas tocando nas teclas, digitando cifras ou importando arquivos `.mid` com precisão exata.

---

## Como Contribuir com Novas Músicas

Qualquer pessoa pode ajudar a aumentar a biblioteca oficial de músicas do **Kalim**! Existem duas formas super simples:

### Opção 1: Sem programar (Via Issue no GitHub)
1. Abra o **Kalim** e vá na aba **Criar**.
2. Monte sua música (ou importe um arquivo `.mid` / cifra) e teste no modo **Tiles**.
3. Clique no botão **"Copiar Código p/ GitHub"** no canto inferior direito do Criador.
4. Vá na aba **Issues** deste repositório no GitHub, clique em **New Issue -> Enviar Nova Música** e cole o código copiado!

### Opção 2: Via Pull Request (Direto no Catálogo)
1. Faça um *Fork* deste repositório.
2. Abra o arquivo [`js/songs-catalog.js`](./js/songs-catalog.js).
3. Cole o bloco gerado pelo botão **"Copiar Código p/ GitHub"** no final da lista `window.KALIM_COMMUNITY_SONGS`.
4. Envie um **Pull Request**! Assim que aprovado, sua música ficará disponível para todos os usuários no GitHub Pages.

---

## Como Rodar Localmente ou Publicar no GitHub Pages

O **Kalim** não exige instalação de dependências complexas (`Node.js` ou compiladores) para funcionar:
- **Localmente**: Basta abrir o arquivo `index.html` em qualquer navegador moderno (PC ou celular).
- **No GitHub Pages**:
  1. Suba este repositório no seu GitHub.
  2. Vá em **Settings -> Pages**.
  3. Em **Branch**, selecione `main` (pasta `/root`) e clique em **Save**.
  4. Seu aplicativo estará online gratuitamente em `https://seu-usuario.github.io/nome-do-repo/`.
