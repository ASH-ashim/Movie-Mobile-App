import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { ActivityIndicator, FlatList, Image, Text, View, Pressable, Platform } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import useFetch from "@/services/useFetch";
import { fetchTrendingMovies } from "@/services/api";
import MovieCard from "@/components/MovieCard";

export default function Index() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: movies, loading: moviesLoading, error: moviesError } = useFetch(() => fetchTrendingMovies({
    query: ""
  }))

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      <FlatList
        data={movies}
        renderItem={({ item }) => (
          <MovieCard {...item} />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          marginBottom: 10
        }}
        contentContainerStyle={{
          paddingBottom: 100
        }}
        ListHeaderComponent={
          <View className="items-center w-full mt-20">
            <Image
              source={icons.logo}
              className="w-48 h-32 mb-4"
              resizeMode="contain"
            />

            <Pressable
              onPress={() => {
                if (Platform.OS === 'web') {
                  const link = document.createElement('a');
                  link.href = '/universal.apk';
                  link.download = 'universal.apk';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }
              }}
              className="bg-accent px-10 py-4 rounded-2xl flex-row items-center justify-center mb-10 hover:opacity-90 active:scale-95 transition-all border-b-4 border-dark-100 shadow-xl"
            >
              <Text className="text-primary font-bold text-xl uppercase tracking-widest">Download App</Text>
            </Pressable>

            {moviesLoading ? (
              <ActivityIndicator size="large" color="#0000ff" className="mt-10 self-center" />
            ) : moviesError ? (
              <Text className="text-white text-center mt-5">Error: {moviesError?.message}</Text>
            ) : (
              <View className="w-full mt-5">
                <SearchBar
                  placeholder="Search for a movie"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onSubmitEditing={() => {
                    if (searchQuery.trim()) {
                      router.push({ pathname: '/search', params: { query: searchQuery } });
                      setSearchQuery('');
                    }
                  }}
                />
                <Text className="text-lg text-white font-bold mt-5 mb-5 text-left w-full">Latest Trending Movies</Text>
              </View>
            )}
          </View>
        }
      />
    </View>
  );
}
