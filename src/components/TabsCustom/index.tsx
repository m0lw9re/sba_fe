import { Tabs, TabsProps } from 'antd';
import { FC } from 'react';
import './style.scss';
type Props = TabsProps & {
  aboveHeight?: number;
};
export const TabsCustom: FC<Props> = ({ aboveHeight, ...rest }) => {
  return (
    <Tabs
      className='tabs-wrapper-custom'
      tabBarStyle={{
        backgroundImage: 'linear-gradient(to left, #6FBEED , #2C68B1)',
        borderRadius: '4px',
        padding: '8px',
        ...(aboveHeight && {
          top: `${aboveHeight}px`,
        }),
      }}
      {...rest}
    />
  );
};
