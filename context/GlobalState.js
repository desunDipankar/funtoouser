import React from "react";
import AppContext from "./AppContext";

export default class GlobalState extends React.Component {
  constructor(props) {
    super(props);
    
    this.setUserData = (data) => this.setState({ userData: data });
    this.setTotalCartQuantity = (data) => this.setState({ totalCartQuantity: data });
    this.unsetUserData = () => this.setState({ userData: null });

    this.state = {
      userData: props.persistantData,
      setUserData: this.setUserData,
      unsetUserData: this.unsetUserData,
      totalCartQuantity: props.cartQuantity,
      setTotalCartQuantity: this.setTotalCartQuantity,
    };
  }

  render = () => {
    return (
      <AppContext.Provider value={this.state}>
        {this.props.children}
      </AppContext.Provider>
    );
  };
}
