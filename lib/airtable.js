import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_SECRET_KEY }).base(
  process.env.AIRTABLE_BASE_KEY
);

const table = base("stores");

export default table;

export const filterFields = resultsArray => {
  return resultsArray.map(el => (
    { 
      ...el.fields, // fields object for each record
      recordId: el.id // record id
    }
  ));
};

export const findCoffeStoreById = async id => {
  const foundStores = await table
    .select({ filterByFormula: `id="${id}"` })
    .firstPage();

  return filterFields(foundStores);
};
