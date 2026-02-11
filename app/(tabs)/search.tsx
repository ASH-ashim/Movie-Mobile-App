import { View, Text, Image, FlatList, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { images } from '@/constants/images'
import MovieCard from '@/components/MovieCard'
import { fetchTrendingMovies } from '@/services/api'
import useFetch from '@/services/useFetch'
import { icons } from '@/constants/icons'
import SearchBar from '@/components/SearchBar'
import { useLocalSearchParams } from 'expo-router'

const Search = () => {
    const { query } = useLocalSearchParams();
    const [searchQuery, setSearchQuery] = useState(query ? query.toString() : '');

    useEffect(() => {
        if (query) {
            setSearchQuery(query.toString());
        }
    }, [query]);

    const { data: movies, loading: moviesLoading, error: moviesError, refetch } = useFetch(() => fetchTrendingMovies({
        query: searchQuery
    }), false);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            refetch();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    return (
        <View className='flex-1 bg-primary'>
            <Image source={images.bg} className='flex-1 absolute w-full h-full z-0'
                resizeMode='cover' />
            <FlatList className='px-4'
                columnWrapperStyle={{
                    justifyContent: 'space-between',
                    marginBottom: 10
                }}
                contentContainerStyle={{ paddingBottom: 100 }}
                numColumns={3}
                data={movies}
                renderItem={({ item }) => <MovieCard {...item} />}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={
                    <View className="items-center w-full mt-12">
                        <Image
                            source={icons.logo}
                            className='w-24 h-16'
                            resizeMode='contain'
                        />

                        <View className='my-5 w-full'>
                            <SearchBar
                                placeholder='Search Movies...'
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>

                        {moviesLoading && (
                            <ActivityIndicator size="large" color="#0000ff" className='my-3' />
                        )}

                        {moviesError && (
                            <Text className='text-red-600 px-5 my-4'> Error: {moviesError.message}</Text>
                        )}

                        {!moviesLoading && !moviesError && searchQuery.trim().length > 0 && movies?.length > 0 && (
                            <Text className='text-xl text-white font-bold self-start mb-4'>Search Results for{' '}
                                <Text className='text-accent'>{searchQuery}</Text>
                            </Text>
                        )}
                    </View>
                } />

        </View>
    )
}

export default Search