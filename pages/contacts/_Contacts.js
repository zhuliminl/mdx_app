/*
 * Created by Saul at 2019/06/27
 *
 * 添加紧急联系人
 * 由于 RN 的性能问题，当前组件已被废弃
 *
 */

import React from 'react';
import { View, Text, StyleSheet, SectionList, Platform, Image, TouchableOpacity, StatusBar } from 'react-native';
import { createStackNavigator } from "react-navigation";
import { LargeList } from "react-native-largelist-v3";
import _ from 'lodash'
import PinYin from 'pinyin'
import PubSub from "pubsub-js";

import { p } from "../../utils/p";
import { tm } from '../../utils/theme'
import Toast from '../../utils/toast'
import HeaderBackBtn from '../../cpns/small/HeaderBackBtn'

import SearchBar from './SearchBar'
import SelectedItems from './SelectedItems'
import SideSelector from './SideSelector'
import Cell from './Cell'

const letters = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('')

const ITEM_HEITHT = 50

class Contacts extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <HeaderBackBtn navigation={navigation} />
      ),
      headerTitle: '选择2位紧急联系人'
    }

  };

  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      selectedItem: [],
      selectRecordId: {},
      wvh: 0,
      data: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.navigation.state.params.contacts && nextProps.navigation.state.params.contacts.length > 0) {
      this.setState({ contacts: nextProps.navigation.state.params.contacts }, this.convertContactsToSourceData);
    }
  }

  // 给通讯录数据分组
  convertContactsToSourceData = () => {
    const { contacts } = this.state
    // 过滤一些非常规的用户格式
    let contactsFiltered = []
    // 安卓和苹果返回的格式默认值不一样
    if (Platform.OS === 'ios') {
      contactsFiltered = contacts.filter(item => (item['familyName'] !== '' || item['givenName'] !== ''))
    } else {
      contactsFiltered = contacts.filter(item => (item['givenName'] !== null))
    }

    const contactsWithFullName = contactsFiltered.map(item => {
      const familyName = item['familyName'] || ''
      const middleName = item['middleName'] || ''
      const givenName = item['givenName'] || ''
      return {
        ...item,
        fullName: familyName + middleName + givenName,
      }
    })
    const contactsWithPinYin = contactsWithFullName.map(item => {
      const pinyin = PinYin(item['fullName'])[0][0]
      const firstLetter = pinyin[0] || 'a'
      return {
        ...item,
        firstLetter: firstLetter.toUpperCase(),
      }
    })

    const contactsGroupByFirstLetter = _.groupBy(contactsWithPinYin, d => d.firstLetter)
    const data = _.reduce(contactsGroupByFirstLetter, (acc, next, key) => {
      acc.push({
        title: key,
        data: next,
      })
      return acc
    }, [])
    data.sort((a, b) => a.title.localeCompare(b.title))
    this.setState({ data }, this.updateSelectedItemByAnotherPage)
  }

  // 根据认证页面的数据，渲染最新状态
  updateSelectedItemByAnotherPage = () => {
    const selectedItem = this.props.navigation.state.params.selectedItem
    if (selectedItem) {
      this.setState({
        selectedItem,
        data: this.state.data.map(section => {
          selectedItem.forEach(_item => {
            section.data.forEach(item => {
              if (item.recordID === _item.recordID) {
                item.isSelected = true
              }
            })
          })
          return section
        })
      })
    }

    if (this.props.navigation.state.params.selectRecordId) {
      this.setState({ selectRecordId: this.props.navigation.state.params.selectRecordId })
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
      reBack: async () => {
        // 返回的时候清除数据
        await this.setState({ contacts: [], selectedItem: [], selectRecordId: {} });
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

  scrollToTitle = title => {

    const { data } = this.state
    let sectionIndex = 0
    let hitFlag = false
    data.forEach((item, i) => {
      if (item.title === title) {
        sectionIndex = i
        hitFlag = true
      }
    })
    if (!hitFlag) return
    PubSub.publish('TITLE_CHANGE', title)
    this.sectionList && this.sectionList.scrollToLocation({
      animated: true,
      sectionIndex,
      itemIndex: 0,
      viewPosition: 0
    })
  }

  handleItemSelected = (item) => {
    const { selectedItem } = this.state

    let hasSelected = false
    selectedItem.forEach(_item => {
      if (item.recordID === _item.recordID) {
        hasSelected = true
      }
    })

    // 当点击当前选中之外的项目，则判断是否超过最高数量。但是点击当前已选中的项目，则进行删除选中动作
    if (selectedItem.length >= 2 && !hasSelected) {
      return Toast('最多选择两位联系人')
    }

    const { title, index } = item
    this.setState({
      data: this.state.data.map((section, i) => {
        if (section.title === title) {
          const _item = section.data[index]
          // 更新被选中的联系人
          this.updateSelected(_item)
          section.data[index] = { ..._item, isSelected: !_item.isSelected }
        }
        return section
      })
    })
  }

  updateSelected = item => {
    const { selectedItem } = this.state
    const { isSelected } = item
    if (isSelected) {
      let nextSelectedItem = selectedItem.filter(_item => _item.recordID !== item.recordID)
      this.setState({
        selectedItem: nextSelectedItem,
      })
    } else {
      selectedItem.push(item)
      this.setState({
        selectedItem,
      })
    }
  }

  handleItemDelete = recordID => {
    this.setState({
      selectedItem: this.state.selectedItem.filter(item => item.recordID !== recordID)
    })

    const { data } = this.state
    this.setState({
      data: data.map(section => {
        section.data.forEach(item => {
          if (item.recordID === recordID) {
            item.isSelected = false
          }
        })
        return section
      })
    })
  }

  renderFooter = () => (
    <View style={{ height: p.td(200) }}></View>
  )

  handleConfirmBtnClick = () => {
    this.props.navigation.navigate('AuthenticationCenter', {
      r: {
        status: true,
        statusName: 'backContact',
        selectedItem: this.state.selectedItem,
        selectRecordId: this.state.selectRecordId
      }
    })
  }

  // 组头
  renderSectionHeader = ({ section: { title } }) => {
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{title}</Text>
      </View>
    )
  }

  render() {

    // RN 提供的 SctionList 性能跟不上
    return (
      <View style={styles.container}>
        <SelectedItems
          items={this.state.selectedItem}
          onPress={this.handleItemDelete}
        />
        <SectionList
          ref={c => { this.sectionList = c }}
          stickySectionHeadersEnabled={true}
          renderItem={({ item, index, section }) => {
            const { title } = section
            return (
              <Cell
                isSelected={item.isSelected}
                title={title}
                item={item}
                key={index}
                index={index}
                onPress={this.handleItemSelected}
              />
            )
          }}
          renderSectionHeader={this.renderSectionHeader}
          sections={this.state.data}
          keyExtractor={(item, index) => item + index}
          ListFooterComponent={this.renderFooter}
          onScrollToIndexFailed={() => {
            console.log('FIN failed to scorll to Index of')
          }}
        />
        <SideSelector
          handleLetterClick={(title) => {
            this.scrollToTitle(title)
          }}
        />
        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={this.handleConfirmBtnClick}
        >
          <Text style={styles.confirmBtnText}>
            确定
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

// getItemLayout={(data, index) => {
// console.log('FIN Sectionlist optimize', index)
// return {
// length: ITEM_HEITHT,
// offset: ITEM_HEITHT * index,
// index,
// }
// }}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: p.h,
    backgroundColor: '#FFF',
  },
  icon: {
    marginTop: p.td(200),
    marginBottom: p.td(160),
    alignSelf: 'center',
    height: p.td(90),
    width: p.td(90),
  },
  textContainer: {
    fontSize: p.td(30),
    alignSelf: 'center',
  },
  messageText: {
  },
  sectionHeader: {
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
  },
  sectionHeaderText: {
    lineHeight: p.td(80),
    fontSize: p.td(34),
    color: '#666',
    marginLeft: p.td(40),
  },
  confirmBtn: {
    backgroundColor: tm.mainColor,
    borderRadius: p.td(50),
    padding: p.td(30),
    paddingHorizontal: p.td(100),
    position: 'absolute',
    bottom: p.td(40),
    left: p.td(230),
  },
  confirmBtnText: {
    color: '#FFF',
    fontSize: p.td(34),
  },

})


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
          // height: 56 + StatusBar.currentHeight,
          // paddingTop: StatusBar.currentHeight
        }
      }),
    },
    headerTitleStyle: {
      fontSize: p.td(36),
      color: '#4F5A6E'
    }
  }
});
