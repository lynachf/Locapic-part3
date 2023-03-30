import { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, Modal, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useSelector, useDispatch } from 'react-redux';
import { addPlace } from '../reducers/user';


export default function MapScreen() {

 const [currentPosition, setCurrentPosition] = useState(null);

 const cityPin = useSelector(state => state.user.value.places); //  récupérer les villes du tableau places du reducer grâce à l'état user
    console.log(cityPin)

 const PlacesPin = cityPin.map((data, i) => {
    return (
      <Marker key={i} coordinate={{latitude: data.latitude, longitude: data.longitude }} title={data.name} pinColor="#red" />
    );
  })

//fonction pour récupérer les long et lat du point sur lequel j'ai longClick et je l'ajoute 
  const dispatch = useDispatch();
  const [locationsOnPress, setLocationsOnPress] = useState ('');
   //etat pour enregister les coordonnées sur le longclick
  const [modalVisible, setModalVisible] = useState(false);
  const [newPlaceName, setNewPlaceName] = useState('');
  

  const handleLongPressLocation = (e) => {
      setLocationsOnPress(e.nativeEvent.coordinate); 
      setModalVisible(true);
      setNewPlaceName('');
  }
 
  const handleAddNewPlace = () => {
    if(newPlaceName) {
      dispatch(addPlace({name:newPlaceName, latitude: locationsOnPress.latitude, longitude: locationsOnPress.longitude}))
    }
  }
 

 useEffect(() => {
   (async () => {
     const { status } = await Location.requestForegroundPermissionsAsync();

     if (status === 'granted') {
       Location.watchPositionAsync({ distanceInterval: 10 },
         (location) => {
           setCurrentPosition(location.coords);
         });
     }
   })();
 }, []);

 return (
   <View style={{ flex: 1 }}>
    
    <Modal 
      visible={modalVisible}  
      animationType="slide"
      transparent={true}>
     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TextInput
          style={styles.textInput} 
          placeholder="New place"
          value={newPlaceName}
          onChangeText={(text) => setNewPlaceName(text)}
        />
        <TouchableOpacity 
          style={styles.button} 
          activeOpacity={0.8} 
          title="Add" 
          onPress={handleAddNewPlace}>
          <Text>Add</Text>         
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          activeOpacity={0.8} 
          title="Close" 
          onPress={() => setModalVisible(false)}>
          <Text>Close</Text>  
        </TouchableOpacity>
      </View>
    </Modal>
     {/* pourquoi ça ne marche pas sans le style flex appliqué à View? */}
     <MapView mapType="hybrid" style={{ flex: 1 }}
        onLongPress={handleLongPressLocation} >
        {/* // console.log(e.coordinate.latitude, e.coordinate.longitude) */}
       {currentPosition && <Marker coordinate={currentPosition} title="My position" pinColor="#fecb2d" />}
       {PlacesPin}
     </MapView>
   </View>
 );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },

  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },

  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  }, 

    button: {
      width: '30%',
      alignItems: 'center',
      paddingTop: 8,
      backgroundColor: '#ec6e5b',
      borderRadius: 10,
    },

    textInput: {
      width: 150,
      borderBottomColor: "white",
      borderBottomWidth: 1,
    },
  },
);
//fin ..j