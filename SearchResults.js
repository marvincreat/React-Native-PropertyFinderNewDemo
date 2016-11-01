/**
 * Created by Marvin on 16/9/22.
 */

'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    View,
    TouchableHighlight,
    ListView,
    Text
} from 'react-native';

import PropertyView from './PropertyView';

var styles = StyleSheet.create({
    thumb: {
        width:80,
        height:80,
        marginRight:10
    },
    textContainer: {
        flex: 1,

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
        color: '#48BBEC',
        marginTop:10
    },
    rowContainer: {
        flexDirection: 'row',
        padding: 10,
    }
});

export default class SearchResults extends Component {
    constructor(props) {
        super(props);
        //console.log('this.props.listings' + this.props.listings);

        var dataSource = new ListView.DataSource(
            {rowHasChanged: (r1, r2) => r1.guid !== r2.guid});
        this.state = {
            dataSource: dataSource.cloneWithRows(this.props.listings)
        };
    }

    renderRow(rowData, sectionID, rowID) {
        var price = rowData.price_formatted.split(' ')[0];
        //console.log('rowData' + rowData);
        //console.log('rowData.price' + rowData.price);
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

    rowPressed(propertyGuid) {
        var property = this.props.listings.filter(prop => prop.guid === propertyGuid)[0];

        this.props.navigator.push({
            title: "Property",
            component: PropertyView,
            passProps: {property: property}
        });
    }

    render() {
        return (
            <ListView
                dataSource = {this.state.dataSource}
                renderRow = {(rowData) => this.renderRow(rowData)} />
        )
    }
}