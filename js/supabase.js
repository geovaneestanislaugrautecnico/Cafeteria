// NÃO coloque a service_role key aqui.
const SUPABASE_URL = "COLE_AQUI_A_URL_DO_SEU_PROJETO";
const SUPABASE_PUBLISHABLE_KEY = "COLE_AQUI_A_CHAVE_PUBLICAVEL";
const { createClient } = window.supabase;
const db = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
