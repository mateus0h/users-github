import React, { Component } from 'react';

import { WebView } from 'react-native-webview';
import { Text } from 'react-native';

export default class WebRepository extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('name').name,
  });

  state = {
    repository: this.props.navigation.state.params.name,
  };

  render() {
    const { html_url } = this.state.repository;
    return <WebView source={{ uri: html_url }} style={{ flex: 1 }} />;
  }
}
