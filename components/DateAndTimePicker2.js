
import React from "react";
import { View, Text, TouchableWithoutFeedback, StyleSheet, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AntDesign } from "@expo/vector-icons";
import Colors from "../config/colors";
import { Ionicons } from "@expo/vector-icons";
import { showDate, showDateAsClientWant, showTimeAsClientWant } from "../utils/Util";

let am_pm = "AM";

export default class DateAndTimePicker2 extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			show: false,
		};
	}

	togglePicker = () => this.setState({ show:!this.state.show });

	setData = (event, selectedDate) => {
		this.setState({ show: false });

		if (typeof selectedDate !== "undefined") {
			let mode =
				typeof this.props.mode !== "undefined" ? this.props.mode : "date";
			if (mode === "time") {
				let hour = new Date(selectedDate).getHours();
				// console.log(hour)

				if (hour > 12) {
					am_pm = "PM";
					hour = hour - 12;
				}
				else {
					am_pm = "AM";
					hour = parseInt(hour) > 9 ? hour : "0" + hour;
					let minute = new Date(selectedDate).getMinutes();
					minute = parseInt(minute) > 9 ? minute : "0" + minute;
                
					let time = hour + ":" + minute + " " + am_pm;
					this.props.onChange(time);
				}
			} else {
				this.props.onChange(selectedDate);
			}
		}
	};

	getValue = () => {
		if (!this.props.value) {
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

	getMonthName = (monthId) => {
		if (monthId == 0) {
			return 'Jan';
		} else if (monthId = 1) {
			return 'Feb';
		} else if (monthId = 2) {
			return 'Mar';
		} else if (monthId = 3) {
			return 'Apr';
		} else if (monthId = 4) {
			return 'May';
		} else if (monthId = 5) {
			return 'Jun';
		} else if (monthId = 6) {
			return 'Jul';
		} else if (monthId = 7) {
			return 'Aug';
		} else if (monthId = 8) {
			return 'Sep';
		} else if (monthId = 9) {
			return 'Oct';
		} else if (monthId = 10) {
			return 'Nov';
		} else if (monthId = 11) {
			return 'Dec';
		}
	}

	getDayName = (dayId) => {
		if (dayId == 0) {
			return 'Sun';
		} else if (dayId == 1) {
			return 'Mon';
		} else if (dayId == 2) {
			return 'Tue'
		} else if (dayId == 3) {
			return 'Wed';
		} else if (dayId == 4) {
			return 'Thu';
		} else if (dayId == 5) {
			return 'Fri';
		} else if (dayId == 6) {
			return 'Sat';
		}
	}

	formatDate = (date) => {
		return `${date.getDate()}-${this.getMonthName(date.getMonth())}-${date.getFullYear()} (${this.getDayName(date.getDay())})`;
	}

	render = () => {
		let mode =
			typeof this.props.mode !== "undefined" ? this.props.mode : "date";
		return (
			<>
				<TouchableWithoutFeedback onPress={this.togglePicker}>
					<View style={[styles.inputContainer, this.props.containerStyle]}>
						<View style={[styles.textInput, this.props.textInputStyle]}>
							{!!this.props.value ? (
								<Text style={{ fontSize: 14, color: Colors.black, opacity: 0.8}}>
									{mode === "date"
										? showDateAsClientWant(this.props.value)
										: (this.props.value)}
								</Text>
							) : (
								<Text style={{ fontSize: 14, color: Colors.black, opacity: 0.8 }} >
									{mode === "date" ? "DD/MM/YY" : this.props.placeholder ?? "HH:MM"}

								</Text>
							)}
						</View>
					</View>
				</TouchableWithoutFeedback>

				{this.state.show && (
					<View style={{ alignItems: 'flex-start', width: '100%' }}>
						<DateTimePicker
							testID="dateTimePicker"
							value={this.getValue()}
							mode={mode}
							is12Hour={true}
							display={Platform.OS == 'android' ? 'default' : "compact"}
							onChange={this.setData}
							minimumDate={this.props.minimumDate}
							style={{ width: 90}}
						/>
					</View>
				)}
			</>
		);
	};
}

const styles = StyleSheet.create({
	inputContainer: {
		width: "100%",
		//marginBottom: 25,
	},
	inputLable: {
		fontSize: 16,
		color: Colors.black,
		marginBottom: 10,
		marginLeft: 0,
		opacity: 0.8,

	},
	textInput: {
		paddingHorizontal: 9,
		paddingVertical: 14,
		width: "100%",
		borderWidth: 0,
		borderRadius: 0,
		borderColor: Colors.textInputBorder,
		// backgroundColor: Colors.textInputBg,
		backgroundColor: "#fff",
		marginTop: 0.2,
		height: 44
	},
});

