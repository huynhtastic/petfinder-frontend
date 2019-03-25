import { List, Avatar, Icon } from 'antd';
import fetch from 'node-fetch';
import React, { Component } from 'react';
import env from '../../env';

const IconText = () => (
  // TODO: change star to heart
  <span>
    <Icon type='star-o' style={{ marginRight: 8 }} />
  </span>
);

export default class Results extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
    };
  }

  async componentDidMount() {
    const queryParamsString = this.props.location.search;
    const url = `${env.apiUrl}/getSearchResults${ queryParamsString}`;
    console.log(url);
    const res = await fetch(url);
    const json = await res.json();
    console.log(json);
    this.setState({ results: json.animals });
  }

  render() {
    return(
      <List
        itemLayout='vertical'
        size='large'
        pagination={{
          // TODO: change pagination to actually search a different pg of results
          // and footer
          // TODO: change href to non external link
          onChange: (page) => { console.log(page); },
          pageSize: 3,
        }}
        dataSource={this.state.results}
        renderItem={item => (
          <List.Item
            key={item.id}
            actions={[<IconText />]}
            extra={<img alt='animal-pic' src={item.photos[0].medium} />}
          >
            <List.Item.Meta title={<a href={item.url}>{item.name}</a>}
              description={`${item.breeds.primary} | ${item.age} | ${item.gender}`}
            />
            {item.description}
          </List.Item>
        )}
        />
    )
  }
}
