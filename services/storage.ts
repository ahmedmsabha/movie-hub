import AsyncStorage from "@react-native-async-storage/async-storage";

const BOOKMARKS_STORAGE_KEY = "movie_hub_bookmarks";

export const getBookmarks = async (): Promise<StoredBookmark[]> => {
  try {
    const bookmarksJson = await AsyncStorage.getItem(BOOKMARKS_STORAGE_KEY);
    if (!bookmarksJson) return [];
    return JSON.parse(bookmarksJson);
  } catch (error) {
    console.error("Error getting bookmarks from storage:", error);
    return [];
  }
};

export const addBookmark = async (movie: Movie): Promise<void> => {
  try {
    const bookmarks = await getBookmarks();

    const exists = bookmarks.some(
      (bookmark) => bookmark.movie_id === movie.id.toString()
    );
    if (exists) return;

    const newBookmark: StoredBookmark = {
      id: Date.now().toString(),
      movie_id: movie.id.toString(),
      title: movie.title,
      poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      created_at: new Date().toISOString(),
    };

    await AsyncStorage.setItem(
      BOOKMARKS_STORAGE_KEY,
      JSON.stringify([...bookmarks, newBookmark])
    );
  } catch (error) {
    console.error("Error adding bookmark to storage:", error);
    throw error;
  }
};

export const removeBookmark = async (movieId: string): Promise<void> => {
  try {
    const bookmarks = await getBookmarks();
    const updatedBookmarks = bookmarks.filter(
      (bookmark) => bookmark.movie_id !== movieId
    );

    await AsyncStorage.setItem(
      BOOKMARKS_STORAGE_KEY,
      JSON.stringify(updatedBookmarks)
    );
  } catch (error) {
    console.error("Error removing bookmark from storage:", error);
    throw error;
  }
};

export const isBookmarked = async (movieId: string): Promise<boolean> => {
  try {
    const bookmarks = await getBookmarks();
    return bookmarks.some((bookmark) => bookmark.movie_id === movieId);
  } catch (error) {
    console.error("Error checking bookmark status:", error);
    return false;
  }
};

export const getBookmarkCount = async (): Promise<number> => {
  try {
    const bookmarks = await getBookmarks();
    return bookmarks.length;
  } catch (error) {
    console.error("Error getting bookmark count:", error);
    return 0;
  }
};
