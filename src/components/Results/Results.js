import { List, Icon } from 'antd';
import fetch from 'node-fetch';
import React, { Component } from 'react';
import env from '../../env';

const IconText = ({petid}) => {
  const handleClick = () => {
    console.log(petid);
    fetch(`${env.apiUrl}/change`, {
      method: 'POST',
      body: JSON.stringify({ petid: petid }),
      headers: { 'Content-Type': 'application/json'},
    });
  };

  // TODO: change star to heart
  // TODO: trigger different icon when clicked to show favorited
  return (
    <span>
      <Icon type='star-o' style={{ marginRight: 8 }} onClick={handleClick} />
    </span>
  )
};

export default class Results extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
    };
  }

  async componentDidMount() {
    let url = '';
    const path = this.props.location.pathname;
    if (path === '/favorites') {
      url = `${env.apiUrl}/favorites`;
    } else {
      const queryParamsString = this.props.location.search;
      url = `${env.apiUrl}/getSearchResults${ queryParamsString }`;
    }
    console.log(url);
    const res = await fetch(url);
    const json = await res.json();
    console.log(json);
    this.setState({ results: json.animals });
  }

  render() {
    return (
      <List
        itemLayout='vertical'
        size='large'
        pagination={{
          // TODO: change pagination to actually search a different pg of results
          // and footer
          // TODO: change href to non external link
          onChange: (page) => { console.log(page); },
          pageSize: 6,
        }}
        dataSource={this.state.results}
        renderItem={item => {
          let src = item.photos[0] ? item.photos[0].medium : '';
          return (
            <List.Item
              key={item.id}
              actions={[<IconText petid={item.id} />]}
              extra={<img alt='animal-pic' src={src} />}
            >
              <List.Item.Meta title={<a href={item.url}>{item.name}</a>}
                description={`${item.breeds.primary} | ${item.age} | ${item.gender}`}
              />
              {item.description}
            </List.Item>
          );
        }}
        />
    );
  }
}
