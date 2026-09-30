const el = document.getElementById("produtos");
const busca = document.getElementById("busca");
const categoria = document.getElementById("categoria");

let produtos = [];
let categorias = [];

const money = (valor) =>
    Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

const cart = () =>
    JSON.parse(localStorage.getItem("breaking_cart") || "[]");

function qtd() {
    document.getElementById("qtdCarrinho").textContent = cart()
        .reduce((total, item) => total + item.quantidade, 0);
}

function render() {
    const termo = busca.value.toLowerCase();
    const categoriaSelecionada = categoria.value;

    const lista = produtos.filter(
        (produto) =>
            (!categoriaSelecionada ||
                String(produto.categoria_id) === categoriaSelecionada) &&
            produto.nome.toLowerCase().includes(termo)
    );

    el.innerHTML = lista.length
        ? lista
              .map(
                  (produto) => `
                    <article class="card">
                        <h3>${produto.nome}</h3>
                        <p>${produto.descricao}</p>
                        <p class="price">${money(produto.preco)}</p>
                        <button class="btn" onclick="add(${produto.id})">
                            Adicionar
                        </button>
                    </article>
                `
              )
              .join("")
        : '<div class="empty">Nenhum produto encontrado.</div>';
}

window.add = (id) => {
    const produto = produtos.find((item) => item.id === id);
    const carrinho = cart();
    const itemExistente = carrinho.find((item) => item.produto_id === id);

    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({
            produto_id: produto.id,
            nome_produto: produto.nome,
            quantidade: 1,
            preco_unitario: Number(produto.preco)
        });
    }

    localStorage.setItem("breaking_cart", JSON.stringify(carrinho));
    qtd();
};

async function init() {
    const [resultadoProdutos, resultadoCategorias] = await Promise.all([
        db
            .from("produtos")
            .select("id,categoria_id,nome,descricao,preco")
            .eq("disponivel", true)
            .order("id"),

        db
            .from("categorias")
            .select("id,nome")
            .eq("ativo", true)
            .order("nome")
    ]);

    if (resultadoProdutos.error || resultadoCategorias.error) {
        el.innerHTML =
            '<div class="notice">Erro no Supabase. Confira js/supabase.js.</div>';
        return;
    }

    produtos = resultadoProdutos.data;
    categorias = resultadoCategorias.data;

    categoria.innerHTML += categorias
        .map(
            (item) => `<option value="${item.id}">${item.nome}</option>`
        )
        .join("");

    render();
    qtd();
}

busca.addEventListener("input", render);
categoria.addEventListener("change", render);

init();
