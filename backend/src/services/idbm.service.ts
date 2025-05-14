import axios from 'axios';

export const getIMDbRating = async (movieTitle:string) => {
  try {
    const { data } = await axios.get(`https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&t=${encodeURIComponent(movieTitle)}`);
    if (data.Response === 'True') {
      return { rating: data.imdbRating, votes: data.imdbVotes };
    } else {
      throw new Error( 'Movie not found' );
    }
  } catch (err) {
    throw err;
  }
}
