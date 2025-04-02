const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// 🟢 Create Category
exports.createCategory = async (req, res) => {
  try {
    const { name, recovery_fee } = req.body;
    if (!name || recovery_fee == null) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const { data, error } = await supabase
      .from("id_categories") // ✅ Fixed table name
      .insert([{ name, recovery_fee }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: "Category created successfully", category: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🟢 Get All Categories
exports.getCategories = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("id_categories") // ✅ Fixed table name
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🟢 Update Category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, recovery_fee } = req.body;

    if (!id || !name || recovery_fee == null) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const { data, error } = await supabase
      .from("id_categories") // ✅ Fixed table name
      .update({ name, recovery_fee })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({ message: "Category updated successfully", category: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🟢 Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Category ID is required" });

    const { error } = await supabase.from("id_categories").delete().eq("id", id);

    if (error) throw error;

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
