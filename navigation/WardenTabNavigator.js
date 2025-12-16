import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"

// Import screens
import WardenDashboardScreen from "../screens/WardenDashboardScreen."
import ProfileScreen from "../screens/ProfileScreen"
import OutpassRequestsScreen from "../screens/OutpassRequestsScreen"
// import StudentsScreen from "../screens/StudentsScreen"

const Tab = createBottomTabNavigator()

export default function WardenTabNavigator() {
    return (
       <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName
    
              if (route.name === "Dashboard") {
                iconName = focused ? "home" : "home-outline"
              } else if (route.name === "Approvals") {
                iconName = focused ? "checkmark-circle" : "checkmark-circle-outline";
              } else if (route.name === "Profile") {
                iconName = focused ? "person" : "person-outline"
              } else if (route.name === "Students") {
                iconName =  focused ? "people" : "people-outline";
              } 
    
    
    
              return <Ionicons name={iconName} size={size} color={color} />
            },
            tabBarActiveTintColor: "#2563eb",
            tabBarInactiveTintColor: "gray",
            headerShown: false,
          })}
        >
          <Tab.Screen name="Dashboard" component={WardenDashboardScreen} />
          <Tab.Screen name="Approvals" component={OutpassRequestsScreen} />
          {/* <Tab.Screen name="Students" component={StudentsScreen} /> */}
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      )
    }