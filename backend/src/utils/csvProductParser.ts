import fs from "fs";
import csv from "csv-parser";

export interface CsvProductRow {
  name: string;
  description?: string;
  price: string;
  stock: string;
  image: string;
  category?: string;
}

export const parseProductCsv = async (
  csvPath: string,
): Promise<CsvProductRow[]> => {
  const rows: CsvProductRow[] = [];

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on("data", (row) => {
        rows.push(row as CsvProductRow);
      })
      .on("end", () => resolve())
      .on("error", reject);
  });

  return rows;
};
