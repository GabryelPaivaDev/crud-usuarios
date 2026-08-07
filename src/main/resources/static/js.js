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
   Máscaras (CPF e telefone)
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
   Modal de confirmação (excluir / editar)
   ========================================================= */

const modalOverlay = document.getElementById("modalOverlay");
const modalBox = document.getElementById("modalBox");
const modalIcon = document.getElementById("modalIcon");
const modalIconSvg = document.getElementById("modalIconSvg");
const modalTitulo = document.getElementById("modalTitulo");
const modalMensagem = document.getElementById("modalMensagem");
const modalCancelar = document.getElementById("modalCancelar");
const modalConfirmar = document.getElementById("modalConfirmar");
const modalConfirmarTexto = document.getElementById("modalConfirmarTexto");

const ICONE_EXCLUIR = '<path d="M4 7h16M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m2 0v13a2 2 0 01-2 2H8a2 2 0 01-2-2V7h12zM10 11v6M14 11v6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>';
const ICONE_EDITAR = '<path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>';

function confirmarAcao(opcoes) {

    return new Promise(function (resolve) {

        modalTitulo.textContent = opcoes.titulo;
        modalMensagem.textContent = opcoes.mensagem;
        modalConfirmarTexto.textContent = opcoes.textoConfirmar || "Confirmar";

        modalIconSvg.innerHTML = opcoes.perigo ? ICONE_EXCLUIR : ICONE_EDITAR;
        modalIcon.classList.toggle("perigo", !!opcoes.perigo);
        modalConfirmar.classList.toggle("excluir", !!opcoes.perigo);

        modalOverlay.classList.add("aberto");

        function encerrar(resultado) {
            modalOverlay.classList.remove("aberto");
            modalConfirmar.removeEventListener("click", aoConfirmar);
            modalCancelar.removeEventListener("click", aoCancelar);
            modalOverlay.removeEventListener("click", aoClicarFora);
            document.removeEventListener("keydown", aoTeclaEsc);
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

    const resposta = await fetch(API);
    const usuarios = await resposta.json();

    tabela.innerHTML = "";

    if (usuarios.length === 0) {
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
                            onclick="editarUsuario(${usuario.id})">
                            <span class="shadow"></span>
                            <span class="edge"></span>
                            <span class="front">Editar</span>
                        </button>

                        <button class="pushable small excluir" type="button"
                            onclick="excluirUsuario(${usuario.id})">
                            <span class="shadow"></span>
                            <span class="edge"></span>
                            <span class="front">Excluir</span>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

}

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    if (!validarCpf() || !validarTelefone()) {
        return;
    }

    const usuario = {

        nome: nome.value,
        email: email.value,
        cpf: cpf.value,
        telefone: telefone.value,
        dataNascimento: dataSelecionada ? formatarDataISO(dataSelecionada) : ""

    };

    if (id.value == "") {

        await fetch(API, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(usuario)

        });

        limparFormulario();
        listarUsuarios();

    } else {

        const confirmou = await confirmarAcao({
            titulo: "Confirmar edição",
            mensagem: `Deseja salvar as alterações feitas em "${usuario.nome}"?`,
            textoConfirmar: "Salvar alterações",
            perigo: false
        });

        if (!confirmou) return;

        await fetch(`${API}/${id.value}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(usuario)

        });

        limparFormulario();
        listarUsuarios();

    }

});

async function editarUsuario(codigo) {

    const resposta = await fetch(`${API}/${codigo}`);
    const usuario = await resposta.json();

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

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

async function excluirUsuario(codigo) {

    const linha = document.querySelector(`button.excluir[onclick="excluirUsuario(${codigo})"]`)
        ?.closest("tr");
    const nomeUsuario = linha ? linha.children[1].textContent : "este usuário";

    const confirmou = await confirmarAcao({
        titulo: "Excluir usuário",
        mensagem: `Tem certeza que deseja excluir "${nomeUsuario}"? Esta ação não pode ser desfeita.`,
        textoConfirmar: "Excluir",
        perigo: true
    });

    if (!confirmou) return;

    await fetch(`${API}/${codigo}`, {

        method: "DELETE"

    });

    listarUsuarios();

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
