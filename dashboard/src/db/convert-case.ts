const fs = require('fs');
const filepath = 'src/db/schema.ts';

const schemaContent = fs.readFileSync(filepath, 'utf-8');

const updatedSchema = schemaContent.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()
    .replace(/primary_key/g, 'primaryKey')
    .replace(/unique_index/g, 'uniqueIndex')
    .replace(/not_null/g, 'notNull')
    .replace(/nulls_first/g, 'nullsFirst')
    .replace(/nulls_last/g, 'nullsLast')
    .replace(/foreign_key/g, 'foreignKey')
    .replace(/on_update/g, 'onUpdate')
    .replace(/on_delete/g, 'onDelete')
    .replace(/pg_table/g, 'pgTable')
    .replace(/foreign_columns/g, 'foreignColumns');

fs.writeFileSync(filepath, updatedSchema);
