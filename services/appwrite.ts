import { Client, Databases, ID, Query } from "react-native-appwrite";

const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
  collectionId: process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!,
};

// const DATABASE_ID = "67d151c300289ad96a5e";
// const COLLECTION_ID = "67d1522400271cae53c5";

export const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId);

export const databases = new Databases(client);

export async function updateSearchCount(query: string, movie: Movie) {
  try {
    const result = await databases.listDocuments(
      config.databaseId,
      config.collectionId,
      [Query.equal("searchTerm", query)]
    );

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];

      await databases.updateDocument(
        config.databaseId,
        config.collectionId,
        existingMovie.$id,
        {
          count: existingMovie.count + 1,
        }
      );
    } else {
      await databases.createDocument(
        config.databaseId,
        config.collectionId,
        ID.unique(),
        {
          searchTerm: query,
          movie_id: movie.id,
          count: 1,
          title: movie.title,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }
      );
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getTrendingMovies(): Promise<
  TrendingMovie[] | undefined
> {
  try {
    const result = await databases.listDocuments(
      config.databaseId,
      config.collectionId,
      [Query.limit(5), Query.orderDesc("count")]
    );

    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
