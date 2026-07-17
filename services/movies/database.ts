export interface Movie {
  id: string;
  title: string;
  coverImage: string;
  bannerImage: string;
  description: string;
  year: number;
  rating: number;
  runtime: string;
  genres: string[];
  imdbId: string;
  type: 'hollywood' | 'bollywood';
}

export const MOVIES: Movie[] = [
  {
    id: "deadpool-wolverine",
    title: "Deadpool & Wolverine",
    coverImage: "https://image.tmdb.org/t/p/w500/8cdWjv4pa84scCN50ub74gb06K4.jpg",
    bannerImage: "https://image.tmdb.org/t/p/original/yD116QvnCvyjT3zI144nCQGCEbc.jpg",
    description: "A listless Wade Wilson toils in civilian life with his days as the morally flexible mercenary, Deadpool, behind him. But when his homeworld faces an existential threat, he must reluctantly suit-up again with an even more reluctant Wolverine.",
    year: 2024,
    rating: 7.8,
    runtime: "2h 8m",
    genres: ["Action", "Comedy", "Sci-Fi"],
    imdbId: "tt6263850",
    type: "hollywood"
  },
  {
    id: "inside-out-2",
    title: "Inside Out 2",
    coverImage: "https://image.tmdb.org/t/p/w500/vpnVM9B6mENj4u6fjluxBg46Rsz.jpg",
    bannerImage: "https://image.tmdb.org/t/p/original/stKGOmbuuuQTY6h25Z7w7CD4ZjZ.jpg",
    description: "Teenager Riley's mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions! Joy, Sadness, Anger, Fear and Disgust, who’ve long been running a successful operation by all accounts, aren’t sure how to feel when Anxiety shows up.",
    year: 2024,
    rating: 7.6,
    runtime: "1h 36m",
    genres: ["Animation", "Family", "Comedy", "Drama"],
    imdbId: "tt22022452",
    type: "hollywood"
  },
  {
    id: "dune-part-two",
    title: "Dune: Part Two",
    coverImage: "https://image.tmdb.org/t/p/w500/czemb4hm1Yj42CdV211gmq9znju.jpg",
    bannerImage: "https://image.tmdb.org/t/p/original/xOMo8j360w2UPkg6gd66cRjIY2y.jpg",
    description: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.",
    year: 2024,
    rating: 8.2,
    runtime: "2h 46m",
    genres: ["Sci-Fi", "Adventure", "Action"],
    imdbId: "tt15239678",
    type: "hollywood"
  },
  {
    id: "jawan",
    title: "Jawan",
    coverImage: "https://image.tmdb.org/t/p/w500/5E12cc4rmmB52W25508t6Bj76r5.jpg",
    bannerImage: "https://image.tmdb.org/t/p/original/m19g11rXFfF8S2R26ZJ741S4T29.jpg",
    description: "A high-octane action thriller which outlines the emotional journey of a man who is set to rectify the wrongs in the society. Driven by a personal vendetta while keeping a promise made years ago, he confronts a monstrous outlaw who has caused extreme suffering to many.",
    year: 2023,
    rating: 7.0,
    runtime: "2h 49m",
    genres: ["Action", "Thriller"],
    imdbId: "tt16377770",
    type: "bollywood"
  },
  {
    id: "pathaan",
    title: "Pathaan",
    coverImage: "https://image.tmdb.org/t/p/w500/v21gzEng525z2t6clJ8Mee452v1.jpg",
    bannerImage: "https://image.tmdb.org/t/p/original/d5Nf54h77t116M14NnCQGCEbc.jpg",
    description: "An Indian spy agent, Pathaan, takes on a private terror group led by Jim, a rogue former agent, who has a catastrophic plan to release a deadly mutated virus across India.",
    year: 2023,
    rating: 6.4,
    runtime: "2h 26m",
    genres: ["Action", "Adventure", "Thriller"],
    imdbId: "tt12844910",
    type: "bollywood"
  },
  {
    id: "animal",
    title: "Animal",
    coverImage: "https://image.tmdb.org/t/p/w500/hr9rjQ3cxj6r776o8Lz6J4j2I7Y.jpg",
    bannerImage: "https://image.tmdb.org/t/p/original/2wSbsysLYlhgegjZzsjZ35C.jpg",
    description: "A fierce relationship between a father and son unfolds against the backdrop of a dark, violent underworld, leading the son down a path of extreme vengeance to protect his family.",
    year: 2023,
    rating: 6.8,
    runtime: "3h 21m",
    genres: ["Action", "Drama", "Crime"],
    imdbId: "tt13756662",
    type: "bollywood"
  },
  {
    id: "oppenheimer",
    title: "Oppenheimer",
    coverImage: "https://image.tmdb.org/t/p/w500/8Gxv2wSbsysLYlhgegjZzsjZ35C.jpg",
    bannerImage: "https://image.tmdb.org/t/p/original/fm61w39gHA37tMrn2hxXJ35C.jpg",
    description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, leading to the atomic age.",
    year: 2023,
    rating: 8.4,
    runtime: "3h 0m",
    genres: ["Drama", "History", "Biography"],
    imdbId: "tt15398776",
    type: "hollywood"
  },
  {
    id: "barbie",
    title: "Barbie",
    coverImage: "https://image.tmdb.org/t/p/w500/iuFNmZ513d9L2t36dsJmq1J6q2s.jpg",
    bannerImage: "https://image.tmdb.org/t/p/original/ctMserH8g26z2t36dsJmq1J6q2s.jpg",
    description: "Barbie and Ken are having the time of their lives in the colorful and seemingly perfect World of Barbie Land. However, when they get a chance to go to the real world, they soon discover the joys and perils of living among humans.",
    year: 2023,
    rating: 7.2,
    runtime: "1h 54m",
    genres: ["Comedy", "Adventure", "Fantasy"],
    imdbId: "tt1517268",
    type: "hollywood"
  },
  {
    id: "spider-man-no-way-home",
    title: "Spider-Man: No Way Home",
    coverImage: "https://image.tmdb.org/t/p/w500/1g01u754H2j9Okz2G7vSNHu7Wd6.jpg",
    bannerImage: "https://image.tmdb.org/t/p/original/iQFcwUg6Z7vSNHu7Wd6.jpg",
    description: "Peter Parker's secret identity is revealed to the entire world. Desperate for help, he turns to Doctor Strange to make the world forget his secret, but the spell goes horribly wrong, tearing a hole in the multiverse.",
    year: 2021,
    rating: 8.0,
    runtime: "2h 28m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    imdbId: "tt10872600",
    type: "hollywood"
  },
  {
    id: "scary-movie",
    title: "Scary Movie",
    coverImage: "https://image.tmdb.org/t/p/w500/3oQ21g01u754H2j9Okz2G7vS.jpg",
    bannerImage: "https://image.tmdb.org/t/p/original/52c6f10250664e1f740003df.jpg",
    description: "A familiar-looking group of teenagers find themselves being stalked by a more-than-vaguely familiar masked killer. As the victims stack up, the comedy gets more ridiculous in this hilarious parody of 90s horror blockbusters.",
    year: 2000,
    rating: 6.3,
    runtime: "1h 28m",
    genres: ["Comedy"],
    imdbId: "tt0175142",
    type: "hollywood"
  },
  {
    id: "3bhk",
    title: "3BHK",
    coverImage: "https://image.tmdb.org/t/p/w500/7IbqCvyjT3zI144nCQGCEbc.jpg",
    bannerImage: "https://image.tmdb.org/t/p/original/stKGOmbuuuQTY6h25Z7w7CD4ZjZ.jpg",
    description: "A lighthearted Bollywood comedy-drama revolving around three middle-class friends who dream of purchasing a luxury 3BHK apartment in Mumbai, leading to a series of chaotic and hilarious misadventures.",
    year: 2025,
    rating: 6.9,
    runtime: "2h 15m",
    genres: ["Comedy", "Drama"],
    imdbId: "tt32420310",
    type: "bollywood"
  },
  {
    id: "the-odyssey",
    title: "The Odyssey",
    coverImage: "https://image.tmdb.org/t/p/w500/8Gxv2wSbsysLYlhgegjZzsjZ35C.jpg",
    bannerImage: "https://image.tmdb.org/t/p/original/fm61w39gHA37tMrn2hxXJ35C.jpg",
    description: "Odysseus, the legendary King of Ithaca, embarks on a long and perilous ten-year journey home following the fall of Troy, confronting monstrous beasts, sirens, and wrathful gods.",
    year: 1997,
    rating: 7.1,
    runtime: "2h 56m",
    genres: ["Adventure", "Fantasy", "Drama"],
    imdbId: "tt0118414",
    type: "hollywood"
  }
];

export async function fetchMovies(type?: 'hollywood' | 'bollywood'): Promise<Movie[]> {
  if (type) {
    return MOVIES.filter(m => m.type === type);
  }
  return MOVIES;
}

export async function fetchMovieById(id: string): Promise<Movie | undefined> {
  return MOVIES.find(m => m.id === id);
}

export async function searchMovies(query: string): Promise<Movie[]> {
  const q = query.toLowerCase();
  return MOVIES.filter(m => m.title.toLowerCase().includes(q) || m.genres.some(g => g.toLowerCase().includes(q)));
}
