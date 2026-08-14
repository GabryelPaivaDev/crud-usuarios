const API_AUTH = "/auth";
const campo = id => document.getElementById(id);

function salvarSessao(dados) { localStorage.setItem("sessao", JSON.stringify(dados)); }
function mensagem(texto, erro = false) { const el = document.getElementById("authFeedback"); el.textContent = texto; el.classList.toggle("erro", erro); }
function somenteNumeros(valor) { return valor.replace(/\D/g, ""); }
function redirecionar(dados) { window.location.href = dados.perfil === "ADMIN" ? "admin.html" : "usuario.html"; }

try { const sessao = JSON.parse(localStorage.getItem("sessao")); if (sessao) redirecionar(sessao); } catch (_) { localStorage.removeItem("sessao"); }

const themeToggle = document.getElementById("themeToggle");
function aplicarTema(tema) { document.body.dataset.theme = tema; themeToggle.checked = tema === "light"; localStorage.setItem("tema", tema); }
aplicarTema(localStorage.getItem("tema") || "dark");
themeToggle.addEventListener("change", () => aplicarTema(themeToggle.checked ? "light" : "dark"));

document.querySelectorAll(".password-toggle").forEach(botao => {
    botao.addEventListener("click", () => {
        const input = botao.previousElementSibling;
        const mostrar = input.type === "password";
        input.type = mostrar ? "text" : "password";
        botao.classList.toggle("visivel", mostrar);
        botao.setAttribute("aria-pressed", String(mostrar));
        botao.setAttribute("aria-label", mostrar ? "Ocultar senha" : "Mostrar senha");
        input.focus({ preventScroll: true });
    });
});

/* O mesmo calendário personalizado usado pelo painel administrativo. */
const mesesCalendario = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
function instalarCalendario(idInput) {
    const input = campo(idInput);
    const area = input.closest(".date-login-control");
    const hoje = new Date();
    let mes = hoje.getMonth(), ano = hoje.getFullYear(), selecionada = null;
    const pop = area.querySelector(".calendar-pop"), grade = area.querySelector(".calendar-grid");
    const seletorMes = area.querySelector(".cal-month"), seletorAno = area.querySelector(".cal-year");
    mesesCalendario.forEach((nome, indice) => seletorMes.add(new Option(nome, indice)));
    for (let valor = hoje.getFullYear(); valor >= hoje.getFullYear() - 100; valor--) seletorAno.add(new Option(valor, valor));
    const mesmaData = (a, b) => a && b && a.toDateString() === b.toDateString();
    const iso = data => `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`;
    const br = data => `${String(data.getDate()).padStart(2, "0")}/${String(data.getMonth() + 1).padStart(2, "0")}/${data.getFullYear()}`;
    function lerDataDigitada(valor) {
        const partes = valor.split("/").map(Number);
        if (partes.length !== 3 || String(partes[2]).length !== 4) return null;
        const data = new Date(partes[2], partes[1] - 1, partes[0]);
        return data.getFullYear() === partes[2] && data.getMonth() === partes[1] - 1 && data.getDate() === partes[0] && data <= hoje ? data : null;
    }
    function renderizar() {
        seletorMes.value = mes; seletorAno.value = ano; grade.innerHTML = "";
        const primeiro = new Date(ano, mes, 1).getDay(), total = new Date(ano, mes + 1, 0).getDate(), anterior = new Date(ano, mes, 0).getDate();
        for (let indice = 0; indice < 42; indice++) {
            const numero = indice - primeiro + 1; let data;
            if (numero < 1) data = new Date(ano, mes - 1, anterior + numero);
            else if (numero > total) data = new Date(ano, mes + 1, numero - total);
            else data = new Date(ano, mes, numero);
            const botao = document.createElement("button"); botao.type = "button"; botao.className = "calendar-dia"; botao.textContent = data.getDate();
            if (data.getMonth() !== mes) botao.classList.add("fora-mes");
            if (mesmaData(data, hoje)) botao.classList.add("hoje");
            if (mesmaData(data, selecionada)) botao.classList.add("selecionado");
            botao.addEventListener("click", () => { selecionada = data; mes = data.getMonth(); ano = data.getFullYear(); input.value = br(data); input.dataset.iso = iso(data); input.setCustomValidity(""); fechar(); });
            grade.appendChild(botao);
        }
    }
    function abrir() { if (selecionada) { mes = selecionada.getMonth(); ano = selecionada.getFullYear(); } renderizar(); pop.classList.add("aberto"); }
    function fechar() { pop.classList.remove("aberto"); }
    input.addEventListener("input", () => {
        const digitos = input.value.replace(/\D/g, "").slice(0, 8);
        input.value = digitos.replace(/^(\d{2})(\d)/, "$1/$2").replace(/^(\d{2}\/\d{2})(\d)/, "$1/$2");
        selecionada = lerDataDigitada(input.value);
        input.dataset.iso = selecionada ? iso(selecionada) : "";
        input.setCustomValidity(digitos.length === 8 && !selecionada ? "Informe uma data válida." : "");
        if (selecionada) { mes = selecionada.getMonth(); ano = selecionada.getFullYear(); }
    });
    area.querySelector(".date-icon-btn").addEventListener("click", evento => { evento.stopPropagation(); pop.classList.contains("aberto") ? fechar() : abrir(); });
    seletorMes.addEventListener("change", () => { mes = Number(seletorMes.value); renderizar(); }); seletorAno.addEventListener("change", () => { ano = Number(seletorAno.value); renderizar(); });
    area.querySelector(".cal-prev").addEventListener("click", () => { mes--; if (mes < 0) { mes = 11; ano--; } renderizar(); }); area.querySelector(".cal-next").addEventListener("click", () => { mes++; if (mes > 11) { mes = 0; ano++; } renderizar(); }); area.querySelector(".calendar-today").addEventListener("click", () => { selecionada = hoje; mes = hoje.getMonth(); ano = hoje.getFullYear(); input.value = br(hoje); input.dataset.iso = iso(hoje); input.setCustomValidity(""); renderizar(); fechar(); });
    document.addEventListener("click", evento => { if (!area.contains(evento.target)) fechar(); });
}
instalarCalendario("cadNascimento");
instalarCalendario("recNascimento");

document.querySelectorAll("[data-view]").forEach(botao => botao.addEventListener("click", () => {
    document.querySelectorAll(".auth-view").forEach(view => view.classList.remove("active"));
    document.getElementById(botao.dataset.view).classList.add("active");
    mensagem("");
}));

const esperar = milissegundos => new Promise(resolve => setTimeout(resolve, milissegundos));

async function requisicao(url, opcoes) {
    const resposta = await fetch(url, opcoes);
    const texto = await resposta.text();
    let corpo = null; try { corpo = texto ? JSON.parse(texto) : null; } catch (_) { throw new Error("Resposta inválida do servidor."); }
    if (!resposta.ok) throw new Error(corpo?.erro || "Não foi possível concluir a operação.");
    return corpo;
}

function bloquear(form, bloqueado) { const botao = form.querySelector("button[type=submit]"); botao.disabled = bloqueado; botao.classList.toggle("loading", bloqueado); document.getElementById("pencilLoader").classList.toggle("aberto", bloqueado); }

document.getElementById("formLogin").addEventListener("submit", async evento => {
    evento.preventDefault(); const form = evento.currentTarget; bloquear(form, true); mensagem("");
    try { const dados = await requisicao(`${API_AUTH}/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: campo("loginEmail").value, senha: campo("loginSenha").value }) }); salvarSessao(dados); await esperar(700); redirecionar(dados); }
    catch (erro) { mensagem(erro.message, true); bloquear(form, false); }
});

document.getElementById("formRegister").addEventListener("submit", async evento => {
    evento.preventDefault(); const form = evento.currentTarget; bloquear(form, true); mensagem("");
    try {
        const dados = await requisicao(`${API_AUTH}/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nome: campo("cadNome").value.trim(), email: campo("cadEmail").value.trim(), senha: campo("cadSenha").value, cpf: somenteNumeros(campo("cadCpf").value), telefone: somenteNumeros(campo("cadTelefone").value), dataNascimento: campo("cadNascimento").dataset.iso }) });
        salvarSessao(dados); await esperar(700); redirecionar(dados);
    } catch (erro) { mensagem(erro.message, true); bloquear(form, false); }
});

document.getElementById("formRecovery").addEventListener("submit", async evento => {
    evento.preventDefault(); const form = evento.currentTarget; bloquear(form, true); mensagem("");
    try { await requisicao(`${API_AUTH}/password`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: campo("recEmail").value.trim(), cpf: somenteNumeros(campo("recCpf").value), dataNascimento: campo("recNascimento").dataset.iso, novaSenha: campo("recSenha").value }) }); mensagem("Senha redefinida. Agora você já pode entrar."); form.reset(); }
    catch (erro) { mensagem(erro.message, true); } finally { bloquear(form, false); }
});

function aplicarMascara(id, formato) { document.getElementById(id).addEventListener("input", e => e.target.value = formato(somenteNumeros(e.target.value))); }
aplicarMascara("cadCpf", v => v.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2"));
aplicarMascara("recCpf", v => v.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2"));
aplicarMascara("cadTelefone", v => v.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2"));
