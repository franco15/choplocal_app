import React from "react";
import { Button, StyleSheet, Switch, Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {images} from '../constants/images';

const Wallet = () => {
    return (
        <SafeAreaView style={styles.container} className="items-center">
            <Text style={styles.header} className="text-5xl">Blue Whale</Text>
            <Text style={styles.subheader} className="text-1xl">Coffee Shop, San Diego</Text>
            <Text style={styles.location}>834 Kline St., San Diego, California 92037</Text>
            <Text style={styles.location}>Your new favorite café for the locals 🌴& for those just swimming through 🐋</Text>
            <Text className="text-2xl" style={styles.location}>Your stamps 15</Text>
            <Button title="Recommend this restaurant"/>
            <View style={styles.switchContainer}>
            <Text>Wallet / Loyalty Rewards</Text>
            <Switch/>
            </View>
            <Text>
                Your Wallet
            </Text>
            <Text>
                Balance: $200 USD
            </Text>
         <Image style={styles.qr} source={images.qrExample}/>
        </SafeAreaView>
    );
};

export default Wallet;

const styles = StyleSheet.create({
    container: {
        flex:1,
    },
    header: {
        marginTop: 65,
        fontWeight: 800,
    },
    subheader: {
        fontSize: 15,
    },
    location:{
        fontSize: 11,
        marginTop: 50,
    },
    switchContainer: {
        marginTop: 10,
        paddingHorizontal: 10,
        flexDirection: "row",
    },
    qr: {
        width: 196,
        height: 206,
    }
});
