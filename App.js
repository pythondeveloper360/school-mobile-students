import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Component } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import AllWorks from "./components/AllWorks";
import  Bug  from "./components/Bug";
import styles from "./styles";

const Tabs = createBottomTabNavigator();
export default class App extends Component {
  constructor() {
    super();
    this.login = this.login.bind(this);
    this.state = {
      loggedIn: false,
      appState: "",
      grInput: "",
    };
    this.style = StyleSheet.create(styles);
  }
  componentDidMount() {
    this.auth();
  }
  async auth() {
    const gr = await AsyncStorage.getItem("@gr");
    if (gr) {
      this.setState({ appState: "loading" });
      fetch("https://school-server.herokuapp.com/auth", {
        headers: {
          gr: gr,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.auth) {
            this.setState({ loggedIn: true });
          }
        })
        .finally(() => {
          this.setState({ appState: "" });
        });
    }
  }
  login() {
    if (this.state.grInput) {
      this.setState({ appState: "loading" });
      fetch("https://school-server.herokuapp.com/auth", {
        headers: {
          gr: this.state.grInput,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.auth) {
            AsyncStorage.setItem("@gr", this.state.grInput).then(() => {
              this.setState({ loggedIn: true });
            });
          }
        })
        .finally(() => {
          this.setState({ appState: "" });
        });
    }
  }
  render() {
    return (
      <>
        {this.state.loggedIn ? (
          <NavigationContainer>
            <Tabs.Navigator>
              <Tabs.Screen
                name="All Works"
                component={AllWorks}
                options={{
                  tabBarLabel: "All Works",
                  tabBarIcon: () => (
                    <Icon name="book" size={25} color="#0c9c88" />
                  ),
                }}
              />
              <Tabs.Screen name = 'Report Bug' component={Bug}/>
            </Tabs.Navigator>
          </NavigationContainer>
        ) : (
          <View style={this.style.loginPage}>
            {this.state.appState === "loading" ? (
              <Text style={this.style.loadingBanner}>Loading</Text>
            ) : null}
            <TextInput
              value={this.state.grInput}
              onChangeText={(tex) => {
                this.setState({ grInput: tex });
              }}
              placeholder="GR"
              style={this.style.loginInput}
              keyboardType="number-pad"
            />
            <TouchableOpacity style={this.style.loginBtn}>
              <Button title="Login" onPress={this.login} />
            </TouchableOpacity>
            <TouchableOpacity style={this.style.loginBtn}>
              <Button title="Login with QR code" />
            </TouchableOpacity>
          </View>
        )}
      </>
    );
  }
}
