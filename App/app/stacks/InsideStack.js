import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { ThemeContext } from '../theme';
import {
	outsideHeader, themedHeader, StackAnimation
} from '../utils/navigation';
import {createDrawerNavigator} from "@react-navigation/drawer";

import SidebarView from "../views/SidebarView";
import HomeView from "../views/HomeView";
import PostsView from "../views/HomeView/posts";
import RecentView from "../views/HomeView/recent";
import PopularView from "../views/HomeView/popular";
import ProfileView from '../views/ProfileView';
import ProfileEditView from '../views/ProfileEditView';
import FriendView from '../views/FriendView';
import FollowView from '../views/FollowView';
import CreatePostView from '../views/CreatePostView';
import PostDetailView from '../views/PostDetailView';
import MessageView from '../views/MessageView';
import ChatView from '../views/ChatView';
import SettingView from '../views/SettingView';
import AboutView from '../views/AboutView';
import SecurityView from '../views/SecurityView';
import BlockView from '../views/BlockView';
import OtherProfileView from '../views/OtherProfileView';
import ActivityView from '../views/ActivityView';
import CategoryView from '../views/CategoryView';
import VipMembersClubView from '../views/VipMembersClubView';
import ProductDetailView from '../views/ProductDetailView';
import EditPostView from '../views/EditPostView';
import ProductWebView from '../views/ProductWebView';
import PickLibraryView from '../views/PickLibraryView';

// Outside
const Inside = createStackNavigator();
const InsideStack = () => {
	const { theme } = React.useContext(ThemeContext);

	return (
		<Inside.Navigator screenOptions={{ ...outsideHeader, ...themedHeader(theme), ...StackAnimation }}>
			<Inside.Screen
				name='Home'
				component={HomeView}
			/>
			<Inside.Screen
				name='Posts'
				component={PostsView}
			/>
			<Inside.Screen
				name='Recent'
				component={RecentView}
				options={RecentView.navigationOptions}
			/>
			<Inside.Screen
				name='Popular'
				component={PopularView}
				options={PopularView.navigationOptions}
			/>
			<Inside.Screen
				name='Profile'
				component={ProfileView}
				options={ProfileView.navigationOptions}
			/>
			<Inside.Screen
				name='Activity'
				component={ActivityView}
				options={ActivityView.navigationOptions}
			/>
			<Inside.Screen
				name='ProfileEdit'
				component={ProfileEditView}
			/>
			<Inside.Screen
				name='Friend'
				component={FriendView}
				options={FriendView.navigationOptions}
			/>
			<Inside.Screen
				name='OtherProfile'
				component={OtherProfileView}
				options={OtherProfileView.navigationOptions}
			/>
			<Inside.Screen
				name='Follow'
				component={FollowView}
			/>
			<Inside.Screen
				name='CreatePost'
				component={CreatePostView}
			/>
			<Inside.Screen
				name='EditPost'
				component={EditPostView}
			/>
			<Inside.Screen
				name='PostDetail'
				component={PostDetailView}
			/>
			<Inside.Screen
				name='Message'
				component={MessageView}
				options={MessageView.navigationOptions}
			/>
			<Inside.Screen
				name='Chat'
				component={ChatView}
			/>
			<Inside.Screen
				name='Setting'
				component={SettingView}
				options={SettingView.navigationOptions}
			/>
			<Inside.Screen
				name='About'
				component={AboutView}
			/>
			<Inside.Screen
				name='Security'
				component={SecurityView}
				options={SecurityView.navigationOptions}
			/>
			<Inside.Screen
				name='Block'
				component={BlockView}
			/>
			<Inside.Screen
				name='ProductWeb'
				component={ProductWebView}
			/>
			<Inside.Screen
				name='Category'
				component={CategoryView}
				options={CategoryView.navigationOptions}
			/>
			<Inside.Screen
				name='VipMembers'
				component={VipMembersClubView}
				options={VipMembersClubView.navigationOptions}
			/>
			<Inside.Screen
				name='ProductDetail'
				component={ProductDetailView}
			/>
			<Inside.Screen
				name='PickLibrary'
				component={PickLibraryView}
			/>
		</Inside.Navigator>
	);
};

const Drawer = createDrawerNavigator();
const DrawerNavigator = () => (
	<Drawer.Navigator
		drawerContent={({ navigation, state }) => <SidebarView navigation={navigation} state={state} />}
		screenOptions={{ swipeEnabled: true }}
		drawerType='back'
	>
		<Drawer.Screen name='InsideStack' component={InsideStack} options={{headerShown: false}}/>
	</Drawer.Navigator>
)

export default DrawerNavigator;
