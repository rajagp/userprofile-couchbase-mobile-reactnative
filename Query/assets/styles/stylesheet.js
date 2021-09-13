import { StyleSheet } from 'react-native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

const whole = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    width: wp('100%'),
    height: hp('100%'),
    backgroundColor: '#fff',
  },
  profileImage: {
    width: wp('80%'),
    height: 120,
    marginBottom: 30,
    resizeMode: 'contain'
  },
  btnUpload: {
    marginTop: 10,
    width: 50
  },
  centerLayoutProfile: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
    width: "50%"
  },
  logoImage: {
    width: wp('50%'),
    height: 120,
    marginTop: hp('10%'),
    resizeMode: 'center'
  },
  button: {
    textAlign: 'center',
    fontFamily: 'Avenir-Heavy',
    justifyContent: 'center',
    alignSelf: 'center',
    textTransform: 'uppercase',
    margin: 10,
    backgroundColor: '#E62125'

  },
  verticalLinearLayout: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  centerLayout: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  mtextinput: {
    height: 40,
    margin: 12,
    color: '#000',
    width: 200,
    borderBottomWidth: 1,
    borderBottomColor: '#E62125'
  },
  msearchtextinput: {
    width: wp('100%'),
    alignSelf: 'flex-start'
  },
  searchHeader: {
    paddingTop: 20
  },
  listitem: {
    borderBottomColor: "#ccc",
    width:wp("100%"),
    padding:10,
    borderBottomWidth: 1
  }, 
  listMainText: {
    color:"#000",
    fontSize:14
  },
  listDescriptionText: {
    color:"#888",
    fontSize:12
  },
  mselectinput: {
    height: 40,
    margin: 12,
    color: '#000',
    width: 200,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#E62125'
  },
  alignincenter: {
    alignContent: 'center'
  },

});


export { whole };
