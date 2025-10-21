import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="create" options={{title: "Nueva Historia Clinica"}} />
      <Stack.Screen name="view" options={{title: "Ver Historia Clinica"}} />
    </Stack>
  );
}
