import express from "express";
const router = express.Router();
import Extras from "../Models/Schemas/extras.js";
import axios from "axios";

router.get("/extras/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const extras = await Extras.find();

    const packageResponse = await axios.get(`http://localhost:3000/api/packages/${slug}`);
    const packageData = packageResponse.data;

    // Paket özelliklerini kontrol ederek yalnızca pakette bulunmayan ekstraları döndür
    const filteredExtras = extras.filter(
      (extra) =>
        !extra.featureKey || // featureKey boş ise her zaman dahil edilir
        !packageData.features.some((feature) => feature.name === extra.featureKey) // Pakette mevcut değilse
    );

    res.json(filteredExtras);
  } catch (error) {
    console.error("Error fetching extras:", error);
    res.status(500).json({ message: "Error fetching extras" });
  }
});

export default router;
