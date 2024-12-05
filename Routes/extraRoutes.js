import express from "express";
import axios from "axios";
import Pricings from "../Models/Schemas/pricings.js";

const router = express.Router();

router.get("/extras/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    // Tüm `extra` türündeki belgeleri al
    const extras = await Pricings.find({ type: "extra" });

    // Paket verisini API'den al
    const packageResponse = await axios.get(`https://wabelzapi.fly.dev/api/packages/${slug}`);
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
