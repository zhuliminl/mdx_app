/* 已被废弃。重写到单独的文件夹 contacts 中
import React from 'react';
import {StyleSheet, View, Image, Text, ScrollView, TouchableOpacity, FlatList, StatusBar, Platform} from 'react-native';
import HeaderBackBtn from '../cpns/small/HeaderBackBtn'
import {p} from "../utils/p";
import { removeArr } from '../utils/removeArr'
import {createStackNavigator} from "react-navigation";
import RedBtn from "../cpns/small/RedBtn";
import Toast from '../utils/toast'
const okOn = require('../images/icons/contact-ok-on.png');
const okOff = require('../images/icons/contact-ok-off.png');



class SelectedItem extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableOpacity style={styles.selectedItem} onPress={() => {
        this.props.onDelete(this.props.item)
      }}>
        <Text style={styles.selectedItemText}>{this.props.item['familyName']}{this.props.item['middleName']}{this.props.item['givenName']}</Text>
      </TouchableOpacity>
    );
  }
}

class Contacts extends React.Component {

  static navigationOptions = ({navigation}) => {
    return {
      headerLeft: (
        <HeaderBackBtn navigation={navigation}/>
      ),
      headerTitle: '选择2位紧急联系人'
    }

  };

  async componentWillReceiveProps(nextProps) {
    if (nextProps.navigation.state.params.contacts && nextProps.navigation.state.params.contacts.length > 0) {
      await this.setState({contacts: nextProps.navigation.state.params.contacts});
    }

    if (nextProps.navigation.state.params.selectedItem) {
      await this.setState({selectedItem: nextProps.navigation.state.params.selectedItem})
    }

    if (nextProps.navigation.state.params.selectRecordId) {
      await this.setState({selectRecordId: nextProps.navigation.state.params.selectRecordId})
    }

  }

  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      selectedItem: [],
      selectRecordId: {},
      wvh: 0
    };
  }


  componentDidMount() {
    this.props.navigation.setParams({
      reBack: async () => {
        await this.setState({contacts: [], selectedItem: [], selectRecordId: {}});
        this.props.navigation.navigate('AuthenticationCenter', {
          r: {
            status: false,
            statusName: 'backContact',
            selectedItem: [],
            selectRecordId: {}
          }
        })
      }
    });
  }

  async setSelectItem(item) {
    if (this.state.selectedItem.indexOf(item) > -1) {
      return await this.removeSelectItem(item);
    }

    if (this.state.selectedItem.length < 2) {
      this.state.selectedItem.push(item);
      this.state.selectRecordId[item.recordID] = true;

      await this.setState({selectedItem: this.state.selectedItem, selectRecordId: this.state.selectRecordId});
    } else {
      Toast('最多选择2位紧急联系人');
    }
  }

  async removeSelectItem(item) {
    if (this.state.selectedItem.indexOf(item) > -1) {
      this.state.selectedItem = removeArr(this.state.selectedItem, item);
      delete this.state.selectRecordId[item.recordID];

      await this.setState({selectRecordId: this.state.selectRecordId, selectedItem: this.state.selectedItem});
    }
  }

  _renderItem = ({item}) => (

    <TouchableOpacity style={styles.item} onPress={async () => {
      await this.setSelectItem(item)
    }}>
      <Image style={styles.itemIcon}
             source={this.state.selectRecordId[item.recordID] === true ? okOn : okOff}/>
      <Text style={styles.itemText}>{item['familyName']}{item['middleName']}{item['givenName']}</Text>
    </TouchableOpacity>

  );

  _keyExtractor = (item) => item.recordID;

  render() {
    const sA = [];
    console.log('this.state.selectedItem', typeof this.state.selectedItem, this.state.selectedItem);

    for (let s of this.state.selectedItem) {
      sA.push(<SelectedItem key={s.recordID} item={s} onDelete={async (item) => {
        await this.removeSelectItem(item)
      }}/>)
    }


    return (
      <View style={styles.container} onLayout={(event) => {
        const {x, y, width, height} = event.nativeEvent.layout;
        this.setState({wvh: height - p.td(110)})
      }}>
        <View style={styles.header}>
          {sA}
        </View>
        <ScrollView style={[styles.body, {height: this.state.wvh}]}>
          <FlatList
            data={this.state.contacts}
            extraData={this.state}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
          />
        </ScrollView>

        <RedBtn show={true} title='确定' style={styles.sureBtn} onPress={
          () => {
            this.props.navigation.navigate('AuthenticationCenter', {
              r: {
                status: true,
                statusName: 'backContact',
                selectedItem: this.state.selectedItem,
                selectRecordId: this.state.selectRecordId
              }
            })
          }
        }/>
      </View>
    );

  }

}


const styles = StyleSheet.create({
  sureBtn: {
    width: p.td(300),
    left: p.td(225),
    bottom: p.td(50),
    position: 'absolute',
  },
  selectedItemText: {
    lineHeight: p.td(64),
    fontSize: p.td(28),
    color: '#4F5A6E'
  },
  selectedItem: {
    borderWidth: p.td(2),
    borderColor: '#ddd',
    borderRadius: p.td(34),
    height: p.td(68),
    paddingLeft: p.td(28),
    paddingRight: p.td(28),
    backgroundColor: '#f7f7f7',
    marginRight: p.td(12)
  },
  body: {
    // position: 'absolute',
    width: p.td(750),
    marginTop: p.td(18)
  },
  itemText: {
    position: 'absolute',
    lineHeight: p.td(92),
    color: '#4F5A6E',
    fontSize: p.td(34),
    left: p.td(82),
    top: 0,
  },
  itemIcon: {
    width: p.td(36),
    height: p.td(36),
    position: 'absolute',
    left: p.td(34),
    top: p.td(28)
  },
  item: {
    width: p.td(750),
    height: p.td(92),
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    position: 'relative',
    backgroundColor: '#fff'
  },
  container: {
    width: p.td(750),
    backgroundColor: '#f7f7f7',
    position: 'relative',
    height: p.h,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderTopColor: '#C6C8C9',
    borderTopWidth: 1
  },
  header: {
    height: p.td(92),
    backgroundColor: '#fff',
    width: p.td(750),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: p.td(16),
    paddingTop: p.td(12)
  },
  containerC: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  }

});
export default createStackNavigator({
  Contacts: {
    screen: Contacts
  }
}, {
  initialRouteName: 'Contacts',
  headerMode: 'screen',
  headerLayoutPreset: 'center',
  navigationOptions: {
    headerStyle: {
      backgroundColor: '#fff',
      borderBottomColor: '#fff',
      elevation: 0,
      ...Platform.select({
        android: {
          height: 56 + StatusBar.currentHeight,
          paddingTop: StatusBar.currentHeight
        }
      }),
    },
    headerTitleStyle: {
      fontSize: p.td(36),
      color: '#4F5A6E'
    }
  }
});
*/
