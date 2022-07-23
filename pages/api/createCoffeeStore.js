import table, { filterFields ,findCoffeStoreById } from "../../lib/airtable";

const createCoffeeStore = async (req, res) => {
  const { id, name, address, neighbourhood, imgUrl, vote } = JSON.parse(req.body) ;
  try {
    const foundStores = await findCoffeStoreById(id) ;

    if (foundStores.length) 
      return res.status(200).json(foundStores);
      
    // creating a new store
    if (name && id) {
      let createdRecods = await table.create([{
          fields: {
            id,
            name,
            address,
            neighbourhood,
            vote,
            imgUrl,
          }
        }
      ]);

      // filtering response data object
      createdRecods = filterFields(createdRecods);

      res.json({
        message: "created a record",
        records: createdRecods,
      });

    } else {
      return res.status(403).json({ message: "name and id are required" });
    }
    
  } catch (err) {
    console.log("error creating record : ", err);
    res.status(500).json("error creating record ");
  }
};

export default createCoffeeStore;