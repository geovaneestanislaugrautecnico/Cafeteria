const form = document.getElementById("form");
const resultado = document.getElementById("resultado");
const resumo = document.getElementById("resumo");

const cart = JSON.parse(
    localStorage.getItem("breaking_cart") || "[]"
);

const money = (valor) =>
    Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

const total = cart.reduce(
    (soma, item) => soma + item.quantidade * item.preco_unitario,
    0
);

resumo.innerHTML = cart.length
    ? `
        <div class="notice">
            ${cart.length} item(ns) • Total:
            <strong>${money(total)}</strong>
        </div>
    `
    : `
        <div class="notice">
            Carrinho vazio.
            <a href="produtos.html">Escolha produtos.</a>
        </div>
    `;

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!cart.length) {
        return;
    }

    resultado.innerHTML = '<div class="notice">Enviando...</div>';

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const metodo = document.getElementById("metodo").value;
    const obs = document.getElementById("obs").value.trim();

    // 1. Cria o cliente.
    let resultadoCliente = await db
        .from("clientes")
        .insert({
            nome,
            email,
            telefone
        })
        .select("id")
        .single();

    let cliente = resultadoCliente.data;

    // Se o e-mail já existir, busca o cliente existente.
    if (
        resultadoCliente.error &&
        resultadoCliente.error.code === "23505"
    ) {
        resultadoCliente = await db
            .from("clientes")
            .select("id")
            .eq("email", email)
            .single();

        cliente = resultadoCliente.data;
    }

    if (resultadoCliente.error) {
        resultado.innerHTML = `
            <div class="notice">
                Erro no cliente: ${resultadoCliente.error.message}
            </div>
        `;
        return;
    }

    // 2. Cria o pedido.
    resultadoCliente = await db
        .from("pedidos")
        .insert({
            cliente_id: cliente.id,
            status: "pendente",
            observacoes: obs
        })
        .select("id")
        .single();

    if (resultadoCliente.error) {
        resultado.innerHTML = `
            <div class="notice">
                Erro no pedido: ${resultadoCliente.error.message}
            </div>
        `;
        return;
    }

    const pedido = resultadoCliente.data;

    // 3. Cria os itens do pedido.
    const resultadoItens = await db
        .from("itens_pedido")
        .insert(
            cart.map((item) => ({
                pedido_id: pedido.id,
                produto_id: item.produto_id,
                nome_produto: item.nome_produto,
                quantidade: item.quantidade,
                preco_unitario: item.preco_unitario
            }))
        );

    if (resultadoItens.error) {
        resultado.innerHTML = `
            <div class="notice">
                Erro nos itens: ${resultadoItens.error.message}
            </div>
        `;
        return;
    }

    // 4. Registra o pagamento.
    const resultadoPagamento = await db
        .from("pagamentos")
        .insert({
            pedido_id: pedido.id,
            metodo,
            valor: total,
            status: "pendente"
        });

    if (resultadoPagamento.error) {
        resultado.innerHTML = `
            <div class="notice">
                Erro no pagamento: ${resultadoPagamento.error.message}
            </div>
        `;
        return;
    }

    // 5. Limpa o carrinho e informa o sucesso.
    localStorage.removeItem("breaking_cart");
    form.style.display = "none";

    resultado.innerHTML = `
        <div class="notice">
            <h2>Pedido #${pedido.id} registrado!</h2>
            <p>Status: pendente.</p>
            <a class="btn" href="produtos.html">Voltar ao catálogo</a>
        </div>
    `;
});
