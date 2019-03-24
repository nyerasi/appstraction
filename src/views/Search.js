import React from "react";
import { ScrollView, View, Image } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

import { BackHeader } from "../components/Headers";
import { SearchBar } from "../components/Inputs";
import SearchResult from "../components/SearchResult/SearchResult";
import { Footer } from "../components/Footer";
import { Title, SubTitle } from "../components/Text";

import firebase from "../data/firebase";

const styles = EStyleSheet.create({
  mainView: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "$primaryGray"
  },
  subtitle: {
    fontFamily: "Gotham Book, sans-serif",
    lineHeight: 24,
    fontSize: 16,
    color: "#000000"
  }
});

export default class Search extends React.Component {
  state = {
    artDetails: -1
  };

  componentShouldUpdate() {
    //check if we should render the component again (has text changed?)

  }

  componentDidMount() {
    // fetch data from firebase and update state accordingly
    firebase
      .database()
      .ref()
      .once("value")
      .then(snapshot => {
        let artDetails = snapshot.val();

        // assumes data is formatted correctly... TODO: error check data
        this.setState({
          artDetails: artDetails
        });
      })
      .catch(error => {
        this.setState({
          artDetails: null
        });
      });
  }

  updateSearchResults(searchText) {
    console.log(searchText);
    this.setState({ searchText });


  }

  render() {
    let viewToRender = (
      <Image
        style={{ marginTop: 100, width: 100, height: 100 }}
        source={require("../assets/loading.gif")}
      />
    );

    if (this.state.artDetails !== -1) {
      viewToRender = (
        <View style={{ flex: 1, width: "100%"}}>
          <SearchBar
            onChangeText={searchText => this.setState({ searchText })}
          />
          <SubTitle style={{ lineHeight: "1.3em", fontSize: "1.2rem", textAlign: "center", paddingVertical: 10 }}>
            Results for "{this.state.searchText}"
          </SubTitle>
          <ScrollView
            bounces={false}
            alwaysBounceVertical={false}
            contentContainerStyle={{ alignItems: "center" }}
            style={{
              flex: 1,
              width: "100%",
              paddingTop: 10,
              paddingBottom: 40,
              paddingHorizontal: 20
            }}
          >
            {Object.keys(this.state.artDetails).map(
              function(key, index) {
                const artDetails = this.state.artDetails;
                console.log(artDetails)
                return (
                  <SearchResult
                    key={index}
                    name={artDetails[key].name}
                    year="1987"
                    link={key}
                    photoFileLink={artDetails[key].photoFileLink}
                  />
                );
              }.bind(this)
            )}
            <Footer />
          </ScrollView>
        </View>
      );
    }

    return (
      <View
        style={{
          flex: 1
        }}
        className="back-item"
      >
        <BackHeader />

        {/* CONTENT */}
        <View style={styles.mainView}>{viewToRender}</View>
      </View>
    );
  }
}
