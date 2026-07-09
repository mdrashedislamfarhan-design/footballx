// ─── AniList GraphQL Service ────────────────────────────────────────────────
// Free API — no key needed
// Docs: https://anilist.gitbook.io/anilist-apiv2-docs/

const ANILIST_URL = 'https://graphql.anilist.co';

export interface AnimeMedia {
  id: number;
  idMal: number | null;
  title: { romaji: string; english: string | null; native: string };
  coverImage: { large: string; extraLarge: string; color: string | null };
  bannerImage: string | null;
  description: string | null;
  episodes: number | null;
  averageScore: number | null;
  popularity: number;
  genres: string[];
  status: 'FINISHED' | 'RELEASING' | 'NOT_YET_RELEASED' | 'CANCELLED' | 'HIATUS';
  season: string | null;
  seasonYear: number | null;
  format: string | null;
  studios: { nodes: { name: string }[] };
  nextAiringEpisode: { episode: number; timeUntilAiring: number } | null;
  trailer: { id: string; site: string } | null;
  tags: { name: string; rank: number }[];
}

export interface AnimeCharacter {
  id: number;
  name: { full: string };
  image: { large: string };
  role: string;
}

export interface AnimeDetails extends AnimeMedia {
  characters: { nodes: AnimeCharacter[] };
  relations: { nodes: AnimeMedia[] };
  recommendations: { nodes: { mediaRecommendation: AnimeMedia }[] };
}

const MEDIA_FIELDS = `
  id
  idMal
  title { romaji english native }
  coverImage { large extraLarge color }
  bannerImage
  description(asHtml: false)
  episodes
  averageScore
  popularity
  genres
  status
  season
  seasonYear
  format
  studios(isMain: true) { nodes { name } }
  nextAiringEpisode { episode timeUntilAiring }
  trailer { id site }
  tags { name rank }
`;

async function gql(query: string, variables?: Record<string, unknown>) {
  const res = await fetch(ANILIST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 300 }, // cache 5 minutes
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data;
}

// ── Trending Now (currently airing + most popular) ────────────────────────
export async function fetchTrending(page = 1, perPage = 20): Promise<AnimeMedia[]> {
  const data = await gql(`
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, sort: TRENDING_DESC, status: RELEASING) {
          ${MEDIA_FIELDS}
        }
      }
    }
  `, { page, perPage });
  return data.Page.media;
}

// ── Popular All Time ──────────────────────────────────────────────────────
export async function fetchPopular(page = 1, perPage = 20): Promise<AnimeMedia[]> {
  const data = await gql(`
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, sort: POPULARITY_DESC) {
          ${MEDIA_FIELDS}
        }
      }
    }
  `, { page, perPage });
  return data.Page.media;
}

// ── Top Rated ──────────────────────────────────────────────────────────────
export async function fetchTopRated(page = 1, perPage = 20): Promise<AnimeMedia[]> {
  const data = await gql(`
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, sort: SCORE_DESC, averageScore_greater: 70, episodes_greater: 5) {
          ${MEDIA_FIELDS}
        }
      }
    }
  `, { page, perPage });
  return data.Page.media;
}

// ── Search ─────────────────────────────────────────────────────────────────
export async function searchAnime(query: string, page = 1, perPage = 20): Promise<AnimeMedia[]> {
  const data = await gql(`
    query ($query: String, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, search: $query, sort: SEARCH_MATCH) {
          ${MEDIA_FIELDS}
        }
      }
    }
  `, { query, page, perPage });
  return data.Page.media;
}

// ── Single Anime Detail ────────────────────────────────────────────────────
export async function fetchAnimeDetail(id: number): Promise<AnimeDetails> {
  const data = await gql(`
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        ${MEDIA_FIELDS}
        characters(sort: ROLE, perPage: 12) {
          edges {
            role
            node {
              id
              name { full }
              image { large }
            }
          }
        }
        relations {
          nodes { ${MEDIA_FIELDS} }
        }
        recommendations(sort: RATING_DESC, perPage: 6) {
          nodes {
            mediaRecommendation { ${MEDIA_FIELDS} }
          }
        }
      }
    }
  `, { id });

  // Map edges to nodes with role to maintain compatibility
  if (data?.Media?.characters?.edges) {
    data.Media.characters.nodes = data.Media.characters.edges.map((edge: any) => ({
      ...edge.node,
      role: edge.role,
    }));
  }

  return data.Media;
}

// ── By Genre ────────────────────────────────────────────────────────────────
export async function fetchByGenre(genre: string, page = 1, perPage = 20): Promise<AnimeMedia[]> {
  const data = await gql(`
    query ($genre: String, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, genre: $genre, sort: POPULARITY_DESC) {
          ${MEDIA_FIELDS}
        }
      }
    }
  `, { genre, page, perPage });
  return data.Page.media;
}

// ── Upcoming Season ────────────────────────────────────────────────────────
export async function fetchUpcoming(perPage = 10): Promise<AnimeMedia[]> {
  const data = await gql(`
    query ($perPage: Int) {
      Page(perPage: $perPage) {
        media(type: ANIME, status: NOT_YET_RELEASED, sort: POPULARITY_DESC) {
          ${MEDIA_FIELDS}
        }
      }
    }
  `, { perPage });
  return data.Page.media;
}

// ── Helper ─────────────────────────────────────────────────────────────────
export function getTitle(anime: AnimeMedia) {
  return anime.title.english || anime.title.romaji;
}

export function getWatchUrl(anime: AnimeMedia) {
  // Best free streaming options for embed
  const title = encodeURIComponent(getTitle(anime));
  return `https://www.gogoanime.tel/category/${anime.title.romaji.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

export const GENRES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror',
  'Mecha', 'Music', 'Mystery', 'Psychological', 'Romance', 'Sci-Fi',
  'Slice of Life', 'Sports', 'Supernatural', 'Thriller',
];
