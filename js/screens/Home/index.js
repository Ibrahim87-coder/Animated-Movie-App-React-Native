import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Dimensions,
  Platform,
  StatusBar,
  FlatList,
  Image,
  Animated,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {getMovies} from '../../data/api';
import Rating from '../../data/Rating';
import Genres from '../../data/Genres';
import styles from './styles';
import MaskedView from '@react-native-community/masked-view';
import Svg, {Rect} from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';

const {width, height} = Dimensions.get('window');

const SPACING = 10;
const ITEM_SIZE = width * 0.74;
const EMPTY_ITEM_SIZE = (width - ITEM_SIZE) / 2;
const BACKDROP_HEIGHT = height * 0.65;

const Home = () => {
  const scrollX = useRef(new Animated.Value(0)).current;

  const AnimatedSVG = Animated.createAnimatedComponent(Svg);

  const [movies, setMovies] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const movies = await getMovies();
      setMovies([{key: 'left-spacer'}, ...movies, {key: 'right-spacer'}]);
    };
    7;
    if (movies.length === 0) {
      fetchData();
    }
  }, []);

  const Loading = () => (
    <View style={styles.loadingContainer}>
      <Text style={styles.paragraph}>Loading...</Text>
    </View>
  );
  if (movies.length === 0) {
    return <Loading />;
  }

  const MovieBackGrounds = ({movies = [], scrollX}) => {
    return (
      <View
        style={{
          // flexGrow: 1,
          width,
          height: BACKDROP_HEIGHT,
          position: 'absolute',
          top: 0,
          zIndex: 1,
        }}>
        <FlatList
          horizontal
          style={{flex: 1, width, height: BACKDROP_HEIGHT}}
          contentContainerStyle={{
            width,
            height: BACKDROP_HEIGHT,
            flexDirection: 'column',
            justifyContent: 'center',
          }}
          data={movies}
          keyExtractor={item => item.key}
          renderItem={({item, index}) => {
            const inputRange = [
              (index - 2) * ITEM_SIZE,
              (index - 1) * ITEM_SIZE,
              index * ITEM_SIZE,
            ];

            const outputRange = [-width, 0, 0];

            const translateX = scrollX.interpolate({inputRange, outputRange});

            return (
              <Animated.View
                style={[
                  StyleSheet.absoluteFillObject,
                  {
                    transform: [{translateX}],
                    top: -BACKDROP_HEIGHT / 2,
                    width,
                    height: BACKDROP_HEIGHT,
                  },
                ]}>
                <Image
                  source={{uri: item.backdrop}}
                  style={{height: BACKDROP_HEIGHT, width}}
                  resizeMode="cover"
                />
              </Animated.View>
            );
          }}
        />

        <LinearGradient
          colors={[
            'rgba(255, 255, 255, 0)',
            'rgba(255, 255, 255, 0.4)',
            'rgba(255, 255, 255, 1)',
          ]}
          style={{position: 'absolute', top: 0, height: BACKDROP_HEIGHT, width}}
        />
      </View>
    );
  };

  //   const Backdrop = ({movies, scrollX}) => {
  //     return (
  //       <View
  //         style={{
  //           width,
  //           height: BACKDROP_HEIGHT,
  //           position: 'absolute',
  //         }}>
  //         <FlatList
  //           data={movies}
  //                 keyExtractor={item => item.key}
  //           horizontal
  //           // style={{backgroundColor:'red'}}
  //           renderItem={({item, index}) => {
  //             const translateX = scrollX.interpolate({
  //               inputRange: [(index - 1) * ITEM_SIZE, index * ITEM_SIZE],
  //               outputRange: [0, width],
  //             });
  //             if (!item.backdrop) return null;
  //             return (
  //                 <MaskedView

  //                 maskElement={
  //                   <AnimatedSVG
  //                     width={width}
  //                     height={height}
  //                     viewBox={`0 0 ${width} ${height}`}
  //                     style={{transform: [{translateX: translateX}]}}>
  //                     <Rect
  //                       x="0"
  //                       y="0"
  //                       width={width}
  //                       height={height}
  //                       fill="red"
  //                     />
  //                   </AnimatedSVG>
  //                 }>
  //                 <Image
  //                   source={{uri: item.backdrop}}
  //                   style={{
  //                     width: width,
  //                     height: BACKDROP_HEIGHT,
  //                   }}
  //                 />
  //               </MaskedView>
  //             );
  //           }}
  //         />
  //         <LinearGradient
  //           colors={['transparent', 'white']}
  //           style={{
  //             width,
  //             height: BACKDROP_HEIGHT,
  //             position: 'absolute',
  //             bottom: 0,
  //           }}></LinearGradient>
  //       </View>
  //     );
  //   };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <MovieBackGrounds movies={movies} scrollX={scrollX} />
      <Animated.FlatList
        style={{position: 'relative', zIndex: 2}}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        data={movies}
        keyExtractor={item => item.key}
        horizontal
        bounces={false}
        renderToHardwareTextureAndroid
        contentContainerStyle={{
          alignItems: 'center',
        }}
        snapToAlignment="start"
        snapToInterval={ITEM_SIZE}
        decelerationRate={0.5}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: true},
        )}
        renderItem={({item, index}) => {
          if (!item.poster) {
            return <View style={{width: EMPTY_ITEM_SIZE}}></View>;
          }
          const inputRange = [
            (index - 2) * ITEM_SIZE,
            (index - 1) * ITEM_SIZE,
            index * ITEM_SIZE,
          ];
          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [100, 50, 100],
            extrapolate: 'clamp',
          });
          return (
            <View style={{width: ITEM_SIZE}}>
              <Animated.View
                style={{
                  marginHorizontal: SPACING,
                  padding: SPACING * 2,
                  alignItems: 'center',
                  backgroundColor: '#fff',
                  top: 40,
                  borderRadius: 34,
                  transform: [{translateY}],
                }}>
                <Image
                  source={{uri: item.poster}}
                  resizeMode={'cover'}
                  style={styles.posterImage}
                />
                <Text
                  style={{fontSize: 20, color: 'black', fontWeight: 'bold'}}
                  numberOfLines={1}>
                  {item.title}
                </Text>
                <Genres genres={item.genres} />
                <Text style={{fontSize: 12}} numberOfLines={3}>
                  {item.description}
                </Text>
                <TouchableOpacity
                  style={{
                    paddingHorizontal: 40,
                    borderRadius: 10,
                    paddingVertical: 20,
                    marginTop: 10,
                    backgroundColor: 'black',
                  }}>
                  <Text style={{color: '#fff', fontWeight: 'bold'}}>
                    {'BUY TICKET'}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          );
        }}
      />
    </View>
  );
};

export default Home;
