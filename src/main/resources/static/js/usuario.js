/* =========================================================
   Sessão e proteção de rota
   ========================================================= */

function obterSessao() {
    try {
        return JSON.parse(localStorage.getItem("sessao"));
    } catch (erro) {
        return null;
    }
}

const sessao = obterSessao();

if (!sessao) {
    window.location.href = "index.html";
} else if (sessao.perfil === "ADMIN") {
    window.location.href = "admin.html";
}

if (sessao) {
    document.getElementById("saudacao").textContent = "Bem-vindo(a), " + sessao.nome + "!";
}

document.getElementById("btnSair").addEventListener("click", async function () {
    document.getElementById("navigationLoader").classList.add("aberto");
    localStorage.removeItem("sessao");
    await new Promise(resolve => setTimeout(resolve, 700));
    window.location.href = "index.html";
});

/* =========================================================
   Tema claro / escuro
   ========================================================= */

const themeToggle = document.getElementById("themeToggle");
const temaSalvo = localStorage.getItem("tema") || "dark";

aplicarTema(temaSalvo);

themeToggle.addEventListener("change", function () {
    aplicarTema(this.checked ? "light" : "dark");
});

function aplicarTema(tema) {
    document.body.setAttribute("data-theme", tema);
    themeToggle.checked = tema === "light";
    localStorage.setItem("tema", tema);
}

/* =========================================================
   Jogo: Pong
   ========================================================= */

const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");
const overlay = document.getElementById("jogoOverlay");
const overlayTexto = document.getElementById("jogoOverlayTexto");
const btnJogar = document.getElementById("btnJogar");
const btnJogarTexto = document.getElementById("btnJogarTexto");
const placarJogadorEl = document.getElementById("placarJogador");
const placarMaquinaEl = document.getElementById("placarMaquina");

const LARGURA = canvas.width;
const ALTURA = canvas.height;
const RAQUETE_ALTURA = 80;
const RAQUETE_LARGURA = 10;
const PONTOS_PARA_VENCER = 5;
const niveis = {
    facil: { velocidadeMaquina: 1.9, velocidadeBola: 2.6 },
    medio: { velocidadeMaquina: 3.1, velocidadeBola: 3.5 },
    dificil: { velocidadeMaquina: 4.5, velocidadeBola: 4.5 }
};

let nivelSelecionado = "medio";
let jogadorY = ALTURA / 2 - RAQUETE_ALTURA / 2;
let maquinaY = ALTURA / 2 - RAQUETE_ALTURA / 2;
let bola = criarBola();
let placarJogador = 0;
let placarMaquina = 0;
let jogoAtivo = false;
let loopId = null;
const telaJogo = document.getElementById("jogoTelaWrap");
const teclasPressionadas = { cima: false, baixo: false };

function nivelAtual() { return niveis[nivelSelecionado] || niveis.medio; }

document.querySelectorAll(".nivel-btn").forEach(botao => {
    botao.addEventListener("click", () => {
        if (jogoAtivo) return;
        nivelSelecionado = botao.dataset.nivel;
        document.querySelectorAll(".nivel-btn").forEach(item => item.classList.toggle("ativo", item === botao));
    });
});

function criarBola() {
    const direcao = Math.random() > 0.5 ? 1 : -1;
    return {
        x: LARGURA / 2,
        y: ALTURA / 2,
        raio: 8,
        vx: nivelAtual().velocidadeBola * direcao,
        vy: (Math.random() * 4 - 2)
    };
}

function desenhar() {

    // fundo
    ctx.fillStyle = corFundoCanvas();
    ctx.fillRect(0, 0, LARGURA, ALTURA);

    // linha central tracejada
    ctx.strokeStyle = corLinhaCanvas();
    ctx.setLineDash([8, 10]);
    ctx.beginPath();
    ctx.moveTo(LARGURA / 2, 0);
    ctx.lineTo(LARGURA / 2, ALTURA);
    ctx.stroke();
    ctx.setLineDash([]);

    // raquetes
    ctx.fillStyle = corAcaoCanvas();
    ctx.fillRect(20, jogadorY, RAQUETE_LARGURA, RAQUETE_ALTURA);
    ctx.fillRect(LARGURA - 30, maquinaY, RAQUETE_LARGURA, RAQUETE_ALTURA);

    // bola
    ctx.beginPath();
    ctx.arc(bola.x, bola.y, bola.raio, 0, Math.PI * 2);
    ctx.fillStyle = corDestaqueCanvas();
    ctx.fill();

}

function corFundoCanvas() {
    return getComputedStyle(document.body).getPropertyValue("--surface-2").trim() || "#101010";
}
function corLinhaCanvas() {
    return getComputedStyle(document.body).getPropertyValue("--border").trim() || "#333";
}
function corAcaoCanvas() {
    return getComputedStyle(document.body).getPropertyValue("--accent").trim() || "#3b6fed";
}
function corDestaqueCanvas() {
    return getComputedStyle(document.body).getPropertyValue("--highlight").trim() || "#ffd23f";
}

function atualizar() {

    const passoTeclado = 5;
    if (teclasPressionadas.cima) jogadorY -= passoTeclado;
    if (teclasPressionadas.baixo) jogadorY += passoTeclado;
    jogadorY = Math.max(0, Math.min(ALTURA - RAQUETE_ALTURA, jogadorY));

    bola.x += bola.vx;
    bola.y += bola.vy;

    // colisão com topo/baixo
    if (bola.y - bola.raio < 0 || bola.y + bola.raio > ALTURA) {
        bola.vy *= -1;
    }

    // raquete do jogador
    if (bola.x - bola.raio < 20 + RAQUETE_LARGURA &&
        bola.y > jogadorY && bola.y < jogadorY + RAQUETE_ALTURA &&
        bola.vx < 0) {
        bola.vx *= -1;
        bola.vy += (bola.y - (jogadorY + RAQUETE_ALTURA / 2)) * 0.12;
    }

    // raquete da máquina
    if (bola.x + bola.raio > LARGURA - 30 &&
        bola.y > maquinaY && bola.y < maquinaY + RAQUETE_ALTURA &&
        bola.vx > 0) {
        bola.vx *= -1;
        bola.vy += (bola.y - (maquinaY + RAQUETE_ALTURA / 2)) * 0.12;
    }

    // IA simples da máquina: segue a bola com velocidade limitada
    const centroMaquina = maquinaY + RAQUETE_ALTURA / 2;
    if (centroMaquina < bola.y - 10) maquinaY += nivelAtual().velocidadeMaquina;
    else if (centroMaquina > bola.y + 10) maquinaY -= nivelAtual().velocidadeMaquina;
    maquinaY = Math.max(0, Math.min(ALTURA - RAQUETE_ALTURA, maquinaY));

    // ponto
    if (bola.x < 0) {
        placarMaquina++;
        atualizarPlacar();
        verificarFimDeJogo() || reiniciarBola();
    } else if (bola.x > LARGURA) {
        placarJogador++;
        atualizarPlacar();
        verificarFimDeJogo() || reiniciarBola();
    }

}

function atualizarPlacar() {
    placarJogadorEl.textContent = placarJogador;
    placarMaquinaEl.textContent = placarMaquina;
}

function reiniciarBola() {
    bola = criarBola();
}

function verificarFimDeJogo() {
    if (placarJogador >= PONTOS_PARA_VENCER || placarMaquina >= PONTOS_PARA_VENCER) {
        pararJogo(placarJogador > placarMaquina ? "Você venceu! 🎉" : "A máquina venceu — tenta de novo!");
        return true;
    }
    return false;
}

function loop() {
    if (!jogoAtivo) return;
    atualizar();
    desenhar();
    loopId = requestAnimationFrame(loop);
}

function iniciarJogo() {
    if (jogoAtivo) return;
    placarJogador = 0;
    placarMaquina = 0;
    atualizarPlacar();
    jogadorY = ALTURA / 2 - RAQUETE_ALTURA / 2;
    maquinaY = ALTURA / 2 - RAQUETE_ALTURA / 2;
    bola = criarBola();

    overlay.classList.add("oculto");
    jogoAtivo = true;
    telaJogo.classList.add("em-jogo");
    document.body.classList.add("jogo-em-foco");
    canvas.focus({ preventScroll: true });
    if (canvas.requestPointerLock) {
        const pedido = canvas.requestPointerLock();
        if (pedido && typeof pedido.catch === "function") pedido.catch(() => {});
    }
    loop();
}

function pararJogo(mensagemFinal) {
    jogoAtivo = false;
    if (loopId) cancelAnimationFrame(loopId);
    telaJogo.classList.remove("em-jogo");
    document.body.classList.remove("jogo-em-foco");
    teclasPressionadas.cima = false;
    teclasPressionadas.baixo = false;
    if (document.pointerLockElement === canvas) document.exitPointerLock();

    if (mensagemFinal) {
        overlayTexto.textContent = mensagemFinal;
        btnJogarTexto.textContent = "Jogar novamente";
        overlay.classList.remove("oculto");
    }
}

btnJogar.addEventListener("click", iniciarJogo);
overlay.addEventListener("click", evento => {
    if (evento.target.closest("#btnJogar") || jogoAtivo) return;
    iniciarJogo();
});
canvas.addEventListener("click", () => {
    if (!jogoAtivo) iniciarJogo();
});

// Controles: teclado
document.addEventListener("keydown", function (evento) {
    if (!jogoAtivo) return;
    if (evento.key === "Escape") {
        evento.preventDefault();
        pararJogo("Partida encerrada. Clique em Jogar quando quiser voltar.");
        return;
    }
    if (evento.key === "ArrowUp") {
        evento.preventDefault();
        teclasPressionadas.cima = true;
    }
    if (evento.key === "ArrowDown") {
        evento.preventDefault();
        teclasPressionadas.baixo = true;
    }
});

document.addEventListener("keyup", function (evento) {
    if (evento.key === "ArrowUp") teclasPressionadas.cima = false;
    if (evento.key === "ArrowDown") teclasPressionadas.baixo = false;
});

document.addEventListener("pointerlockchange", function () {
    if (jogoAtivo && document.pointerLockElement !== canvas) {
        pararJogo("Partida pausada. Clique em Jogar para voltar.");
    }
});

// Controles: mouse
canvas.addEventListener("mousemove", function (evento) {
    if (!jogoAtivo) return;
    if (document.pointerLockElement === canvas) {
        const escalaY = ALTURA / canvas.getBoundingClientRect().height;
        jogadorY = Math.max(0, Math.min(ALTURA - RAQUETE_ALTURA, jogadorY + evento.movementY * escalaY));
        return;
    }
    const retangulo = canvas.getBoundingClientRect();
    const escalaY = ALTURA / retangulo.height;
    const y = (evento.clientY - retangulo.top) * escalaY;
    jogadorY = Math.max(0, Math.min(ALTURA - RAQUETE_ALTURA, y - RAQUETE_ALTURA / 2));
});

// Controles: toque (celular/tablet)
canvas.addEventListener("touchmove", function (evento) {
    if (!jogoAtivo) return;
    evento.preventDefault();
    const toque = evento.touches[0];
    const retangulo = canvas.getBoundingClientRect();
    const escalaY = ALTURA / retangulo.height;
    const y = (toque.clientY - retangulo.top) * escalaY;
    jogadorY = Math.max(0, Math.min(ALTURA - RAQUETE_ALTURA, y - RAQUETE_ALTURA / 2));
}, { passive: false });

// Desenha o estado inicial (parado) assim que a página carrega
desenhar();
