import {StyleSheet, Text, View} from 'react-native';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AnimatedCards from '../screens/AnimatedCards';
import CardDetail from '../screens/CardDetail';
const Stack = createNativeStackNavigator();
const AppNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Group
        screenOptions={{
          headerShown: false,
          presentation: 'containedModal',
        }}>
        <Stack.Screen name="AnimatedCards" component={AnimatedCards} />
        <Stack.Screen name="CardDetail" component={CardDetail} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default AppNavigation;

const styles = StyleSheet.create({});
