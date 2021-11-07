import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    height:"100%",width:"100%",top:-50
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  posterImage: {
    width: '100%',
    height: 411 * 0.74 * 1.2,
    borderRadius: 24,
    margin: 0,
    marginBottom: 10,
  },
});
