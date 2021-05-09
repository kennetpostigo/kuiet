import { ChakraProvider, localStorageManager } from "@chakra-ui/react";

interface ChakraProps {}
export const Chakra: React.FC<ChakraProps> = ({ children }) => {
  return (
    <ChakraProvider resetCSS colorModeManager={localStorageManager}>
      {children}
    </ChakraProvider>
  );
};
