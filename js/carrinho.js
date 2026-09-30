const el = document.getElementById("carrinho");

const money = (valor) =>
    Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

const get = () =>
    JSON.parse(localStorage.getItem("breaking_cart") || "[]");

function render() {
    const carrinho = get();

    if (!carrinho.length) {
        el.innerHTML = `
            <div class="empty">
                Carrinho vazio.
                <br><br>
                <a class="btn" href="produtos.html">Voltar</a>
            </div>
        `;
        return;
    }

    const total = carrinho.reduce(
        (soma, item) => soma + item.quantidade * item.preco_unitario,
        0
    );

    el.innerHTML = `
        <table class="table">
            <tr>
                <th>Produto</th>
                <th>Qtd.</th>
                <th>Preço</th>
                <th>Subtotal</th>
                <th></th>
            </tr>

            ${carrinho
                .map(
                    (item, indice) => `
                        <tr>
                            <td>${item.nome_produto}</td>
                            <td>${item.quantidade}</td>
                            <td>${money(item.preco_unitario)}</td>
                            <td>${money(item.quantidade * item.preco_unitario)}</td>
                            <td>
                                <button
                                    class="btn secondary"
                                    onclick="removeItem(${indice})"
                                >
                                    Remover
                                </button>
                            </td>
                        </tr>
                    `
                )
                .join("")}
        </table>

        <h2>Total: ${money(total)}</h2>

        <a class="btn" href="checkout.html">
            Finalizar pedido
        </a>
    `;
}

window.removeItem = (indice) => {
    const carrinho = get();

    carrinho.splice(indice, 1);

    localStorage.setItem(
        "breaking_cart",
        JSON.stringify(carrinho)
    );

    render();
};

render();
