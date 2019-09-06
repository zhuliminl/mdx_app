/*
 * Created by Saul at 2019/06/27
 *
 * 添加紧急联系人
 *
 */

import _ from 'lodash';
import PinYin from 'pinyin';
import React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LargeList } from "react-native-largelist-v3";
import { createStackNavigator } from "react-navigation";
import HeaderBackBtn from '../../cpns/small/HeaderBackBtn';
import { p } from "../../utils/p";
import { tm } from '../../utils/theme';
import Toast from '../../utils/toast';
import SelectedItems from './SelectedItems';
import SideSelector from './SideSelector';



const letters = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('')
const okOn = require('../../images/icons/contact-ok-on.png');
const okOff = require('../../images/icons/contact-ok-off.png');

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
    // console.log('FIN user contacts', contacts)
    // 安卓和苹果返回的格式默认值不一样
    if (Platform.OS === 'ios') {
      contactsFiltered = contacts.filter(item => (item['familyName'] !== '' || item['givenName'] !== ''))
    } else {
      contactsFiltered = contacts.filter(item => (item['familyName'] !== null || item['givenName'] !== null))
      // contactsFiltered = contacts.filter(item => (item['givenName'] !== null))
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

    // 排除 fullName 为空的通讯录
    const contactsWithFullNameFiltered = contactsWithFullName.filter(item => { return item['fullName'] !== '' })

    const contactsWithPinYin = contactsWithFullNameFiltered.map(item => {
      const pinyin = PinYin(item['fullName'])[0][0]
      // const pinyin = PinYin('')[0][0]
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
        items: next,
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
            section.items.forEach(item => {
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
    // console.log('FIN data state', this.state.data)
  }

  componentDidMount() {
    this.props.navigation.setParams({
      reBack: async () => {
        console.log('FIN Contacts Page reBack')
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
    // 在原始数据源里找到当前 title 的 index

    const data = this.state.data
    let sectionIndex = 0
    let hasData = false
    data.forEach((_section, i) => {
      if (_section.title === title) {
        sectionIndex = i
        hasData = true
      }
    })

    if (!hasData) return
    // 组头位置
    const location = {
      section: sectionIndex,
      row: -1,
    }
    this.largeList && this.largeList.scrollToIndexPath(location)
      .then(() => {
        console.log('FIN scroll ok')
      })
      .catch(err => {
        console.log('FIN scrollToTitle err', err)
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
          const _item = section.items[index]
          // 更新被选中的联系人
          this.updateSelected(_item)
          section.items[index] = { ..._item, isSelected: !_item.isSelected }
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
        section.items.forEach(item => {
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
    if (this.state.selectedItem.length < 2) {
      return Toast('请选择两位联系人')
    }

    this.props.navigation.navigate('AuthenticationCenter', {
      r: {
        status: true,
        statusName: 'backContact',
        selectedItem: this.state.selectedItem,
        selectRecordId: this.state.selectRecordId,
      }
    })
  }

  // 组头
  renderSectionHeader = sectionIndex => {
    const section = this.state.data[sectionIndex]
    const title = section.title
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{title}</Text>
      </View>
    )
  }

  renderIndexPath = ({ section: sectionIndex, row: index }) => {

    const section = this.state.data[sectionIndex]
    const title = section.title
    const item = section.items[index]
    const isSelected = item.isSelected
    const fullName = item['fullName']

    /*
    console.log('FIN sectionIndex', sectionIndex)
    console.log('FIN row index', index)
    console.log('FIN section data', section)
    console.log('FIN item data', item)
    console.log('FIN xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    */

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          this.handleItemSelected({ title, index, recordID: item.recordID })
        }}
      >
        <Image
          style={styles.itemIcon}
          source={isSelected ? okOn : okOff} />
        <Text style={styles.itemText}>{fullName}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    let { data } = this.state
    if (data && data.length === 0) {
      return (
        <View style={styles.blank}>
          <Text style={styles.blankText}>您的通讯录有效联系人为空</Text>
        </View>
      )
    }

    return (
      <View style={styles._container}>
        <SelectedItems
          items={this.state.selectedItem}
          onPress={this.handleItemDelete}
        />
        <LargeList
          ref={c => { this.largeList = c }}
          style={styles.container}
          heightForSection={() => 50}
          heightForIndexPath={() => 50}
          data={this.state.data}
          renderIndexPath={this.renderIndexPath}
          renderSection={this.renderSectionHeader}
          renderFooter={this.renderFooter}
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


const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: p.h,

  },
  section: {
    flex: 1,
    backgroundColor: "gray",
    justifyContent: "center",
    alignItems: "center"
  },
  row: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  line: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 1,
    backgroundColor: "#EEE"
  },

  _container: {
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
    flex: 1,
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

  item: {
    backgroundColor: '#FFF',
    paddingLeft: p.td(33),
    borderBottomWidth: 1,
    alignItems: 'center',
    borderBottomColor: '#F5F6F7',
    flexDirection: 'row',
    height: ITEM_HEITHT,
  },
  itemIcon: {
    // position: 'relative',
    width: p.td(36),
    height: p.td(36),
  },
  itemText: {
    marginLeft: p.td(10),
    fontSize: p.td(34),
    color: '#333',
  },
  blank: {
    paddingTop: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blankText: {
    color: '#666'
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
