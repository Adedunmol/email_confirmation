

const getAllMovies = (req, res) => {
    res.status(200).json({ movies: movies });
}

const createNewMovie = async (req, res) => {
    try {
        const { name, rating } = req.body;

        if (!name || !rating) return res.status(400).json({ message: "body does not include name or rating" })

        const movie = {
            "id":  1,
            "movie name": name,
            "rating": rating
        }

        return res.status(200).json(movie);

    }catch (err) {
        console.log(err)
    }
}

module.exports = {
    getAllMovies,
    createNewMovie
};