import * as React from 'react';
import { Text, View } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { Button } from '@react-navigation/elements';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Menu } from 'react-native-paper';

function HomeScreen() {
    const [visible, setVisible] = useState(false);
      console.log('visiblity is:', visible);
  const navigation = useNavigation();
 const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <View style={{position: 'relative', paddingTop:100}}>
      <Menu
          visible={visible}
          onDismiss={closeMenu}
           anchor={
      (
         <Button onPress={openMenu}>
        open Menu
      </Button>
)}
    >
    
          
          <Menu.Item onPress={() => {}} title="Item 1" />
          <Menu.Item onPress={() => {}} title="Item 2" />
          <Divider />
          <Menu.Item onPress={() => {}} title="Item 3" />
        </Menu>
        </View>
         <Button onPress={openMenu}>
        openMenu
      </Button>
      <Button onPress={() => navigation.navigate('Profile')}>
        Go to Profile
      </Button>
    </View>
  );
}

function ProfileScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
      <Button onPress={() => navigation.navigate('Home')}>Go to Home</Button>
    </View>
  );
}

const MyDrawer = createDrawerNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});

const Navigation = createStaticNavigation(MyDrawer);

export default function App() {
  return <Navigation />;
}
