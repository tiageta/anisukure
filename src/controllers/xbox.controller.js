import { searchXboxGames } from "../services/index.js";

export default {
  search: async (req, res) => {
    try {
      const searchResults = await searchXboxGames();
      if (searchResults === undefined)
        return res.status(404).json({ message: "No games found" });
      else if (searchResults === null)
        return res.status(404).json({ message: "Some problem occurred" });
      res.status(200).json({ games: searchResults });
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },
};
