import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { icons } from '@/constants/icons'

const MovieCard = ({ id, poster_path, title, vote_average, release_date }: Movie) => {
    return (
        <Link href={`/movies/${id}`} asChild>
            <TouchableOpacity style={{ width: '30%' }} className='mb-5'>
                <View className='w-full bg-dark-100 rounded-xl overflow-hidden' style={{ aspectRatio: 2 / 3 }}>
                    <Image
                        source={{
                            uri: poster_path ? `https://image.tmdb.org/t/p/w342${poster_path}`
                                : "https://via.placeholder.com/342x513?text=No+Poster"
                        }}
                        className='w-full h-full'
                        resizeMode='cover'
                    />
                </View>
                <Text className='text-[10px] font-semibold text-white mt-1 px-1' numberOfLines={1}>{title}</Text>

                <View className='flex-row items-center justify-start gap-x-1 mt-0.5 px-1'>
                    <Image source={icons.star} className='size-2.5' tintColor="#ab8bff" />
                    <Text className='text-[9px] text-light-100 font-medium'>{Math.round(vote_average / 2)}</Text>
                    <Text className='text-[9px] text-light-300 font-medium ml-auto'>
                        {release_date?.split("-")[0]}
                    </Text>
                </View>
            </TouchableOpacity>
        </Link>
    )
}

export default MovieCard