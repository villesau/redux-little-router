import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import { applyMiddleware, combineReducers, createStore } from 'redux';

import routerForHash from '../../src/environment/hash-router';

import routes from '../test-util/fixtures/routes';

chai.use(sinonChai);

describe('Hash router', () => {
  it('creates a browser store connector using window.location', () => {
    const history = {
      listen() {},
      location: {
        pathname: '/home',
        search: '?get=schwifty'
      }
    };
    const { connect, middleware, reducer } = routerForHash({
      routes,
      history
    });
    const store = createStore(
      combineReducers({ router: reducer }),
      {},
      applyMiddleware(middleware)
    );
    connect(store);
    const state = store.getState();
    expect(state).to.have.nested.property('router.pathname', '/home');
    expect(state).to.have.nested.property('router.search', '?get=schwifty');
    expect(state).to.have.nested
      .property('router.query')
      .that.deep.equals({ get: 'schwifty' });
  });

  it('supports basenames', () => {
    const history = {
      listen() {},
      location: {
        pathname: '/home',
        search: '?get=schwifty'
      }
    };

    const { connect, middleware, reducer } = routerForHash({
      routes,
      history,
      basename: '/cob-planet'
    });
    const store = createStore(
      combineReducers({ router: reducer }),
      {},
      applyMiddleware(middleware)
    );
    connect(store);
    const state = store.getState();
    expect(state).to.have.nested.property('router.basename', '/cob-planet');
    expect(state).to.have.nested.property('router.pathname', '/home');
    expect(state).to.have.nested.property('router.search', '?get=schwifty');
    expect(state).to.have.nested
      .property('router.query')
      .that.deep.equals({ get: 'schwifty' });
  });
});
