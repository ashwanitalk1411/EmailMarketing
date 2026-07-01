const fs = require('fs');
const { parse } = require('csv-parse/sync');
const { isValidEmail } = require('./emailHelper');

const parseContactsCsv = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
  });

  return records.map((row) => {
    const keys = Object.keys(row);
    const nameKey = keys.find((k) => /name/i.test(k)) || keys[0];
    const emailKey = keys.find((k) => /email/i.test(k)) || keys[1];

    return {
      name: (row[nameKey] || '').trim(),
      email: (row[emailKey] || '').trim().toLowerCase(),
    };
  });
};

const processImportRecords = (records, existingEmails) => {
  const summary = { total: records.length, saved: 0, skipped: 0, invalid: 0 };
  const toInsert = [];
  const seenInFile = new Set();

  for (const record of records) {
    if (!record.email || !isValidEmail(record.email)) {
      summary.invalid++;
      continue;
    }

    if (seenInFile.has(record.email) || existingEmails.has(record.email)) {
      summary.skipped++;
      continue;
    }

    seenInFile.add(record.email);
    toInsert.push({
      name: record.name || record.email.split('@')[0],
      email: record.email,
    });
    summary.saved++;
  }

  return { toInsert, summary };
};

module.exports = { parseContactsCsv, processImportRecords };
