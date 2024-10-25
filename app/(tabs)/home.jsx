import { View, Text, ScrollView, FlatList } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

const Styles ={
  Headercontainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 20,
  },
  logo: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
  },
  icons:{
    flexDirection: 'row',
  },
  body: {
    //fontSize: 16,
    backgroundColor: 'white',  },
}

const Home = () => {

  return (
    <SafeAreaView >
      <View  /*</SafeAreaView>style={Styles.body}*/>
<Headers

/>

      {/* <View style={Styles.Headercontainer}>
        <Text style={Styles.logo}>AcademiGig</Text>
        <View style={Styles.icons}>
        <SimpleLineIcons name="bell" size={24} color="black" />
        <Ionicons name="chatbubbles-outline" size={24} color="black" />
      </View>
      </View> */}
      
    <FlatList>
      <View>
        <Text>search</Text>
      </View>
    </FlatList>
      </View>
      
    </SafeAreaView>
  )
}

export default Home