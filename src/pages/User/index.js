import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import api from '../../services/api';
import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  StarButton,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    page: 1,
    loading: false,
    loadingPlus: false,
    refreshing: false,
  };

  async componentDidMount() {
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    this.setState({ loading: true });

    const { page } = this.state;

    const response = await api.get(`/users/${user.login}/starred`, {
      params: {
        page,
      },
    });

    this.setState({
      stars: response.data,
      loading: false,
    });
  }

  updateList = async page => {
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    if (page !== 1) {
      this.setState({ loadingPlus: true });
    }

    const response = await api.get(`/users/${user.login}/starred`, {
      params: {
        page,
      },
    });

    const { stars } = this.state;

    this.setState({
      stars: [...stars, ...response.data],
      loadingPlus: false,
      refreshing: false,
    });
  };

  loadMore = page => {
    const { stars } = this.state;
    if (stars.length >= 30) {
      const nextPage = page + 1;

      this.setState({ page: nextPage });

      this.updateList(nextPage);
    }
  };

  refreshList = () => {
    this.setState({
      refreshing: true,
    });
    this.updateList(1);
  };

  handleNavigate = name => {
    const { navigation } = this.props;
    navigation.navigate('WebRepository', { name });
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading, page, loadingPlus, refreshing } = this.state;
    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        {loading || refreshing ? (
          <ActivityIndicator color="#7159c1" />
        ) : (
          <Stars
            onRefresh={this.refreshList} // Função dispara quando o usuário arrasta a lista pra baixo
            refreshing={refreshing} // Variável que armazena um estado true/false que representa se a lista está atualizando
            onEndReachedThreshold={0.2} // Carrega mais itens quando chegar em 20% do fim
            onEndReached={() => this.loadMore(page)} // Função que carrega mais itens
            data={stars}
            keyExtractor={star => String(star.id)}
            renderItem={({ item }) => (
              <StarButton onPress={() => this.handleNavigate(item)}>
                <Starred>
                  <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                  <Info>
                    <Title>{item.name}</Title>
                    <Author>{item.owner.login}</Author>
                  </Info>
                </Starred>
              </StarButton>
            )}
          />
        )}

        {loadingPlus && <ActivityIndicator color="#7159c1" />}
      </Container>
    );
  }
}
