import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Main from './pages/Main';
import User from './pages/User';
import WebRepository from './pages/WebRepository';

const Routes = createAppContainer(
  createStackNavigator(
    {
      Main,
      User,
      WebRepository,
    },
    {
      headerLayoutPreset: 'center',
      headerBackTitleVisible: false,
      defaultNavigationOptions: {
        headerStyle: {
          backgroundColor: '#7159c1',
        },
        headerTintColor: '#FFFFFF',
      },
    }
  )
);

export default Routes;
