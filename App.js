
import React from 'react'
import { Text } from 'react-native';
const App = () => {
  return (
    <Marquee spacing={0} speed={0.7} direction='left'autofill={false} >
      <Text style={{marginTop:60,fontSize:16, color:'red',}}> world Hello</Text>
    </Marquee>
  )
}

export default App