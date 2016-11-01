/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
'use strict';
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


const styles = StyleSheet.create({
    text: {
        color: 'black',
        backgroundColor: 'white',
        fontSize: 30,
        margin: 60
    },
    container: {
        flex: 1,
    }
});

//class HelloWorld extends React.Component {
//    render() {
//        return (
//            <Text style={styles.text}>
//                Hello World!(Again)
//            </Text>
//        );
//    }
//}

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


AppRegistry.registerComponent('PropertyFinder', () => PropertyFinderApp);
