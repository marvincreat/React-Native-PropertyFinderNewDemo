/**
 * Created by Marvin on 16/9/22.
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableHighlight,
    ActivityIndicator,
    Image
} from 'react-native';

import SearchResults from './SearchResults';

const styles = StyleSheet.create({
    description: {
        marginBottom: 20,
        fontSize: 18,
        textAlign: 'center',
        color: '#656565'
    },
    container: {
        padding: 30,
        marginTop: 65,
        alignItems: 'center'
    },
    flowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch'
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center'
    },
    button: {
        height: 36,
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    searchInput: {
        height: 36,
        padding: 4,
        marginRight: 5,
        flex: 3,
        fontSize: 12,
        borderWidth: 1,
        borderColor: '#48BBEC',
        borderRadius: 8,
        color: '#48BBEC'
    },
    image: {
        width: 217,
        height: 138
    }

});

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
    //http://api.nestoria.co.uk/api?country=uk&pretty=1&encoding=json&listing_type=buy&action=search_listings&page=1&place_name=london
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
        //console.log('onSearchTextChanged');
        this.setState({searchString: text})
        //console.log(this.state.searchString);
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


//module .exports = SearchPage;

