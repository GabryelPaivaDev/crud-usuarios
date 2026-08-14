const API = "http://localhost:8080/usuarios";

const form = document.getElementById("formUsuario");
const tabela = document.getElementById("tabelaUsuarios");

const id = document.getElementById("id");
const nome = document.getElementById("nome");
const email = document.getElementById("email");
const cpf = document.getElementById("cpf");
const telefone = document.getElementById("telefone");
const dataNascimento = document.getElementById("dataNascimento");

const erroCpf = document.getElementById("erroCpf");
const erroTelefone = document.getElementById("erroTelefone");

const btnSalvar = form.querySelector(".btn-salvar");

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
   Modal único (avisos + confirmações)
   ========================================================= */

const modalOverlay = document.getElementById("modalOverlay");
const modalBox = document.getElementById("modalBox");
const modalIcon = document.getElementById("modalIcon");
const modalIconSvg = document.getElementById("modalIconSvg");
const modalTitulo = document.getElementById("modalTitulo");
const modalMensagem = document.getElementById("modalMensagem");
const modalAcoes = modalBox.querySelector(".modal-acoes");
const modalCancelar = document.getElementById("modalCancelar");
const modalConfirmar = document.getElementById("modalConfirmar");
const modalConfirmarTexto = document.getElementById("modalConfirmarTexto");
const modalCancelarTexto = modalCancelar.querySelector(".front");

const ICONES = {
    sucesso: '<path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/>',
    erro: '<path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/>',
    aviso: '<path d="M12 9v4.5M12 16.5h.01M10.5 3.7L2.9 17a1.4 1.4 0 001.2 2.1h15.8a1.4 1.4 0 001.2-2.1L13.5 3.7a1.4 1.4 0 00-3 0z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
    info: '<path d="M12 16v-4.5M12 8h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/>',
    excluir: '<path d="M4 7h16M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m2 0v13a2 2 0 01-2 2H8a2 2 0 01-2-2V7h12zM10 11v6M14 11v6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
    editar: '<path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>'
};

const TITULOS_PADRAO = {
    sucesso: "Sucesso",
    erro: "Erro",
    aviso: "Atenção",
    info: "Informação"
};

let elementoComFocoAntesDoModal = null;

/**
 * Função base: abre o modal único, configurado para aviso simples (só OK)
 * ou para confirmação (Cancelar + Confirmar). Retorna uma Promise que
 * resolve `true` quando o usuário confirma e `false` quando cancela/fecha.
 */
function abrirModalBase(opcoes) {

    const {
        titulo,
        mensagem,
        tipo = "info",
        textoConfirmar = "OK",
        textoCancelar = "Cancelar",
        mostrarCancelar = false
    } = opcoes;

    return new Promise(function (resolve) {

        modalTitulo.textContent = titulo;
        modalMensagem.textContent = mensagem;
        modalConfirmarTexto.textContent = textoConfirmar;
        modalCancelarTexto.textContent = textoCancelar;

        modalIconSvg.innerHTML = ICONES[tipo] || ICONES.info;
        modalIcon.className = "modal-icon tipo-" + tipo;

        modalConfirmar.classList.toggle("excluir", tipo === "erro" || tipo === "excluir");
        modalCancelar.style.display = mostrarCancelar ? "" : "none";
        modalAcoes.classList.toggle("somente-ok", !mostrarCancelar);

        elementoComFocoAntesDoModal = document.activeElement;

        modalOverlay.classList.add("aberto");
        document.body.classList.add("modal-aberto");

        requestAnimationFrame(function () {
            modalConfirmar.focus();
        });

        function encerrar(resultado) {
            modalOverlay.classList.remove("aberto");
            document.body.classList.remove("modal-aberto");

            modalConfirmar.removeEventListener("click", aoConfirmar);
            modalCancelar.removeEventListener("click", aoCancelar);
            modalOverlay.removeEventListener("click", aoClicarFora);
            document.removeEventListener("keydown", aoTeclaEsc);

            if (elementoComFocoAntesDoModal && typeof elementoComFocoAntesDoModal.focus === "function") {
                elementoComFocoAntesDoModal.focus();
            }

            resolve(resultado);
        }

        function aoConfirmar() { encerrar(true); }
        function aoCancelar() { encerrar(false); }

        function aoClicarFora(evento) {
            if (evento.target === modalOverlay) encerrar(false);
        }

        function aoTeclaEsc(evento) {
            if (evento.key === "Escape") encerrar(false);
        }

        modalConfirmar.addEventListener("click", aoConfirmar);
        modalCancelar.addEventListener("click", aoCancelar);
        modalOverlay.addEventListener("click", aoClicarFora);
        document.addEventListener("keydown", aoTeclaEsc);

    });

}

function mostrarModal(tipo, mensagem, titulo) {
    return abrirModalBase({
        titulo: titulo || TITULOS_PADRAO[tipo] || "Aviso",
        mensagem,
        tipo,
        textoConfirmar: "OK",
        mostrarCancelar: false
    });
}

function mostrarSucesso(mensagem, titulo) { return mostrarModal("sucesso", mensagem, titulo); }
function mostrarErro(mensagem, titulo) { return mostrarModal("erro", mensagem, titulo); }
function mostrarAviso(mensagem, titulo) { return mostrarModal("aviso", mensagem, titulo); }
function mostrarInfo(mensagem, titulo) { return mostrarModal("info", mensagem, titulo); }

function confirmarAcao(opcoes) {
    return abrirModalBase({
        titulo: opcoes.titulo,
        mensagem: opcoes.mensagem,
        tipo: opcoes.perigo ? "excluir" : "editar",
        textoConfirmar: opcoes.textoConfirmar || "Confirmar",
        textoCancelar: opcoes.textoCancelar || "Cancelar",
        mostrarCancelar: true
    });
}

/* =========================================================
   Estado de carregamento nos botões
   ========================================================= */

function mostrarCarregando(botao, texto) {
    if (!botao) return;
    const front = botao.querySelector(".front");
    botao.dataset.textoOriginal = front.textContent;
    front.innerHTML = '<span class="spinner" aria-hidden="true"></span>' + texto;
    botao.disabled = true;
    botao.classList.add("carregando");
}

function esconderCarregando(botao) {
    if (!botao) return;
    const front = botao.querySelector(".front");
    front.textContent = botao.dataset.textoOriginal || front.textContent;
    botao.disabled = false;
    botao.classList.remove("carregando");
}

/* =========================================================
   Chamada de API com tratamento completo de respostas
   ========================================================= */

class ErroApi extends Error {
    constructor(mensagem, status) {
        super(mensagem);
        this.status = status;
    }
}

const MENSAGENS_PADRAO_POR_STATUS = {
    400: "Dados inválidos. Verifique os campos preenchidos.",
    401: "Sessão expirada ou não autorizada.",
    403: "Você não tem permissão para realizar essa ação.",
    404: "Usuário não encontrado.",
    409: "Já existe um usuário cadastrado com esses dados.",
    500: "Erro interno no servidor. Tente novamente mais tarde.",
    503: "Serviço indisponível no momento. Tente novamente em instantes."
};

async function chamarApi(url, opcoes) {

    let resposta;

    try {
        resposta = await fetch(url, opcoes);
    } catch (erroDeRede) {
        throw new ErroApi("Não foi possível conectar ao servidor. Verifique se ele está em execução.");
    }

    const texto = await resposta.text();
    let corpo = null;

    try {
        corpo = texto ? JSON.parse(texto) : null;
    } catch (erroDeParse) {
        corpo = null;
    }

    if (resposta.ok) {
        return corpo;
    }

    // Se o backend ainda não responde em JSON ({ "erro": "..." }), ele costuma
    // mandar a mensagem real como texto puro no corpo — usamos ela antes de
    // cair na mensagem genérica, e evitamos mostrar página de erro em HTML.
    const textoPareceUtilizavel = texto && texto.trim() && !/^\s*</.test(texto);

    const mensagem =
        (corpo && (corpo.erro || corpo.mensagem)) ||
        (textoPareceUtilizavel ? texto.trim() : null) ||
        MENSAGENS_PADRAO_POR_STATUS[resposta.status] ||
        `Ocorreu um erro inesperado (código ${resposta.status}).`;

    throw new ErroApi(mensagem, resposta.status);

}

/* =========================================================
   Máscaras e validação (CPF e telefone)
   ========================================================= */

cpf.addEventListener("input", function () {
    let valor = this.value.replace(/\D/g, "").slice(0, 11);

    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    this.value = valor;
    validarCpf();
});

telefone.addEventListener("input", function () {
    let valor = this.value.replace(/\D/g, "").slice(0, 11);

    if (valor.length > 10) {
        valor = valor.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    } else if (valor.length > 5) {
        valor = valor.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else if (valor.length > 2) {
        valor = valor.replace(/(\d{2})(\d{0,5})/, "($1) $2");
    } else if (valor.length > 0) {
        valor = valor.replace(/(\d{0,2})/, "($1");
    }

    this.value = valor.trim();
    validarTelefone();
});

function validarCpf() {
    const digitos = cpf.value.replace(/\D/g, "");
    const valido = digitos.length === 11;

    erroCpf.textContent = digitos.length > 0 && !valido
        ? "CPF deve conter 11 dígitos"
        : "";

    return valido;
}

function validarTelefone() {
    const digitos = telefone.value.replace(/\D/g, "");
    const valido = digitos.length === 10 || digitos.length === 11;

    erroTelefone.textContent = digitos.length > 0 && !valido
        ? "Telefone inválido"
        : "";

    return valido;
}

/* =========================================================
   Seletor de data customizado
   ========================================================= */

const dateField = document.getElementById("dateField");
const dateIconBtn = document.getElementById("dateIconBtn");
const calendarPop = document.getElementById("calendarPop");
const calendarGrid = document.getElementById("calendarGrid");
const calMonth = document.getElementById("calMonth");
const calYear = document.getElementById("calYear");
const calPrev = document.getElementById("calPrev");
const calNext = document.getElementById("calNext");
const calToday = document.getElementById("calToday");

const MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

let dataSelecionada = null;
const hoje = new Date();
let mesVisivel = hoje.getMonth();
let anoVisivel = hoje.getFullYear();

inicializarSeletoresCalendario();
renderizarCalendario();

function inicializarSeletoresCalendario() {

    MESES.forEach(function (mes, indice) {
        const opcao = document.createElement("option");
        opcao.value = indice;
        opcao.textContent = mes;
        calMonth.appendChild(opcao);
    });

    const anoMinimo = hoje.getFullYear() - 100;
    const anoMaximo = hoje.getFullYear();

    for (let ano = anoMaximo; ano >= anoMinimo; ano--) {
        const opcao = document.createElement("option");
        opcao.value = ano;
        opcao.textContent = ano;
        calYear.appendChild(opcao);
    }

}

function renderizarCalendario() {

    calMonth.value = mesVisivel;
    calYear.value = anoVisivel;

    calendarGrid.innerHTML = "";

    const primeiroDiaSemana = new Date(anoVisivel, mesVisivel, 1).getDay();
    const diasNoMes = new Date(anoVisivel, mesVisivel + 1, 0).getDate();
    const diasMesAnterior = new Date(anoVisivel, mesVisivel, 0).getDate();

    for (let i = 0; i < 42; i++) {

        const numeroDia = i - primeiroDiaSemana + 1;

        let diaReal, mesReal, anoReal;

        if (numeroDia < 1) {
            diaReal = diasMesAnterior + numeroDia;
            mesReal = mesVisivel - 1;
            anoReal = anoVisivel;
        } else if (numeroDia > diasNoMes) {
            diaReal = numeroDia - diasNoMes;
            mesReal = mesVisivel + 1;
            anoReal = anoVisivel;
        } else {
            diaReal = numeroDia;
            mesReal = mesVisivel;
            anoReal = anoVisivel;
        }

        if (mesReal < 0) { mesReal = 11; anoReal--; }
        if (mesReal > 11) { mesReal = 0; anoReal++; }

        const dataCelula = new Date(anoReal, mesReal, diaReal);

        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "calendar-dia";
        botao.textContent = diaReal;

        if (numeroDia < 1 || numeroDia > diasNoMes) {
            botao.classList.add("fora-mes");
        }

        if (mesmaData(dataCelula, hoje)) {
            botao.classList.add("hoje");
        }

        if (dataSelecionada && mesmaData(dataCelula, dataSelecionada)) {
            botao.classList.add("selecionado");
        }

        botao.addEventListener("click", function () {
            dataSelecionada = dataCelula;
            mesVisivel = mesReal;
            anoVisivel = anoReal;
            dataNascimento.value = formatarDataBR(dataCelula);
            renderizarCalendario();
            fecharCalendario();
        });

        calendarGrid.appendChild(botao);

    }

}

function mesmaData(a, b) {
    return a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();
}

function formatarDataBR(data) {
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    return `${dia}/${mes}/${data.getFullYear()}`;
}

function formatarDataISO(data) {
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    return `${data.getFullYear()}-${mes}-${dia}`;
}

function isoParaData(iso) {
    if (!iso) return null;
    const [ano, mes, dia] = iso.split("-").map(Number);
    return new Date(ano, mes - 1, dia);
}

function abrirCalendario() {

    if (dataSelecionada) {
        mesVisivel = dataSelecionada.getMonth();
        anoVisivel = dataSelecionada.getFullYear();
    }

    renderizarCalendario();
    calendarPop.classList.add("aberto");

}

function fecharCalendario() {
    calendarPop.classList.remove("aberto");
}

dateIconBtn.addEventListener("click", function (evento) {
    evento.stopPropagation();
    calendarPop.classList.contains("aberto") ? fecharCalendario() : abrirCalendario();
});

dataNascimento.addEventListener("click", function (evento) {
    evento.stopPropagation();
    abrirCalendario();
});

calMonth.addEventListener("change", function () {
    mesVisivel = Number(this.value);
    renderizarCalendario();
});

calYear.addEventListener("change", function () {
    anoVisivel = Number(this.value);
    renderizarCalendario();
});

calPrev.addEventListener("click", function () {
    mesVisivel--;
    if (mesVisivel < 0) { mesVisivel = 11; anoVisivel--; }
    renderizarCalendario();
});

calNext.addEventListener("click", function () {
    mesVisivel++;
    if (mesVisivel > 11) { mesVisivel = 0; anoVisivel++; }
    renderizarCalendario();
});

calToday.addEventListener("click", function () {
    mesVisivel = hoje.getMonth();
    anoVisivel = hoje.getFullYear();
    renderizarCalendario();
});

document.addEventListener("click", function (evento) {
    if (!dateField.contains(evento.target)) {
        fecharCalendario();
    }
});

/* =========================================================
   Esconder / mostrar tabela de usuários
   ========================================================= */

const toggleTabela = document.getElementById("toggleTabela");
const tableCollapse = document.getElementById("tableCollapse");

toggleTabela.addEventListener("click", function () {

    const escondido = tableCollapse.classList.toggle("escondido");

    toggleTabela.classList.toggle("escondido", escondido);
    toggleTabela.setAttribute("aria-expanded", String(!escondido));
    toggleTabela.setAttribute(
        "aria-label",
        escondido ? "Mostrar usuários cadastrados" : "Esconder usuários cadastrados"
    );

});

/* =========================================================
   CRUD
   ========================================================= */

listarUsuarios();

async function listarUsuarios() {

    try {

        const usuarios = await chamarApi(API);

        tabela.innerHTML = "";

        if (!usuarios || usuarios.length === 0) {
            tabela.innerHTML = `<tr><td class="vazio" colspan="7">Nenhum usuário cadastrado ainda.</td></tr>`;
            return;
        }

        usuarios.forEach(usuario => {

            tabela.innerHTML += `
                <tr>
                    <td>${usuario.id}</td>
                    <td>${usuario.nome}</td>
                    <td>${usuario.email}</td>
                    <td>${usuario.cpf}</td>
                    <td>${usuario.telefone}</td>
                    <td>${usuario.dataNascimento}</td>

                    <td>
                        <div class="acoes">
                            <button class="pushable small editar" type="button"
                                onclick="editarUsuario(${usuario.id}, this)">
                                <span class="shadow"></span>
                                <span class="edge"></span>
                                <span class="front">Editar</span>
                            </button>

                            <button class="pushable small excluir" type="button"
                                onclick="excluirUsuario(${usuario.id}, this)">
                                <span class="shadow"></span>
                                <span class="edge"></span>
                                <span class="front">Excluir</span>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

    } catch (erro) {
        tabela.innerHTML = `<tr><td class="vazio" colspan="7">Não foi possível carregar os usuários.</td></tr>`;
        mostrarErro(erro.message);
    }

}

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    if (!validarCpf() || !validarTelefone()) {
        mostrarAviso("Verifique o CPF e o telefone informados antes de continuar.", "Dados inválidos");
        return;
    }

    const usuario = {
        nome: nome.value,
        email: email.value,
        cpf: cpf.value,
        telefone: telefone.value,
        dataNascimento: dataSelecionada ? formatarDataISO(dataSelecionada) : ""
    };

    const criando = id.value === "";

    mostrarCarregando(btnSalvar, criando ? "Salvando..." : "Atualizando...");

    try {

        if (criando) {

            await chamarApi(API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(usuario)
            });

        } else {

            await chamarApi(`${API}/${id.value}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(usuario)
            });

        }

        await mostrarSucesso(
            criando ? "Usuário cadastrado com sucesso!" : "Usuário atualizado com sucesso!"
        );

        limparFormulario();
        listarUsuarios();

    } catch (erro) {
        mostrarErro(erro.message);
    } finally {
        esconderCarregando(btnSalvar);
    }

});

async function editarUsuario(codigo, botao) {

    mostrarCarregando(botao, "Buscando...");

    try {

        const usuario = await chamarApi(`${API}/${codigo}`);

        id.value = usuario.id;
        nome.value = usuario.nome;
        email.value = usuario.email;
        cpf.value = usuario.cpf;
        telefone.value = usuario.telefone;

        dataSelecionada = isoParaData(usuario.dataNascimento);
        dataNascimento.value = dataSelecionada ? formatarDataBR(dataSelecionada) : "";

        if (dataSelecionada) {
            mesVisivel = dataSelecionada.getMonth();
            anoVisivel = dataSelecionada.getFullYear();
        }

        erroCpf.textContent = "";
        erroTelefone.textContent = "";

        window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (erro) {
        mostrarErro(erro.message);
    } finally {
        esconderCarregando(botao);
    }

}

async function excluirUsuario(codigo, botao) {

    const linha = botao.closest("tr");
    const nomeUsuario = linha ? linha.children[1].textContent : "este usuário";

    const confirmou = await confirmarAcao({
        titulo: "Excluir usuário",
        mensagem: `Tem certeza que deseja excluir "${nomeUsuario}"? Esta ação não pode ser desfeita.`,
        textoConfirmar: "Excluir",
        perigo: true
    });

    if (!confirmou) return;

    mostrarCarregando(botao, "Excluindo...");

    try {

        await chamarApi(`${API}/${codigo}`, { method: "DELETE" });

        await mostrarSucesso("Usuário excluído com sucesso!");
        listarUsuarios();

    } catch (erro) {
        mostrarErro(erro.message);
        esconderCarregando(botao);
    }

}

function limparFormulario() {

    id.value = "";
    nome.value = "";
    email.value = "";
    cpf.value = "";
    telefone.value = "";
    dataNascimento.value = "";
    dataSelecionada = null;
    mesVisivel = hoje.getMonth();
    anoVisivel = hoje.getFullYear();
    erroCpf.textContent = "";
    erroTelefone.textContent = "";

}