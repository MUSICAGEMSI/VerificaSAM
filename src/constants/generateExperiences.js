const fs = require("fs");
const https = require("https");
const csv = require("csv-parser");

const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJqlG7xJhthlPfWhSWBGf6qtYP2uhfVTtPk6uJz2i3oCWbUTdU0rbLy7uWGSb8lQ/pub?gid=750632160&single=true&output=csv";

function fetchCSV(url) {
  return new Promise((resolve, reject) => {
    const results = [];
    https.get(url, (res) => {
      res.pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", () => resolve(results))
        .on("error", reject);
    });
  });
}

function formatToJS(experiences) {
  return `export const experiences = ${JSON.stringify(
    experiences.map((row) => ({
      title: row["POLO"] || "",
      company_name: row["CURSO"] || "",
      icon: null,
      iconBg: "#161329",
      date: `${row["DATA INÍCIO"] || ""} - ${row["DATA FIM"] || ""}`,
      points: [
        `Instrumento: ${row["INSTRUMENTO"] || ""}`,
        `Dia: ${row["DIA"] || ""}`,
        `Hora: ${row["HORÁRIO"] || ""}`,
        `Matriculados: ${row["MATRICULADOS"] || ""}`,
        `Lançamento Pendente: ${row["LANÇAMENTO PENDENTE"] || ""}`,
        `Lançamento Inválido: ${row["LANÇAMENTO INVÁLIDO"] || ""}`,
      ],
    })),
    null,
    2
  )};`;
}

async function main() {
  try {
    const csvData = await fetchCSV(csvUrl);
    const jsContent = formatToJS(csvData);

    const targetPath = "./src/constants/experiences.js";
    fs.writeFileSync(targetPath, jsContent);
    console.log(`✅ Arquivo ${targetPath} gerado com sucesso!`);
  } catch (error) {
    console.error("Erro ao gerar experiences.js:", error);
  }
}

main();
