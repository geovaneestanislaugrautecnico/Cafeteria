# Breaking Orders

Projeto educacional de e-commerce fictício com GitHub Pages + Supabase.

## Passos
1. Crie o projeto no Supabase.
2. Execute `supabase.sql` no SQL Editor.
3. Copie URL e chave PUBLICÁVEL para `js/supabase.js`.
4. Suba os arquivos para um repositório GitHub.
5. Ative GitHub Pages na branch `main`.

## Base inicial
30 clientes, 10 categorias, 100 produtos, 100 pedidos, 200 itens e 100 pagamentos.

## Segurança
Nunca use a `service_role` key no navegador. Esta versão usa checkout anônimo apenas para fins didáticos. Para produção, use Supabase Auth e RLS vinculada ao usuário.
