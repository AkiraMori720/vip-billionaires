import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import { RectButton } from 'react-native-gesture-handler';

import styles from './styles';
import LinearGradient from 'react-native-linear-gradient';
import {COLOR_WHITE, HEADER_BAR_START, NAV_BAR_END, NAV_BAR_START} from '../../constants/colors';

const Item = React.memo(({
	id, left, text, onPress, current, containerStyle, textStyle
}) => (
	<TouchableOpacity
		key={id}
		onPress={onPress}
		underlayColor='#292E35'
		activeOpacity={0.3}
		style={[containerStyle, {paddingRight: 24}]}
	>
		{
			current?<LinearGradient colors={[NAV_BAR_END, NAV_BAR_START]} style={styles.item} angle={90} useAngle>
				<View style={styles.itemLeft}>
					{left}
				</View>
				<View style={styles.itemCenter}>
					<Text style={[styles.itemText, textStyle]} numberOfLines={2} ellipsizeMode={'tail'}>
						{text}
					</Text>
				</View>
				<View style={styles.itemsRight}/>
			</LinearGradient>
			:
			<View style={styles.item}>
				<View style={styles.itemLeft}>
					{left}
				</View>
				<View style={styles.itemCenter}>
					<Text style={[styles.itemText, textStyle]} numberOfLines={2} ellipsizeMode={'tail'}>
						{text}
					</Text>
				</View>
				<View style={styles.itemsRight}/>
			</View>
		}
	</TouchableOpacity>
));

Item.propTypes = {
	left: PropTypes.element,
	text: PropTypes.string,
	current: PropTypes.bool,
	onPress: PropTypes.func,
	testID: PropTypes.string,
	showSort: PropTypes.bool
};

export default Item;
