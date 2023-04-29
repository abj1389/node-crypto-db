const express = require("express");

// Modelos
const { Crypto } = require("../models/Crypto.js");

const router = express.Router();

const convertJsonToCsv = (jsonData) => {
  let csv = "";
  console.log("jsonData.data[0]");
  console.log(jsonData.data[0]);
  // Encabezados
  const firstItemInJson = jsonData.data[0];
  const headers = Object.keys(firstItemInJson.toObject());
  console.log("headers");
  console.log(JSON.stringify(headers));
  csv = csv + headers.join(";") + "; \n";
  console.log("csv header");
  console.log(csv);

  // Datos

  // Recorremos cada fila
  jsonData.data.forEach((item) => {
    // Dentro de cada fila recorremos todas las propiedades
    headers.forEach((header) => {
      csv = csv + item[header] + ";";
    });
    csv = csv + "\n";
  });
  console.log("csv final");
  console.log(csv);
  return csv;
};

// CRUD: READ
router.get("/csv", async (req, res) => {
  try {
    // Asi leemos query params
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const cryptos = await Crypto.find()
      .limit(limit)
      .skip((page - 1) * limit);

    // Num total de elementos
    const totalElements = await Crypto.countDocuments();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: cryptos,
    };
    console.log("response");
    console.log(response);
    res.send(convertJsonToCsv(response), "text/csv", "UTF-8");
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// CRUD: READ
router.get("/", async (req, res) => {
  try {
    // Asi leemos query params
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const cryptos = await Crypto.find()
      .limit(limit)
      .skip((page - 1) * limit);

    // Num total de elementos
    const totalElements = await Crypto.countDocuments();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: cryptos,
    };
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

router.get("/sorted-by-marketCap", async (req, res) => {
  try {
    // Asi leemos query params
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const cryptos = await Crypto.find()
      .limit(limit)
      .skip((page - 1) * limit);

    // Num total de elementos
    const totalElements = await Crypto.countDocuments();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: cryptos,
    };

    response.data = response.data.sort((a, b) => (a.marketCap < b.marketCap ? 1 : -1));
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// CRUD: READ
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const crypto = await Crypto.findById(id);
    if (crypto) {
      res.json(crypto);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

router.get("/:name", async (req, res) => {
  const name = req.params.name;

  try {
    const crypto = await Crypto.find({ name: new RegExp("^" + name.toLowerCase(), "i") });
    if (crypto?.length) {
      res.json(crypto);
    } else {
      res.status(404).json([]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// CRUD: CREATE
router.post("/", async (req, res) => {
  try {
    const date = new Date();
    const crypto = new Crypto({
      name: req.body.name,
      price: req.body.price,
      marketCap: req.body.marketCap,
      created_at: date.toISOString(),
    });

    const createdCrypto = await crypto.save();
    return res.status(201).json(createdCrypto);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// CRUD: DELETE
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const cryptoDeleted = await Crypto.findByIdAndDelete(id);
    if (cryptoDeleted) {
      res.json(cryptoDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// CRUD: UPDATE
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const cryptoUpdated = await Crypto.findByIdAndUpdate(id, req.body, { new: true });
    if (cryptoUpdated) {
      res.json(cryptoUpdated);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

module.exports = { cryptoRouter: router };
