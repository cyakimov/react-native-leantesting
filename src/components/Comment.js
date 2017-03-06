import React, {Component} from 'react';
import {} from 'react-native';
import {Row, View, Image, Subtitle, Caption, Text, Divider} from '@shoutem/ui'
import {timeAgo} from '../lib/date'
import UserAvatar from './UserAvatar'

type Props = {
  comment: CommentObject
}

type CommentObject = {
  id: number,
  owner_id: number,
  text: string,
  created_at: string,
};

export default class Comment extends Component {
  props: Props;

  shouldComponentUpdate(nextProps) {
    return this.props.comment.text !== nextProps.comment.text
  }

  render() {
    const {comment} = this.props
    return (
      <Row>
        <UserAvatar user={comment.owner}/>
        <View styleName="vertical">
          <View styleName="horizontal space-between">
            <Subtitle>{`${comment.owner.first_name} ${comment.owner.last_name}`}</Subtitle>
            <Caption>{timeAgo(comment.created_at)}</Caption>
          </View>
          <Text styleName="multiline">{comment.text}</Text>
        </View>
        <Divider styleName="line"/>
      </Row>
    )
  }
}