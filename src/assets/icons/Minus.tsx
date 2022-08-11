import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg viewBox='0 0 448 512' width={24} height={24} {...props}>
    <Path d='M400 288H48c-17.69 0-32-14.32-32-32.01S30.31 224 48 224h352c17.69 0 32 14.3 32 31.99S417.7 288 400 288z' />
  </Svg>
);

export default SvgComponent;
