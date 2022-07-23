import table, { filterFields, findCoffeStoreById } from "../../lib/airtable";


// this will increament vote of a specific coffee store
const favouriteCoffeeStoreById = async (req, res) => {
  if (req.method === "PUT") {
    const { id } = JSON.parse(req.body);

    try {
      let foundStore = await findCoffeStoreById(id);

      if (foundStore.length !== 0) {
        foundStore = foundStore[0];
        const calculateVoting = parseInt(foundStore.vote) + 1;

        const updatedVote = await table.update([
          {
            id: foundStore.recordId,
            fields: {
              vote: calculateVoting,
            },
          },
        ]);

        if(updatedVote) {
          res.json(filterFields(updatedVote));
        }
      } else {
        return res.status(400).json({ message: "store not found" });
      }
    } catch (error) {
      console.log("error updating vote count", error);
      return res.status(500).json({ message: "something went wrong" });
    }
  } else {
    return res.json({ message: "wrong http mehtod , PUT expected" });
  }
};

export default favouriteCoffeeStoreById;
