const { createClient } = require("@supabase/supabase-js");
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const UserService = {
    
  async createUserProfile(userId, correo, nombre) {
    const { data, error } = await supabase
      .from("usuarios")
      .insert([
        { id: userId, correo: correo, nombre: nombre },
      ])
      .select("*");

    if (error) throw new Error(error.message);
    return data[0];
  },

  async getUserProfile(userId) {
        const { data, error } = await supabase
            .from("usuarios")
            .select("*")
            .eq("id", userId)
            .single();

        if (error) throw new Error(`Error al obtener perfil: ${error.message}`);
        return data;
    },

  async updateUserProfile(userId, updates) {
    const { data, error } = await supabase
      .from("usuarios")
      .update(updates)
      .eq("id", userId)
      .single();

    if (error) throw new Error(error.message);
    console.log(data)
    return;
  },

  async getIdByEmail(email) {
    const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("correo", email)
        .single();

    if (error) throw new Error(`Error al obtener perfil: ${error.message}`);
    return data.id;
},

};

module.exports = UserService;
