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

    gerarEstrelas("stars", 200, 2);
    gerarEstrelas("stars2", 90, 3);
    gerarEstrelas("stars3", 250, 1);
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
        dataNascimento: dataNascimento.value

    };

    if (id.value == "") {

        await fetch(API, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(usuario)

        });

    } else {

        await fetch(`${API}/${id.value}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(usuario)

        });

    }

    limparFormulario();
    listarUsuarios();

});

async function editarUsuario(codigo) {

    const resposta = await fetch(`${API}/${codigo}`);
    const usuario = await resposta.json();

    id.value = usuario.id;
    nome.value = usuario.nome;
    email.value = usuario.email;
    cpf.value = usuario.cpf;
    telefone.value = usuario.telefone;
    dataNascimento.value = usuario.dataNascimento;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

async function excluirUsuario(codigo) {

    const confirmar = confirm("Deseja realmente excluir este usuário?");

    if (!confirmar)
        return;

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
    erroCpf.textContent = "";
    erroTelefone.textContent = "";

}

/* =========================================================
   Campo estrelado (fundo animado)
   ========================================================= */

gerarEstrelas("stars", 200, 2);
gerarEstrelas("stars2", 90, 3);
gerarEstrelas("stars3", 250, 1);

function gerarEstrelas(elementId, quantidade, tamanho) {

    const el = document.getElementById(elementId);
    if (!el) return;

    const largura = 2000;
    const altura = 2000;

    const tema = document.body.getAttribute("data-theme");

    const cor = tema === "light"
        ? "#8b5cf6"
        : "#ffffff";

    const sombras = [];

    for (let i = 0; i < quantidade; i++) {

        const x = Math.floor(Math.random() * largura);
        const y = Math.floor(Math.random() * altura);

        sombras.push(`${x}px ${y}px ${cor}`);
    }

    const boxShadow = sombras.join(", ");

    el.style.width = tamanho + "px";
    el.style.height = tamanho + "px";
    el.style.boxShadow = boxShadow;

    const antigo = document.getElementById(elementId + "-style");
    if (antigo) antigo.remove();

    const style = document.createElement("style");
    style.id = elementId + "-style";

    style.textContent = `
        #${elementId}::after{
            content:"";
            position:absolute;
            top:${altura}px;
            width:${tamanho}px;
            height:${tamanho}px;
            background:transparent;
            box-shadow:${boxShadow};
        }
    `;

    document.head.appendChild(style);
}