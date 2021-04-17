import React, { createContext, useContext } from 'react';
import { Container, interfaces } from 'inversify';

import { BrewService } from './services';

// Container
export const container = new Container();
container.bind('BrewService').to(BrewService).inSingletonScope();

// Provider
const InversifyContext = createContext<{ container: Container | null }>({
  container: null,
});

type Props = {
  container: Container;
};

export const Provider: React.FC<Props> = ({ container, children }) => (
  <InversifyContext.Provider value={{ container }}>
    {children}
  </InversifyContext.Provider>
);

// Injection
export function useInjection<T>(
  identifier: interfaces.ServiceIdentifier<T>
): T {
  const { container } = useContext(InversifyContext);
  if (!container) throw new Error();
  return container.get<T>(identifier);
}
