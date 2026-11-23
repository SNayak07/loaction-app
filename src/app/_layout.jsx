import React, { useState } from 'react';
import {
    View,
    Text,
    Button,
    Alert,
    StyleSheet
} from 'react-native';

import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import { File, Paths } from 'expo-file-system';

export default function App() {

    const [file, setFile] = useState(null);

    const uploadFile = async () => {

        try {

            const result = await DocumentPicker.getDocumentAsync({
                copyToCacheDirectory: true,
            });

            if (!result.canceled) {

                const selectedFile = result.assets[0];

                const sourceFile = new File(selectedFile.uri);

                const safeName =
                    selectedFile.name || `document_${Date.now()}`;

                const destinationFile = new File(
                    Paths.cache,
                    safeName
                );

                if (destinationFile.exists) {
                    destinationFile.delete();
                }

                sourceFile.copy(destinationFile);

                setFile({
                    ...selectedFile,
                    uri: destinationFile.uri,
                });

            }

        } catch (error) {

            console.log(error);

            Alert.alert(
                'Error',
                'Unable to select the document'
            );

        }

    };


    const shareFile = async () => {

        if (!file) {

            Alert.alert(
                'Please select a document first'
            );

            return;

        }

        try {

            const available =
                await Sharing.isAvailableAsync();

            if (!available) {

                Alert.alert(
                    'Sharing is not available on this device'
                );

                return;

            }

            await Sharing.shareAsync(
                file.uri
            );

        } catch (error) {

            console.log(error);

            Alert.alert(
                'Error',
                'Unable to share the document'
            );

        }

    };


    return (

        <View style={styles.container}>

            <Text style={styles.title}>
                Document App
            </Text>
            <Text style={styles.title}>
                Document App
            </Text>


            <Button
                title="Upload Document"
                onPress={uploadFile}
            />


            {file && (

                <View>

                    <Text style={styles.name}>
                        Selected: {file.name}
                    </Text>


                    <Text style={styles.uri}>
                        {file.uri}
                    </Text>


                    <Button
                        title="Share Document"
                        onPress={shareFile}
                    />

                </View>

            )}

        </View>

    );

}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 25,
        backgroundColor: '#F0F8FF',
    },

    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
    },

    name: {
        fontSize: 16,
        marginTop: 25,
        marginBottom: 10,
    },

    uri: {
        fontSize: 11,
        marginBottom: 30,
        color: 'gray',
    },

});