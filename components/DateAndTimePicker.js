import React from "react";
import { View, Text, TouchableWithoutFeedback, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AntDesign } from "@expo/vector-icons";
import Colors from "../config/colors";

export default class DateAndTimePicker extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			show: false,
		};
	}

	togglePicker = () => this.setState({ show: !this.state.show });

	setData = (event, selectedDate) => {
		this.setState({ show: false });

		if (typeof selectedDate !== "undefined") {
			let mode =
				typeof this.props.mode !== "undefined" ? this.props.mode : "date";
			if (mode === "time") {
				let hour = new Date(selectedDate).getHours();
				hour = parseInt(hour) > 9 ? hour : "0" + hour;

				let minute = new Date(selectedDate).getMinutes();
				minute = parseInt(minute) > 9 ? minute : "0" + minute;

				let time = hour + ":" + minute;
				this.props.onChange(time);
			} else {
				this.props.onChange(selectedDate);
			}
		}
	};

	getValue = () => {
		if (!!this.props.value) {
			let mode =
				typeof this.props.mode !== "undefined" ? this.props.mode : "date";
			if (mode === "time") {
				let timeArr = this.props.value.toString().split(":");
				var d = new Date();
				d.setHours(timeArr[0]);
				d.setMinutes(timeArr[1]);
				return d;
			} else {
				return this.props.value;
			}
		} else {
			return new Date();
		}
	};

	render = () => {
		let mode =
			typeof this.props.mode !== "undefined" ? this.props.mode : "date";
		return (
			<>
				<TouchableWithoutFeedback onPress={this.togglePicker}>
					<View style={styles.inputContainer}>
						<Text style={styles.inputLable}>{this.props.label}</Text>
						<View style={styles.textInput}>
							{!!this.props.value ? (
								<Text style={{ fontSize: 14, color: Colors.black }}>
									{mode === "date"
										? this.props.value.toDateString()
										: this.props.value}
								</Text>
							) : (
								<Text
									style = {{ fontSize: 14, color: Colors.black, opacity: 0.6 }}
								>
									{mode === "date" ? "DD/MM/YYYY" : "HH:MM"}
								</Text>
							)}
						</View>
					</View>
				</TouchableWithoutFeedback>
				{this.state.show && (
					<DateTimePicker
						testID="dateTimePicker"
						value={this.getValue()}
						mode={mode}
						is24Hour={true}
						display="default"
						onChange={this.setData}
						minimumDate={this.props.minimumDate}
					/>
				)}
			</>
		);
	};
}

const styles = StyleSheet.create({
	inputContainer: {
		width: "100%",
		marginBottom: 25,
	},
	inputLable: {
		fontSize: 16,
		color: Colors.black,
		marginBottom: 10,
		opacity: 0.8,
	},
	textInput: {
		paddingHorizontal: 9,
		paddingVertical: 15,
		width: "100%",
		borderWidth: 1,
		borderRadius: 4,
		borderColor: Colors.textInputBorder,
		backgroundColor: Colors.textInputBg,
	},
});
