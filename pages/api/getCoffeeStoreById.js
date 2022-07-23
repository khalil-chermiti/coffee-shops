import { findCoffeStoreById } from "../../lib/airtable";

const getCoffeeStoreById = async (req, res) => {
  const { id } = req.query;
  try {
    if (id) {
      // fetch store from airtable
      const foundStore = await findCoffeStoreById(id) ;
      
      if(foundStore.length) 
        return res.status(200).json(foundStore);
      else {
        res.json({ message: "store not found" });
      }

    } else {
      res.json({ message: "id is missing" });
    }

  } catch (err) {
    console.log(err)
    res.status(500);
    res.json({ message: "something went wrong"});
  }
};

export default getCoffeeStoreById;
