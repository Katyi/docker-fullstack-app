import React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

const Provider = TooltipPrimitive.Provider;
const Root = TooltipPrimitive.Root;
const Trigger = TooltipPrimitive.Trigger;
const Portal = TooltipPrimitive.Portal;
const Content = TooltipPrimitive.Content;

interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

const Tooltip = ({ children, content }: TooltipProps) => {
  return (
    <Provider>
      <Root>
        <Trigger asChild>{children}</Trigger>
        <Portal>
          <Content
            style={{
              zIndex: 100,
              backgroundColor: 'lightgray',
              padding: '2px 5px',
              borderRadius: '5px',
            }}
          >
            {content}
          </Content>
        </Portal>
      </Root>
    </Provider>
  );
};

export default Tooltip;
