import express from "express";
import axios from "axios";
import Pricings from "../Models/Schemas/pricings.js";

const router = express.Router();

router.get("/info/items", async (req, res) => {
  try {
    const pricingDocuments = await Pricings.find({});

    const quantities = {};
    const elements = {};

    pricingDocuments.forEach((doc) => {
      if (doc.type === "quantity") {
        quantities[doc.featureKey] = {
          id: doc.id,
          featureKey: doc.featureKey,
          price: doc.price,
          type: doc.type,
          title: doc.title,
        };
      } else if (doc.type === "element") {
        elements[doc.featureKey] = {
          id: doc.id,
          featureKey: doc.featureKey,
          price: doc.price,
          type: doc.type,
          title: doc.title,
        };
      }
    });

    res.json({ quantities, elements });
  } catch (error) {
    console.error("Error fetching pricing data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/info/extras/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const extras = await Pricings.find({ type: "extra" });
    const extrasData = extras.map(({ id, type, title, price, featureKey }) => ({
      id,
      type,
      title,
      price,
      featureKey,
    }));

    const packageResponse = await axios.get(`${process.env.API_ORIGIN}/api/info/packages/${slug}`);
    const packageData = packageResponse.data;

    const filteredExtras = extrasData.filter(
      (extra) =>
        !extra.featureKey ||
        !packageData.features.some((feature) => feature.featureKey === extra.featureKey)
    );

    res.json(filteredExtras);
  } catch (error) {
    console.error("Error fetching extras:", error);
    res.status(500).json({ message: "Error fetching extras" });
  }
});

router.get("/info/packages", async (req, res) => {
  try {
    const allPackages = await Pricings.find({ type: "package" });
    res.json(allPackages);
  } catch (err) {
    res.status(500).json({ definition: "Packages fetching error", message: err.message });
  }
});

router.get("/info/packages/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
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
