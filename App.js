
import React from 'react'
import { Text } from 'react-native';
import Marquee from 'react_native_pandey_marquee';

const App = () => {
  return (
    <Marquee spacing={0} speed={0.7} direction='left'autofill={false} linearGradientColors={['#FF5733', '#FFC300']} >
      <Text style={{marginTop:60,fontSize:16, color:'red',}}> Hello World </Text>
    </Marquee>
  )
}

export default App
