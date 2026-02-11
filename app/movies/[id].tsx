
import { View, Text, ScrollView, Image, ActivityIndicator, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { fetchMovieDetails, fetchMovieCredits, fetchSimilarMovies } from '@/services/api'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons } from '@/constants/icons'
import MovieCard from '@/components/MovieCard'

const MovieDetails = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [movie, setMovie] = useState<any>(null);
    const [cast, setCast] = useState<any[]>([]);
    const [similarMovies, setSimilarMovies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                if (!id) return;

                setLoading(true);
                const movieId = Number(id);

                const [details, credits, similar] = await Promise.all([
                    fetchMovieDetails(movieId),
                    fetchMovieCredits(movieId),
                    fetchSimilarMovies(movieId)
                ]);

                setMovie(details);
                setCast(credits.slice(0, 10)); // Top 10 cast members
                setSimilarMovies(similar.slice(0, 10)); // Top 10 similar movies
            } catch (err: any) {
                setError(err.message || 'Failed to fetch movie details');
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [id]);

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-primary justify-center items-center">
                <ActivityIndicator size="large" color="#ab8bff" />
            </SafeAreaView>
        )
    }

    if (error || !movie) {
        return (
            <SafeAreaView className="flex-1 bg-primary justify-center items-center">
                <Text className="text-white text-lg">Error: {error || 'Movie not found'}</Text>
                <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-accent px-4 py-2 rounded-lg">
                    <Text className="text-white font-bold">Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        )
    }

    return (
        <View className="flex-1 bg-primary">
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Header Image */}
                <View className="relative">
                    <Image
                        source={{
                            uri: movie.backdrop_path
                                ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
                                : movie.poster_path
                                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                    : "https://placehold.co/600x400/png"
                        }}
                        className="w-full h-80"
                        resizeMode="cover"
                    />

                    {/* Dark Gradient Overlay */}
                    <View className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-primary to-transparent" />

                    {/* Back Button */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="absolute top-12 left-4 bg-black/50 p-3 rounded-full"
                    >
                        <Image source={icons.arrow} style={{ width: 20, height: 20, tintColor: 'white', transform: [{ rotate: '180deg' }] }} />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <View className="px-5 -mt-20">
                    {/* Poster + Title Section */}
                    <View className="flex-row gap-4">
                        <Image
                            source={{
                                uri: movie.poster_path
                                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                    : "https://placehold.co/400x600/png"
                            }}
                            className="w-32 h-48 rounded-2xl border-2 border-white/20 shadow-xl"
                            resizeMode="cover"
                        />
                        <View className="flex-1 justify-end pb-2">
                            <Text className="text-2xl font-bold text-white mb-2 leading-tight">{movie.title}</Text>

                            <View className="flex-row items-center gap-2 mb-2">
                                <Image source={icons.star} className="size-4" />
                                <Text className="text-accent font-bold text-base">{movie.vote_average?.toFixed(1)}/10</Text>
                                <Text className="text-gray-400 text-sm">({movie.vote_count})</Text>
                            </View>

                            <Text className="text-gray-300 text-sm font-medium">
                                {movie.release_date?.split('-')[0]} • {movie.runtime} min • {movie.status}
                            </Text>

                            <View className="flex-row flex-wrap gap-2 mt-2">
                                {movie.genres?.slice(0, 3).map((genre: any) => (
                                    <View key={genre.id} className="bg-dark-100 px-3 py-1 rounded-full border border-white/10">
                                        <Text className="text-[10px] text-gray-300 uppercase tracking-wider font-bold">{genre.name}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>

                    {/* Overview */}
                    <View className="mt-8">
                        <Text className="text-xl font-bold text-white mb-3">Overview</Text>
                        <Text className="text-gray-400 leading-6 text-base text-justify italic">"{movie.tagline}"</Text>
                        <Text className="text-gray-300 leading-6 text-base mt-2">{movie.overview}</Text>
                    </View>

                    {/* Cast Section */}
                    {cast.length > 0 && (
                        <View className="mt-8">
                            <Text className="text-xl font-bold text-white mb-4">Top Cast</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                                {cast.map((item: any) => (
                                    <View key={item.id} className="mr-5 items-center w-20">
                                        <Image
                                            source={{
                                                uri: item.profile_path
                                                    ? `https://image.tmdb.org/t/p/w185${item.profile_path}`
                                                    : "https://placehold.co/100x100/png?text=Actor"
                                            }}
                                            className="w-16 h-16 rounded-full border border-white/10"
                                            resizeMode="cover"
                                        />
                                        <Text className="text-white text-[10px] font-bold mt-2 text-center" numberOfLines={1}>{item.name}</Text>
                                        <Text className="text-gray-500 text-[9px] text-center" numberOfLines={1}>{item.character}</Text>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {/* Similar Movies Section */}
                    {similarMovies.length > 0 && (
                        <View className="mt-8">
                            <Text className="text-xl font-bold text-white mb-4">You Might Also Like</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View className="flex-row gap-x-4">
                                    {similarMovies.map((item: any) => (
                                        <View key={item.id} className="w-32" style={{ flexShrink: 0 }}>
                                            <MovieCard {...item} />
                                        </View>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    )
}

export default MovieDetails