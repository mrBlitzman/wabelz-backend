import express from "express";
const router = express.Router();
import Pricings from "../Models/Schemas/pricings.js";

// Tüm paketleri al
router.get("/packages", async (req, res) => {
  try {
    // Sadece `type: "package"` olan belgeleri getir
    const allPackages = await Pricings.find({ type: "package" });
    res.json(allPackages);
  } catch (err) {
    res.status(500).json({ definition: "Packages fetching error", message: err.message });
  }
});

// Belirli bir paketi `slug` ile al
router.get("/packages/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    // `type: "package"` ile eşleşen ve `slug` değerine uyan belgeyi bul
    const foundPackage = await Pricings.findOne({ type: "package", slug: slug });
    
    if (!foundPackage) {
      return res.status(404).json({ definition: "Package not found", message: "No package found with the given slug." });
    }

    res.json(foundPackage);
  } catch (err) {
    res.status(500).json({ definition: "Package fetching error", message: err.message });
  }
});

export default router;
