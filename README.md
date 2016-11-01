# React-Native-PropertyFinderNewDemo
PropertyFinder New Demo (Base on React Native 0.36)
### 教程的原文链接：https://www.raywenderlich.com/126063/react-native-tutorial

#### 中文链接：http://www.kancloud.cn/digest/reactvavtive/75166

### （由于RN更新的缘故，于是对源代码进行了适配，基于目前的0.36版本）


---
# Demo学习笔记
### PART1:综述
### 1. 关于代码整体结构
    
##### 第一块是加载 react-native 模块及所需要的原生组件如image组件，以及引入其他js文件的组件
    
```
//加载各种原生组件
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    NavigatorIOS
} from 'react-native';

//引入其他JS组件
import SearchPage from './SearchPage';
```
写法比较固定，如果用到的原生组件未引入，会报错。

##### 第二块布局样式

```
var styles = StyleSheet.create({
    thumb: {
        width:80,
        height:80,
        marginRight:10
    },
    textContainer: {
        flex: 1
    },
    separator: {
        height: 1,
        backgroundColor: '#dddddd'
    },
    price:{
        fontSize: 25,
        fontWeight: 'bold',
        color: '#48BBEC'
    },
    title: {
        fontSize: 20,
        color: '#48BBEC'
    },
    rowContainer: {
        flexDirection: 'row',
        padding: 10
    }
});

```
##### 第三块自定义组件部分，包括可以被其他js文件引用的组件，组件里面有属性声明，自定义方法，以及渲染界面等


```
//自定义新组件
function urlForQueryAndPage(key, value, pageNumber) {
    var data = {
        country: 'uk',
        pretty: '1',
        encoding: 'json',
        listing_type: 'buy',
        action: 'search_listings',
        page: pageNumber
    };
    data[key] = value;

    var querystring = Object.keys(data).map(key => key + '=' + encodeURIComponent(data[key])).join('&');
    console.log(querystring);
    return 'http://api.nestoria.co.uk/api?' + querystring;
};

//可供外部访问的组件定义方法
export default class SearchPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchString: 'london',
            isLoading: false,
            message: ''
        }
    };

    onSearchTextChanged(text) {
        console.log('onSearchTextChanged');
        this.setState({searchString: text})
        console.log(this.state.searchString);
    };

    _executeQuery(query) {
        console.log(query);
        this.setState({
            isLoading: true
        });
        fetch(query)
        .then(response => response.json())
        .then(json => this._handleResponse(json.response))
        .catch(error =>
            this.setState({
                isLoading: false,
                message: 'Something bad happend ' + error
            })
        );
    };

    _handleResponse(response) {
        this.setState({ isLoading: false , message: '' });
        if (response.application_response_code.substr(0, 1) === '1') {
            //console.log('Properties found: ' + response.listings.length);
            this.props.navigator.push({
                title: 'Results',
                component: SearchResults,
                passProps: {listings: response.listings} //passProps中传递的属性
            });
        } else {
            this.setState({ message: 'Location not recognized; please try again.'});
        }
    }


    onSearchPressed() {
        var query = urlForQueryAndPage('place_name', this.state.searchString, 1);
        this._executeQuery(query);
    };

    render() {
        console.log('SearchPage.render');
        var spinner = this.state.isLoading ?
            ( <ActivityIndicator size='large'/>) :
            ( <View/>)
        return (
            <View style={styles.container}>
                <Text style={styles.description}>
                    Search for houses to buy!
                </Text>
                <Text style={styles.description}>
                    Search by place-name, postcode or search near your location.
                </Text>
                <View style={styles.flowRight}>
                    <TextInput
                        style={styles.searchInput}
                        value={this.state.searchString}
                        onChangeText={(text) => this.onSearchTextChanged(text)}
                        placeholder='Search via name or postcode'>
                    </TextInput>
                    <TouchableHighlight
                        style={styles.button}
                        underlayColor='#99D9F4'
                        onPress={this.onSearchPressed.bind(this)}>
                        <Text style={styles.buttonText}>Go</Text>
                    </TouchableHighlight>
                </View>
                <TouchableHighlight
                    style={styles.button}
                    underlayColor='#99D9F4'>
                    <Text style={styles.buttonText}>Location</Text>
                </TouchableHighlight>
                <Image
                    source={ require('./Resources/house.png')}
                    style={styles.image}
                />
                <Text style={styles.description}>{this.state.message}</Text>
                {spinner}


            </View>
        );
    }
}

//module .exports = SearchPage;//另一种写法，供外部访问

```
最后是AppRegistry，用来告知React Native哪一个组件被注册为整个应用的根容器。一般在整个应用里AppRegistry.registerComponent这个方法只会调用一次。

```
AppRegistry.registerComponent('PropertyFinder', () => PropertyFinderApp);

```


### 2. 关于布局
与css3类似等布局，而flex部分主要是

- flexDirection（决定主轴是水平row还是垂直column）
- justifyContent（子元素沿着主轴的排列方式，flex-start、center、flex-end、space-around以及space-between）
- alignItems（子元素沿着垂直与主轴的次轴的排列方式，lex-start、center、flex-end以及stretch）
- flexWrap (是否支持弹性nowrap | wrap | wrap-reverse)

### 3. 关于网络请求
由于之前未接触过fetch api，基本过程如下，需要进一步熟悉和研究

```
//将请求参数生成url进行请求
function urlForQueryAndPage(key, value, pageNumber) {
    var data = {
        country: 'uk',
        pretty: '1',
        encoding: 'json',
        listing_type: 'buy',
        action: 'search_listings',
        page: pageNumber
    };
    data[key] = value;

    var querystring = Object.keys(data).map(key => key + '=' + encodeURIComponent(data[key])).join('&');
    console.log(querystring);
    return 'http://api.nestoria.co.uk/api?' + querystring;
};

//执行请求
    _executeQuery(query) {
        console.log(query);
        this.setState({
            isLoading: true
        });
        fetch(query)
        .then(response => response.json())
        .then(json => this._handleResponse(json.response))
        .catch(error =>
            this.setState({
                isLoading: false,
                message: 'Something bad happend ' + error
            })
        );
    };

    //请求结果判断
    _handleResponse(response) {
        this.setState({ isLoading: false , message: '' });
        if (response.application_response_code.substr(0, 1) === '1') {
            //console.log('Properties found: ' + response.listings.length);
            this.props.navigator.push({
                title: 'Results',
                component: SearchResults,
                passProps: {listings: response.listings} //passProps中传递的属性
            });
        } else {
            this.setState({ message: 'Location not recognized; please try again.'});
        }
    }


    //请求传递参数
    onSearchPressed() {
        var query = urlForQueryAndPage('place_name', this.state.searchString, 1);
        this._executeQuery(query);
    };
```

### 4. 关于导航
在进一步研究中

initialRoute 
它定义了Navigator的初始化组件，该组件将在应用启动时加载。

configureScene 
配置界面与界面之间跳转时的动画效果

renderScene 
渲染对应的组件

passProps传参等


```
this.props.navigator.push({
                title: 'Results',//push目标页导航title
                component: SearchResults,//push目标
                passProps: {listings: response.listings} 
                //passProps中传递的属性
            });
```


---
### PART 2 实现过程 架构设计分析

**主要构成文件是：index.ios.js(注册APP根容器组件)/SearchPage.js（根容器组件对应的View）/SearchResults.js（搜索结果列表View）/PropertyView.js（搜索结果详情页View）**

**==index.ios.js==** 

含有一个名为PropertyFinder的自定义组件，类似rootview，

```
class PropertyFinderApp extends Component {
    render() {
        return (
            <NavigatorIOS
                style = {styles.container}
                initialRoute = {{
                title: 'Property Finder',
                component: SearchPage,
                }} />
        )
    }
}
```
将该组件注册为APP的根容器，

```
AppRegistry.registerComponent('PropertyFinder', () => PropertyFinderApp);

```
并引入另一个名为SearchPage.js文件，

```
import SearchPage from './SearchPage';

```
调用其中的SearchPage组件作为根容器的视图，

```
            <NavigatorIOS
                style = {styles.container}
                initialRoute = {{
                title: 'Property Finder',
                component: SearchPage,
                }} />

```
注意NavigatorIOS它是基于UINavigationController封装的仅供iOS使用，如果要兼容Android，可以使用纯JavaScript实现的导航栈Navigator，参考下面两个文章

导航对比：
https://github.com/reactnativecn/react-native-docs-cn/blob/master/docs/0.31/navigation.md

Navigator介绍：
http://bbs.reactnative.cn/topic/20/%E6%96%B0%E6%89%8B%E7%90%86%E8%A7%A3navigator%E7%9A%84%E6%95%99%E7%A8%8B

**==SearchPage.js==** 

该文件包含一个SearchPage的组件供外部引用：

```
export default class SearchPage extends Component {...}

```


包括几部分:

构造函数，每个React组件都有一个state对象，它是一个键值存储对象。在组件被渲染之前，我们可以设置组件的state对象。（类似iOS的属性声明），声明了搜索关键字，加载动画状态，以及提示信息。

```
    constructor(props) {
        super(props);
        this.state = {
            searchString: 'london',
            isLoading: false,
            message: ''
        }
    };
```
渲染界面，用于首页view的界面布局

```
    render() {
        console.log('SearchPage.render');
        var spinner = this.state.isLoading ?
            ( <ActivityIndicator size='large'/>) :
            ( <View/>)
        return (
            <View style={styles.container}>
                <Text style={styles.description}>
                    Search for houses to buy!
                </Text>
                <Text style={styles.description}>
                    Search by place-name, postcode or search near your location.
                </Text>
                <View style={styles.flowRight}>
                    <TextInput
                        style={styles.searchInput}
                        value={this.state.searchString}
                        onChangeText={(text) => this.onSearchTextChanged(text)}
                        placeholder='Search via name or postcode'>
                    </TextInput>
                    <TouchableHighlight
                        style={styles.button}
                        underlayColor='#99D9F4'
                        onPress={this.onSearchPressed.bind(this)}>
                    <Text style={styles.buttonText}>Go</Text>
                </TouchableHighlight>
                </View>
                <TouchableHighlight
                    style={styles.button}
                    underlayColor='#99D9F4'
                    onPress = {this.onLocationPressed.bind(this)}>
                    <Text style={styles.buttonText}>Location</Text>
                </TouchableHighlight>
                <Image
                    source={ require('./Resources/house.png')}
                    style={styles.image}
                />
                <Text style={styles.description}>{this.state.message}</Text>
                {spinner}


            </View>
        );
    }
}
```
**网络请求方法，包括执行、请求结果处理**

```
    //执行请求
    _executeQuery(query) {
        console.log(query);
        this.setState({
            isLoading: true
        });
        fetch(query)
        .then(response => response.json())
        .then(json => this._handleResponse(json.response))
        .catch(error =>
            this.setState({
                isLoading: false,
                message: 'Something bad happend ' + error
            })
        );
    };

    //请求结果
    _handleResponse(response) {
        this.setState({ isLoading: false , message: '' });
        if (response.application_response_code.substr(0, 1) === '1') {
            //console.log('Properties found: ' + response.listings.length);
            this.props.navigator.push({
                title: 'Results',
                component: SearchResults,
                passProps: {listings: response.listings} //passProps中传递的属性
            });
        } else {
            this.setState({ message: 'Location not recognized; please try again.'});
        }
    };
```

事件方法，触发请求方法

```
   onSearchTextChanged(text) {
        //console.log('onSearchTextChanged');
        this.setState({searchString: text})
        //console.log(this.state.searchString);
    };
```

```
    //搜索事件请求
    onSearchPressed() {
        var query = urlForQueryAndPage('place_name', this.state.searchString, 1);
        this._executeQuery(query);
    };

    //定位事件请求
    onLocationPressed() {
        //获取当前位置
        navigator.geolocation.getCurrentPosition(
            location => {
                var search = location.coords.latitude + ',' + location.coords.longitude;
                this.setState( { searchString: search } );
                var query = urlForQueryAndPage('centre_point', search, 1);
                this._executeQuery(query);
            },
            error => {
                this.setState( {
                    message: 'There was a problem with obtaining your location: ' + error
                });
            }
        );
    }
```
**navigator.geolocation可获取当前位置，如果当前位置获取成功，我们将调用第一个箭头函数，否则调用第二个箭头函数简单显示一下错误信息。**

**如果未开启定位APP集成RN，需要在Info.plist中增加NSLocationWhenInUseUsageDescription字段来启用定位功能。如果使用react-native init创建项目，定位会被默认启用。**

类外部函数，处理请求URL

```
//自定义函数
function urlForQueryAndPage(key, value, pageNumber) {
    var data = {
        country: 'uk',
        pretty: '1',
        encoding: 'json',
        listing_type: 'buy',
        action: 'search_listings',
        page: pageNumber
    };
    data[key] = value;

    var querystring = Object.keys(data).map(key => key + '=' + encodeURIComponent(data[key])).join('&');
    console.log('querystring: ' + querystring);

    return 'http://api.nestoria.co.uk/api?' + querystring;
};
```

**==SearchResults.js==** 

该文件定义了一个组件供外部的SearchPage组件使用，用于展示搜索结果列表，侧重于listView的使用。

```
export default class SearchResults extends Component {...}
```
分为三部分

构造函数用于定义属性，**构建listView的数据源，构建数据源的时候，使用箭头函数对不同的row进行识别。这个函数在ListView进行“一致化”的时候被调用，以便判断列表中的数据是否被改变。Nestoria API有一个guid全局唯一标识符属性，刚好可以用来作为判断的标准。**

```
    constructor(props) {
        super(props);
        //console.log('this.props.listings' + this.props.listings);

        var dataSource = new ListView.DataSource(
            {rowHasChanged: (r1, r2) => r1.guid !== r2.guid});
        this.state = {
            dataSource: dataSource.cloneWithRows(this.props.listings)
        };
    }

```
这里的this.props.listings，就是从上个页面请求到数据以后通过navigatorIOS传过来的

```
            this.props.navigator.push({
                title: 'Results',
                component: SearchResults,
                passProps: {listings: response.listings} //passProps中传递的属性

```

**ListView组件必须的两个属性是dataSource和renderRow。dataSource是列表的数据源，而renderRow则逐个解析数据源中的数据，然后返回一个设定好格式的组件来渲染。**

**rowHasChanged函数也是ListView的必需属性。这里只是简单的比较两行数据是否是同一个数据（===符号只比较基本类型数据的值，和引用类型的地址）来判断某行数据是否变化了。**

**renderRow函数则用于为每个行提供UI**

```
    renderRow(rowData, sectionID, rowID) {
        var price = rowData.price_formatted.split(' ')[0];
        console.log('rowData.price' + price);//rowData.price_formatted可以加上价格符号

        return (
            <TouchableHighlight onPress = {() => this.rowPressed(rowData.guid)}
                underlayColor='#dddddd'>
                <View>
                    <View style = {styles.rowContainer}>
                        <Image style = {styles.thumb} source = {{ uri: rowData.img_url }} />
                        <View style = {styles.textContainer}>
                            <Text style = {styles.price}>
                                {price}
                            </Text>
                            <Text style = {styles.title}
                                numberOfLines={1}>{rowData.title}
                            </Text>
                        </View>
                    </View>
                    <View style = {styles.separator} />
                </View>
            </TouchableHighlight>
        );
    }

```
**rowPressed函数执行行点击事件，并传递详情页参数**

```
    rowPressed(propertyGuid) {
        var property = this.props.listings.filter(prop => prop.guid === propertyGuid)[0];

        this.props.navigator.push({
            title: "Property",
            component: PropertyView,
            passProps: {property: property}
        });
    }
```

**渲染部分，创建listView**

```
render() {
        return (
            <ListView
                dataSource = {this.state.dataSource}
                renderRow = {this.renderRow.bind(this)}/>
        )
    }
```


**==PropertyView.js==** 

这个文件比较简单，渲染一个上面是图片，下面是文字的详情页，引入SearchResults组件里的rowPressed函数传递的参数

```
    rowPressed(propertyGuid) {
        var property = this.props.listings.filter(prop => prop.guid === propertyGuid)[0];

        this.props.navigator.push({
            title: "Property",
            component: PropertyView,
            passProps: {property: property}
        });
    }

```

创建组件，渲染函数

```
export default class PropertyView extends Component {
    render() {
        var property = this.props.property;
        var stats = property.bedroom_number + ' bed ' + property.property_type;
        if (property.bathroom_number) {
            stats += ' . ' + property.bathroom_number + ' ' + (property.bathroom_number > 1 ? 'bathrooms' : 'bathroom');
        }

        var price = property.price_formatted.split(' ')[0];

        return (
            <View style={styles.container}>
                <Image style={styles.image}
                       source={{uri: property.img_url}}/>
                <View style={styles.heading}>
                    <Text style={styles.price}> {price} </Text>
                    <Text style={styles.title}> {property.title} </Text>
                    <View style={styles.separator}/>
                </View>
                <Text style={styles.description}> {stats} </Text>
                <Text style={styles.description}> {property.summary}</Text>
            </View>
        )
    }

}


