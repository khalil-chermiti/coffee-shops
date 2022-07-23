import fetchCoffeStoresData from "../../lib/coffee-store";

const getCoffeeStores = async (req, res) => {
  const { latLong, limit } = req.query;

  try {
    const response = await fetchCoffeStoresData(latLong, limit);
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500);
    res.json({ message: "oh! no something went wrong" });
  }
};

export default getCoffeeStores;
