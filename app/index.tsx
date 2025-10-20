import { initDatabases } from "@/db/init_databases";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {


  useEffect(() => {
    initDatabases()
  }, []);


  return (
    <View style={styles.view}>
      <Text> View de las historias clinicas que existan </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }
})

