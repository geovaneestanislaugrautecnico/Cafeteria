const SUPABASE_URL = "https://gbnmwrbssqvuxyekofgy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_8VSzL4giDkBVlLXqCcONdA_wfHb3pET";

const { createClient } = window.supabase;
const db = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
